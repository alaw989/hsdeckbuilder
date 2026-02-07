# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** Deck builders can easily construct, optimize, and share Hearthstone decks with visual drag-and-drop—while discovering ways to improve their gameplay through analytics and expert guides.
**Current focus:** Phase 4: Monetization & Platform Polish

## Current Position

Phase: 4 of 4 (Monetization & Platform Polish)
Status: Phase complete
Last activity: 2026-02-07 — Completed Phase 04: Monetization & Platform Polish

Progress: [████████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 15
- Average duration: 2.3m
- Total execution time: 0.55 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01    | 3     | 10m   | 3m       |
| 02    | 6     | 14m   | 2.3m     |
| 03    | 3     | 7m    | 2.3m     |
| 04    | 3     | 8m    | 2.7m     |

**Recent Trend:**
- Last 5 plans: 2.2m
- Trend: Consistent fast execution

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

1. **Laravel 12 instead of 11** - Accepted latest stable version (backward compatible)
2. **Vite 7.3.1 with --legacy-peer-deps** - Resolved peer dependency conflict with @vitejs/plugin-vue
3. **Replaced React 16 app** - Complete migration to Laravel + Vue 3 + Inertia stack
4. **File cache as fallback for Redis** - Redis not available on dev system, using file cache (Redis configured for production)
5. **Hardcoded standard sets list** - Standard format sets in HearthstoneService (will need updates every 4 months)
6. **@vueuse/core for debouncing** - Used VueUse library instead of custom setTimeout/clearTimeout for search input debouncing (300ms)
7. **Autocomplete limited to 8 results** - Prevents overwhelming dropdown UI, covers most search scenarios
8. **Set filter limited to 50 options** - Hearthstone has 100+ sets, limited to prevent unusably long dropdown
9. **Vue 3 Composition API composables for state management** - Using reactive() and ref() for deck state instead of Vuex/Pinia (per research best practices)
10. **Legendary cards limited to 1 copy** - Enforcing Hearthstone rules in useDeckBuilder composable (LEGENDARY rarity check)
11. **Cards grouped by mana cost in deck list** - Organized 0-10+ for better deck overview (matches Hearthstone game UI)
12. **Vitest with jsdom for testing** - Chose Vitest over Jest for better Vite integration, jsdom environment for DOM-like testing (plan 02-02)
13. **Pure validation functions** - Separated business logic from Vue components for testability and reusability (plan 02-02)
14. **Computed properties for validation reactivity** - DeckValidation component uses computed instead of watch for automatic updates (plan 02-02)
15. **@firestone-hs/deckstrings@2.2.8 for deck code handling** - Hearthstone deckstring library for base64 + varint encoding/decoding (plan 02-03)
16. **Hero DBF ID mappings hardcoded** - Static mappings for all 11 classes to avoid external API dependency (plan 02-03)
17. **Error object return pattern** - Utilities return `{ data, error }` objects for consistent error handling (plan 02-03)
18. **Chart.js + vue-chart-3 for charting** - Vue 3 Composition API compatible charting library for mana curve visualization (plan 02-04)
19. **Official Hearthstone dust costs** - Dust calculation uses official values: Free 0, Common 40, Rare 100, Epic 400, Legendary 1600 (plan 02-04)
20. **Computed properties for reactive charts** - Mana curve and dust cost use computed() for automatic updates when deck changes (plan 02-04)
21. **Modal UI pattern with backdrop dismissal** - Fixed overlay with z-50 and click-outside-to-close for deck code import/export (plan 02-05)
22. **Clipboard API with visual feedback** - Navigator.clipboard.writeText() with 2-second success timeout for copy confirmation (plan 02-05)
23. **Computed deck code generation** - Export only enabled when deck validation passes (30 cards, correct class) (plan 02-05)
24. **Vue 3 Teleport for tooltip rendering** - CardTooltip renders at document body root via Teleport for z-index isolation (plan 02-06)
25. **Viewport-aware positioning calculation** - Tooltip position adjusts dynamically to prevent overflow on right/bottom/top edges (plan 02-06)
26. **HearthstoneJSON CDN for card images** - 256x card images loaded from official CDN for tooltips (plan 02-06)
27. **LocalStorage for deck persistence** - Client-side storage using VueUse useLocalStorage for reactive sync and cross-tab support (plan 03-01)
28. **Store full card data in saved decks** - Saves complete card objects alongside deckCode for offline display without database lookups (plan 03-01)
29. **window.prompt for deck naming** - Simple MVP approach for deck name input, can be upgraded to modal form later (plan 03-01)
30. **Clone saves to LocalStorage without server** - Shared decks save directly to browser storage for offline access (plan 03-03)
31. **Keep same deck loaded after clone** - Cloned shared deck remains in editor for immediate modification without reload (plan 03-03)
32. **Modal input with auto-focus and select** - Clone modal automatically focuses and selects deck name for easy editing (plan 03-03)
33. **Query parameters instead of hash fragments for share URLs** - Enables server-side validation before frontend processing (plan 03-02)
34. **Server validation with redirect on invalid deck code** - Laravel validates format and redirects to clean URL on failure (plan 03-02)
35. **Wild format for share URLs** - Broadest compatibility across deck formats (plan 03-02)
36. **No compression for deck codes in URLs** - Deck codes are 50-100 chars, well under URL limits (plan 03-02)
37. **Shared deck state is informational only** - Shared deck banner shows context but doesn't auto-save to LocalStorage (plan 03-02)
38. **Auto-clear URL parameter after loading shared deck** - Uses history.replaceState() to keep URLs clean (plan 03-02)
39. **useAdSense composable for script initialization** - Vue 3 composable pattern for AdSense async script loading with duplicate detection (plan 04-01)
40. **AdSenseBanner with responsive ad units** - Component with data-full-width-responsive for mobile adaptation and placeholder fallback (plan 04-01)
41. **Preallocated ad space to prevent CLS** - minHeight prop on ad containers prevents layout shift when ads load (plan 04-01)
42. **Three ad placements on DeckBuilder** - Top horizontal banner, mid-page auto ad, sidebar vertical ad (within 3-4 max limit) (plan 04-01)
43. **FTC disclosure in footer** - "Affiliate links support this site" in AuthenticatedLayout footer per locked decision (plan 04-01)
44. **Amazon Associates only for affiliate links** - Using Amazon Associates program with direct links (no PAAPI5 API, deprecated April 2026) (plan 04-02)
45. **Dedicated affiliate section pattern** - Affiliate links in separate panel (not inline with analytics) per CONTEXT.md locked decision (plan 04-02)
46. **USD cost from dust calculation** - $0.0143 per dust based on pack economics ($43 for 3000 dust minus ~400 duplicate value) (plan 04-02)
47. **VITE_AMAZON_ASSOCIATES_TAG environment variable** - Amazon associate ID configured via environment for easy deployment (plan 04-02)
48. **Tap-to-modal for card tooltips on mobile** - Hover interactions don't exist on touch devices; modal provides better UX with tap-to-open, backdrop-dismiss, and escape key (plan 04-03)
49. **Bottom tab bar for mobile navigation** - Native-app-like UX pattern with fixed positioning at bottom, safe area insets for iOS devices, inline SVG icons for zero dependencies (plan 04-03)
50. **Slide-out drawer for main navigation** - Standard mobile pattern with smooth transitions, overlay backdrop, click-to-close behavior (plan 04-03)
51. **Lazy loading below-fold images only** - CardGrid images use loading="lazy" with decoding="async"; critical content (tooltips) uses loading="eager" (plan 04-03)
52. **Responsive srcset for high-DPI displays** - CardTooltip uses 1x/2x srcset (256x and 512x) for sharper images on retina screens (plan 04-03)
53. **Code splitting via import.meta.glob** - Route-based code splitting configured in app.js; load deck builder code only when needed (plan 04-03)

### Pending Todos

None yet.

### Blockers/Concerns

- AdSense approval timeline (1-2 weeks) may delay actual ad display
- Ad blockers (uBlock Origin, AdBlock) will block ~20-40% of ads - mitigated by adding affiliate links (04-02)
- Monitor Core Web Vitals after real ads load (may affect CLS despite preallocated space)
- Amazon Associates account needed for affiliate revenue (user setup required)
- Product ASINs in AmazonCardPacks.vue are placeholders and need replacement with actual Hearthstone card pack ASINs
- Core Web Vitals should be monitored after production deployment to ensure LCP < 2.5s and CLS < 0.1 with real mobile devices
- Safe area insets may need testing on physical iOS devices (currently only env() CSS support)
- Consider adding touch feedback (visual ripple/scale) for better mobile interaction feel

## Session Continuity

Last session: 2026-02-07 08:20 UTC
Stopped at: Completed 04-03 - Mobile responsive design with tabbed navigation
Resume file: None
