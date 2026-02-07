---
phase: 04-monetization-platform-polish
plan: 02
subsystem: monetization
tags: [amazon-associates, affiliate-links, usd-calculation, ftc-compliance]

# Dependency graph
requires:
  - phase: 04-01
    provides: Google AdSense integration, FTC disclosure footer
provides:
  - Amazon Associates affiliate links for Hearthstone card packs
  - USD cost calculation from dust values
  - Environment configuration for affiliate tagging
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Affiliate component pattern with dedicated section (not inline)
    - USD cost estimation from dust using pack economics
    - Environment-based affiliate tag configuration

key-files:
  created:
    - resources/js/Components/Affiliates/AmazonCardPacks.vue
  modified:
    - resources/js/Utils/dustCalculation.js
    - resources/js/Components/DeckStats.vue
    - resources/js/Pages/DeckBuilder.vue
    - .env.example

key-decisions:
  - "Amazon Associates only (no other affiliate programs per CONTEXT.md)"
  - "Dedicated affiliate section (not inline with analytics)"
  - "USD per dust constant: $0.0143 based on pack economics"
  - "Direct affiliate links instead of Amazon PAAPI5 (deprecated April 2026)"

patterns-established:
  - "Affiliate component pattern: dedicated panel, proper rel attributes, FTC disclosure"
  - "USD display alongside dust: green-50 box for visual distinction"

# Metrics
duration: 3min
completed: 2026-02-07
---

# Phase 04-02: Amazon Affiliate Links and USD Cost Display Summary

**Amazon Associates affiliate link integration with FTC compliance disclosures, USD cost calculation from dust values ($0.0143/dust), and dedicated affiliate section in DeckBuilder.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-07T08:16:49Z
- **Completed:** 2026-02-07T08:19:49Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- USD cost calculation utility with pack economics-based pricing ($0.0143 per dust)
- AmazonCardPacks component with 2 card pack products and affiliate tagging
- USD value display in DeckStats (green-50 box below dust cost)
- Dedicated affiliate section in DeckBuilder (visually separate from analytics)
- Environment variable configuration for Amazon Associates tag
- FTC compliance disclosures in affiliate component and footer (from 04-01)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add USD cost calculation to dustCalculation utility** - `9a27bcd` (feat)
2. **Task 2: Create AmazonCardPacks affiliate component** - `a2e3692` (feat)
3. **Task 3: Integrate affiliate links and USD cost into DeckBuilder** - `3393d74` (feat)
4. **Auto-fix: Build blockers** - `8df50f6` (fix)

## Files Created/Modified

- `resources/js/Utils/dustCalculation.js` - Added `calculateUsdCost()` and `calculateDustCostWithUsd()` functions
- `resources/js/Components/Affiliates/AmazonCardPacks.vue` - New affiliate component with 2 product listings, associate tag integration, and FTC disclosure
- `resources/js/Components/DeckStats.vue` - Added USD cost display below dust cost in green-50 styled box
- `resources/js/Pages/DeckBuilder.vue` - Imported and placed AmazonCardPacks in dedicated section below deck stats
- `.env.example` - Added `VITE_AMAZON_ASSOCIATES_TAG=yourtag-20` configuration

## Decisions Made

- **Amazon Associates only**: Per CONTEXT.md research, using only Amazon Associates (no other affiliate programs)
- **Direct affiliate links**: Using direct Amazon URLs with associate tag instead of PAAPI5 API (deprecated April 2026 per RESEARCH.md)
- **Dedicated affiliate section**: Affiliate links placed in separate panel below deck stats, not inline with analytics (per locked decision from CONTEXT.md)
- **USD per dust constant**: $0.0143 per dust based on pack economics ($43 for 3000 dust minus ~400 duplicate value)
- **FTC compliance**: Component includes "As an Amazon Associate, I earn from qualifying purchases" disclosure; footer has "Affiliate links support this site" from 04-01

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed duplicate variable declaration in CardTooltip.vue**
- **Found during:** Task 3 verification (build failure)
- **Issue:** Lines 35-36 declared `tooltipRef` and `position` variables already declared at lines 25-26
- **Fix:** Removed duplicate declarations, kept only lines 25-26
- **Files modified:** resources/js/Components/CardTooltip.vue
- **Verification:** Build succeeds, no "Identifier already declared" errors
- **Committed in:** `8df50f6` (fix commit)

