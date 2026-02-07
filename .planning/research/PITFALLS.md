# Domain Pitfalls: Hearthstone Deck Builder & TCG Platform

**Domain:** Hearthstone deck builder with TCG platform features (external API, drag-drop, payments, ads, affiliates)
**Researched:** 2026-02-06
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: API Rate Limit Exhaustion Without Caching Strategy

**What goes wrong:**
Application hits Blizzard Hearthstone API rate limits (36,000 requests/hour, 100/sec) causing deck builder to fail during peak usage. Users experience slow card loading, empty card lists, or complete service interruption.

**Why it happens:**
Developers treat the API as unlimited, implementing direct API calls for every card display, filter change, or search without caching. Each user action triggers fresh API requests. With 3000+ Hearthstone cards and multiple user interactions, rate limits are quickly exhausted.

**Consequences:**
- Service degradation during peak hours
- Poor user experience with slow/no card data loading
- Potential API access suspension for abuse
- Lost users who abandon the platform

**How to avoid:**
- Implement cache-aside pattern with TTL + LRU eviction
- Cache card metadata (changes infrequently) for 24-72 hours
- Use authenticated API requests (higher limits)
- Batch card requests instead of individual card fetches
- Implement client-side rate limiting and exponential backoff

**Warning signs:**
- Increasing API response times during peak usage
- 429 Too Many Requests errors in production logs
- User reports of "cards not loading"
- Dashboard showing API quota approaching limits

**Phase to address:** Phase 1 (Core Infrastructure) - Caching layer must be built before card data integration

**Detection methods:**
- Monitor API request counts per hour
- Track cache hit/miss ratios
- Alert when approaching 80% of rate limit
- Log all 429 responses with timestamp patterns

---

### Pitfall 2: Drag-and-Drop Performance Collapse with Large Card Collections

**What goes wrong:**
Deck builder becomes unusably slow when users have large collections or when dragging cards through extensive lists. Vue.Draggable's move event fires ~60 times/second, triggering re-renders and validation logic on every drag movement.

**Why it happens:**
Developers implement drag-drop without considering:
- Vue.Draggable's continuous event firing during drag operations
- Complex validation rules executed on every move event
- No virtual scrolling for large card lists
- Re-rendering entire component trees on each drag event

**Consequences:**
- 200ms+ lag when dragging cards
- Browser freezing with collections >100 cards
- Abandoned deck building sessions
- Mobile devices completely unusable

**How to avoid:**
- Throttle/debounce drag move handlers (16ms = 60fps target)
- Implement virtual scrolling for card collections (vue-virtual-scroll-list)
- Use CSS transforms instead of top/left positioning
- Move validation logic to drag end, not drag move
- Consider @vip30/vue-draggable-virtual-scroll-list for large datasets

**Warning signs:**
- Drag operation feels "sticky" or laggy
- Frame rate drops during card dragging (check Chrome DevTools Performance tab)
- Memory increases continuously during drag sessions
- Mobile users specifically report performance issues

**Phase to address:** Phase 2 (Deck Builder Core) - Performance testing required before drag-drop feature complete

**Detection methods:**
- Chrome DevTools Performance recording during drag operations
- Monitor event listener counts for memory leaks
- Track drag operation duration
- Test with progressively larger card collections (50, 100, 500 cards)

---

### Pitfall 3: Stripe Webhook Failures Causing Payment State Desync

**What goes wrong:**
Payments succeed in Stripe but local database never updates due to webhook failures. Users are charged but don't receive premium features, or subscriptions show as "incomplete" despite successful payment.

**Why it happens:**
- Webhook endpoint not publicly accessible (localhost vs production confusion)
- Missing webhook signature verification (security bypass attempts break webhooks)
- Incorrect webhook secret in environment variables
- No retry logic for failed webhook deliveries
- Webhook handling errors silently logged instead of monitored

**Consequences:**
- Users charged but no service granted (support nightmare)
- Subscriptions stuck in "incomplete" state after 3D Secure
- Revenue recognition issues
- Loss of user trust

**How to avoid:**
- Always verify webhook signatures using Stripe's signing secret
- Store webhooks in database table before processing (idempotency)
- Implement scheduled command to process webhooks in order
- Use ngrok for local webhook testing
- Set up proper logging and monitoring for webhook failures
- Test webhook events in Stripe dashboard before going live

