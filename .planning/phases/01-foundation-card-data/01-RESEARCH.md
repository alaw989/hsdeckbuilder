# Phase 1: Foundation & Card Data - Research

**Researched:** 2026-02-06
**Domain:** Laravel 11 + Vue 3 + Inertia.js full-stack application with Hearthstone card data
**Confidence:** HIGH

## Summary

This phase establishes the foundation for the Hearthstone Deck Builder platform by implementing a modern full-stack application with cached card data from the HearthstoneJSON API. Research confirms that the **Laravel 11 + Vue 3 + Inertia.js + Tailwind CSS** stack is well-established with comprehensive documentation and active community support. For card data, **HearthstoneJSON** has emerged as the most reliable community-maintained data source, as Blizzard's official API documentation appears to be partially inaccessible.

The standard approach uses **Inertia.js for seamless Laravel-Vue integration**, **Vite for modern asset bundling**, **Redis for card data caching** (critical given the 36,000/hour API rate limits), and **Tailwind CSS's mobile-first breakpoint system** for responsive design. Vue 3 Composition API with computed properties and debouncing provides performant card search/filter functionality.

**Primary recommendation:** Use Laravel 11 starter kit with Inertia.js + Vue 3, integrate HearthstoneJSON API with Redis caching layer (24-hour TTL), implement search with 300ms debounced computed filters, and build responsive UI with Tailwind's sm/md/lg/xl/2xl breakpoints.

## User Constraints (from CONTEXT.md)

No CONTEXT.md exists for this phase - full research freedom to explore options and make recommendations.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **Laravel** | 11.x | Backend framework | Modern PHP framework with excellent caching, routing, and API capabilities |
| **Vue.js** | 3.x | Frontend framework | Composition API, excellent reactivity for search/filter, great Inertia.js support |
| **Inertia.js** | 2.x | Laravel-Vue bridge | Eliminates API layer, seamless monolith SPA experience, official Laravel adapter |
| **Tailwind CSS** | 3.x | Styling framework | Mobile-first breakpoints, utility-first approach, excellent Vite integration |
| **Vite** | 5.x | Asset bundler | Fast HMR, modern build tool, official Laravel 11 support |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **predis/predis** | ~2.0 | Redis PHP client | When PhpRedis extension not available |
| **PhpRedis** | 5.x+ | Redis PHP extension | Production environments (better performance) |
| **Laravel Redis** | Built-in | Redis facade | Cache::remember(), Cache::tags(), cache management |
| **VueUse** | Latest | Vue composition utilities | useDebounceFn() for search input debouncing |

### Hearthstone Data Source

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **HearthstoneJSON** | Latest (API) | Card data API | Community-maintained, JSON format, updated with each game build, reliable |
| **Blizzard API** | Official | Primary data source | Rate limited (36,000/hour), authentication required, official source |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| HearthstoneJSON | Blizzard official API | Blizzard API has stricter rate limits, requires OAuth, less reliable for rapid iteration |
| Vite | Mix (Webpack) | Vite is faster, modern, officially supported in Laravel 11 |
| Inertia.js | SPA with API layer | Inertia eliminates API duplication, simpler state management |
| Redis cache | Database cache | Redis is 10-100x faster, better for high-volume card data |
| Vue 3 Composition API | Options API | Composition API is more reusable, better TypeScript support, modern standard |

**Installation:**
```bash
# Laravel 11 with Inertia.js starter kit
composer create-project laravel/laravel hsdeckbuilder
cd hsdeckbuilder
composer require laravel/breeze --dev
php artisan breeze:install vue

# Redis setup
composer require predis/predis  # OR install PhpRedis extension

# VueUse for debouncing
npm install @vueuse/core
```

## Architecture Patterns

### Recommended Project Structure

