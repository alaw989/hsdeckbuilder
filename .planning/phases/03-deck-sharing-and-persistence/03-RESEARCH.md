# Phase 3: Deck Sharing & Persistence - Research

**Researched:** 2026-02-07
**Domain:** Hearthstone deck builder with Vue 3 + Laravel + Inertia.js
**Confidence:** HIGH

## Summary

This research covers the implementation of Phase 3: Deck Sharing & Persistence, which enables users to save decks locally to browser LocalStorage, share decks via unique URLs, and clone decks from shared links. The phase builds on the existing deck builder functionality from Phase 2, adding persistence and social features without requiring server-side storage or user authentication.

The implementation requires understanding LocalStorage API patterns for Vue 3, URL-based deck sharing strategies (query parameters vs hash), deck serialization/deserialization, browser persistence best practices, security considerations for URL handling, and Vue 3 composables for persistence. All research areas have HIGH confidence due to mature VueUse library integration and existing Inertia.js patterns.

**Primary recommendation:** Use VueUse's `useLocalStorage` composable for reactive LocalStorage synchronization, URL query parameters for deck sharing (via `?deck=` parameter), Blizzard's existing deckstring format for serialization (avoiding duplication of Phase 2 work), Laravel backend validation for shared deck parameters, and Vue 3 Composition API patterns for persistence composables. This approach provides a seamless user experience without requiring server-side storage or authentication.

## Standard Stack

The established libraries/tools for this phase:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @vueuse/core | 14.2.0 (installed) | Vue composition utilities including useLocalStorage | Already installed, provides reactive LocalStorage sync, SSR-safe, cross-tab sync |
| @firestone-hs/deckstrings | 2.2.8 (installed) | Hearthstone deck code encoding/decoding | Already handles deck serialization from Phase 2, use for URL sharing |
| @inertiajs/vue3 | Latest | Inertia.js Vue 3 adapter | Handles page visits, URL query parameter access via usePage() |
| DOMPurify | Latest | HTML sanitization for XSS prevention | Recommended for URL parameter sanitization if rendering user content |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lz-string | Latest | LZ-based compression algorithm | If URL length becomes an issue with deck codes (unlikely, deck codes are already compact) |
| compressjs | Latest | LZW compression | Alternative compression if lz-string doesn't meet needs (unlikely needed) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Query parameters (?deck=) | Hash fragments (#deck=) | Query params are server-visible (can validate), hash is client-only |
| VueUse useLocalStorage | Custom LocalStorage composable | VueUse is battle-tested, handles SSR, cross-tab sync, edge cases |
| Deckstring serialization | Full JSON deck data | Deckstring is 50-100 chars, JSON would be 2000+ chars (URL limits) |
| DOMPurify | sanitize-url library | DOMPurify is more comprehensive, handles HTML + URL protocols |

**Installation:**
```bash
# If XSS sanitization needed
npm install dompurify
npm install --save-dev @types/dompurify  # TypeScript support

# If compression needed (unlikely)
npm install lz-string
```

## Architecture Patterns

### Recommended Project Structure

```
resources/js/
├── Pages/
│   └── DeckBuilder.vue              # Main deck builder (add share/save UI)
├── Components/
│   ├── SavedDecksModal.vue          # DECK-02: Load saved decks (NEW)
│   ├── ShareDeckModal.vue           # DECK-04: Generate share URL (NEW)
│   └── ConfirmCloneModal.vue        # DECK-06: Clone shared deck confirmation (NEW)
├── Composables/
│   ├── useDeckBuilder.js            # Existing deck state (no changes)
│   └── useDeckStorage.js            # DECK-01/02/03: LocalStorage composable (NEW)
└── Utils/
    ├── deckCode.js                  # Existing deckstring utilities (use for sharing)
    └── deckStorage.js               # DECK-01: Save/load/delete deck utilities (NEW)
```

### Pattern 1: LocalStorage Composable with VueUse

**What:** Reactive LocalStorage synchronization using `useLocalStorage` from VueUse

**When to use:** DECK-01 (save deck), DECK-02 (load deck), DECK-03 (delete deck)

**Why VueUse useLocalStorage:**
- **SSR-safe:** Handles server-side rendering gracefully
- **Cross-tab sync:** Automatically syncs changes across browser tabs
- **Type-safe:** Full TypeScript support with generics
- **Error handling:** Handles quota exceeded, serialization errors
- **Already installed:** @vueuse/core@14.2.0 in project