**Warning signs:**
- Stripe dashboard shows successful payments but local DB shows pending
- Users report "I paid but nothing happened"
- Webhook endpoint returns 401 Unauthorized
- Customer support tickets about payment issues spike

**Phase to address:** Phase 3 (Monetization - Payments) - Webhook handling is payment completion path

**Detection methods:**
- Monitor webhook endpoint logs for 4xx/5xx responses
- Reconcile Stripe payments vs local database daily
- Alert on webhook signature verification failures
- Track webhook processing latency

---

### Pitfall 4: Stale Card Data After Blizzard API Updates

**What goes wrong:**
New Hearthstone expansion releases or card balance changes break the deck builder. Cards show old stats, new cards are missing, or deck codes fail validation because card database is out of sync.

**Why it happens:**
- Long cache TTLs (72+ hours) not invalidated after game updates
- No proactive cache invalidation mechanism
- Relying solely on passive TTL expiration
- No monitoring for Blizzard API changes
- Set metadata endpoints returning different data than card search endpoints (documented Blizzard API inconsistency)

**Consequences:**
- Deck codes don't work after patches
- Users see incorrect card data
- New expansion content appears days late
- Loss of user trust during critical content release windows

**How to avoid:**
- Implement manual cache eviction triggers for patch days
- Monitor Blizzard's official Hearthstone patch notes
- Use shorter TTLs (1-6 hours) during expansion release windows
- Validate card data consistency across multiple API endpoints
- Build admin interface to force cache refresh
- Implement health checks that verify card database currency

**Warning signs:**
- Social media mentions of "broken deck codes"
- Spike in 404 errors for card lookups
- User reports of incorrect card stats
- Cache timestamps older than 24 hours during expansion release

**Phase to address:** Phase 1 (Core Infrastructure) + Phase 2 (Card Data Integration)

**Detection methods:**
- Monitor cache age of most frequently accessed cards
- Track deck code validation failure rates
- Set up alerts for Blizzard patch note releases
- Compare card counts against known set sizes

---

### Pitfall 5: Ad Blockers Killing 100% of Ad Revenue

**What goes wrong:**
AdSense integration generates zero revenue because 60-80% of users run ad blockers. No fallback monetization strategy exists, platform becomes financially unsustainable.

**Why it happens:**
- Treating ad revenue as primary instead of supplemental
- No diversification in monetization strategy
- Not communicating value proposition to users (why they should disable ad blocker)
- Poor ad placement that encourages blocking

**Consequences:**
- Revenue 80%+ lower than projections
- Platform cannot cover hosting/API costs
- Forced to shut down or implement aggressive paywalls
- User resentment from desperate monetization attempts

**How to avoid:**
- Design ad revenue as supplemental (10-20% of total, not 80%)
- Implement affiliate links as primary revenue stream (TCGplayer partnerships)
- Create premium features worth paying for (no ads, advanced analytics)
- Communicate value: "Ads keep this free" messaging
- Consider acceptable ad initiative compliance
- Implement anti-ad-block detection with graceful messaging

**Warning signs:**
- AdSense revenue consistently below projections
- Analytics showing 60%+ ad block rate
- High bounce rate from pages with heavy ads
- No alternative revenue streams developed

**Phase to address:** Phase 3 (Monetization) - Must have multiple revenue streams before launch

**Detection methods:**
- Monitor ad block rate via JavaScript detection
- Track ad impressions vs page views
- A/B test ad placements
- Survey users about ad experience

---

### Pitfall 6: Mobile Deck Builder UX Blocking Core Functionality

**What goes wrong:**
Filter menus and UI overlays block the main deck building area on mobile/tablet. Users cannot drag cards or interact with their deck because filtering UI covers the entire screen.

**Why it happens:**
- Desktop-first design scaled down for mobile
- Dropdown menus that render behind other UI elements (MTG Arena/GWENT issues)
- Touch targets too small for mobile interaction
- Filtering UI using overlays instead of collapsible sidebars
- Not testing on actual mobile devices during development

**Consequences:**
- Mobile users cannot complete deck building workflow
- 40-60% of traffic (mobile share) has degraded experience
- High mobile bounce rate
- Negative app store reviews