```
app/
├── Http/
│   └── Controllers/
│       ├── CardController.php      # Card data API endpoints
│       └── DeckController.php      # (Future) Deck management
├── Models/
│   └── Card.php                    # Card data model
├── Services/
│   └── HearthstoneService.php      # API client, caching logic
resources/
├── css/
│   └── app.css                     # Tailwind directives
├── js/
│   ├── Pages/
│   │   ├── CardSearch.vue          # Main search/filter UI
│   │   └── Welcome.vue             # Laravel Breeze default
│   ├── Components/
│   │   ├── CardGrid.vue            # Card display grid
│   │   ├── SearchInput.vue         # Autocomplete search
│   │   └── FilterPanel.vue         # Class, mana, rarity filters
│   └── app.js                      # Inertia app setup
routes/
├── web.php                         # Inertia routes
└── api.php                         # (Optional) API routes
config/
├── cache.php                       # Redis cache configuration
└── database.php                    # Redis connection configuration
```

### Pattern 1: Laravel Service + Redis Cache for Card Data

**What:** Centralized service layer handles HearthstoneJSON API calls with Redis caching

**When to use:** Any external API integration where rate limits, performance, and data freshness matter

**Example:**
```php
// app/Services/HearthstoneService.php

<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class HearthstoneService
{
    private const BASE_URL = 'https://api.hearthstonejson.com/v1';
    private const CACHE_TTL_HOURS = 24;

    public function getAllCards(): array
    {
        return Cache::remember('cards.all', now()->addHours(self::CACHE_TTL_HOURS), function () {
            $response = Http::get(self::BASE_URL . '/latest/enUS/cards.collectible.json');

            if (!$response->successful()) {
                throw new \RuntimeException('Failed to fetch cards from HearthstoneJSON');
            }

            return $response->json();
        });
    }

    public function getCardsByClass(string $class): array
    {
        return Cache::remember("cards.class.{$class}", now()->addHours(self::CACHE_TTL_HOURS), function () use ($class) {
            $allCards = $this->getAllCards();

            return collect($allCards)
                ->filter(fn($card) => $card['cardClass'] === $class || $card['cardClass'] === 'NEUTRAL')
                ->values()
                ->all();
        });
    }

    public function getCardsByFormat(string $format): array
    {
        $standardSets = [
            'PERMITTENOL', 'REVENDRETH', 'FROZEN_THRONE', 'DARKMOON_FAIRE',
            'STORMWIND', 'ALTERAC_VALLEY', 'ONYXIAS_LAIR', 'SHOWCASE',
            'FESTIVAL_OF_LEGENDS', 'TITANS', 'BADLANDS', 'PATH_OF_ARTHAS'
        ];

        return Cache::remember("cards.format.{$format}", now()->addHours(self::CACHE_TTL_HOURS), function () use ($format, $standardSets) {
            $allCards = $this->getAllCards();

            if ($format === 'standard') {
                return collect($allCards)
                    ->filter(fn($card) => in_array($card['set'], $standardSets))
                    ->values()
                    ->all();
            }

            // Wild and Twist include all cards
            return $allCards;
        });
    }

    public function clearCardCache(): void
    {
        Cache::forget('cards.all');
        // Clear all class and format caches
        $classes = ['DEMONHUNTER', 'DRUID', 'HUNTER', 'MAGE', 'PALADIN', 'PRIEST', 'ROGUE', 'SHAMAN', 'WARLOCK', 'WARRIOR'];
        foreach ($classes as $class) {
            Cache::forget("cards.class.{$class}");
        }
        Cache::forget('cards.format.standard');
        Cache::forget('cards.format.wild');
        Cache::forget('cards.format.twist');
    }
}
```

**Source:** Laravel cache documentation, HearthstoneJSON API structure research

### Pattern 2: Vue 3 Composition API with Computed Filters

**What:** Use Vue 3's Composition API with computed properties for reactive card filtering

**When to use:** Any search/filter interface requiring real-time updates based on multiple criteria

