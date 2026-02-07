# Project Research Summary

**Project:** Hearthstone Deck Builder Platform
**Domain:** TCG deck builder with monetization (ads, affiliates, premium subscriptions, coaching marketplace)
**Researched:** 2026-02-06
**Confidence:** HIGH

## Executive Summary

This is a modern TCG deck builder platform—similar to HSReplay, HearthstoneTopDecks, and Moxfield—that requires real-time card search, drag-and-drop deck construction, and multiple revenue streams. Experts build these as monolithic Laravel/Vue applications using Inertia.js for SPA-like UX without API complexity, Pinia for state management, and aggressive caching for external API data. The stack choice is well-established: Laravel 11 + Vue 3 + Inertia.js + Tailwind CSS is the current standard (2025), with Vue.draggable.next for drag operations and Laravel Cashier for payments.

The recommended approach is to start with a list-based deck builder (MVP) rather than visual drag-and-drop, validate user engagement, then add drag-drop using Vue.draggable.next. Implement caching on day 1 (Redis) to avoid Blizzard API rate limits (36,000 requests/hour). Build authentication with Laravel Breeze/Sanctum before adding premium features. Defer real-time collaboration and native mobile apps to v2+. Monetization should be diversified from launch: ads (supplemental, 10-20% of revenue), affiliate links to Amazon/Blizzard (primary early revenue), and premium subscriptions after validation.

**Key risks and mitigation:** (1) API rate limit exhaustion—mitigate with cache-aside pattern, 24-72h TTL, batch requests; (2) Drag-drop performance collapse—mitigate with throttling (16ms), virtual scrolling, validation on drag-end not drag-move; (3) Stripe webhook failures—verify signatures, store webhooks in DB before processing, test with ngrok; (4) Ad blockers killing revenue—diversify with affiliates and premium features, never rely on ads as primary revenue. Most pitfalls are well-documented with clear prevention strategies.

## Key Findings

### Recommended Stack

Laravel 11 + Vue 3 + Inertia.js monolith is the recommended architecture. This stack provides SPA-like UX without the complexity of building a separate API backend. Laravel handles routing, auth, and business logic; Vue 3 provides reactive components; Inertia.js bridges them without REST API boilerplate. Pinia replaces Vuex for state management. Vite replaces Laravel Mix for fast builds. Tailwind CSS v3.4.17 (stable) provides rapid UI development.

**Core technologies:**
- **Laravel 11 (PHP 8.2+)** — Backend framework with excellent ecosystem, Eloquent ORM, built-in security, queues, and scheduling. Laravel 12.x exists but 11 is stable and widely adopted (2025).
- **Vue 3 (3.4+)** — Frontend framework with Composition API, better TypeScript support, and improved performance over Vue 2 (EOL Dec 2023). Ideal for complex interactive UIs.
- **Inertia.js (2.x)** — SPA architecture without API—server-side routing with Vue rendering. Reduces complexity while maintaining SPA-like UX. Officially supported by Laravel.
- **Tailwind CSS (3.4.17 stable)** — Utility-first CSS framework for rapid UI development. Avoid writing custom CSS. v4 is in beta (2025) but not production-ready.
- **Vite (5.x)** — Frontend build tool with lightning-fast HMR. Default in Laravel 11, replacing Laravel Mix.
- **Pinia (2.x)** — Official Vue 3 state management (replaces Vuex). Lightweight, TypeScript-friendly, integrates with Composition API.
- **Vue.draggable.next (2.x+)** — Drag-and-drop built on SortableJS. Most mature Vue 3 drag-drop solution. Use with virtual scrolling for performance.

**Critical for this domain:**
- **Laravel Cashier (Stripe 15.x)** — Subscription billing. Official Stripe integration for Laravel.
- **Laravel Reverb (1.x)** — Real-time WebSocket server for notifications and live deck collaboration.
- **VueUse (10.x+)** — 200+ composition utilities (debounce, storage, drag detection).
- **Laravel Sanctum (4.x)** — SPA authentication perfect for Inertia.js apps.