**How to avoid:**
- Mobile-first responsive design
- Use bottom sheets or collapsible sidebars for filters on mobile
- Ensure touch targets are minimum 44x44 pixels
- Test on real devices (iOS Safari, Chrome Mobile)
- Implement swipe gestures for card manipulation
- Keep filters accessible but not blocking main interaction area
- Prefer overlays over dropdowns for mobile filtering

**Warning signs:**
- Mobile session duration significantly shorter than desktop
- High mobile bounce rate from deck builder page
- User reports specifically mentioning iPad or mobile issues
- Filter menu blocking card movement in testing

**Phase to address:** Phase 2 (Deck Builder Core) - Mobile usability testing required

**Detection methods:**
- Compare mobile vs desktop session duration
- Track mobile-specific feature usage rates
- Test on physical mobile devices before each release
- Monitor mobile-specific error rates

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skipping cache implementation | Faster initial development, less infrastructure | API rate limit failures, poor performance at scale | Never - caching is day 1 requirement for API-heavy apps |
| Direct API calls from Vue components | Simpler component code, less abstraction | Impossible to add caching, rate limiting, or error handling | Only for prototypes, never for production |
| Hardcoding card data in frontend | No backend needed, works offline | Instantly stale after patches, no new cards | MVP testing only, must replace before launch |
| Webhook signature verification skipped | Faster development, fewer debugging headaches | Security vulnerability, payment fraud potential | Never - this is a security requirement |
| Using ad revenue as primary monetization | Simple implementation, no business partnerships needed | Unsustainable business model, platform shutdown risk | Only as supplemental revenue (10-20% of total) |
| Ignoring virtual scrolling for card lists | Simple implementation, works fine with <100 cards | Performance collapses with real collections | MVP with <100 cards only, must add before public launch |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **Blizzard Hearthstone API** | Treating rate limits as "rare edge case" | Design for rate limits as normal operation. Assume you'll hit them. Cache aggressively. |
| **Blizzard OAuth** | Hardcoding OAuth tokens or using query parameters | Use HTTP headers for OAuth tokens (required as of Sept 2024). Rotate tokens properly. |
| **Stripe Webhooks** | Assuming webhooks always fire in order or at all | Store webhooks in database, process with scheduled commands. Handle idempotency. |
| **Stripe + Laravel Cashier** | Not verifying webhook signatures "because it works in dev" | Always verify signatures. Test with ngrok locally. Never skip in production. |
| **AdSense** | Placing ads without considering mobile UX | Test ad placements on mobile. Ensure ads don't block deck building. |
| **TCGplayer Affiliate Links** | Not disclosing affiliate relationship (FTC violation) | Explicit disclosure on all pages with affiliate links. "We may earn a commission" messaging. |
| **Card Database Sync** | Relying on passive cache expiration only | Implement manual cache refresh triggers for patch days. Monitor Blizzard announcements. |
| **Vue.Draggable** | Running validation logic on every drag move event | Throttle handlers (16ms). Move validation to drag end. Use virtual scrolling. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **No virtual scrolling for card lists** | Frame rate drops, browser hangs, 2GB+ memory usage with 500+ cards | Implement vue-virtual-scroll-list or similar. Only render visible cards. | Breaks at 100-200 cards depending on device |
| **Drag validation on every move event** | 200+ms lag during card drag, CPU spikes | Throttle to 60fps max. Move heavy validation to drag end. | Noticeable immediately with any deck size |
| **Re-rendering entire component tree on drag** | Janky animations, input lag | Use React.memo/Vue's shouldUpdate. Only re-render changed components. | Worsens linearly with deck size |
| **Client-side card image loading without optimization** | 5+ second page loads, bandwidth waste | Lazy load images. Use WebP format. Implement image CDN. | Breaks at 50+ cards on mobile connections |
| **No debouncing on search/filter inputs** | API request spam, rate limit exhaustion | 300ms debounce on search inputs. Cancel pending requests on new input. | Noticeable with rapid filter changes |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| **Skipping webhook signature verification** | Payment fraud, attackers triggering free premium features | Always verify Stripe webhook signatures using endpoint secret |
| **API keys in frontend code** | Credentials exposed, API abuse, quota exhaustion | Never expose Blizzard or Stripe API keys. Proxy through backend. |
| **No CSRF protection on payment routes** | Cross-site request forgery, unauthorized charges | Laravel CSRF protection on all payment-related routes |
| **Logging full credit card numbers** | PCI compliance violation, security breach | Never log raw payment data. Use Stripe's test tokens in logs. |
| **Storing deck codes without sanitization** | XSS attacks when rendering user-created decks | Sanitize all user input. Use CSP headers. |
| **Missing affiliate disclosure** | FTC violation, legal liability, loss of trust | Explicit disclosure on all pages with affiliate links. Comply with 16 CFR Part 255. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| **Filter menu blocking deck area** | Users cannot manipulate deck while filtering (GWENT/MTG Arena issue) | Use collapsible sidebar or bottom sheet for filters on mobile. Don't block main interaction area. |
| **No deck code copy/paste** | Users must manually share deck lists | Implement one-click deck code import/export using Blizzard's deck string format |
| **Loading spinners for every card** | Anxiety-inducing experience, feels broken | Show skeleton screens. Cache card images locally. Progressive loading. |
| **Mobile card selection requires precision tapping** | Frustrating mobile experience, accidental selections | Implement swipe gestures. Large touch targets (44x44px minimum). |
| **No undo after card removal** | Accidentally removed cards, user frustration | Implement undo/redo stack for deck modifications |
| **Deck validation only on submit** | User builds invalid deck, gets error message at end | Real-time deck validation with inline feedback (class/mana count) |
| **Missing mana curve visualization** | Users cannot assess deck balance | Display mana curve histogram. Highlight issues (too many 7-drops) |