**Example:**
```vue
<!-- resources/js/Pages/CardSearch.vue -->

<script setup>
import { ref, computed, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { Head, Link } from '@inertiajs/vue3';

const props = defineProps({
    cards: Array, // All cards from Laravel
    selectedClass: String,
    selectedFormat: String,
});

const searchQuery = ref('');
const filters = ref({
    class: 'all',
    manaCost: null,
    type: 'all',
    rarity: 'all',
    set: 'all',
});

// Debounced search input
const debouncedSearch = useDebounceFn((value) => {
    searchQuery.value = value;
}, 300);

// Filtered cards computed property
const filteredCards = computed(() => {
    let results = props.cards;

    // Class filter
    if (filters.value.class !== 'all') {
        results = results.filter(card =>
            card.cardClass === filters.value.class ||
            card.cardClass === 'NEUTRAL'
        );
    }

    // Format filter (Standard/Wild/Twist)
    if (props.selectedFormat === 'standard') {
        const standardSets = ['PERMITTENOL', 'REVENDRETH', /* ... */];
        results = results.filter(card => standardSets.includes(card.set));
    }

    // Mana cost filter
    if (filters.value.manaCost !== null) {
        results = results.filter(card => card.cost === filters.value.manaCost);
    }

    // Type filter
    if (filters.value.type !== 'all') {
        results = results.filter(card => card.type === filters.value.type);
    }

    // Rarity filter
    if (filters.value.rarity !== 'all') {
        results = results.filter(card => card.rarity === filters.value.rarity);
    }

    // Set filter
    if (filters.value.set !== 'all') {
        results = results.filter(card => card.set === filters.value.set);
    }

    // Search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        results = results.filter(card =>
            card.name.toLowerCase().includes(query) ||
            card.text?.toLowerCase().includes(query)
        );
    }

    return results;
});

// Autocomplete suggestions
const autocompleteSuggestions = computed(() => {
    if (!searchQuery.value) return [];

    const query = searchQuery.value.toLowerCase();
    const seen = new Set();

    return props.cards
        .filter(card => card.name.toLowerCase().includes(query))
        .slice(0, 8) // Limit to 8 suggestions
        .filter(card => {
            if (seen.has(card.name)) return false;
            seen.add(card.name);
            return true;
        });
});
</script>

<template>
    <Head title="Card Search" />

    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Search Input -->
            <div class="mb-6 relative">
                <input
                    type="text"
                    :value="searchQuery"
                    @input="debouncedSearch($event.target.value)"
                    placeholder="Search cards by name..."
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <!-- Autocomplete dropdown -->
                <div v-if="autocompleteSuggestions.length > 0" class="absolute z-10 w-full bg-white mt-1 rounded-lg shadow-lg">
                    <div
                        v-for="card in autocompleteSuggestions"
                        :key="card.id"
                        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                        {{ card.name }}
                    </div>
                </div>
            </div>

            <!-- Filter Panel -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <!-- Class Filter -->
                <select v-model="filters.class" class="px-4 py-2 rounded-lg border">
                    <option value="all">All Classes</option>
                    <option v-for="class in ['DEMONHUNTER','DRUID','HUNTER','MAGE','PALADIN','PRIEST','ROGUE','SHAMAN','WARLOCK','WARRIOR']" :key="class" :value="class">
                        {{ class }}
                    </option>
                </select>

                <!-- Mana Cost Filter -->
                <select v-model="filters.manaCost" class="px-4 py-2 rounded-lg border">
                    <option :value="null">Any Mana</option>
                    <option v-for="mana in [0,1,2,3,4,5,6,7,8,9,10]" :key="mana" :value="mana">
                        {{ mana }} Mana
                    </option>
                </select>

                <!-- Type Filter -->
                <select v-model="filters.type" class="px-4 py-2 rounded-lg border">
                    <option value="all">All Types</option>
                    <option value="MINION">Minion</option>
                    <option value="SPELL">Spell</option>
                    <option value="WEAPON">Weapon</option>
                </select>

                <!-- Rarity Filter -->
                <select v-model="filters.rarity" class="px-4 py-2 rounded-lg border">
                    <option value="all">All Rarities</option>
                    <option value="COMMON">Common</option>
                    <option value="RARE">Rare</option>
                    <option value="EPIC">Epic</option>
                    <option value="LEGENDARY">Legendary</option>
                </select>

                <!-- Set Filter -->
                <select v-model="filters.set" class="px-4 py-2 rounded-lg border">
                    <option value="all">All Sets</option>
                    <option v-for="set in [...new Set(cards.map(c => c.set))]" :key="set" :value="set">
                        {{ set }}
                    </option>
                </select>
            </div>

            <!-- Card Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div
                    v-for="card in filteredCards"
                    :key="card.id"
                    class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
                >
                    <img :src="`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`" :alt="card.name" class="w-full" />
                    <h3 class="mt-2 text-sm font-semibold">{{ card.name }}</h3>
                    <p class="text-xs text-gray-500">{{ card.cost }} Mana • {{ card.rarity }}</p>
                </div>
            </div>

            <p class="mt-4 text-gray-600">Showing {{ filteredCards.length }} cards</p>
        </div>
    </div>
</template>
```

