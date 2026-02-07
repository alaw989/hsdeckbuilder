# Architecture Research

**Domain:** Hearthstone Deck Builder Platform
**Researched:** 2026-02-06
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │ CardSearch │  │ DeckEditor │  │ AuthViews  │  │ Dashboard  │  │
│  │  (Vue 3)   │  │  (Vue 3)   │  │  (Vue 3)   │  │  (Vue 3)   │  │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  │
├────────┼───────────────┼───────────────┼───────────────┼───────────┤
│        │               │               │               │           │
│  ┌─────▼───────────────▼───────────────▼───────────────▼───────┐  │
│  │                   Vue 3 + Inertia.js Bridge                  │  │
│  │              (Server-Side Routing + SPA UX)                   │  │
│  └─────────────────────────────┬───────────────────────────────┘  │
├────────────────────────────────┼──────────────────────────────────┤
│                                 │                                  │
│  ┌─────────────────────────────▼───────────────────────────────┐  │
│  │                     Laravel 11 Backend                       │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │  │
│  │  │ Controllers │ │   Routes    │ │ Middleware  │           │  │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘           │  │
│  │         │               │               │                    │  │
│  │  ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐           │  │
│  │  │   Models    │ │   Services  │ │   Events    │           │  │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘           │  │
│  └─────────┼─────────────────┼─────────────────┼────────────────┘  │
├────────────┼─────────────────┼─────────────────┼───────────────────┤
│            │                 │                 │                   │
│  ┌─────────▼─────┐ ┌─────────▼─────┐ ┌─────────▼─────┐           │
│  │   MySQL/      │ │   Redis       │ │   Laravel     │           │
│  │ PostgreSQL    │ │   (Cache/     │ │   Reverb     │           │
│  │   Database    │ │    Queue)     │ │   (WebSockets)│           │
│  └───────────────┘ └───────────────┘ └───────────────┘           │
└────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Vue 3 Pages** | User-facing pages rendered via Inertia | `resources/js/Pages/` - CardSearch.vue, DeckEditor.vue, Dashboard.vue |
| **Vue 3 Components** | Reusable UI elements | `resources/js/Components/` - CardGrid.vue, ManaCurve.vue, DeckList.vue |
| **Composables** | Shared logic using Composition API | `resources/js/composables/` - useCards.js, useDecks.js, useAuth.js |
| **Pinia Stores** | Global state management | `resources/js/stores/` - cards.js, decks.js, auth.js, subscription.js |
| **Laravel Controllers** | Handle Inertia requests & business logic | `app/Http/Controllers/` - DeckController, CardController, AuthController |
| **Laravel Routes** | Define URL patterns & Inertia middleware | `routes/web.php` for Inertia, `routes/api.php` for AJAX |
| **Laravel Services** | Business logic & external API integration | `app/Services/` - CardApiService, DeckBuilderService, PaymentService |
| **Laravel Models** | Database interaction | `app/Models/` - User, Deck, Card, Subscription, CoachProfile |
| **Laravel Events** | Trigger real-time broadcasts | `app/Events/` - DeckShared, NewSubscription, CoachBooked |
| **Laravel Listeners** | Handle events & send notifications | `app/Listeners/` - SendDeckNotification, ProcessPayment |

## Recommended Project Structure