## "Looks Done But Isn't" Checklist

- [ ] **Card Caching:** Often missing cache invalidation after patches — verify manual refresh triggers exist and are tested
- [ ] **Drag Performance:** Often performs fine with 10 cards but breaks at 100 — verify virtual scrolling implemented and tested with 500+ cards
- [ ] **Webhook Handling:** Often works in dev but fails in production — verify ngrok testing done and webhook endpoint publicly accessible
- [ ] **Rate Limiting:** Often not hit until real user load — verify monitoring for 429 responses and automated alerts configured
- [ ] **Mobile Deck Building:** Often "tested" in browser dev tools but not on real devices — verify tested on physical iPhone and Android devices
- [ ] **Deck Code Validation:** Often validates against stale card database — verify validation uses fresh API data or properly cached metadata
- [ ] **Affiliate Disclosure:** Often missing or buried — verify disclosure visible on all pages with affiliate links
- [ ] **AdSense on Mobile:** Often breaks layout or blocks functionality — verify ads don't interfere with deck building on mobile
- [ ] **Payment Error Handling:** Often shows generic "payment failed" message — verify users see specific decline reasons and actionable next steps
- [ ] **API Key Security:** Often found in frontend code or public repos — verify all keys in environment variables, never committed to git

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **API rate limit exhaustion** | HIGH - May require days of rate limit quota recovery | 1. Implement emergency caching layer immediately. 2. Reduce API call frequency by 90%. 3. Request rate limit increase from Blizzard (may take weeks). 4. Consider API proxy service. |
| **Drag performance collapse** | MEDIUM - Requires refactoring but doesn't block users entirely | 1. Add virtual scrolling (1-2 days dev). 2. Throttle event handlers (few hours). 3. Move validation to drag end (1 day). 4. Test with progressively larger datasets. |
| **Webhook payment state desync** | HIGH - Requires manual reconciliation of payments | 1. Implement webhook signature verification immediately. 2. Build admin interface to manually sync payments. 3. Reconcile last 30 days of Stripe transactions vs database. 4. Grant premium features to affected users (support cost). |
| **Stale card data after patch** | MEDIUM - Manual intervention but quick fix | 1. Build admin endpoint to force cache refresh. 2. Manually clear all card caches. 3. Update social media acknowledging issue. 4. Implement automated patch monitoring going forward. |
| **Ad revenue collapse from ad blockers** | HIGH - Business model broken, requires pivot | 1. Immediately pivot to affiliate revenue model (1-2 weeks). 2. Develop premium features (1-2 months). 3. Communicate value proposition to users. 4. Consider acceptable ads or whitelist requests. |
| **Mobile UX blocking functionality** | HIGH - 60% of users affected | 1. Emergency mobile-specific CSS fixes (1-2 days). 2. Redesign filter UI for mobile (1-2 weeks). 3. Implement proper mobile testing before releases. 4. Consider progressive web app (PWA) for better mobile experience. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| **API rate limit exhaustion** | Phase 1 (Core Infrastructure) | Load test API with 10x expected traffic. Verify cache hit ratio >90%. Monitor for 429s under load. |
| **Drag performance collapse** | Phase 2 (Deck Builder Core) | Performance test with 500-card deck. Drag operations must stay under 50ms. Test on mobile device. |
| **Webhook payment state desync** | Phase 3 (Monetization - Payments) | Process test payments in Stripe, verify local DB updates. Test webhook failures and retries. Reconcile payments daily for first week. |
| **Stale card data after patches** | Phase 1 + Phase 2 | Implement cache age monitoring. Test manual refresh workflow. Verify deck code validation works after simulated patch. |
| **Ad blockers killing revenue** | Phase 3 (Monetization - Revenue Strategy) | Launch with minimum 2 revenue streams (affiliates + premium). Project ad revenue as 10-20% max. Monitor ad block rate. |
| **Mobile UX blocking functionality** | Phase 2 (Deck Builder Core) | Test complete deck building workflow on physical iPhone and Android. Verify filters don't block card manipulation. |

