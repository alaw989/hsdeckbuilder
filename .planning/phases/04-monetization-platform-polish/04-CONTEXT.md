# Phase 4: Monetization & Platform Polish - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Display ads and affiliate links for revenue generation while ensuring responsive mobile design and fast page loads. This phase adds monetization infrastructure (AdSense, Amazon affiliate) and refines the platform for mobile users and performance.

</domain>

<decisions>
## Implementation Decisions

### Ad Placement & Density
- **Maximum ads per page**: 3-4 (standard density)
- **Mobile behavior**: Same ads, responsive sizing only (no reduction in ad count)
- **Ad placement**: Claude's discretion based on layout constraints
- **Ad sizes**: Claude's discretion based on layout constraints

### Affiliate Strategy
- **Affiliate partner**: Amazon only for card pack purchases
- **Link placement**: Dedicated section (not inline with analytics)
- **FTC disclosure**: Footer only: "Affiliate links support this site"
- **Deck cost display**: Show both dust cost AND estimated USD cost to craft

### Mobile Responsiveness
- **Layout**: Tabbed navigation interface (Cards / Deck / Analytics tabs)
- **Touch targets**: Claude's discretion based on design system
- **Card tooltips**: Tap to show modal, tap outside to close
- **Main navigation**: Hamburger menu with slide-out drawer

### Performance Priorities
- **Primary metric**: All Core Web Vitals balanced (LCP, FCP, TTI, CLS)
- **Ad loading**: Lazy load ads after main content is visible
- **Image optimization**: Responsive srcset for different screen sizes
- **Code splitting**: Route-based splitting (load deck builder code only when needed)

### Claude's Discretion
- Exact ad placement positions within layout
- Ad size selection based on IAS standards and layout fit
- Touch target minimum size based on chosen design system
- Exact spacing and typography for mobile layout
- Performance measurement approach and thresholds

</decisions>

<specifics>
## Specific Ideas

- Tabbed interface on mobile should feel like a native app
- Amazon affiliate for broad availability and trusted checkout
- Cost display helps users understand real money value of decks
- FTC disclosure in footer keeps it compliant but unobtrusive
- Lazy loading ads ensures core functionality loads first

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-monetization-platform-polish*
*Context gathered: 2026-02-07*