**Source:** Vue 3 Composition API documentation, HearthstoneJSON card structure

### Pattern 3: Inertia.js Data Passing with Controller

**What:** Laravel controller passes card data to Inertia Vue pages via props

**When to use:** Server-side data loading for initial page render, avoiding separate API endpoints

**Example:**
```php
// app/Http/Controllers/CardController.php

<?php

namespace App\Http\Controllers;

use App\Services\HearthstoneService;
use Inertia\Inertia;

class CardController extends Controller
{
    public function __construct(
        private HearthstoneService $hearthstone
    ) {}

    public function index()
    {
        // Warm cache if needed
        $cards = $this->hearthstone->getAllCards();

        return Inertia::render('CardSearch', [
            'cards' => $cards,
            'selectedClass' => request('class', 'all'),
            'selectedFormat' => request('format', 'wild'),
        ]);
    }

    public function byClass(string $class)
    {
        $cards = $this->hearthstone->getCardsByClass(strtoupper($class));

        return Inertia::render('CardSearch', [
            'cards' => $cards,
            'selectedClass' => strtoupper($class),
            'selectedFormat' => request('format', 'wild'),
        ]);
    }

    public function byFormat(string $format)
    {
        $cards = $this->hearthstone->getCardsByFormat($format);

        return Inertia::render('CardSearch', [
            'cards' => $cards,
            'selectedClass' => request('class', 'all'),
            'selectedFormat' => $format,
        ]);
    }
}
```

**Route definition:**
```php
// routes/web.php

Route::get('/cards', [CardController::class, 'index'])->name('cards.index');
Route::get('/cards/class/{class}', [CardController::class, 'byClass'])->name('cards.byClass');
Route::get('/cards/format/{format}', [CardController::class, 'byFormat'])->name('cards.byFormat');
```

**Source:** Inertia.js Laravel documentation

### Pattern 4: Tailwind Mobile-First Responsive Design

**What:** Tailwind CSS mobile-first breakpoint system for responsive card grid

**When to use:** Any UI that must work on mobile, tablet, and desktop

**Breakpoints:**
- `default`: < 640px (mobile)
- `sm:`: >= 640px (small tablets)
- `md:`: >= 768px (tablets)
- `lg:`: >= 1024px (laptops)
- `xl:`: >= 1280px (desktops)
- `2xl:`: >= 1536px (large screens)

**Example:**
```vue
<template>
    <!-- Mobile: 1 column, Tablet: 2 columns, Desktop: 4-6 columns -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        <div v-for="card in cards" :key="card.id" class="card-item">
            <!-- Card content -->
        </div>
    </div>
</template>
```

**Source:** Tailwind CSS responsive design documentation

### Anti-Patterns to Avoid

- **Separate REST API for initial data:** Don't create `/api/cards` endpoint when Inertia can pass data directly from controller. Only use API endpoints for AJAX interactions after initial page load.

- **Client-side filtering of entire dataset:** Don't fetch all 5000+ cards and filter only client-side if you can pre-filter on server based on class/format.