## Hearthstone/Blizzard API Specific Gotchas

### OAuth Token Changes (September 2024)
- **Breaking Change:** OAuth tokens must now be sent in HTTP headers, not URL query parameters
- **Impact:** Old integrations break with authentication errors
- **Prevention:** Use current Blizzard API SDK. Monitor official Blizzard API announcements.
- **Detection:** 401 Unauthorized errors specifically mentioning OAuth

### Set Metadata vs Card Search API Inconsistency
- **Issue:** Set metadata endpoint returns different data structures than card search endpoint
- **Impact:** Card database inconsistencies, incorrect set information
- **Prevention:** Validate data from both endpoints. Build abstraction layer that normalizes responses.
- **Detection:** Cards showing wrong set IDs, user reports of incorrect metadata

### No Public API for Draft/Replay Data
- **Limitation:** Blizzard doesn't provide public API for draft captures, game replays, or statistics
- **Workaround:** Rely on third-party tools or community-scraped data
- **Risk:** Third-party data sources may be unreliable or violate ToS
- **Prevention:** Design features to work with official APIs only. Don't promise features requiring unavailable data.

### Deck Code Format Changes
- **Risk:** Blizzard may change deck string format, breaking deck import/export
- **Impact:** User-created deck codes become invalid
- **Prevention:** Use Blizzard's official deck code parsing libraries. Monitor patch notes for format changes.
- **Detection:** Spike in "invalid deck code" errors after patches

## Monetization Pitfalls

### Ad Blocker Revenue Impact
- **Reality:** 60-80% of gaming/TCG users run ad blockers
- **Mistake:** Projecting revenue based on 100% ad viewability
- **Prevention:** Model 20-40% ad fill rate. Diversify revenue streams (affiliates, premium)
- **Detection:** AdSense revenue significantly below projections

### Payment Decline User Retention
- **Reality:** Failed payments cause immediate user churn. 15%+ decline rates trigger fraud flags.
- **Mistake:** Treating payment failures as technical issues, not UX problems
- **Prevention:** Clear error messages explaining specific decline reasons. Smart retry logic. Autofill to prevent data entry errors.
- **Detection:** Monitor decline rates by reason code. Track user return after failed payment.

### Affiliate Disclosure Compliance
- **Requirement:** FTC mandates disclosure of affiliate relationships (16 CFR Part 255)
- **Risk:** Fines, legal liability, loss of user trust
- **Prevention:** Explicit disclosure on all pages with affiliate links. Clear language like "We may earn a commission"
- **Verification:** Legal review of disclosure language. Audit pages for missing disclosures.

### Stripe Radar Fraud Prevention Overreach
- **Issue:** Overly aggressive fraud blocking declines legitimate transactions
- **Impact:** Users unable to pay, frustration, churn
- **Prevention:** Monitor false positive rate. Whitelist repeat customers. Don't block on first purchase.
- **Detection:** Legitimate users complaining about payment blocks