**Example:**
```javascript
// Composables/useDeckStorage.js
import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';

const STORAGE_KEY = 'hs-saved-decks';

export function useDeckStorage() {
  // Reactive array of saved decks
  const savedDecks = useLocalStorage(STORAGE_KEY, []);

  // Computed properties
  const deckCount = computed(() => savedDecks.value.length);

  const deckById = (id) => {
    return savedDecks.value.find(deck => deck.id === id);
  };

  // Actions
  function saveDeck(deckData) {
    const deck = {
      id: generateId(),  // UUID or timestamp-based
      name: deckData.name || 'Untitled Deck',
      class: deckData.class,
      deckCode: deckData.deckCode,  // Blizzard deckstring
      cards: deckData.cards,        // Full card data for offline display
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    savedDecks.value.push(deck);
    return deck.id;
  }

  function loadDeck(id) {
    const deck = deckById(id);
    if (!deck) {
      throw new Error(`Deck with id ${id} not found`);
    }

    // Return deck data in format expected by useDeckBuilder
    return {
      class: deck.class,
      cards: deck.cards,
      deckCode: deck.deckCode
    };
  }

  function deleteDeck(id) {
    const index = savedDecks.value.findIndex(deck => deck.id === id);
    if (index === -1) return false;

    savedDecks.value.splice(index, 1);
    return true;
  }

  function updateDeck(id, updates) {
    const index = savedDecks.value.findIndex(deck => deck.id === id);
    if (index === -1) return false;

    savedDecks.value[index] = {
      ...savedDecks.value[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return true;
  }

  return {
    savedDecks,
    deckCount,
    saveDeck,
    loadDeck,
    deleteDeck,
    updateDeck
  };
}

// Utility: Generate unique ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

**Source:** [VueUse useLocalStorage Documentation](https://vueuse.org/core/uselocalstorage/), [VueUse Composables Style Guide](https://alexop.dev/posts/vueuse_composables_style_guide/)

### Pattern 2: URL-Based Deck Sharing

**What:** Share decks via URL query parameters using Blizzard deckstring format

**When to use:** DECK-04 (generate URL), DECK-05 (view shared deck), DECK-06 (clone deck)

**Strategy decision: Query parameters vs Hash fragments**

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| Query params `?deck=AAECA...` | Server can validate, analytics trackable, bookmarkable | Visible in server logs | **RECOMMENDED** for MVP |
| Hash fragment `#deck=AAECA...` | Client-only, no server visibility | Can't validate server-side, harder to track | Use if privacy is critical |
| Short URL `share/d/abc123` | Clean URLs, can track analytics | Requires server-side storage/routing | Use for Phase 4 (server features) |

**Example: Query Parameter Sharing (DECK-04)**
```javascript
// Utils/deckShare.js
import { exportDeckCode } from './deckCode';

export function generateShareUrl(deckCards, deckClass, baseUrl = window.location.origin) {
  // Generate deck code using existing utility
  const { deckCode, error } = exportDeckCode(deckCards, deckClass);

  if (error) {
    return { url: null, error };
  }

  // Encode deck code for URL (base64 is URL-safe)
  const encodedDeck = encodeURIComponent(deckCode);

  // Build share URL
  const shareUrl = `${baseUrl}/deck-builder?deck=${encodedDeck}`;

  return { url: shareUrl, error: null };
}

export function parseSharedDeckFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const deckCode = params.get('deck');

  if (!deckCode) {
    return { deckCode: null, error: null };
  }

  // Decode URL-encoded deck code
  try {
    const decodedDeck = decodeURIComponent(deckCode);
    return { deckCode: decodedDeck, error: null };
  } catch (error) {
    return {
      deckCode: null,
      error: 'Invalid deck code in URL'
    };
  }
}
```