- **Hardcoded card set lists:** Don't hardcode standard/wild sets in multiple places. Create a configuration file or service method.

- **No debouncing on search input:** Don't trigger filters on every keystroke - use 300ms debounce to avoid excessive re-renders.

- **Global state for search filters:** Don't use global variables or complex state management libraries for simple search filters. Vue 3 `ref()` and `computed()` are sufficient.

- **Ignoring cache invalidation:** Don't cache card data indefinitely without a cache invalidation strategy when new sets release.

- **Blocking initial page load:** Don't wait for API call on every request. Use `Cache::remember()` to serve cached data instantly.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Autocomplete search | Custom dropdown with keyboard nav | Headless UI or native Vue with debouncing | Accessibility, keyboard navigation, aria attributes are complex |
| Card image URLs | Store images locally or build image service | HearthstoneJSON image URLs (`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/{card_id}.png`) | Image hosting, bandwidth, CDN already handled |
| Debounce function | Custom setTimeout/clearTimeout | VueUse `useDebounceFn()` | Handles edge cases, cleanup, proper composition API integration |
| Form state management | Custom form handling | Inertia `@inertiajs/form` or Vue `reactive()` | Validation errors, loading states, error handling built-in |
| API rate limiting | Custom request queuing | Laravel Redis cache with TTL | Avoids rate limits entirely, better performance |
| Responsive grid | Custom CSS media queries | Tailwind grid system | Mobile-first approach, consistent breakpoints, no custom CSS needed |
| Card filtering | Custom filter logic in multiple components | Computed properties + reusable filter utilities | Reactivity, performance optimization, code reuse |

**Key insight:** Custom solutions for these problems seem faster initially but lead to technical debt. Autocomplete accessibility alone has 20+ edge cases (keyboard navigation, ARIA attributes, screen reader support, click-outside handling, etc.). Use existing solutions and focus on business logic.

## Common Pitfalls

### Pitfall 1: Ignoring HearthstoneJSON Data Structure

**What goes wrong:** Filtering fails because code assumes fields that don't exist (e.g., assuming `manaCost` instead of `cost`, or `playerClass` instead of `cardClass`).

**Why it happens:** HearthstoneJSON uses specific field names (`cost`, `cardClass`, `collectible`, etc.) that differ from Blizzard API or common assumptions.

**How to avoid:** Use the official HearthstoneJSON card structure:
- `cost` (not `manaCost`)
- `cardClass` (not `playerClass`)
- `dbfId` for unique numeric ID
- `id` for string ID (e.g., "EX1_116")
- `collectible: true` to filter non-collectible cards
- `type` can be "MINION", "SPELL", "WEAPON", "HERO", "HERO_POWER", "ENCHANTMENT"
- `rarity` can be "FREE", "COMMON", "RARE", "EPIC", "LEGENDARY"
- `set` uses enum values like "CORE", "EXPERT1", "PERMITTENOL", etc.

**Warning signs:** Filter returns empty results, undefined property errors, inconsistent card counts.

### Pitfall 2: No Caching or Inadequate Cache TTL

**What goes wrong:** App hits rate limits, pages load slowly (5-10 seconds), users experience timeout errors.

**Why it happens:** HearthstoneJSON API is fast but has implicit rate limits. No caching means every page load fetches 5000+ cards.

**How to avoid:** Implement Redis caching with appropriate TTL:
- Cache all cards for 24 hours (card data rarely changes mid-day)
- Use `Cache::remember()` to fetch once, serve from cache
- Implement cache invalidation command for new set releases
- Monitor cache hit rates in production

**Example cache warm command:**
```php
// artisan command
public function handle()
{
    Cache::forget('cards.all');
    $this->hearthstone->getAllCards(); // Warms cache
    $this->info('Card cache warmed successfully');
}
```

**Warning signs:** API response times > 2 seconds, rate limit errors, user complaints about slow loading.

### Pitfall 3: Client-Side Filtering of Entire Dataset

**What goes wrong:** Browser becomes sluggish with 5000+ cards, memory usage spikes, filter lag > 1 second.