```
hsdeckbuilder/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php       # Login/register/logout
│   │   │   ├── DeckController.php       # Deck CRUD, sharing
│   │   │   ├── CardController.php       # Card search, filtering
│   │   │   ├── DashboardController.php  # User dashboard
│   │   │   ├── SubscriptionController.php # Subscriptions, payments
│   │   │   └── CoachController.php      # Coach marketplace
│   │   ├── Middleware/
│   │   │   ├── Authenticate.php
│   │   │   ├── RedirectIfAuthenticated.php
│   │   │   └── EnsureSubscriptionIs.php # Premium gates
│   │   └── Requests/
│   │       ├── DeckRequest.php          # Validation
│   │       └── CardSearchRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Deck.php                     # Deck Eloquent model
│   │   ├── Card.php                     # Card Eloquent model
│   │   ├── DeckCard.php                 # Pivot: cards in decks
│   │   ├── Subscription.php             # User subscriptions
│   │   ├── CoachProfile.php             # Coach marketplace
│   │   └── AnalyticsEvent.php           # Usage tracking
│   ├── Services/
│   │   ├── BlizzardApiService.php       # Hearthstone API client
│   │   ├── DeckBuilderService.php       # Deck construction logic
│   │   ├── PaymentService.php           # Stripe integration
│   │   └── CardCacheService.php         # Redis caching for cards
│   ├── Events/
│   │   ├── DeckShared.php               # Broadcast when deck shared
│   │   ├── NewFollower.php              # User follows another
│   │   └── SubscriptionPurchased.php    # Payment events
│   └── Listeners/
│       ├── SendDeckSharedNotification.php
│       └── UpdateSubscriptionStatus.php
├── resources/
│   ├── js/
│   │   ├── Pages/                       # Inertia page components
│   │   │   ├── Welcome.vue
│   │   │   ├── Auth/
│   │   │   │   ├── Login.vue
│   │   │   │   └── Register.vue
│   │   │   ├── Deck/
│   │   │   │   ├── Index.vue            # Deck browser
│   │   │   │   ├── Create.vue           # Deck builder
│   │   │   │   ├── Show.vue             # Single deck view
│   │   │   │   └── Edit.vue
│   │   │   ├── Card/
│   │   │   │   └── Search.vue           # Card search
│   │   │   ├── Dashboard/
│   │   │   │   └── Index.vue
│   │   │   ├── Subscription/
│   │   │   │   ├── Plans.vue            # Pricing page
│   │   │   │   └── Checkout.vue         # Stripe checkout
│   │   │   └── Coach/
│   │   │       ├── Index.vue            # Coach marketplace
│   │   │       └── Profile.vue          # Coach profile
│   │   ├── Components/                  # Reusable Vue components
│   │   │   ├── Layout/
│   │   │   │   ├── AuthenticatedLayout.vue
│   │   │   │   └── GuestLayout.vue
│   │   │   ├── Deck/
│   │   │   │   ├── CardGrid.vue         # Display cards
│   │   │   │   ├── ManaCurve.vue        # Mana cost chart
│   │   │   │   ├── DeckList.vue         # Selected cards
│   │   │   │   ├── DraggableCard.vue    # Drag-drop wrapper
│   │   │   │   └── ClassSelector.vue    # Pick class
│   │   │   ├── Card/
│   │   │   │   ├── CardSearch.vue       # Search autocomplete
│   │   │   │   └── CardTooltip.vue      # Hover details
│   │   │   └── UI/
│   │   │       ├── Button.vue
│   │   │       ├── Modal.vue
│   │   │       ├── Notification.vue     # Toast/alert
│   │   │       └── AdBanner.vue         # Ad placement
│   │   ├── Composables/                 # Vue 3 Composition API
│   │   │   ├── useCards.js              # Card search/filter logic
│   │   │   ├── useDecks.js              # Deck CRUD operations
│   │   │   ├── useAuth.js               # Auth state & methods
│   │   │   ├── useDragDrop.js           # Drag-drop logic
│   │   │   └── useNotifications.js      # Real-time notifications
│   │   ├── Stores/                      # Pinia state stores
│   │   │   ├── cards.js                 # Card catalog, filters
│   │   │   ├── decks.js                 # User decks, active deck
│   │   │   ├── auth.js                  # User session
│   │   │   ├── subscription.js          # Premium status
│   │   │   └── notifications.js         # Notification queue
│   │   ├── app.js                       # Vue app bootstrap
│   │   └── bootstrap.js                 # Inertia setup
│   ├── views/
│   │   └── app.blade.php                # Root Inertia template
│   └── css/
│       └── app.css                      # Tailwind imports
├── routes/
│   ├── web.php                          # Inertia routes
│   ├── api.php                          # JSON API routes
│   └── channels.php                     # Broadcast auth
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_decks_table.php
│   │   ├── 2024_01_01_000003_create_cards_table.php
│   │   ├── 2024_01_01_000004_create_deck_cards_table.php
│   │   ├── 2024_01_01_000005_create_subscriptions_table.php
│   │   ├── 2024_01_01_000006_create_coach_profiles_table.php
│   │   └── 2024_01_01_000007_create_analytics_events_table.php
│   └── seeders/
│       └── CardSeeder.php               # Import Hearthstone cards
├── config/
│   └── reverb.php                       # WebSocket config
├── vite.config.js                       # Vite + Laravel plugin
├── tailwind.config.js
└── package.json
```