**Example: Inertia.js Route with Query Parameter Validation**
```php
// routes/web.php
Route::get('/deck-builder', [DeckBuilderController::class, 'index'])
    ->name('deck-builder');

// app/Http/Controllers/DeckBuilderController.php
class DeckBuilderController extends Controller
{
    public function index(Request $request)
    {
        // Validate shared deck parameter
        $deckCode = $request->query('deck');

        if ($deckCode) {
            // Basic validation (length, format)
            $validator = validator(
                ['deck' => $deckCode],
                ['deck' => 'required|string|min:30|max:200']
            );

            if ($validator->fails()) {
                // Redirect to deck builder without deck parameter
                return redirect()->route('deck-builder');
            }

            // Pass validated deck code to page
            return Inertia::render('DeckBuilder', [
                'cards' => HearthstoneService::getAllCards(),
                'sharedDeckCode' => $deckCode  // NEW: for DECK-05
            ]);
        }

        // Normal deck builder load
        return Inertia::render('DeckBuilder', [
            'cards' => HearthstoneService::getAllCards(),
            'sharedDeckCode' => null
        ]);
    }
}
```

**Example: Vue Component with Shared Deck Handling (DECK-05)**
```vue
<!-- DeckBuilder.vue -->
<script setup>
import { onMounted } from 'vue';
import { useDeckBuilder } from '@/Composables/useDeckBuilder';
import { importDeckCode } from '@/Utils/deckCode';

const props = defineProps({
  cards: Array,
  sharedDeckCode: String  // NEW: from Laravel controller
});

const {
  selectedClass,
  deckCards,
  addCard,
  clearDeck
} = useDeckBuilder();

const cardDbfMap = computed(() => {
  const map = {};
  for (const card of props.cards) {
    map[card.dbfId] = card;
  }
  return map;
});

// DECK-05: Load shared deck on mount
const sharedDeck = ref(null);

onMounted(() => {
  if (props.sharedDeckCode) {
    loadSharedDeck(props.sharedDeckCode);
  }
});

function loadSharedDeck(deckCodeString) {
  const result = importDeckCode(deckCodeString, cardDbfMap.value);

  if (result.error) {
    alert(`Invalid shared deck: ${result.error}`);
    return;
  }

  // Clear current deck and load shared deck
  clearDeck();

  for (const item of result.cards) {
    for (let i = 0; i < item.count; i++) {
      addCard(item.card);
    }
  }

  selectedClass.value = result.class;

  // Mark as shared deck (read-only until cloned)
  sharedDeck.value = {
    class: result.class,
    cards: result.cards,
    deckCode: deckCodeString
  };
}
</script>

<template>
  <!-- Existing deck builder UI -->

  <!-- NEW: Shared deck banner (DECK-05) -->
  <div v-if="sharedDeck" class="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4">
    <div class="flex">
      <div class="flex-1">
        <p class="font-bold text-blue-900">Viewing Shared Deck</p>
        <p class="text-blue-700 text-sm">
          This is a shared deck. Make changes or clone it to your local storage.
        </p>
      </div>
      <button
        @click="cloneSharedDeck"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Clone to My Decks
      </button>
    </div>
  </div>
</template>
```

