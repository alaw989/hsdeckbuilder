# Stack Research

**Domain:** Hearthstone Deck Builder Platform
**Researched:** 2026-02-06
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Laravel** | 11.x (consider 12.x) | Backend PHP framework | Laravel 11 (released March 2024) is the current stable version with modern features, excellent ecosystem, and long-term support. Laravel 12.x is available but Laravel 11 remains widely adopted in 2025. Provides robust routing, Eloquent ORM, queues, scheduling, and built-in security features. |
| **Vue 3** | 3.4+ | Frontend JavaScript framework | Vue 3 is the current standard with Composition API, better TypeScript support, and improved performance. Vue 2 reached EOL on Dec 31, 2023. Vue 3's reactivity system and SFC (Single File Components) are ideal for complex interactive UIs like deck builders. |
| **Inertia.js** | 2.x | SPA architecture without API | Build modern single-page applications using classic server-side routing. No API required - Laravel controllers pass props directly to Vue components. Reduces complexity while maintaining SPA-like UX. Officially supported by Laravel team. |
| **Tailwind CSS** | 3.4.17 (stable) | Utility-first CSS framework | Tailwind CSS v3.4.17 is the current stable version. Tailwind CSS v4 is in beta as of 2025 but not production-ready. Provides rapid UI development, excellent documentation, and perfect for component-based architectures. Avoids writing custom CSS. |
| **Vite** | 5.x | Frontend build tool | Lightning-fast HMR (Hot Module Replacement) and optimized production builds. Laravel 11 ships with Vite as the default frontend build tool, replacing Laravel Mix. Significantly faster development experience than webpack-based solutions. |
| **PHP** | 8.2+ | Server-side language | Laravel 11 requires PHP 8.2 or higher. PHP 8.3 is recommended for better performance and type safety. Both versions are actively supported with security updates. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Pinia** | 2.x | State management | **Use for:** Managing global application state (user authentication, deck lists, card collections, filters). Pinia is the official Vue 3 state management solution, replacing Vuex. Lightweight, TypeScript-friendly, and integrates perfectly with Composition API. |
| **VueUse** | 10.x+ | Composition utilities | **Use for:** Browser storage (useStorage), window management (useWindowScroll), drag detection (useMouse), element visibility (useElementVisibility). 200+ composable functions that simplify common Vue patterns. Essential for reducing boilerplate. |
| **Vue.draggable.next** | 2.x+ | Drag-and-drop functionality | **Use for:** Card deck construction, reordering deck lists, mana curve visualization. Built on SortableJS, the official Vue 3 compatible version of VueDraggable. Smart auto-scrolling, touch support, cross-list dragging. Most mature and battle-tested Vue 3 drag-drop solution. |
| **Laravel Cashier (Stripe)** | 15.x | Subscription billing | **Use for:** Premium subscriptions, recurring payments, one-time payments. Official Laravel package for Stripe integration. Handles subscriptions, invoices, coupons, and webhooks. Eliminates boilerplate payment code. |
| **Laravel Sanctum** | 4.x | Authentication | **Use for:** SPA authentication, API token management, session-based auth. Lightweight authentication system perfect for Inertia.js applications. Handles both session cookies and API tokens. Works seamlessly with Vue 3 + Inertia. |
| **Laravel Reverb** | 1.x | Real-time WebSocket server | **Use for:** Real-time deck collaboration, live notifications, coaching marketplace chat. Official Laravel WebSocket server (released 2024) as a self-hosted Pusher alternative. Native integration with Laravel broadcasting, scalable, and supports both WebSockets and fallback to polling. |
| **Vue Router** | 4.x | Client-side routing | **Use for:** SPA navigation within your Vue application. Official Vue 3 router with Composition API support. Integrates with Inertia.js for server-side routing control while maintaining client-side navigation. |
| **Laravel Breeze** | 2.x | Authentication scaffolding | **Use for:** Quick start with authentication, email verification, password reset. Lightweight starter kit with Inertia.js + Vue 3 stack. Provides production-ready auth scaffolding out of the box. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **Laravel Herd** | Local development environment | Native PHP and Nginx development environment for macOS/Windows. Includes PHP 8.3, Composer, Laravel installer, and database management. Faster and more reliable than Docker for local Laravel development. |
| **Laravel Sail** | Docker-based development | Use Docker on Linux or prefer containerized development. Pre-configured Docker environment for Laravel with MySQL, Redis, and other services. Cross-platform consistency. |
| **Laravel Pint** | Code style fixer | Automatic PHP code style fixing. Enforces PSR-12 coding standard. Run via `./vendor/bin/pint`. Integrates with pre-commit hooks. |
| **PHPStan** | Static analysis | Catch bugs before runtime. Use level 5 for Laravel projects. Type safety and dead code detection. Essential for maintainable codebases. |
| **Laravel Telescope** | Debug assistant | Monitor requests, exceptions, logs, queries, and more. Excellent for debugging complex deck builder operations. Use in development only. |
| **Vue DevTools** | Vue debugging | Browser extension for debugging Vue 3 applications. Inspect components, events, Pinia stores, and router. Essential for Vue development. |