### Structure Rationale

- **`resources/js/Pages/`:** Inertia.js expects page components here. Each route maps to a Vue component in this directory. Subdirectories group related features (Deck, Card, Subscription).
- **`resources/js/Components/`:** Reusable Vue components. Organized by feature (Deck, Card, UI) for clarity. Layout components handle app shell.
- **`resources/js/Composables/`:** Vue 3 Composition API functions. Encapsulates reusable logic (useCards for card API, useDragDrop for drag-drop). Cleaner than Options API mixins.
- **`resources/js/Stores/`:** Pinia stores. Centralized state for cards, decks, auth, subscriptions. Better than Vuex for Vue 3.
- **`app/Http/Controllers/`:** Laravel controllers. Each controller handles a feature area. Inertia controllers return `Inertia::render()`, API controllers return JSON.
- **`app/Services/`:** Business logic. External API calls (Blizzard), payment processing (Stripe), deck construction rules. Keeps controllers thin.
- **`app/Models/`:** Eloquent models with relationships. `Deck` hasMany `Cards`, `User` hasMany `Decks`, etc.
- **`app/Events/` & `Listeners/`:** Real-time features via Laravel Reverb. Events broadcast to Vue frontend.

## Architectural Patterns

### Pattern 1: Inertia.js Monolith

**What:** Server-side routing with Vue 3 frontend. Laravel handles routing, controllers, auth. Vue renders pages via Inertia without API calls.

**When to use:**
- Want SPA UX without full SPA complexity
- Team comfortable with Laravel and Vue
- Single deployment (no separate frontend/backend)
- SEO needs basic SSR (Inertia + SSR possible)