**Source:** [Inertia.js Manual Visits](https://inertiajs.com/docs/v2/the-basics/manual-visits), [Laravel Query Parameter Validation](https://laravel.com/docs/12.x/validation)

### Pattern 3: Deck Serialization Strategy

**What:** Serialize/deserialize decks for LocalStorage and URL sharing

**When to use:** DECK-01 (save deck), DECK-04 (share deck)

**Decision: Use existing deckstring format for URL sharing**

The Blizzard deckstring format is already:
- **Compact:** 50-100 characters (fits easily in URLs)
- **Standard:** Works with Hearthstone client
- **Tested:** Already implemented in Phase 2
- **Efficient:** Base64 + varint encoding

**Avoid:** Re-serializing to JSON for URLs (would be 2000+ chars, risk of URL length limits)

**LocalStorage structure (full data for offline use):**
```javascript
// Saved deck object in LocalStorage
{
  id: "1738923478123-abc123def",
  name: "Quest Warrior",
  class: "WARRIOR",
  deckCode: "AAECAQcIlxaverage...50-100 chars",  // Blizzard deckstring
  cards: [
    { card: { id: 123, dbfId: 456, name: "Mana Diviner", ... }, count: 2 },
    { card: { id: 124, dbfId: 789, name: "Scion of Twilight", ... }, count: 1 },
    // ... all 30 cards
  ],
  createdAt: "2026-02-07T12:34:56.789Z",
  updatedAt: "2026-02-07T12:34:56.789Z"
}
```

**Why store full cards in LocalStorage but use deckstring for URLs:**
- **LocalStorage:** 5-10MB limit, store full card data for offline display without API calls
- **URL:** ~2000 char limit practical, deckstring is compact and sufficient

**Source:** [HearthSim Hearthstone Deckstrings Documentation](https://hearthsim.info/docs/deckstrings/), [Browser LocalStorage Limits](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Pattern 4: Security Considerations for URL Parameters

**What:** Prevent XSS attacks from malicious URL parameters

**When to use:** DECK-05 (view shared deck from URL)

**Primary threat:** Malicious users could craft URLs with dangerous payloads

**Defense strategy:**

1. **Backend validation (Laravel)**
   - Validate deck code format before passing to frontend
   - Reject malformed or overly long parameters
   - Use Laravel's built-in validation

2. **Frontend sanitization (Vue)**
   - Never render URL parameters directly with `v-html`
   - Use Vue's automatic escaping (curly braces)
   - Decode deck codes only through trusted library (@firestone-hs/deckstrings)

3. **Content Security Policy (CSP)**
   - Add CSP headers to prevent inline script injection
   - Restrict script sources to trusted domains

**Example: Laravel Validation**
```php
// app/Http/Requests/SharedDeckRequest.php
class SharedDeckRequest extends FormRequest
{
    public function rules()
    {
        return [
            'deck' => [
                'required',
                'string',
                'min:30',
                'max:200',
                'regex:/^[A-Za-z0-9+/=]+$/u',  // Base64 pattern
            ],
        ];
    }

    public function messages()
    {
        return [
            'deck.regex' => 'Invalid deck code format.',
        ];
    }
}
```

**Example: Vue Safe Rendering**
```javascript
// SAFE: Vue auto-escapes
<div>{{ sharedDeckCode }}</div>

// UNSAFE: Never do this without sanitization
<div v-html="sharedDeckCode"></div>

// SAFE: Use library to parse
const result = importDeckCode(deckCode, cardDbfMap);
```

**Example: CSP Header (Laravel)**
```php
// app/Http/Middleware/EnsureCsrfToken.php or public/.htaccess
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
```

**Source:** [Vue.js Security Best Practices](https://vuejs.org/guide/best-practices/security), [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [XSS in 2025: Why It Still Matters](https://medium.com/@tvvzvpb186/xss-in-2025-why-it-still-matters-and-how-to-defend-against-it-dfd4e2067bb4)

### Pattern 5: Cross-Tab Synchronization

**What:** Sync deck changes across multiple browser tabs

**When to use:** DECK-01/02/03 (automatic with VueUse useLocalStorage)

**Benefit:** User can save deck in one tab and immediately see it in another tab

**How it works:**
- `useLocalStorage` listens to `storage` events
- When LocalStorage changes in one tab, other tabs auto-update
- No additional code needed

**Example:**
```javascript
// Tab 1: Save deck
const { savedDecks, saveDeck } = useDeckStorage();
saveDeck(myDeckData);  // Writes to LocalStorage

// Tab 2: Automatically updates
const { savedDecks } = useDeckStorage();
// savedDecks.value is reactive and updates automatically
```

**Source:** [VueUse useLocalStorage - Cross-tab synchronization](https://vueuse.org/core/uselocalstorage/), [MDN StorageEvent](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)

## Common Pitfalls

### Pitfall 1: Breaking Reactivity with LocalStorage

**What goes wrong:** Saved decks don't appear in UI, or changes don't persist across page reloads.

**Why it happens:** Direct `localStorage.getItem()` calls aren't reactive, or modifying LocalStorage outside VueUse breaks reactivity.

**How to avoid:**
- Always use `useLocalStorage` from VueUse for reactive state
- Never mix direct localStorage API calls with VueUse
- Access stored values via `.value` (Vue 3 Composition API)

**Example:**
```javascript
// WRONG: Not reactive
const savedDecks = JSON.parse(localStorage.getItem('decks') || '[]');

// RIGHT: Reactive with VueUse
const savedDecks = useLocalStorage('hs-saved-decks', []);

// RIGHT: Access value
console.log(savedDecks.value);  // Use .value
```

**Source:** [VueUse useLocalStorage Documentation](https://vueuse.org/core/uselocalstorage/)

**Warning signs:** UI doesn't update after saving deck, changes lost on page reload.

### Pitfall 2: URL Length Limits with Deck Sharing

**What goes wrong:** Shared deck URLs are truncated or don't work.

**Why it happens:** URLs over ~2000 characters may not work in some browsers/servers.

**How to avoid:**
- Use Blizzard deckstring format (50-100 chars, well under limits)
- Avoid JSON serialization (would be 2000+ chars)
- Consider compression if deck data grows (lz-string)

**Example:**
```javascript
// RIGHT: Deckstring is compact
generateShareUrl(deckCards, deckClass);
// Result: https://example.com/deck-builder?deck=AAECAZICBu...

// WRONG: JSON is too long
const jsonDeck = encodeURIComponent(JSON.stringify(fullDeckData));
// Result: https://example.com/deck-builder?deck=%7B%22cards%22%3A%5B%7B%22...
// (2000+ characters, may break)
```

**Source:** [Web URL Length Limits](https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers)

**Warning signs:** URLs look extremely long, some users report broken share links.

### Pitfall 3: SSR Issues with LocalStorage

**What goes wrong:** App crashes with "localStorage is not defined" error.

**Why it happens:** LocalStorage doesn't exist on server-side (SSR), Inertia.js first renders on server.

**How to avoid:**
- Use VueUse's `useLocalStorage` (handles SSR automatically)
- Or check for browser environment before accessing localStorage

**Example:**
```javascript
// WRONG: Crashes on SSR
const savedDecks = JSON.parse(localStorage.getItem('decks'));

// RIGHT: VueUse handles SSR
const savedDecks = useLocalStorage('hs-saved-decks', []);

// RIGHT: Manual check
const savedDecks = ref([]);
onMounted(() => {
  const stored = localStorage.getItem('decks');
  if (stored) {
    savedDecks.value = JSON.parse(stored);
  }
});
```

**Source:** [VueUse SSR Safety](https://vueuse.org/core/uselocalstorage/)

**Warning signs:** Server error logs mention localStorage, app crashes on first load.

### Pitfall 4: LocalStorage Quota Exceeded

**What goes wrong:** Saving deck fails with "QuotaExceededError".

**Why it happens:** LocalStorage has 5-10MB limit per domain. Storing full card data for many decks can exceed limit.

**How to avoid:**
- Store only essential data (deck codes, not full card images)
- Implement error handling for quota exceeded
- Consider IndexedDB for larger storage needs (future enhancement)

**Example:**
```javascript
function saveDeck(deckData) {
  try {
    savedDecks.value.push(deck);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      alert('Local storage full. Please delete some decks to save more.');
    } else {
      throw error;
    }
  }
}
```

**Source:** [MDN LocalStorage Limits](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

**Warning signs:** Error when saving decks, older users with many saved decks.

### Pitfall 5: XSS from Malicious Shared Deck URLs

**What goes wrong:** Attackers craft URLs with JavaScript in deck codes, leading to XSS.

**Why it happens:** Rendering URL parameters without sanitization or using `v-html` on user content.

**How to avoid:**
- Always validate deck codes server-side (Laravel)
- Never use `v-html` on deck data
- Use Vue's automatic escaping (curly braces)
- Parse deck codes through trusted library (@firestone-hs/deckstrings)

**Example:**
```javascript
// WRONG: Renders HTML
<div v-html="userProvidedDeckName"></div>

// RIGHT: Auto-escapes
<div>{{ userProvidedDeckName }}</div>

// RIGHT: Validate backend
Route::get('/deck-builder', function (Request $request) {
    $deckCode = $request->validate([
        'deck' => 'required|string|max:200|regex:/^[A-Za-z0-9+/=]+$/u'
    ]);
    // ...
});
```

**Source:** [Vue.js Security Best Practices](https://vuejs.org/guide/best-practices/security), [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

**Warning signs:** Security scanner warnings, unusual behavior when opening shared links.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| LocalStorage reactivity | Custom watch + localStorage.getItem/setItem | @vueuse/core useLocalStorage | Handles SSR, cross-tab sync, JSON parsing, errors |
| URL-safe encoding | Custom base64 URL encode/decode | encodeURIComponent/decodeURIComponent | Built-in browser API, handles all edge cases |
| Deck serialization | Custom JSON format | Blizzard deckstring format | Already implemented, compact, standard |
| Input sanitization | Custom regex validation | Laravel validation + DOMPurify | Battle-tested, comprehensive security |
| XSS prevention | Custom HTML escaping | Vue auto-escaping + CSP | Built into Vue, CSP provides defense-in-depth |
| Compression | Custom compression algorithm | lz-string (if needed) | Tested compression libraries, unlikely needed for deckstrings |

**Key insight:** VueUse's `useLocalStorage` has been battle-tested across thousands of Vue 3 projects. It handles SSR compatibility, cross-tab synchronization, error handling, and reactivity edge cases that are easy to miss in custom implementations. The Blizzard deckstring format is already optimized for compact representation (base64 + varint), making it ideal for URL sharing without additional compression.

## Code Examples

Verified patterns from official sources:

### VueUse LocalStorage Composable

```javascript
// Source: VueUse official documentation
// https://vueuse.org/core/uselocalstorage/

import { useLocalStorage } from '@vueuse/core'

// Basic usage
const storedDeck = useLocalStorage('my-deck', { name: 'Untitled', cards: [] })

// Reactive - changes persist to localStorage automatically
storedDeck.value.name = 'Warrior Deck'

// Works with arrays
const savedDecks = useLocalStorage('hs-saved-decks', [])
savedDecks.value.push({ id: 1, name: 'Quest Warrior' })

// Type-safe with TypeScript
interface SavedDeck {
  id: string
  name: string
  class: string
  cards: Array<{ card: Card, count: number }>
}

const decks = useLocalStorage<SavedDeck[]>('hs-decks', [])
```

### Inertia.js Query Parameter Handling

```javascript
// Source: Inertia.js documentation
// https://inertiajs.com/docs/v2/the-basics/manual-visits

// Access query parameters in Laravel controller
Route::get('/deck-builder', function (Request $request) {
    $deckCode = $request->query('deck');

    return Inertia::render('DeckBuilder', [
        'cards' => $cards,
        'sharedDeckCode' => $deckCode
    ]);
});

// Access query parameters in Vue component
import { usePage } from '@inertiajs/vue3'

const page = usePage()
const sharedDeckCode = page.props.sharedDeckCode

// Manual URL construction for sharing
import { router } from '@inertiajs/vue3'

const shareUrl = `${window.location.origin}/deck-builder?deck=${encodeURIComponent(deckCode)}`
```

### Laravel Query Parameter Validation

```php
// Source: Laravel 12.x validation documentation
// https://laravel.com/docs/12.x/validation

// Validate query parameters in controller
public function index(Request $request)
{
    $validated = $request->validate([
        'deck' => 'nullable|string|min:30|max:200|regex:/^[A-Za-z0-9+\/=]+$/u'
    ]);

    // If validation fails, Laravel redirects back with errors
}

// Or use FormRequest class
class SharedDeckRequest extends FormRequest
{
    public function rules()
    {
        return [
            'deck' => [
                'nullable',
                'string',
                'min:30',
                'max:200',
                'regex:/^[A-Za-z0-9+\/=]+$/u'
            ]
        ];
    }
}
```

### XSS Prevention with Vue

```javascript
// Source: Vue.js security best practices
// https://vuejs.org/guide/best-practices/security

// SAFE: Vue auto-escapes content
<template>
  <div>{{ userContent }}</div>  <!-- Escaped automatically -->
</template>

// UNSAFE: Renders raw HTML (never use with user content)
<template>
  <div v-html="userContent"></div>  <!-- XSS risk -->
</template>

// SAFE: Sanitize if needed
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(userContent);

// In template
<div v-html="sanitizedContent"></div>  <!-- Still risky, avoid if possible -->
```

### Deck Serialization Pattern

```javascript
// Source: Phase 2 deckCode.js implementation
// Reuse existing utilities

import { exportDeckCode, importDeckCode } from '@/Utils/deckCode';

// Save deck (for LocalStorage)
function saveDeckToStorage(deckCards, deckClass, deckName) {
  const { deckCode } = exportDeckCode(deckCards, deckClass);

  return {
    id: generateId(),
    name: deckName,
    class: deckClass,
    deckCode,  // Compact: 50-100 chars
    cards: deckCards,  // Full data for offline display
    createdAt: new Date().toISOString()
  };
}

// Load deck (from LocalStorage)
function loadDeckFromStorage(savedDeck) {
  const result = importDeckCode(savedDeck.deckCode, cardDbfMap);

  return {
    class: result.class,
    cards: result.cards,
    name: savedDeck.name
  };
}

// Share deck (for URL)
function generateShareUrl(deckCards, deckClass) {
  const { deckCode } = exportDeckCode(deckCards, deckClass);

  return `${window.location.origin}/deck-builder?deck=${encodeURIComponent(deckCode)}`;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual localStorage.getItem/setItem | VueUse useLocalStorage | Vue 3 era (2020+) | Reactive, SSR-safe, cross-tab sync, error handling |
| Server-side deck storage | Client-side LocalStorage | Web storage API (2010s) | No database needed for MVP, works offline, faster |
| Hash-based routing (#deck=) | Query parameters (?deck=) | SEO requirements (2010s) | Server can validate, analytics trackable, bookmarkable |
| Custom XSS sanitization | DOMPurify + Vue auto-escape | Security best practices (2010s+) | Battle-tested, comprehensive protection |
| Manual compression | Deckstring format (already compact) | Hearthstone deckstring (2017) | No compression needed, 50-100 chars per deck |

**Deprecated/outdated:**
- **Direct localStorage API:** Still works but useLocalStorage is reactive and handles edge cases
- **Vuex for localStorage persistence:** Replaced by VueUse composables (simpler, more focused)
- **Server-side only storage:** Modern apps benefit from client-side persistence for offline use
- **Hash-based routing for sharing:** Query params allow server validation, better for analytics

## Open Questions

Things that couldn't be fully resolved:

1. **LocalStorage quota limits with full card data**
   - What we know: LocalStorage has 5-10MB limit per domain
   - What's unclear: How many decks can be stored before hitting limit with full card data
   - Recommendation: Store deck codes (compact) plus minimal card metadata, monitor storage usage, implement quota error handling, consider IndexedDB if needed

2. **URL sharing analytics and tracking**
   - What we know: Query parameters allow server-side validation and tracking
   - What's unclear: Whether to track shared deck views, how to attribute deck shares to users
   - Recommendation: Skip analytics for MVP (no user accounts), add tracking in Phase 4 if authentication is implemented

3. **Browser compatibility for LocalStorage and URL sharing**
   - What we know: LocalStorage supported in all modern browsers, IE8+
   - What's unclear: Whether private/incognito mode restricts LocalStorage
   - Recommendation: Handle QuotaExceededError gracefully, inform users if storage fails, test in private browsing mode

4. **Deck naming conflicts when importing from multiple sources**
   - What we know: Users might save same deck with different names
   - What's unclear: Whether to prevent duplicate deck codes, allow unlimited saves of same deck
   - Recommendation: Allow duplicate decks (same deck code, different names), show "last modified" timestamp to help users identify latest version

## Implementation Strategy

### Phase 3 Plan Structure

**Plan 03-01: LocalStorage Save/Load Infrastructure** (DECK-01, DECK-02, DECK-03)
- Create `useDeckStorage` composable with VueUse
- Create `deckStorage` utility functions
- Add Saved Decks modal component
- Test LocalStorage persistence across page reloads

**Plan 03-02: URL-Based Deck Sharing** (DECK-04, DECK-05)
- Implement deck share URL generation
- Add Laravel backend validation for deck parameter
- Create shared deck banner UI
- Implement shared deck loading on page mount

**Plan 03-03: Clone Shared Deck** (DECK-06)
- Create clone confirmation modal
- Integrate with useDeckStorage composable
- Add "Clone to My Decks" button in shared deck banner
- Test clone flow from shared URL to saved deck

### Testing Strategy

1. **LocalStorage Testing**
   - Save deck and reload page (persistence)
   - Save deck in one tab, check another tab (cross-tab sync)
   - Save 50+ decks to test quota limits
   - Delete deck and verify removal

2. **URL Sharing Testing**
   - Generate share URL and verify format
   - Copy URL to new browser window
   - Test with invalid deck codes (error handling)
   - Test with extremely long deck codes (shouldn't happen)

3. **Security Testing**
   - Attempt XSS via deck parameter (should be blocked)
   - Test with SQL injection patterns (should be blocked)
   - Verify Content Security Policy headers
   - Test URL encoding edge cases

4. **Cross-Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Private/incognito mode
   - Mobile browsers
   - Different screen sizes

## Sources

### Primary (HIGH confidence)

- **VueUse useLocalStorage Documentation** - https://vueuse.org/core/uselocalstorage/
  - Reactive LocalStorage synchronization
  - SSR safety and cross-tab sync
  - Error handling for quota exceeded

- **VueUse useStorage** - https://vueuse.org/core/usestorage/
  - Generic storage composable (localStorage, sessionStorage, custom)
  - SSR-safe implementation
  - Type-safe with TypeScript

- **Vue.js Security Best Practices** - https://vuejs.org/guide/best-practices/security
  - Automatic HTML escaping
  - XSS prevention strategies
  - Content Security Policy recommendations

- **Inertia.js Manual Visits** - https://inertiajs.com/docs/v2/the-basics/manual-visits
  - Query parameter handling
  - URL construction and navigation
  - Page props and server-side validation

- **Laravel 12.x Validation** - https://laravel.com/docs/12.x/validation
  - Query parameter validation rules
  - FormRequest classes
  - Custom validation rules

- **HearthSim Hearthstone Deckstrings** - https://hearthsim.info/docs/deckstrings/
  - Deckstring format specification
  - Compact encoding (base64 + varint)
  - URL-safe for sharing

### Secondary (MEDIUM confidence)

- **VueUse Composables Style Guide** - https://alexop.dev/posts/vueuse_composables_style_guide/
  - Best practices for composable design
  - Parameter flexibility and type safety
  - Reusability patterns

- **OWASP XSS Prevention Cheat Sheet** - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
  - XSS attack vectors
  - Defense strategies
  - Output encoding rules

- **MDN LocalStorage API** - https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
  - Storage limits and quota
  - Browser compatibility
  - Synchronous API considerations

- **DOMPurify Documentation** - https://github.com/cure53/DOMPurify
  - HTML sanitization library
  - XSS prevention for dynamic content
  - Configuration options

- **XSS in 2025: Why It Still Matters** - https://medium.com/@tvvzvpb186/xss-in-2025-why-it-still-matters-and-how-to-defend-against-it-dfd4e2067bb4
  - Modern XSS attack vectors
  - Defense-in-depth strategies
  - Framework-specific protections

- **Laravel Validation Guide 2025** - https://mallow-tech.com/blog/laravel-validation-guide-essential-tips-and-techniques/
  - Laravel 12 validation features
  - Query parameter validation patterns
  - Custom validation rules

### Tertiary (LOW confidence)

- **Stack Overflow: Preserve query string with Inertia.js** - https://stackoverflow.com/questions/74253971/preserve-the-query-string-when-using-link-or-inertia-get
  - Community discussion
  - Inertia.js query parameter handling
  - Not official documentation

- **How to Validate Query Parameters in Laravel** - https://stackoverflow.com/questions/79067751/how-to-validate-query-parameters-in-laravel
  - Community Q&A
  - Multiple validation approaches
  - Helpful but not comprehensive

- **Web URL Length Limits** - https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
  - Browser-specific URL limits
  - Practical vs theoretical limits
  - Community-tested data

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - VueUse is mature and widely adopted, @vueuse/core already installed
- Architecture: HIGH - VueUse documentation and Vue.js official docs provide clear patterns
- Security: HIGH - Vue.js auto-escaping, Laravel validation, OWASP guidelines
- Deckstring format: HIGH - HearthSim official docs, tested in Phase 2
- URL sharing strategy: HIGH - Query params are standard practice, well-documented

**Research date:** 2026-02-07

**Valid until:** 2026-04-07 (60 days - VueUse and Vue 3 APIs are stable, LocalStorage is standard web API)

**Existing codebase analyzed:**
- `/resources/js/Composables/useDeckBuilder.js` - Existing deck state management (line 1-83)
- `/resources/js/Utils/deckCode.js` - Existing deckstring encode/decode (line 1-176)
- `/resources/js/Pages/DeckBuilder.vue` - Main deck builder page (line 1-365)
- `/routes/web.php` - Laravel routes (line 1-36)
- `/package.json` - Confirmed @vueuse/core@14.2.0, @firestone-hs/deckstrings@2.2.8

**Key dependencies:**
- @vueuse/core@14.2.0 - Already installed, provides useLocalStorage
- @firestone-hs/deckstrings@2.2.8 - Already installed, provides deck serialization
- @inertiajs/vue3 - Already installed, provides page props and routing
- Laravel 12 - Already installed, provides backend validation

**Recommended additions (if needed):**
- dompurify - Only if rendering user-provided HTML content (unlikely needed for MVP)
- lz-string - Only if URL length becomes issue (unlikely, deckstrings are compact)