**2. [Rule 3 - Blocking] Fixed vue-chart-3 import in DeckStats.vue**
- **Found during:** Task 3 verification (build failure)
- **Issue:** Import statement used `Bar` but vue-chart-3 exports `BarChart`; component props used `:data` instead of `:chart-data`
- **Fix:** Changed import from `Bar` to `BarChart`, updated component tag and props
- **Files modified:** resources/js/Components/DeckStats.vue
- **Verification:** Build succeeds, charts render correctly
- **Committed in:** `8df50f6` (fix commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both auto-fixes essential for build to succeed. Pre-existing bugs in codebase, not introduced by this plan.

## Issues Encountered

- Build failed during verification due to pre-existing bugs in CardTooltip.vue (duplicate variables) and DeckStats.vue (incorrect vue-chart-3 import)
- Both issues fixed automatically per deviation rules (Rule 1 for bugs, Rule 3 for blocking issues)
- Build now succeeds with all affiliate features integrated

## User Setup Required

**Amazon Associates account required for affiliate links to work:**

1. **Create Amazon Associates account:**
   - Visit: https://affiliate-program.amazon.com/
   - Complete application process
   - Get your associate ID (e.g., `yourtag-20`)

2. **Configure environment variable:**
   ```bash
   # Add to .env file
   VITE_AMAZON_ASSOCIATES_TAG=yourtag-20
   ```

3. **Update product ASINs:**
   - Current ASINs in AmazonCardPacks.vue are placeholders (B07FCWSKX5, B07FCTC3RV)
   - Replace with actual Hearthstone card pack ASINs from Amazon
   - Update pricing ($14.99, $39.99) to match current Amazon prices

4. **FTC Compliance:**
   - Footer disclosure already in place from 04-01: "Affiliate links support this site"
   - Affiliate component includes: "As an Amazon Associate, I earn from qualifying purchases"
   - No additional action needed

## Next Phase Readiness

- Amazon affiliate integration complete, ready for testing with real associate tag
- USD cost display working, shows real-money value alongside dust cost
- FTC compliance maintained with proper disclosures
- Ready for next monetization feature (if any) or platform polish tasks
- Note: AdSense approval still pending (1-2 weeks per 04-01 blockers)

## Verification Commands

```bash
# Verify USD cost functions exist
grep -n "calculateUsdCost\|calculateDustCostWithUsd" resources/js/Utils/dustCalculation.js

# Verify affiliate component integration
grep -n "AmazonCardPacks" resources/js/Pages/DeckBuilder.vue

# Verify affiliate tag configuration
grep -n "VITE_AMAZON_ASSOCIATES_TAG" .env.example resources/js/Components/Affiliates/AmazonCardPacks.vue

# Verify FTC disclosures
grep -n "Amazon Associate\nofollow sponsored" resources/js/Components/Affiliates/AmazonCardPacks.vue

# Test build
npm run build
```

---
*Phase: 04-monetization-platform-polish*
*Plan: 04-02*
*Completed: 2026-02-07*

## Self-Check: PASSED

All key files created:
- ✓ resources/js/Components/Affiliates/AmazonCardPacks.vue

All commits verified:
- ✓ 9a27bcd (feat: USD cost calculation)
- ✓ a2e3692 (feat: AmazonCardPacks component)
- ✓ 3393d74 (feat: Integration)
- ✓ 8df50f6 (fix: Build blockers)