**Why it happens:** Fetching all cards and filtering only in Vue component works for testing but fails in production with full dataset.

**How to avoid:** Pre-filter on server based on primary criteria (class, format), then client-side filter remaining results:
- Server: Filter by class and format (reduces 5000 → ~1500 cards)
- Client: Filter by mana, type, rarity, search text (reduces 1500 → ~50 cards)
- Use server-side filtering for "hard" cuts (class/format)
- Use client-side filtering for "soft" filters (search, mana, rarity)

**Warning signs:** Browser DevTools shows > 10MB JSON transfer, filter inputs lag, mobile browsers freeze.

### Pitfall 4: Incorrect Tailwind Configuration

**What goes wrong:** Tailwind classes don't work, styling is broken, inconsistent appearance.

**Why it happens:** Missing content paths in `tailwind.config.js`, incorrect Vite setup, or not importing Tailwind directives.

**How to avoid:** Follow official Laravel + Tailwind setup:
```javascript
// tailwind.config.js
export default {
  content: [
    './resources/views/**/*.blade.php',
    './resources/js/**/*.vue',
  ],
  // ...
}
```

```css
/* resources/css/app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Warning signs:** Classes like `grid-cols-3` or `bg-blue-500` have no effect, styles work only after page refresh.

### Pitfall 5: Inertia.js Middleware Not Configured

**What goes wrong:** 419 CSRF token errors, Inertia requests return JSON instead of Vue pages, page redirects don't work.

**Why it happens:** Inertia middleware not added to web routes, or session state not properly configured.

**How to avoid:** Ensure Inertia middleware is properly configured:
```php
// app/Http/Kernel.php

protected $middlewareGroups = [
    'web' => [
        // ...
        \Inertia\Middleware\Middleware::class,
    ],
];
```

**Warning signs:** 419 PAGE EXPIRED errors, JSON responses instead of rendered pages, session data lost between requests.

### Pitfall 6: Vue 3 Reactivity Issues with Nested Data

**What goes wrong:** Filters don't update, computed properties return stale data, UI out of sync with state.

**Why it happens:** Directly mutating props, reassigning reactive objects, or using `let` instead of `ref()`.

**How to avoid:**
- Never mutate props directly - create local refs: `const localClass = ref(props.selectedClass)`
- Use `ref()` and `reactive()` for all reactive state
- Use computed properties for derived state
- Don't destructure reactive objects: `const { class } = filters` breaks reactivity

**Example anti-pattern:**
```javascript
// DON'T DO THIS - breaks reactivity
let filters = { class: 'all', manaCost: null }
filters.class = newValue  // Won't trigger updates
```

**Correct approach:**
```javascript
const filters = reactive({ class: 'all', manaCost: null })
filters.class = newValue  // Triggers updates
```

**Warning signs:** Computed properties not updating, need to click twice to see changes, console shows Vue reactivity warnings.

### Pitfall 7: Ignoring Mobile Performance

**What goes wrong:** App works on desktop but is unusable on mobile (slow, laggy, crashes).

**Why it happens:** Testing only on desktop, rendering too many cards at once, not using virtual scrolling.

**How to avoid:**
- Test on real mobile devices or Chrome DevTools mobile emulation
- Limit initial card render to 50-100 cards, use pagination or infinite scroll
- Use lazy loading for card images (`loading="lazy"` attribute)
- Optimize images with proper sizing (don't load 4K images for mobile)
- Use Tailwind responsive classes to adjust grid columns

**Example mobile optimization:**
```vue
<img
    :src="`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`"
    loading="lazy"
    class="w-full h-auto"
    :alt="card.name"
/>
```

**Warning signs:** Lighthouse performance score < 50, mobile page load > 5 seconds, browser crashes on mobile.

## Code Examples

Verified patterns from official sources:

### HearthstoneJSON Card Data Fetch

```javascript
// Browser fetch
const response = await fetch('https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json');
const cards = await response.json();