## Installation

```bash
# Create new Laravel 11 project with Vue 3 + Inertia
composer create-project laravel/laravel hsdeckbuilder
cd hsdeckbuilder

# Install frontend dependencies
npm install

# Install Inertia.js Laravel adapter
composer require inertiajs/inertia-laravel
php artisan inertia:middleware
# Add HandleInertiaRequests to kernel

# Install Vue 3 + Inertia frontend
npm install @inertiajs/vue3 vue
npm install -D @vitejs/plugin-vue

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Pinia for state management
npm install pinia

# Install VueUse for utilities
npm install @vueuse/core

# Install Vue.draggable.next for drag-and-drop
npm install vuedraggable@next

# Install Vue Router (if needed for client-side routing)
npm install vue-router

# Install Laravel Cashier for Stripe payments
composer require laravel/cashier

# Install Laravel Sanctum for authentication
composer require laravel/sanctum
php artisan sanctum:install

# Install Laravel Breeze for auth scaffolding (optional)
composer require laravel/breeze --dev
php artisan breeze:install vue
# Choose "Inertia" during installation
npm install
npm run dev

# Install Laravel Reverb for real-time features
composer require laravel/reverb
php artisan reverb:install
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Vue.draggable.next** | vue-draggable-plus | Use vue-draggable-plus if you need multiple usage patterns (component, directive, functional calls) or stronger TypeScript support. However, Vue.draggable.next is more mature and widely adopted. |
| **Inertia.js** | Traditional SPA API | Use traditional API-based SPA if you need a completely decoupled frontend (mobile app + web) or plan to use Next.js/Nuxt.js instead. Inertia.js is simpler and more productive for single-frontend applications. |
| **Pinia** | Vuex | Use Vuex only if migrating from Vue 2. Pinia is the official Vue 3 replacement with better TypeScript support, simpler API, and smaller bundle size. |
| **Laravel Reverb** | Pusher, Soketi | Use Pusher for managed WebSocket service (no server maintenance) or if you need advanced features like presence channels and client events out of the box. Use Soketi as an open-source Pusher alternative. Reverb is best for Laravel-native solutions. |
| **Tailwind CSS v3.4** | Tailwind CSS v4 | Use Tailwind v4 (beta) if you want bleeding-edge features and are comfortable with beta software. However, v3.4.17 is stable and production-ready for your project. |
| **Laravel Sanctum** | Passport | Use Passport only if you need full OAuth2 server functionality with multiple third-party clients. Sanctum is simpler and lighter for SPA auth and API tokens. |
| **Laravel 11** | Laravel 10 | Use Laravel 10 only if you have legacy constraints. Laravel 11 provides better performance, PHP 8.2+ support, simplified structure (no default models/controllers), and Reverb integration. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Vue 2** | End-of-life as of Dec 31, 2023. No security updates. Missing Vue 3 performance improvements and Composition API. | **Vue 3** - Current, supported, and faster |
| **Vuex** | Deprecated in favor of Pinia for Vue 3. More boilerplate, worse TypeScript support, larger bundle size. | **Pinia** - Official Vue 3 state management |
| **Laravel Mix** | Replaced by Vite in Laravel 11. Slower build times, less modern dev experience. | **Vite** - Default in Laravel 11, significantly faster |
| **Bootstrap CSS** | Conflicts with Tailwind CSS philosophy. Larger bundle size. Requires writing custom CSS for variations. | **Tailwind CSS** - Utility-first, smaller bundle, faster development |
| **jQuery** | Unnecessary in Vue 3. Direct DOM manipulation conflicts with Vue's reactivity. | **VueUse composables** - Reactive utilities, no jQuery needed |
| **Laravel Echo + Pusher** | Pusher has costs and external dependency. Echo adds complexity for simple real-time needs. | **Laravel Reverb** - Free, self-hosted, Laravel-native WebSocket server |
| **SortableJS directly** | More boilerplate without Vue integration. No reactive prop handling out of the box. | **Vue.draggable.next** - Vue 3 wrapper for SortableJS |
| **Passport** | Overkill for SPA authentication. Heavy OAuth2 implementation not needed for single-frontend apps. | **Laravel Sanctum** - Lightweight, perfect for Inertia.js apps |
| **React** | You've already chosen Vue 3. Mixing frameworks increases complexity and bundle size. | **Stick with Vue 3** - Be consistent with your stack choice |
| **Redux** | Unnecessary with Pinia. More boilerplate, steeper learning curve. | **Pinia** - Simpler, Vue 3-optimized |

## Stack Patterns by Variant

**If building a pure MVP (no real-time):**
- Skip Reverb, add later when needed
- Use simple database queries instead of complex caching
- Minimal state management (props + emits) before adding Pinia
- Start with Tailwind CSS CDN, compile to build later
- **Because:** Reduces initial complexity, can add as you scale

**If building for high-traffic public access:**
- Add Redis for caching and queue management
- Use Laravel Octane for better performance
- Implement database read/write splitting
- Add CDN for static assets
- **Because:** Deck builders have read-heavy traffic (viewing decks) vs write operations

**If building collaborative features (multiple users editing decks):**
- Must use Laravel Reverb for real-time updates
- Add optimistic UI updates in Vue 3
- Implement conflict resolution strategies
- Use database transactions and row-level locking
- **Because:** Prevents data loss when users simultaneously edit the same deck

**If targeting mobile devices:**
- Use Tailwind's responsive utilities extensively
- Implement touch-friendly drag handles in Vue.draggable
- Consider progressive web app (PWA) features
- Test drag-drop on mobile browsers
- **Because:** Mobile users are significant for gaming tools

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| **Laravel 11** | PHP 8.2, 8.3, 8.4 | PHP 8.3 recommended for best performance |
| **Vue 3.4+** | Inertia.js 2.x, Pinia 2.x, VueUse 10.x+ | All Vue 3 ecosystem packages are compatible |
| **Tailwind CSS 3.4.17** | Vite 5.x, PostCSS 8.x | Standard Tailwind + Vite setup |
| **Laravel Cashier 15.x** | Laravel 10+, 11+, 12.x | Stripe SDK 12.x+ included |
| **Laravel Reverb 1.x** | Laravel 10+, 11+, 12.x | Requires PHP 8.2+ and Redis |
| **Vue.draggable.next** | Vue 3.0+ | Not compatible with Vue 2 |
| **@inertiajs/vue3** | Vue 3.0+ | Use @inertiajs/vue2 for Vue 2 (deprecated) |

**Key Compatibility Notes:**
- All packages listed support Laravel 11 and PHP 8.2+
- Vue 3 ecosystem (Inertia, Pinia, VueUse) has excellent cross-compatibility
- Avoid mixing Tailwind v3.4 with experimental v4 features
- Laravel 11 introduced Reverb support; earlier Laravel versions need manual WebSocket setup

## Domain-Specific Stack Choices

### For Hearthstone Deck Builder:

**Card Search & Autocomplete:**
- **Frontend:** Vue 3 computed properties + watchers for reactive filtering
- **Backend:** Laravel Eloquent queries with database indexing on card names
- **Optimization:** Debounce search input (VueUse `useDebounceFn`), implement pagination

**Drag-and-Drop Deck Construction:**
- **Library:** Vue.draggable.next (SortableJS wrapper)
- **Pattern:** Store deck state in Pinia, sync with database via debounced API calls
- **Visual feedback:** CSS transitions for drag states, hover effects for valid drop zones

**Mana Curve Visualization:**
- **Library:** Chart.js or ApexCharts via Vue 3 wrappers
- **Alternative:** Custom SVG with Vue 3 reactivity (simpler, more control)
- **State:** Derive from Pinia deck state using computed properties

**Deck Sharing via URLs:**
- **Backend:** Laravel route model binding with UUID or short IDs
- **Frontend:** Inertia.js server props to load deck data, Vue Router for client-side navigation
- **SEO:** Inertia.js SSR support for search engine indexing of public decks

**Premium Subscriptions (Stripe):**
- **Backend:** Laravel Cashier for subscription management
- **Frontend:** Stripe Elements via Vue 3 components
- **Webhooks:** Laravel controller to handle subscription events (payment.success, subscription.updated)

**Display Ads (Google AdSense):**
- **Implementation:** Vue 3 component wrapping AdSense code
- **Optimization:** Lazy-load ad components using Vue 3 `<Suspense>` or defineAsyncComponent
- **Compliance:** GDPR/CCPA consent management using Vue 3 + Pinia

**Affiliate Links:**
- **Backend:** Laravel database to store affiliate URLs and tracking
- **Frontend:** VueUse `useClipboard` for copy-to-clipboard functionality on Amazon/Twitch links
- **Analytics:** Track clicks via Laravel controllers before redirecting

**Coaching Marketplace:**
- **Real-time:** Laravel Reverb for booking calendar availability
- **Payments:** Stripe Checkout sessions (one-time payments)
- **Scheduling:** Custom Laravel backend with timezone support (use Carbon)
- **Video:** Integration with Zoom/Google Meet APIs

## Sources

- **Laravel 11 Documentation** — laravel.com/docs/11.x (core framework features, installation, configuration)
- **Laravel 12 Documentation** — laravel.com/docs/12.x (latest version, future-proofing considerations)
- **Vue 3 Documentation** — vuejs.org/guide/introduction.html (Composition API, SFC, reactivity system)
- **Inertia.js** — inertiajs.com/ (modern monolith architecture, Vue 3 integration)
- **Tailwind CSS v3.4.17** — tailwindcss.com/docs/installation (current stable version, utility-first approach)
- **Laravel Cashier (Stripe)** — laravel.com/docs/12.x/billing (subscription billing implementation)
- **Laravel Reverb** — Multiple 2025 sources confirming official WebSocket server for Laravel 11
- **Vue.draggable.next** — github.com/SortableJS/vue.draggable.next (Vue 3 compatible drag-and-drop)
- **Pinia** — pinia.vuejs.org/ (official Vue 3 state management)
- **VueUse** — vueuse.org/ (200+ composition utilities)
- **Laravel Sanctum** — laravel.com/docs/12.x/sanctum (SPA authentication)
- **Vite** — vite.dev/ (next-generation frontend tooling)

**Web Search Verification (2025 sources):**
- Multiple 2025 articles confirming Laravel 11 + Vue 3 + Inertia.js as standard stack
- Vue.draggable.next confirmed as primary Vue 3 drag-drop solution in 2025
- Laravel Reverb confirmed as official real-time solution replacing Pusher for self-hosted apps
- Pinia confirmed as standard Vue 3 state management (Vuex deprecated)
- Vite confirmed as default Laravel 11 frontend build tool

---
*Stack research for: Hearthstone Deck Builder Platform*
*Researched: 2026-02-06*