**Trade-offs:**
- ✅ Simple deployment, shared codebase
- ✅ Laravel handles auth, sessions, CSRF automatically
- ✅ Less boilerplate than API + SPA
- ❌ Frontend/backend coupled (can't swap easily)
- ❌ Requires server round-trip for navigation

**Example Route:**
```php
// routes/web.php
Route::get('/decks/{deck}', [DeckController::class, 'show'])
    ->middleware('auth');

// app/Http/Controllers/DeckController.php
public function show(Deck $deck)
{
    // Authorization check
    $this->authorize('view', $deck);

    // Render Inertia page with props
    return Inertia::render('Deck/Show', [
        'deck' => $deck->load('cards', 'user'),
        'canEdit' => auth()->user()->can('update', $deck),
        'analytics' => $deck->analytics, // Calculated on server
    ]);
}
```

**Vue Page Component:**
```vue
<!-- resources/js/Pages/Deck/Show.vue -->
<script setup>
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    deck: Object,
    canEdit: Boolean,
    analytics: Object,
});
</script>

<template>
    <div>
        <h1>{{ deck.name }}</h1>
        <div v-if="canEdit">
            <Link :href="`/decks/${deck.id}/edit`">Edit Deck</Link>
        </div>
        <DeckList :cards="deck.cards" />
        <ManaCurve :analytics="analytics" />
    </div>
</template>
```

### Pattern 2: API + SPA Routes (Hybrid)

**What:** Mix Inertia routes for page navigation with JSON API for AJAX operations. Use API routes for real-time features, search, form submissions.

**When to use:**
- Need real-time updates (card search, notifications)
- Want progressive enhancement (server pages + AJAX widgets)
- Background operations (save draft, analytics tracking)

**Trade-offs:**
- ✅ Best of both worlds: fast navigation + dynamic updates
- ✅ API routes can be reused for mobile apps later
- ❌ Two ways to do things (Inertia vs API) confuses beginners

**Example API Route:**
```php
// routes/api.php
Route::middleware('auth')->group(function () {
    Route::get('/cards/search', [CardController::class, 'search']);
    Route::post('/decks/{deck}/cards', [DeckController::class, 'addCard']);
});

// app/Http/Controllers/CardController.php
public function search(Request $request)
{
    $query = $request->get('q');
    $class = $request->get('class');

    $cards = Card::query()
        ->where('name', 'like', "%{$query}%")
        ->when($class, fn($q) => $q->where('player_class', $class))
        ->limit(20)
        ->get();

    return response()->json($cards);
}
```

**Vue Composable with API Call:**
```javascript
// resources/js/composables/useCards.js
import { ref } from 'vue';
import axios from 'axios';

export function useCards() {
    const cards = ref([]);
    const loading = ref(false);

    const searchCards = async (query, classFilter = null) => {
        loading.value = true;
        try {
            const response = await axios.get('/api/cards/search', {
                params: { q: query, class: classFilter }
            });
            cards.value = response.data;
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            loading.value = false;
        }
    };

    return { cards, loading, searchCards };
}
```

### Pattern 3: Pinia State Management

**What:** Centralized state stores using Pinia (Vue 3 official). Stores manage domain state (cards, decks, auth). Components read/write to stores via composables.

**When to use:**
- Shared state across many components
- Complex state logic (deck construction rules)
- Need state persistence (localStorage sync)
- Real-time updates (subscriptions, notifications)

**Trade-offs:**
- ✅ Cleaner than prop drilling
- ✅ DevTools for debugging
- ✅ TypeScript support
- ❌ Overkill for simple component state
- ❌ Learning curve for beginners

**Example Pinia Store:**
```javascript
// resources/js/stores/decks.js
import { defineStore } from 'pinia';

export const useDeckStore = defineStore('decks', {
    state: () => ({
        activeDeck: null,
        decks: [],
        loading: false,
    }),

    getters: {
        cardCount: (state) => state.activeDeck?.cards.length || 0,
        isValidDeck: (state) => {
            return state.activeDeck && state.activeDeck.cards.length === 30;
        },
        manaCurve: (state) => {
            // Calculate mana distribution
            if (!state.activeDeck) return [];
            const curve = Array(8).fill(0);
            state.activeDeck.cards.forEach(card => {
                if (card.cost <= 7) curve[card.cost]++;
            });
            return curve;
        },
    },

    actions: {
        async createDeck(classType) {
            this.loading = true;
            try {
                const response = await axios.post('/api/decks', {
                    class: classType,
                    name: `${classType} Deck`,
                });
                this.activeDeck = response.data;
                this.decks.push(response.data);
            } catch (error) {
                console.error('Failed to create deck:', error);
            } finally {
                this.loading = false;
            }
        },

        async addCard(card) {
            if (!this.activeDeck) return;

            // Validation: max 2 copies per card
            const copies = this.activeDeck.cards.filter(c => c.id === card.id).length;
            if (copies >= 2) {
                throw new Error('Maximum 2 copies per card');
            }

            // Validation: max 30 cards
            if (this.activeDeck.cards.length >= 30) {
                throw new Error('Deck cannot exceed 30 cards');
            }

            this.activeDeck.cards.push(card);

            // Persist to server
            await axios.post(`/api/decks/${this.activeDeck.id}/cards`, {
                card_id: card.id,
            });
        },
    },
});
```

**Component Using Store:**
```vue
<!-- resources/js/Components/Deck/DeckEditor.vue -->
<script setup>
import { storeToRefs } from 'pinia';
import { useDeckStore } from '@/stores/decks';
import { useCardStore } from '@/stores/cards';

const deckStore = useDeckStore();
const cardStore = useCardStore();

const { activeDeck, isValidDeck } = storeToRefs(deckStore);
const { searchResults } = storeToRefs(cardStore);

const handleAddCard = (card) => {
    try {
        deckStore.addCard(card);
    } catch (error) {
        showError(error.message);
    }
};
</script>

<template>
    <div>
        <ClassSelector @selected="deckStore.createDeck" />
        <div v-if="activeDeck">
            <h2>{{ activeDeck.name }}</h2>
            <p>Cards: {{ deckStore.cardCount }} / 30</p>
            <button :disabled="!isValidDeck">Save Deck</button>

            <CardSearch @card-selected="handleAddCard" />

            <ManaCurve :data="deckStore.manaCurve" />
            <DeckList :cards="activeDeck.cards" />
        </div>
    </div>
</template>
```

## Data Flow

### Request Flow (Inertia Page Navigation)

```
[User clicks link]
    ↓
[Inertia.visit('/decks/5')]
    ↓
[Browser request to /decks/5]
    ↓
[Laravel Route matches]
    ↓
[DeckController@show]
    ├─ Authorization check
    ├─ Fetch deck + relations from DB
    ├─ Calculate analytics (server-side)
    └─ Return Inertia::render('Deck/Show', [props])
    ↓
[Inertia middleware]
    ├─ Serialize props to JSON
    └─ Return HTML with Inertia app
    ↓
[Vue Router intercepts]
    ↓
[Deck/Show.vue receives props]
    ↓
[Component renders with props]
```

### Request Flow (AJAX API Call)

```
[User types in search box]
    ↓
[Component calls useCards().search()]
    ↓
[Composable makes axios.get('/api/cards/search?q=fireball')]
    ↓
[Browser XHR to /api/cards/search]
    ↓
[Laravel Route matches (api.php)]
    ↓
[CardController@search]
    ├─ Query parameter validation
    ├─ Search database/cards cache
    └─ Return response()->json($cards)
    ↓
[Component receives JSON]
    ↓
[Pinia store updates state]
    ↓
[Vue component reactivity updates UI]
```

### Real-time Notification Flow (Reverb)

```
[Event triggered in Laravel]
    ↓
[DeckShared event created]
    ↓
[event(new DeckShared($deck, $user))]
    ↓
[Laravel broadcasts via Reverb]
    ↓
[WebSocket message sent to Redis]
    ↓
[Reverb server pushes to connected clients]
    ↓
[Vue component listens to channel]
    ↓
[Laravel Echo receives broadcast]
    ↓
[Notification composable updates UI]
```

**Laravel Event:**
```php
// app/Events/DeckShared.php
class DeckShared implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $deck;
    public $user;

    public function __construct(Deck $deck, User $user)
    {
        $this->deck = $deck;
        $this->user = $user;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('users.' . $this->deck->user_id);
    }

    public function broadcastWith()
    {
        return [
            'deck_id' => $this->deck->id,
            'deck_name' => $this->deck->name,
            'shared_by' => $this->user->name,
        ];
    }
}
```

**Vue Listener:**
```javascript
// resources/js/composables/useNotifications.js
import { onMounted, onUnmounted } from 'vue';
import Echo from 'laravel-echo';

export function useNotifications() {
    const notifications = ref([]);

    onMounted(() => {
        Echo.private(`users.${authUserId}`)
            .listen('DeckShared', (e) => {
                notifications.value.push({
                    type: 'deck_shared',
                    message: `${e.shared_by} viewed your deck ${e.deck_name}`,
                    deck_id: e.deck_id,
                });
            });
    });

    return { notifications };
}
```

### Key Data Flows

1. **Card Search Flow:** User types → Vue component → `useCards().search()` → Axios API call → Laravel queries DB/cards cache → JSON response → Pinia store updates → Vue reactivity updates card grid
2. **Deck Creation Flow:** User selects class → `useDecks().createDeck()` → Axios POST → Laravel creates deck record → Inertia redirects to deck editor → Props passed to Vue component
3. **Deck Building Flow:** User drags card → `useDragDrop()` emits event → `useDecks().addCard()` → Validation in store → Axios POST deck_card → Laravel creates pivot record → WebSocket broadcast to collaborators
4. **Authentication Flow:** User visits `/login` → Inertia renders Login.vue → User submits form → Axios POST `/login` → Laravel Fortify auth attempt → Session created → Inertia redirects to dashboard → auth store updated
5. **Payment Flow:** User clicks subscribe → Inertia visits `/subscription/checkout` → Checkout.vue mounts → Stripe Elements loads → User enters card → Stripe token created → Axios POST `/subscription` → Laravel Cashier creates subscription → Redirect to success page → subscription store updates

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | Monolith is fine. Single Laravel app + MySQL. Deploy on Forge/Vapor. Redis optional but nice for caching. |
| **1k-100k users** | Add Redis for card caching (Blizzard API is slow). Use queue for analytics tracking. Optimize DB queries with eager loading. Consider read replicas for heavy read traffic. |
| **100k-1M users** | Separate card search to dedicated service (Elasticsearch/Algolia). Use CDN for static card images. Separate read replicas. Consider splitting marketplace into separate service. Use Varnish/Nginx caching. |

### Scaling Priorities

1. **First bottleneck: Card search queries**
   - **Problem:** Searching 5,000+ Hearthstone cards on every keystroke
   - **Fix:** Redis cache for card catalog. Pre-filter cards by class/mana. Use full-text search (Elasticsearch) if MySQL too slow.
   - **Implementation:**
     ```php
     // Cache cards for 24 hours
     $cards = Cache::remember('cards:all', 86400, fn() => Card::all());
     ```

2. **Second bottleneck: Deck sharing traffic**
   - **Problem:** Viral deck share causes spike in DB reads
   - **Fix:** Cache rendered deck view (HTML fragment). CDN for deck images. Use read replicas.
   - **Implementation:**
     ```php
     // Cache deck view
     $html = Cache::remember("deck:{$id}:view", 3600, function() use($deck) {
         return view('deck.shared', compact('deck'))->render();
     });
     ```

3. **Third bottleneck: Real-time connections**
   - **Problem:** 10k+ WebSocket connections overload Reverb server
   - **Fix:** Use Redis pub/sub for multiple Reverb servers. Load balance WebSocket connections.
   - **Implementation:**
     ```php
     // config/reverb.php
     'servers' => [
         ['host' => 'reverb-1', 'port' => 8080],
         ['host' => 'reverb-2', 'port' => 8080],
     ],
     ```

## Anti-Patterns

### Anti-Pattern 1: Direct API Calls from Components

**What people do:** Every Vue component makes its own axios calls. API endpoints scattered across components.

**Why it's wrong:** Duplicated logic, hard to test, no caching, error handling repeated.

**Do this instead:**
- Use composables to encapsulate API calls (`useCards()`, `useDecks()`)
- Pinia stores for state + API logic together
- Service layer in Laravel for business logic

```javascript
// BAD: Direct API call in component
const cards = ref([]);
onMounted(async () => {
    const response = await axios.get('/api/cards');
    cards.value = response.data;
});

// GOOD: Use composable
const { cards, loading } = useCards();
onMounted(() => cards.fetch());
```

### Anti-Pattern 2: Massive Page Components

**What people do:** 500-line Vue component with all logic inline. Deck editor handles search, drag-drop, validation, persistence.

**Why it's wrong:** Unmaintainable, hard to test, violates single responsibility.

**Do this instead:**
- Break into smaller components (CardGrid, CardSearch, DeckList, ManaCurve)
- Extract logic to composables
- Use props/events for communication

```vue
<!-- BAD: Everything in one component -->
<template>
  <div><!-- 300 lines of template --></div>
</template>
<script setup>
// 200 lines of logic
</script>

<!-- GOOD: Composed components -->
<template>
  <CardGrid :cards="filteredCards" @card-selected="addCard" />
  <DeckList :cards="deckCards" @card-removed="removeCard" />
  <ManaCurve :cards="deckCards" />
</template>
```

### Anti-Pattern 3: Client-Side Only Auth

**What people do:** Store JWT in localStorage, check auth in Vue only. No middleware on Laravel routes.

**Why it's wrong:** Security hole. Users can bypass client checks. CSRF vulnerabilities.

**Do this instead:**
- Use Laravel session auth (Inertia default)
- Protect routes with `->middleware('auth')`
- Check authorization in controllers (`$this->authorize()`)
- Inertia handles CSRF automatically

```php
// BAD: No middleware
Route::post('/decks', [DeckController::class, 'store']);

// GOOD: Auth + authz middleware
Route::post('/decks', [DeckController::class, 'store'])
    ->middleware('auth');

// In controller
public function store(Request $request)
{
    $this->authorize('create', Deck::class); // Policy check
    // ...
}
```

### Anti-Pattern 4: Ignoring Inertia Page Props

**What people do:** Inertia passes data via props, but component immediately fetches same data via API.

**Why it's wrong:** Extra round trip, defeats Inertia's purpose. Server already fetched data.

**Do this instead:**
- Use Inertia props for initial data
- Only use API calls for user interactions (search, filter, pagination)

```vue
<!-- BAD: Ignore props, fetch again -->
<script setup>
const props = defineProps({ deck: Object });
const deck = ref(null);
onMounted(async () => {
    deck.value = await axios.get(`/api/decks/${props.deck.id}`);
});
</script>

<!-- GOOD: Use props directly -->
<script setup>
const props = defineProps({ deck: Object });
const deck = toRef(props, 'deck'); // Reactive reference
</script>
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Blizzard Hearthstone API** | Laravel Service + Queue | Cards API is slow, use queue to import. Cache cards in DB. |
| **Stripe Payments** | Laravel Cashier (Stripe) | Official package handles subscriptions, webhooks. Use Inertia for checkout page. |
| **Laravel Reverb (WebSockets)** | Laravel Echo + Vue | Real-time notifications, deck sharing. Private channels for user-specific. |
| **Redis** | Cache + Queue + Reverb | Cache card catalog. Queue for analytics. Pub/sub for broadcasts. |
| **Amazon S3** | Laravel Filesystem | Store deck export images, coach profile photos. |
| **Google Analytics** | Vue composable | Track deck shares, searches. Send events on user actions. |

**Blizzard API Integration:**
```php
// app/Services/BlizzardApiService.php
class BlizzardApiService
{
    protected $client;
    protected $cache;

    public function __construct()
    {
        $this->client = Http::acceptJson()
            ->withToken(config('services.blizzard.key'));

        $this->cache = Cache::driver('redis');
    }

    public function getAllCards()
    {
        return $this->cache->remember('blizzard:cards:all', 86400, function() {
            $response = $this->client->get('https://us.api.blizzard.com/hearthstone/cards');
            return $response->json()['cards'];
        });
    }

    public function searchCards($query)
    {
        $cards = $this->getAllCards();
        return collect($cards)->filter(fn($card) =>
            str_contains($card['name'], $query)
        )->values();
    }
}
```

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Laravel ↔ Vue (Inertia)** | Props (Laravel→Vue), visits (Vue→Laravel) | Server passes initial data. Client triggers navigation. |
| **Laravel ↔ Vue (API)** | JSON (HTTP) | Use for AJAX operations, search, real-time updates. |
| **Vue Components ↔ Pinia** | Actions/Getters | Components read stores via `storeToRefs()`. Call actions for mutations. |
| **Laravel Controllers ↔ Services** | Method calls | Controllers delegate business logic to services. |
| **Laravel → Reverb → Vue** | WebSockets | Events broadcast to channels. Vue listens via Echo. |
| **Queue Workers ↔ Database** | Jobs + DB | Background tasks import cards, send emails. Update DB when done. |

## Build Order (Suggested Implementation Sequence)

Based on dependencies and complexity:

1. **Phase 1: Core Deck Builder**
   - Laravel backend (users, decks, cards migrations)
   - Card API integration (Blizzard API service)
   - Inertia setup + basic Vue pages
   - Card search + deck creation
   - **Why:** Foundation for everything. Cards, decks are core.

2. **Phase 2: Authentication + User Decks**
   - Laravel Breeze/Fortify for auth
   - User dashboard (list decks)
   - Deck CRUD (create, edit, delete)
   - Deck sharing (unique URLs)
   - **Why:** Users need accounts to save decks. Auth required for next phases.

3. **Phase 3: Drag-Drop + Polish**
   - vue-draggable-next integration
   - Pinia stores for state
   - Deck validation (30 cards, class restriction)
   - Mana curve visualization
   - **Why:** Makes deck builder usable. Key feature from requirements.

4. **Phase 4: Real-Time Features**
   - Laravel Reverb setup
   - Notifications (deck shared, new follower)
   - Live deck collaboration (optional v2)
   - **Why:** Differentiator. Adds engagement.

5. **Phase 5: Payments + Subscriptions**
   - Stripe + Laravel Cashier
   - Subscription plans
   - Premium features (analytics, guides)
   - **Why:** Monetization. Requires stable user base.

6. **Phase 6: Marketplace**
   - Coach profiles
   - Booking system
   - Reviews/ratings
   - **Why:** Advanced feature. Depends on auth, payments.

## Database Schema Considerations

### Core Tables

```sql
-- Users (Laravel default)
users (id, name, email, password, created_at, updated_at)

-- Decks
decks (id, user_id, name, description, class_type, is_public, slug, created_at, updated_at)

-- Cards (imported from Blizzard API)
cards (id, blizzard_id, name, description, mana_cost, attack, health,
       player_class, card_set, rarity, type, image_url, crop_image_url,
       collectible, created_at, updated_at)

-- Deck-Card Relationship (pivot with metadata)
deck_cards (id, deck_id, card_id, quantity, position, created_at)

-- Subscriptions (Laravel Cashier default + custom)
subscriptions (id, user_id, type, stripe_id, stripe_status, stripe_price,
               quantity, trial_ends_at, ends_at, created_at, updated_at)

-- Coach Profiles (marketplace)
coach_profiles (id, user_id, bio, hourly_rate, languages, availability,
                timezone, verified_at, created_at, updated_at)

-- Analytics Events (track usage)
analytics_events (id, user_id, event_type, metadata, created_at)
```

### Indexes for Performance

```sql
-- Frequent queries: find public decks by class
CREATE INDEX idx_decks_class_public ON decks(class_type, is_public);

-- Frequent queries: search cards by name/class
CREATE INDEX idx_cards_name ON cards(name);
CREATE INDEX idx_cards_class ON cards(player_class);

-- Frequent queries: user's decks
CREATE INDEX idx_decks_user ON decks(user_id);

-- Deck card ordering (for drag-drop positions)
CREATE INDEX idx_deck_cards_position ON deck_cards(deck_id, position);
```

### Relationships

```
User hasMany Deck
User hasMany Subscription (via Cashier)
User hasOne CoachProfile
User hasMany AnalyticsEvent

Deck belongsTo User
Deck hasMany Card (via DeckCard pivot)

Card hasMany Deck (via DeckCard pivot)
DeckCard belongsTo Deck
DeckCard belongsTo Card

CoachProfile belongsTo User
```

## Sources

- **Inertia.js + Vue 3 in Laravel 2026: The Complete Modern SPA Guide** - https://sadiqueali.medium.com/inertia-js-vue-3-in-laravel-2026-the-complete-modern-spa-guide-61c567d48084
- **Laravel 11 + Vue 3 + Tailwind + Vite Best Practices** - https://dev.to/addwebsolutionpvtltd/state-management-in-vue-3-for-laravel-applications-pinia-integration-1jkf
- **State Management in Vue 3 for Laravel Applications (Pinia Integration)** - https://dev.to/addwebsolutionpvtltd/state-management-in-vue-3-for-laravel-applications-pinia-integration-1jkf
- **Vue 3 Drag-and-Drop Page Builder with Laravel 11** - https://github.com/billiemead/vue3-page-builder
- **Laravel Reverb and Vue 3 + TypeScript: Add Realtime to Your App** - https://laravel.io/articles/laravel-reverb-and-vue-3-typescript-add-realtime-to-your-app
- **Real-Time Notifications using Reverb, Redis, and TDD** - https://jose-gutierrez.com/en/articles/laravel-vue-real-time-notifications-using-reverb-redis-and-tdd-03
- **Laravel Documentation - Database** - https://laravel.com/docs/12.x/database
- **Laravel Documentation - Inertia.js** - https://laravel.com/docs/11.x/inertia
- **Laravel Cashier (Stripe) Documentation** - https://laravel.com/docs/11.x/cashier
- **Vue 3 Composition API Documentation** - https://vuejs.org/guide/extras/composition-api-faq.html
- **Pinia Documentation** - https://pinia.vuejs.org/
- **vue-draggable Documentation** - https://github.com/SortableJS/vue.draggable.next
- **Integrate Stripe Payment Gateway with Vue 3 and Laravel** - https://dev.to/scriptmint/integrate-stripe-payment-gateway-with-vue-3-and-laravel-1gnp

---
*Architecture research for: Hearthstone Deck Builder Platform*
*Researched: 2026-02-06*