// Card structure example
{
  "id": "EX1_116",
  "dbfId": 559,
  "name": "Leeroy Jenkins",
  "text": "<b>Charge</b>. <b>Battlecry:</b> Summon two 1/1 Whelps for your opponent.",
  "flavor": "At least he has Angry Chicken.",
  "artist": "Gabe from Penny Arcade",
  "attack": 6,
  "cardClass": "NEUTRAL",
  "collectible": true,
  "cost": 5,
  "elite": true,
  "faction": "ALLIANCE",
  "health": 2,
  "mechanics": ["BATTLECRY", "CHARGE"],
  "rarity": "LEGENDARY",
  "set": "EXPERT1",
  "type": "MINION"
}
```

**Source:** HearthstoneJSON documentation: https://hearthstonejson.com/docs/cards.html

### Laravel 11 Redis Configuration

```php
// config/database.php
'redis' => [
    'client' => env('REDIS_CLIENT', 'predis'),

    'default' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD', null),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_DB', '0'),
    ],
],
```

```php
// config/cache.php
'default' => env('CACHE_DRIVER', 'redis'),

'stores' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'serialize' => true,
    ],
],
```

**Source:** Laravel 12.x Redis documentation (applies to Laravel 11): https://laravel.com/docs/12.x/redis

### Vue 3 Debounced Search Input

```javascript
import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const searchQuery = ref('');
const debouncedSearch = useDebounceFn((value) => {
    searchQuery.value = value;
}, 300);
```

**Template:**
```vue
<input
    type="text"
    @input="debouncedSearch($event.target.value)"
    placeholder="Search..."
/>
```

**Source:** VueUse documentation: https://vueuse.org/

### Inertia.js Page Render

```php
// Laravel Controller
use Inertia\Inertia;

return Inertia::render('CardSearch', [
    'cards' => $cards,
    'filters' => [
        'class' => $selectedClass,
        'format' => $selectedFormat,
    ],
]);
```

**Vue Page:**
```vue
<script setup>
import { Head } from '@inertiajs/vue3';

const props = defineProps({
    cards: Array,
    filters: Object,
});
</script>

<template>
    <Head title="Card Search" />
    <div>
        <!-- Card search UI -->
    </div>