### Subscription Proration Confusion
- **Issue:** Users don't understand prorated charges when upgrading/downgrading
- **Impact:** Support tickets, refund requests, chargebacks
- **Prevention:** Clear preview of charges before confirmation. Email receipt with line-item breakdown.
- **Detection:** Support tickets mentioning "unexpected charge" or "confusing bill"

## Sources

### Hearthstone/Blizzard API
- [Blizzard Forums - Upcoming Changes to Battle.net's API Gateway](https://us.forums.blizzard.com/en/blizzard/t/upcoming-changes-to-battlenet%25E2%2580%2599s-api-gateway/51561) - OAuth token header requirement changes (Sept 2024)
- [Blizzard Forums - Hearthstone Set Metadata differs from Card Search response](https://us.forums.blizzard.com/en/blizzard/t/hearthstone-set-metadata-differs-from-card-search-response/4049) - API inconsistency issues
- [Reddit - Hearthstone API is COMING](https://www.reddit.com/r/hearthstone/comments/3h1iis/hearthstone_api_is_coming/) - Community discussion on API limitations

### API Rate Limiting & Caching
- Stripe and payment platform documentation on rate limiting best practices
- General API rate limiting strategies from multiple developer resources
- Cache invalidation challenges in computer science literature

### Vue.js Drag-and-Drop Performance
- [Dev.to - Handling large lists efficiently in Vue 3](https://dev.to/jacobandrewsky/handling-large-lists-efficiently-in-vue-3-4im1)
- [VueDraggablePlus性能优化技巧：大型列表拖拽的最佳实践](https://blog.csdn.net/gitblog_01047/article/details/152065576) (Chinese blog on Vue.Draggable performance)
- [Vue.Draggable虚拟滚动集成：处理十万级数据拖拽](https://blog.csdn.net/gitblog_00108/article/details/152764299) (Chinese blog on virtual scrolling with Vue.Draggable)
- [@vip30/vue-draggable-virtual-scroll-list](https://www.npmjs.com/package/@vip30/vue-draggable-virtual-scroll-list) - NPM package for large dataset dragging

### Laravel & Stripe Webhooks
- [Laracasts - Troubleshooting Stripe Webhook Setup in Laravel 10](https://laracasts.com/discuss/channels/laravel/troubleshooting-stripe-webhook-setup-in-laravel-10-invalid-url-exception)
- [Stack Overflow - Laravel Cashier Stripe webhook not working in localhost](https://stackoverflow.com/questions/78406028/laravel-cashier-stripe-webhook-not-working-in-localhost-with-stripe-cli)
- [GitHub - Order of webhooks from Stripe may not be consistent](https://github.com/laravel/cashier-stripe/issues/1201)
- [Laravel Cashier (Stripe) Documentation](https://laravel.com/docs/12.x/billing)

### Payment Processing & User Retention
- [Finix - Hidden Costs of Payment Failures: Customer Trust & Retention](https://finix.com/resources/blogs/hidden-costs-payment-failures-customer-trust-retention)
- [Enty - Reduce Failed Payments and Boost Customer Retention](https://enty.io/blog/how-to-reduce-failed-payments)
- [Solidgate - How to manage card declines and recover lost revenue](https://solidgate.com/blog/how-to-manage-card-declines-and-recover-lost-revenue/)
- [Stripe - Failed payment recovery 101](https://stripe.com/resources/more/failed-payment-recovery-101)

### AdSense & Monetization
- Various AdSense optimization and mistake avoidance resources
- FTC Guidelines on Affiliate Marketing (16 CFR Part 255)
- Moxfield, SixPrizes, OP.TCG affiliate disclosure examples

### Mobile UX & Filtering
- MTG Arena and GWENT deck builder UX discussions on Reddit and forums
- Mobile filtering UX best practices from content square and mobile UX resources
- General mobile app UX design mistake discussions

### TCG Platform Issues
- Pokémon TCG Pocket sync error discussions (2024)
- TCG Card Shop Simulator bug reports (Steam community 2024)
- General TCG platform sync and database issues

**Confidence Note:** Research quality is MEDIUM due to reliance on WebSearch for many findings. Some sources are community discussions (Reddit, StackOverflow) which may reflect individual experiences rather than systematic issues. Official Blizzard documentation is limited. Verification with production load testing and real-world usage is recommended.

---

*Pitfalls research for: Hearthstone deck builder and TCG monetization platform*
*Researched: 2026-02-06*
