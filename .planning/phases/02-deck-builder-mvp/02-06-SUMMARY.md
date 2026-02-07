---
phase: 02-deck-builder-mvp
plan: 06
wave: 4
subsystem: UI Components
tags: [vue3, tooltip, teleport, deck-builder, card-hover]

# Dependency Graph
requires:
  - 01-foundation (Laravel + Vue + Inertia setup)
  - 02-04 (DeckStats component for mana curve and dust cost)
provides:
  - Card tooltip with card image display
  - Hover interaction for card details
  - DeckStats integration in right panel
affects:
  - 02-deck-builder-mvp (completes deck builder UI)

# Tech Stack
tech-stack:
  added:
    - "Vue 3 Teleport for portal rendering"
    - "Vue 3 Transition for animations"
  patterns:
    - "Teleport to body for z-index isolation"
    - "Viewport-aware positioning calculation"
    - "Event bubbling for hover states"

# Key Files
key-files:
  created:
    - path: "resources/js/Components/CardTooltip.vue"
      lines: 124
      purpose: "Hover card tooltip with image, position calculation, and Teleport"
  modified:
    - path: "resources/js/Pages/DeckBuilder.vue"
      purpose: "Added DeckStats and CardTooltip integration, hover handlers"
    - path: "resources/js/Components/CardGrid.vue"
      purpose: "Added card-hover and card-leave events for tooltip"
---

# Phase 2 Plan 6: Card Tooltip with DeckStats Integration

## One-Liner

Created Vue 3 CardTooltip component using Teleport for viewport-aware hover tooltips showing full card images from HearthstoneJSON CDN, integrated with DeckStats component in DeckBuilder right panel.

## What Was Built

### CardTooltip Component
- Created `/resources/js/Components/CardTooltip.vue` (124 lines)
- Uses Vue 3 `<Teleport to="body">` to render at document root for z-index isolation
- Implements viewport-aware positioning logic to prevent overflow on right/bottom/top edges
- Smooth fade-in/fade-out animations using `<Transition>` (200ms enter, 150ms leave)
- Card image loaded from HearthstoneJSON CDN (256x resolution)
- Overlay gradient with card name, class, and rarity info
- Keyboard support: Escape key closes tooltip
- `pointer-events-none` prevents tooltip from blocking interactions

### DeckBuilder Integration
- Added DeckStats and CardTooltip imports
- Implemented tooltip state management:
  - `hoveredCard` ref for current hovered card data
  - `tooltipPosition` ref with `{x, y}` coordinates
  - `showTooltip(event, card)` handler
  - `hideTooltip()` handler
- Added DeckStats component to right panel between Validation and DeckList
- Connected CardGrid hover events to tooltip handlers

### CardGrid Updates
- Added `card-hover` and `card-leave` to emits declaration
- Implemented `handleCardHover(event, card)` to emit with mouse position
- Implemented `handleCardLeave()` to emit on mouse leave
- Added `@mouseenter` and `@mouseleave` handlers to card elements

## How It Works

1. User hovers over card in CardGrid
2. CardGrid emits `card-hover` event with MouseEvent and card data
3. DeckBuilder captures hover, updates `hoveredCard` and `tooltipPosition`
4. CardTooltip receives card data via props, shows at calculated position
5. Position calculation adjusts for viewport edges (right/bottom/top)
6. User moves mouse away → CardGrid emits `card-leave` → tooltip hides

## Verification

```bash
# Files created
$ ls -la resources/js/Components/CardTooltip.vue
-rw-r--r-- 1 deck ubuntu 3212 Feb  6 23:50 resources/js/Components/CardTooltip.vue

# Teleport and Transition verified
$ grep -E "Teleport|Transition" resources/js/Components/CardTooltip.vue
  <Teleport to="body">
    <Transition

# Card image CDN verified
$ grep "hearthstonejson" resources/js/Components/CardTooltip.vue
    :src="`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`"

# DeckStats integration verified
$ grep -E "DeckStats|deck-cards" resources/js/Pages/DeckBuilder.vue
import DeckStats from '@/Components/DeckStats.vue';
<DeckStats :deck-cards="deckCards" />

# CardTooltip integration verified
$ grep -E "CardTooltip|hoveredCard" resources/js/Pages/DeckBuilder.vue
import CardTooltip from '@/Components/CardTooltip.vue';
const hoveredCard = ref(null);
<CardTooltip :card="hoveredCard" :show="hoveredCard !== null" />

# CardGrid hover events verified
$ grep -E "card-hover|card-leave" resources/js/Components/CardGrid.vue
const emit = defineEmits(['add-card', 'card-hover', 'card-leave']);
emit('card-hover', event, card);
emit('card-leave');
```

## Deviations from Plan

None. Plan executed exactly as specified.

## Decisions Made

**Decision 1: Teleport to body for tooltip rendering**
- Rationale: Ensures tooltip renders above all content (z-50) without parent container constraints
- Tradeoff: Requires positioning calculation instead of relative positioning

**Decision 2: HearthstoneJSON CDN for card images**
- Rationale: Official card art, reliable CDN, no local storage needed
- Alternative: Could cache images locally, but adds complexity

**Decision 3: 256x image resolution for tooltips**
- Rationale: Balance between quality and load time
- Tradeoff: Could use 512x for retina displays, but slower

## Next Phase Readiness

**Complete:**
- CardTooltip component with Teleport and positioning
- DeckStats component integration
- Hover event flow from CardGrid → DeckBuilder → CardTooltip

**Ready for Phase 3:**
- Deck sharing and import/export features
- Deck code copy/paste using deckCode utility
- Additional UI polish and animations

## Self-Check: PASSED

- [x] resources/js/Components/CardTooltip.vue exists
- [x] resources/js/Pages/DeckBuilder.vue integrates DeckStats and CardTooltip
- [x] resources/js/Components/CardGrid.vue emits hover events
- [x] All commits exist (40696e0, b24a59d)