### Expected Features

**Must have (table stakes):**
- Card database with search/filter — Can't build decks without finding cards. Autocomplete essential.
- Deck builder interface — Core functionality. List-based for MVP, drag-drop as differentiator.
- Deck code import/export — Industry standard (Blizzard's deck string format). Critical for sharing.
- Mana curve visualization — Players expect to see mana distribution. Standard feature on all deck builders.
- Dust cost calculator — Essential for budget players. Shows crafting cost breakdown.
- Class & format selection — Hearthstone is class-based; Standard/Wild/Twist formats have different card pools.
- URL sharing for decks — Community relies on sharing deck links for discovery.
- Responsive design — Many players browse on mobile; apps are differentiator.

**Should have (competitive):**
- Visual drag-and-drop builder — Easier than list-based. High complexity but key differentiator (use Vue.draggable.next).
- Advanced analytics dashboard — Win rates, mulligan guidance, card performance. HSReplay premium feature.
- Pro player deck marketplace — Coaching marketplace, paid guides, pro deck access. Not offered by competitors (blue ocean).
- Collection integration — Import collection, highlight missing cards. Premium feature potential.
- Deck comparison tool — Players analyze deck differences. HearthstoneTopDecks has this.

**Defer (v2+):**
- Real-time multiplayer deck building — HIGH complexity, requires WebSockets + conflict resolution.
- Native mobile apps — Development overhead x3. Web-first with PWA is faster.
- AI-powered deck suggestions — Requires analytics data and ML models. Build after validating core.
- Coaching marketplace — Complex, requires user base, payment split logic, messaging.
- Replay system — HSReplay has this. High complexity, unclear if users want it.

### Architecture Approach

Recommended architecture is an Inertia.js monolith with Laravel 11 backend and Vue 3 frontend. This provides server-side routing, auth, and data fetching with Vue's reactive components—no REST API required for navigation. Laravel controllers pass props directly to Vue pages. Use hybrid approach: Inertia for page navigation, JSON API for AJAX operations (search, real-time updates). Pinia stores manage global state (cards, decks, auth). Laravel Services handle business logic and external API integration (Blizzard API, Stripe). Laravel Reverb handles real-time broadcasts for notifications.

**Major components:**
1. **Vue 3 Pages** (`resources/js/Pages/`) — Inertia page components (CardSearch.vue, DeckEditor.vue, Dashboard.vue). Receive props from Laravel controllers.
2. **Vue Components** (`resources/js/Components/`) — Reusable UI elements (CardGrid.vue, ManaCurve.vue, DeckList.vue). Organized by feature.
3. **Composables** (`resources/js/composables/`) — Shared logic using Composition API (useCards.js, useDecks.js, useAuth.js). Encapsulate API calls.
4. **Pinia Stores** (`resources/js/stores/`) — Global state management (cards.js, decks.js, auth.js, subscription.js). Centralized state for domain entities.
5. **Laravel Controllers** (`app/Http/Controllers/`) — Handle Inertia requests & business logic. Return `Inertia::render()` for pages, JSON for API routes.
6. **Laravel Services** (`app/Services/`) — External API integration (BlizzardApiService, DeckBuilderService, PaymentService). Keeps controllers thin.
7. **Laravel Models** (`app/Models/`) — Eloquent models with relationships (User, Deck, Card, Subscription, CoachProfile).
8. **Laravel Events/Listeners** (`app/Events/`, `app/Listeners/`) — Real-time features via Reverb broadcasts.

**Data flow:** User clicks link → Inertia.visit() → Laravel route → Controller fetches data → Inertia::render() with props → Vue component receives props → Renders. For AJAX: User types search → Composable calls axios.get() → Laravel API route → Query DB/cache → Return JSON → Pinia store updates → Vue reactivity updates UI.

### Critical Pitfalls

1. **API rate limit exhaustion without caching** — Blizzard API has 36,000 requests/hour limit. Direct API calls without caching exhaust quota during peak usage. **Avoid:** Implement cache-aside pattern with 24-72h TTL, batch card requests, Redis cache for card catalog. Cache hit ratio should be >90%. Address in Phase 1.

2. **Drag-and-drop performance collapse** — Vue.Draggable fires ~60 events/second. Complex validation on every move event causes 200ms+ lag, browser freezing. **Avoid:** Throttle handlers to 16ms (60fps), virtual scrolling for card lists, move validation to drag-end not drag-move, use CSS transforms. Address in Phase 2.

3. **Stripe webhook failures causing payment state desync** — Payments succeed but local DB never updates due to webhook failures. **Avoid:** Always verify webhook signatures, store webhooks in DB before processing, use ngrok for local testing, monitor webhook failures. Address in Phase 3 (Payments).

4. **Stale card data after Blizzard API updates** — New expansion releases break deck builder because cache wasn't invalidated. **Avoid:** Manual cache eviction triggers for patch days, monitor Blizzard patch notes, shorter TTLs (1-6h) during expansion releases, admin interface for cache refresh. Address in Phase 1-2.

5. **Ad blockers killing 100% of ad revenue** — 60-80% of users run ad blockers. If ads are primary revenue, platform becomes financially unsustainable. **Avoid:** Design ads as supplemental (10-20% of revenue), diversify with affiliate links (primary early revenue) and premium features, communicate value to users. Address in Phase 3 (Monetization).

## Implications for Roadmap

Based on combined research (stack capabilities, feature dependencies, architecture patterns, and critical pitfalls), the suggested roadmap is:

### Phase 1: Core Infrastructure & Card Data
**Rationale:** Must build caching layer before card integration to avoid API rate limit exhaustion (Pitfall #1). Card database is foundational—all features depend on it. List-based deck builder is MVP; drag-drop can be added later.
**Delivers:** Laravel 11 backend, Vue 3 + Inertia setup, Blizzard API integration with Redis caching, card database seeded, basic card search/filter.
**Addresses:** Card database with search (table stakes), class & format selection, responsive design.
**Avoids:** API rate limit exhaustion (caching on day 1), stale card data (cache invalidation triggers).
**Stack elements:** Laravel 11, Vue 3, Inertia.js, Redis, BlizzardApiService.
**Architecture components:** Controllers, Models, Services, basic Pages.
**Research flags:** Well-documented patterns (Blizzard API, Laravel caching, Vue search). Skip `/gsd:research-phase`.

### Phase 2: Deck Builder MVP & Authentication
**Rationale:** Users need accounts to save decks. Deck builder is core functionality. Build list-based builder first (simpler), add drag-drop after validation. Must address mobile UX early (Pitfall #6).
**Delivers:** User authentication (Laravel Breeze/Sanctum), deck CRUD operations, deck code import/export, mana curve visualization, dust cost calculator, URL sharing for decks, list-based deck builder.
**Addresses:** Deck builder interface, deck code import/export, mana curve, dust cost, URL sharing, user accounts, deck persistence.
**Avoids:** Mobile UX blocking functionality (mobile-first responsive design), drag performance collapse (no drag-drop yet).
**Stack elements:** Laravel Sanctum, Laravel Breeze, Pinia stores (decks.js, auth.js), VueUse composables.
**Architecture components:** AuthController, DeckController, useDecks composable, Pinia stores, Deck pages.
**Research flags:** Well-documented (Laravel Sanctum, deck codes are standard). Skip `/gsd:research-phase`.

### Phase 3: Drag-and-Drop Polish
**Rationale:** Now that list-based builder works, add drag-drop as differentiator. This is when performance pitfalls hit—must throttle, virtual scroll, validate on drag-end.
**Delivers:** Visual drag-and-drop deck builder using Vue.draggable.next, virtual scrolling for large card lists, optimized drag performance, real-time deck validation.
**Addresses:** Visual drag-and-drop builder (differentiator), improves deck builder UX.
**Avoids:** Drag performance collapse (throttling, virtual scrolling), mobile UX issues (touch targets, bottom sheets).
**Stack elements:** Vue.draggable.next, vue-virtual-scroll-list, Pinia store optimization.
**Architecture components:** useDragDrop composable, DraggableCard component, optimized deck stores.
**Research flags:** **Needs research** — Vue.draggable.next has limited docs, performance patterns vary. Run `/gsd:research-phase` for "drag-drop performance optimization" before implementation.

### Phase 4: Real-Time Features & Collaboration
**Rationale:** Differentiator that adds engagement. Requires stable auth and deck persistence. Laravel Reverb is official solution (2024).
**Delivers:** Laravel Reverb WebSocket server, real-time notifications (deck shared, new follower), live deck collaboration (optional), notifications UI.
**Addresses:** Real-time deck collaboration (differentiator), user engagement.
**Stack elements:** Laravel Reverb, Laravel Echo, Vue event listeners, Redis pub/sub.
**Architecture components:** Events/Listeners, useNotifications composable, notification UI components.
**Research flags:** Well-documented (Laravel Reverb official docs). Skip `/gsd:research-phase`.

### Phase 5: Monetization (Payments & Premium)
**Rationale:** Need revenue to sustain platform. Build after stable user base. Diversify from launch (ads + affiliates + premium).
**Delivers:** Stripe integration via Laravel Cashier, subscription plans ($5-10/mo), premium features (ad-free, advanced analytics, unlimited decks), AdSense integration, affiliate links to Amazon/Blizzard, Stripe webhook handling.
**Addresses:** Premium analytics subscription, ad-free experience, display ads, affiliate links, payment processing.
**Avoids:** Webhook payment state desync (signature verification, DB storage), ad blockers killing revenue (diversify streams).
**Stack elements:** Laravel Cashier (Stripe), Stripe Elements, AdSense, affiliate tracking.
**Architecture components:** SubscriptionController, PaymentService, webhook handlers, premium gates.
**Research flags:** **Needs research** — Stripe webhook failure patterns, ad blocker detection strategies. Run `/gsd:research-phase` for "payment webhooks & ad blocker mitigation" before implementation.

### Phase 6: Coaching Marketplace
**Rationale:** Advanced feature, blue ocean opportunity (no competitor has this). Depends on auth, payments, and user profiles.
**Delivers:** Coach profiles, booking system, reviews/ratings, payment split logic, messaging system, video integration (Zoom/Google Meet).
**Addresses:** Coaching marketplace (revenue stream, differentiator), pro player monetization.
**Stack elements:** Laravel Reverb (booking availability), Stripe Checkout, video APIs.
**Architecture components:** CoachController, CoachProfile model, booking system, reviews.
**Research flags:** **Needs research** — Coaching marketplace patterns vague, payment split logic complex. Run `/gsd:research-phase` for "coaching marketplace & payment splits" before implementation.

### Phase Ordering Rationale

- **Dependency-driven:** Card database → Deck builder → Auth → Premium → Marketplace. Each phase requires previous phase's foundations.
- **Risk mitigation:** Caching (Phase 1) prevents API exhaustion. Throttling/virtual scrolling (Phase 3) prevents drag collapse. Webhook verification (Phase 5) prevents payment desync.
- **Value increment:** Each phase delivers user value. Phase 1: card search. Phase 2: build & share decks. Phase 3: better UX. Phase 4: collaboration. Phase 5: premium features. Phase 6: marketplace.
- **Monetization diversification:** Ads/affiliates in Phase 5 (early revenue), premium subscriptions Phase 5 (recurring), marketplace Phase 6 (high-value).
- **Performance-first:** Caching, throttling, virtual scrolling addressed at phase boundaries before they become problems.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (Drag-and-Drop):** Vue.draggable.next documentation is limited. Performance patterns vary by use case. Research specific to large card lists (500+ cards) and mobile touch targets.
- **Phase 5 (Monetization):** Stripe webhook failure recovery patterns are complex. Ad blocker detection and mitigation strategies vary by platform. Affiliate link disclosure requirements (FTC 16 CFR Part 255) need legal review.
- **Phase 6 (Coaching Marketplace):** Coaching marketplace patterns are sparse. Payment split logic (platform commission) needs research. Video API integration (Zoom/Google Meet) varies by provider.

**Phases with standard patterns (skip research-phase):**
- **Phase 1:** Laravel 11 + Vue 3 + Inertia is well-documented (official docs, 2025 standards). Blizzard API integration has community examples.
- **Phase 2:** Laravel Sanctum/Breeze auth is standard. Deck codes are well-documented (Blizzard format). Mana curve visualization has examples.
- **Phase 4:** Laravel Reverb is official (2024), well-documented. Real-time notifications have standard patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified with official docs (Laravel 11, Vue 3, Inertia.js, Reverb). Multiple 2025 sources confirm this is standard stack. |
| Features | MEDIUM | Table stakes features verified from competitor analysis (HSReplay, HearthstoneTopDecks). Differentiator features inferred from market gaps. |
| Architecture | HIGH | Inertia.js monolith pattern is well-documented (official docs, 2025 articles). Project structure matches Laravel best practices. |
| Pitfalls | MEDIUM | API rate limiting, drag performance, and webhook failures verified from community sources (Reddit, StackOverflow, forums). Some sources are anecdotal. |

**Overall confidence:** HIGH

### Gaps to Address

- **Blizzard API authentication changes:** OAuth token format changed in Sept 2024 (headers vs query params). Verify current implementation during Phase 1. Test with real API keys.
- **Set metadata vs card search inconsistency:** Blizzard API returns different data structures from different endpoints. Build abstraction layer to normalize responses. Validate during Phase 1.
- **Deck code format stability:** Blizzard may change deck string format. Monitor patch notes. Use official parsing libraries. Build fallback for invalid codes.
- **Ad blocker impact:** 60-80% ad block rate is industry estimate, not Hearthstone-specific. Monitor real ad fill rate after launch. Pivot revenue strategy if needed.
- **Drag-drop on mobile:** Virtual scrolling + drag-drop on mobile touch devices is poorly documented. Test extensively on physical devices during Phase 3. Consider swipe gestures as alternative.
- **Payment split logic for marketplace:** Commission structures for coaching marketplaces vary. Research competitor models (TakeLessons, Lessons.com) during Phase 6 planning.

## Sources

### Primary (HIGH confidence)
- **Laravel 11 Documentation** — Core framework, Inertia.js integration, Cashier, Reverb
- **Vue 3 Documentation** — Composition API, Pinia, reactivity system
- **Inertia.js Official** — Server-side routing with SPA UX
- **Laravel Cashier (Stripe)** — Subscription billing implementation
- **Laravel Reverb** — Official WebSocket server (2024)
- **Blizzard Hearthstone API** — Rate limits, OAuth changes (Sept 2024)

### Secondary (MEDIUM confidence)
- **HSReplay.net** — Feature analysis, premium monetization model
- **HearthstoneTopDecks.com** — Deck comparison, free content strategy
- **HSGuru.com** — Esports integration, pro deck features
- **Vue.draggable.next (GitHub)** — Drag-drop implementation patterns
- **Pinia Documentation** — State management patterns
- **VueUse Documentation** — Composition utilities
- **Community discussions** — Reddit r/hearthstone, Laracasts, StackOverflow ( pitfalls, UX issues, performance problems)

### Tertiary (LOW confidence)
- **Chinese blogs on Vue.Draggable performance** — Virtual scrolling patterns, but translation may be imperfect
- **Anecdotal forum posts** — Individual experiences may not generalize
- **Ad blocker impact estimates** — Industry averages (60-80%), not Hearthstone-specific data

---
*Research completed: 2026-02-06*
*Ready for roadmap: yes*