</template>
```

**Source:** Inertia.js documentation: https://inertiajs.com/

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Options API | Composition API | Vue 3 (2020) | Better reusability, TypeScript support, tree-shaking |
| Webpack (Mix) | Vite | Laravel 9 (2022) | 10-100x faster HMR, modern ESM-based build |
| Separate API endpoints | Inertia.js | Inertia 1.0 (2021) | Eliminates API layer duplication, simpler state management |
| Client-side only rendering | SSR with Vite | Inertia SSR (2022) | Faster initial page load, better SEO |
| Manual debouncing | VueUse composable | VueUse 2020+ | One-line debounce, tested and maintained |
| jQuery AJAX | Axios/Fetch | Modern JS (2018+) | Promise-based, better error handling, smaller bundle |

**Deprecated/outdated:**
- **React Scripts 1.x:** Use Vite instead (faster, modern)
- **Vue 2 Options API:** Composition API is now standard
- **Bootstrap 3:** Use Tailwind CSS for modern utility-first styling
- **Custom API layer:** Inertia.js eliminates need for separate REST API
- **Laravel Mix:** Use Vite for asset bundling (official Laravel 11 default)

## Open Questions

Things that couldn't be fully resolved:

1. **Blizzard Official API Current Status**
   - What we know: Official Blizzard API documentation pages return 404 errors. HearthstoneJSON is confirmed working and community-maintained.
   - What's unclear: Whether Blizzard's official Hearthstone API is still active, deprecated, or moved to a new location. Rate limits (36,000/hour) are confirmed from forum discussions but API endpoints couldn't be verified.
   - Recommendation: Start with HearthstoneJSON API. If Blizzard API is needed later, investigate Battle.net developer portal and community forums for current status.

2. **Optimal Cache Invalidation Strategy for New Set Releases**
   - What we know: Card data updates when new Hearthstone sets release (every 4 months). 24-hour TTL works for day-to-day caching.
   - What's unclear: How to detect when HearthstoneJSON updates to trigger cache invalidation automatically. No webhook or notification system found.
   - Recommendation: Implement manual cache invalidation command (e.g., `php artisan cards:refresh-cache`) and run after new set releases. Consider scheduled task (every 6 hours) for automatic cache warming.

3. **HearthstoneJSON Update Frequency and Reliability**
   - What we know: HearthstoneJSON is community-maintained and has been active for years. Updates with each game build.
   - What's unclear: SLA or guaranteed update timeframe after new set releases. No formal documentation on maintenance schedule.
   - Recommendation: Monitor HearthstoneJSON GitHub repository for updates. Consider fallback to Blizzard API (if accessible) or manual card data import if HearthstoneJSON becomes unreliable.

## Sources

### Primary (HIGH confidence)
- **HearthstoneJSON Documentation** - Complete card data structure, field definitions, enum values: https://hearthstonejson.com/docs/cards.html
- **Laravel 12.x Redis Documentation** - Applies to Laravel 11, official Redis configuration and usage: https://laravel.com/docs/12.x/redis
- **Laravel 12.x Cache Documentation** - Official cache configuration and Cache facade usage: https://laravel.com/docs/12.x/cache
- **Tailwind CSS Responsive Design** - Official mobile-first breakpoint system: https://tailwindcss.com/docs/responsive-design
- **Inertia.js Documentation** - Official Laravel-Vue integration patterns: https://inertiajs.com/
- **Vue 3 Documentation** - Composition API, reactivity system, computed properties: https://vuejs.org/

### Secondary (MEDIUM confidence)
- **Laravel 11 with Inertia.js and Vue.js** - Setup guide confirming modern stack: https://dilmina.medium.com/laravel-11-with-inertia-js-and-vue-js-a-modern-development-stack-ca060feccfef
- **Laravel 11 Redis Cache Guide** - Practical Redis caching implementation: https://sandeeppant.medium.com/laravel-11-caching-with-redis-051e3a31c89b
- **How to build an autocomplete field with Vue 3** - Verified implementation patterns: https://stevencotterill.com/articles/how-to-build-an-autocomplete-field-with-vue-3/
- **HearthCard.io case study** - Real-world Laravel 11 + Redis + Hearthstone application: https://www.reddit.com/r/laravel/comments/1ibysz7/shipped_my_second_laravel_website_hearthcardio/
- **Zero-to-Heroes/HearthstoneJSON GitHub** - Active community project maintaining HearthstoneJSON: https://github.com/Zero-to-Heroes/HearthstoneJSON

### Tertiary (LOW confidence)
- **Blizzard API Rate Limits** - 36,000 calls/hour confirmed from forum discussions but API endpoints couldn't be verified: https://us.forums.blizzard.com/en/blizzard/t/api-access-clients-rate-limits/5602
- **Blizzard Hearthstone API Updates Forum** - Confirms API exists but shows limited recent activity: https://us.forums.blizzard.com/en/blizzard/t/hearthstone-api-updates/2978
- **Vue 3 autocomplete implementation patterns** - Community approaches to search/filter UI: https://dev.to/mihailo/how-to-adapt-an-autocompleteselect-field-to-work-with-server-side-filtering-and-pagination-55hm
- **Laravel Inertia.js common pitfalls** - Community discussions on SSR, validation, and form issues: https://laracasts.com/discuss/channels/inertia

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation confirms Laravel 11 + Vue 3 + Inertia.js + Tailwind + Vite is current standard
- Architecture: HIGH - HearthstoneJSON card structure verified from official docs, Laravel/Inertia patterns from official sources
- Caching strategy: HIGH - Redis configuration and usage patterns from official Laravel documentation
- Pitfalls: MEDIUM - Most pitfalls verified from official docs and community discussions, some Vue 3 reactivity issues from community reports

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days - Laravel/Vue/Inertia stack is stable but verify HearthstoneJSON updates)
