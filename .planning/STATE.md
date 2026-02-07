# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** Deck builders can easily construct, optimize, and share Hearthstone decks with visual drag-and-drop—while discovering ways to improve their gameplay through analytics and expert guides.
**Current focus:** Phase 2: Deck Builder MVP

## Current Position

Phase: 2 of 4 (Deck Builder MVP)
Plan: 6 of 6 in current phase
Status: Phase complete
Last activity: 2026-02-07 — Completed card tooltip component with DeckStats integration

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 9
- Average duration: 2.2m
- Total execution time: 0.37 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01    | 3     | 10m   | 3m       |
| 02    | 6     | 14m   | 2.3m     |

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-02-07 05:51 UTC
Stopped at: Completed 02-06 - Card tooltip with DeckStats integration
Resume file: None
