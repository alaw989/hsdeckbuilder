# Feature Research

**Domain:** Hearthstone deck builder and monetization platform
**Researched:** 2025-02-06
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Card database with search** | Can't build decks without finding cards | MEDIUM | Search by name, class, cost, type, rarity, set, mechanics. Autocomplete essential. |
| **Deck builder interface** | Core functionality - adding/removing cards | MEDIUM | Must support 30-card decks, class restrictions, format validation (Standard/Wild/Twist) |
| **Deck code import/export** | Industry standard for sharing decks | LOW | Blizzard's deck string format. Critical for sharing. |
| **Mana curve visualization** | Players expect to see mana distribution | LOW | Standard feature on all deck builders. Shows balance of deck. |
| **Deck dust cost calculator** | Players need to know crafting cost | LOW | Essential for budget players. Shows common/rare/epic/legendary breakdown. |
| **Class selection** | Hearthstone is class-based game | LOW | Must support all 11 classes + neutral cards |
| **Format selection** | Standard/Wild/Twist/Duels are fundamental | LOW | Different formats have different card pools. Validation needed. |
| **Visual card display** | Players need to see card art and text | MEDIUM | Card images, tooltips, full card text. Must load efficiently. |
| **Card filtering/sorting** | Navigating thousands of cards requires it | MEDIUM | Filter by mana cost, type, rarity, set, mechanics, keyword search |
| **Basic deck analytics** | Card count, mana curve, dust cost are baseline | LOW | Blizzard's official deck builder has these. Missing them feels broken. |
| **Responsive design** | Many players browse on mobile | HIGH | Mobile web support expected. Apps are differentiator. |
| **Fast loading** | Card database can be large | MEDIUM | Lazy loading, caching, optimized images needed |
| **URL sharing for decks** | Community relies on sharing deck links | LOW | Unique URLs for each deck. Social media integration. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Visual drag-and-drop builder** | Easier than list-based builders | HIGH | Original 2019 app failed due to complexity. Need proven library. |
| **AI-powered deck suggestions** | Helps players optimize decks | HIGH | Suggests cards based on synergy, win rates, collection. Similar to HSReplay's auto-complete. |
| **Advanced analytics dashboard** | Competitive players want deep insights | HIGH | Win rates by matchup, mulligan guidance, card performance data. HSReplay premium feature. |
| **Pro player deck marketplace** | Revenue stream + content differentiation | MEDIUM | Coaching marketplace, paid guides, pro deck access. Not offered by competitors. |
| **Collection integration** | Shows what cards player actually owns | MEDIUM | Import collection data, highlight missing cards. Premium feature potential. |
| **Deck comparison tool** | Players analyze deck differences | MEDIUM | HearthstoneTopDecks has this. Shows card overlap between decks. |
| **Budget deck builder** | Helps F2P players compete | MEDIUM | Auto-build decks from owned cards. HearthstoneTopDecks offers budget decks. |
| **Meta tier lists** | Players want to know what's strong | MEDIUM | Updated regularly based on win rates. HSReplay does this well. |
| **Deck guides and strategy** | Educational content keeps users engaged | MEDIUM | Mulligan guides, play strategy, card synergies. Premium content. |
| **Tournament deck tracker** | Competitive players follow pro play | MEDIUM | Feature decks from tournaments, esports integration. HSGuru offers this. |
| **Replay system** | Learn from games, share plays | HIGH | HSReplay has replay viewing. Complex to build. |
| **Multi-format support** | Wild/Twist/Battlegrounds/Duels | MEDIUM | Most sites focus on Standard. Supporting all formats differentiates. |
| **Community deck ratings** | Social proof for deck quality | LOW | Upvote/downvote, comment system. Helps surface good decks. |
| **Personalized recommendations** | Machine learning for deck suggestions | HIGH | Suggest decks based on play style, rank, collection. |

### Monetization-Specific Features

Features tied directly to revenue streams.

| Feature | Revenue Stream | Complexity | Notes |
|---------|---------------|------------|-------|
| **Display ads (AdSense)** | Ad revenue | LOW | Banner ads on deck pages, card database. Non-intrusive placement. |
| **Affiliate card purchase links** | Affiliate revenue | MEDIUM | Links to Amazon/Blizzard for card packs. "Cheap Hearthstone Packs" on HSTD. |
| **Premium analytics subscription** | Premium subscription ($5-10/mo) | HIGH | Detailed win rates, mulligan data, personal stats. HSReplay charges for this. |
| **Premium deck sharing** | Premium subscription | MEDIUM | Private deck sharing, advanced export options, custom branding. |
| **Ad-free experience** | Premium subscription | LOW | Remove ads for paying users. Standard freemium model. |
| **Coaching marketplace listings** | Marketplace commission | MEDIUM | Pro players list coaching services. Platform takes percentage. |
| **Paid guide marketplace** | Marketplace commission + content sales | HIGH | Pro-written deck guides, strategy articles. Revenue split with creators. |
| **Video guide integration** | Premium + affiliate | MEDIUM | Embedded YouTube videos with affiliate links. |
| **Priority support for premium** | Premium subscription | LOW | Faster response times for paid users. |
| **Early access to features** | Premium subscription | MEDIUM | Beta features for premium users first. |
| **Bulk deck operations** | Premium subscription | MEDIUM | Save unlimited decks, bulk export, advanced search. |
| **API access for premium** | Premium subscription | HIGH | Allow third-party apps to access data. Developer tier. |
| **Team/collaboration features** | Premium subscription | HIGH | Multiple users collaborate on decks. Team pricing. |
| **White-label deck builder** | Enterprise revenue | HIGH | Customize deck builder for streamers/content creators. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Real-time multiplayer deck building** | Players want to build together | HIGH complexity. Requires WebSockets, state sync, conflict resolution. Defer to v2. | Asynchronous collaboration (shared decks with version history) |
| **Mobile apps (native)** | Mobile users want native experience | Development overhead x3 (iOS + Android + maintenance). Web-first is faster. | Progressive Web App (PWA) with mobile-responsive design |
| **Pack opening simulator** | Fun feature, engagement | Different product entirely. Doesn't help deck building. Monetization conflicts. | Affiliate links to actual pack purchases |
| **Tournament management platform** | Competitive players need tournaments | Scope creep. Tournament management is complex, separate product. | Focus on deck sharing and discovery for tournaments |
| **Live gameplay tracking** | In-game overlays like HSReplay | Requires desktop app, Blizzard API access, anti-cheat concerns. | Focus on pre-game deck building, post-game analytics |
| **Social network features** | Build community | High moderation burden. Players already use Discord/Reddit. | Light commenting, upvoting. Heavy social features elsewhere. |
| **Advanced trading/selling cards** | TCGplayer has card marketplace | Not relevant to Hearthstone (digital-only). Different from MTG/Pokemon. | Focus on deck building, not trading |
| **AI deck building from scratch** | "Build me a deck" | Players want guidance, not automation. Removes creativity, engagement. | AI suggestions for card swaps, optimization of existing decks |
| **Chat rooms/discussion forums** | Community building | Moderation nightmare. Reddit/Discord already exist. | Link to existing Discord, comments on decks |
| **Video streaming integration** | Watch streamers build decks | Bandwidth costs, complex. Twitch embeds sufficient. | Curated deck lists from streamers (HSGuru model) |
| **Collection tracker with manual entry** | Track physical/digital collection | Time-consuming for users. API import is better. | Import collection from Blizzard API (if available) |
| **Deck cloning from screenshots** | Import decks from images | OCR is unreliable, error-prone. Deck codes work better. | Support deck code import/export (industry standard) |
| **Anonymous deck posting** | Privacy concerns | Reduces quality, prevents attribution. Spam issues. | Optional pseudonymous usernames, reputation system |

## Feature Dependencies

```
[Card Database & Search]
    └──requires──> [API Integration]
                 └──requires──> [Card Caching System]

[Deck Builder Interface]
    ├──requires──> [Card Database & Search]
    ├──requires──> [Deck Validation Logic]
    └──enhanced-by──> [Drag-and-Drop UI]

[Deck Code Import/Export]
    └──requires──> [Deck Builder Interface]

[Mana Curve Visualization]
    └──requires──> [Deck Builder Interface]

[Dust Cost Calculator]
    └──requires──> [Card Database & Search]

[Analytics Dashboard]
    ├──requires──> [User Accounts]
    ├──requires──> [Deck Persistence]
    └──requires──> [Game Data Collection]

[AI-Powered Suggestions]
    ├──requires──> [Analytics Dashboard]
    └──requires──> [Machine Learning Models]

[Premium Features]
    ├──requires──> [User Accounts]
    ├──requires──> [Payment Processing]
    └──requires──> [Subscription Management]

[Coaching Marketplace]
    ├──requires──> [User Accounts]
    ├──requires──> [Payment Processing]
    ├──requires──> [User Profiles]
    └──requires──> [Messaging System]

[Deck Sharing]
    ├──requires──> [Deck Persistence]
    └──enhanced-by──> [URL Shortener]

[Collection Integration]
    └──requires──> [User Accounts]

[Ad Revenue]
    └──enhanced-by──> [High Traffic Volume]

[Affiliate Revenue]
    └──enhanced-by──> [Deck Guide Content]
```

### Dependency Notes

- **Card Database** is foundational - everything depends on it
- **Deck Builder** requires both Card Database and Validation Logic
- **Analytics** requires user data, which requires accounts and persistence
- **Premium features** depend on payment infrastructure
- **Coaching marketplace** is highest complexity - requires accounts, payments, profiles, messaging
- **AI suggestions** are v2+ - require analytics data and ML models
- **Ad/Affiliate revenue** benefits from high traffic, but doesn't require features

## MVP Definition

### Launch With (v1)

Minimum viable product - what's needed to validate the concept.

- [ ] **Card database with search** - Core functionality, can't build without it
- [ ] **Deck builder interface** - List-based builder is MVP, drag-drop is v2
- [ ] **Deck code import/export** - Industry standard, required for sharing
- [ ] **Mana curve visualization** - Table stakes feature
- [ ] **Dust cost calculator** - Table stakes feature
- [ ] **Class & format selection** - Game mechanics requirement
- [ ] **URL sharing for decks** - Enables discovery and growth
- [ ] **Basic deck persistence** - LocalStorage for MVP, backend for v1.1
- [ ] **Responsive design** - Mobile web support
- [ ] **Display ads (AdSense)** - Revenue stream 1
- [ ] **Affiliate card purchase links** - Revenue stream 2

**Rationale:** This MVP allows users to build, share, and discover decks. Monetization through ads and affiliates is simple to implement. Premium features come after validating product-market fit.

### Add After Validation (v1.x)

Features to add once core is working and users are engaged.

- [ ] **User accounts & authentication** - Required for premium, deck saving
- [ ] **Deck persistence (backend)** - Save decks to cloud, access across devices
- [ ] **Premium analytics subscription** - Revenue stream 3
- [ ] **Ad-free experience for premium** - Monetization optimization
- [ ] **Deck guides & strategy content** - SEO value, affiliate opportunities
- [ ] **Meta tier lists** - Update weekly, drives repeat traffic
- [ ] **Deck comparison tool** - Competitive differentiator
- [ ] **Community deck ratings** - Social proof, engagement
- [ ] **Collection integration** - Import from Blizzard API

**Trigger for adding:** Consistent traffic (1,000+ weekly users), active deck sharing, user feedback requesting accounts/saving.

### Future Consideration (v2+)

Features to defer until product-market fit is established and revenue is flowing.

- [ ] **Visual drag-and-drop builder** - Wait until list builder validates UX needs
- [ ] **AI-powered deck suggestions** - Requires analytics data, ML models
- [ ] **Coaching marketplace** - Complex, requires user base, payment split logic
- [ ] **Replay system** - High complexity, unclear if users want it
- [ ] **Advanced analytics dashboard** - HSReplay territory, competitive risk
- [ ] **Pro player deck marketplace** - Requires partnerships, content creation
- [ ] **Team/collaboration features** - Niche feature, enterprise pricing
- [ ] **API access for developers** - Small audience, documentation burden
- [ ] **Native mobile apps** - Web-first approach, validate demand first

**Rationale:** These are high-complexity features that differentiate but aren't required for initial traction. Build after confirming deck builder is meeting user needs.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Card database with search | HIGH | MEDIUM | P1 |
| Deck builder interface | HIGH | MEDIUM | P1 |
| Deck code import/export | HIGH | LOW | P1 |
| URL sharing for decks | HIGH | LOW | P1 |
| Mana curve visualization | MEDIUM | LOW | P1 |
| Dust cost calculator | MEDIUM | LOW | P1 |
| Display ads (AdSense) | LOW (business) | LOW | P1 |
| Affiliate links | LOW (business) | MEDIUM | P1 |
| Responsive design | HIGH | HIGH | P1 |
| User accounts | HIGH | MEDIUM | P2 |
| Backend deck persistence | HIGH | MEDIUM | P2 |
| Premium analytics | HIGH | HIGH | P2 |
| Meta tier lists | MEDIUM | MEDIUM | P2 |
| Deck guides content | MEDIUM | MEDIUM | P2 |
| Deck comparison tool | MEDIUM | MEDIUM | P2 |
| Collection integration | MEDIUM | HIGH | P2 |
| Drag-and-drop builder | MEDIUM | HIGH | P3 |
| AI suggestions | HIGH | HIGH | P3 |
| Coaching marketplace | MEDIUM | HIGH | P3 |
| Replay system | MEDIUM | HIGH | P3 |
| Native mobile apps | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for MVP
- P2: Should have, add when possible (v1.x)
- P3: Nice to have, future consideration (v2+)

## Competitor Feature Analysis

| Feature | HSReplay | HearthstoneTopDecks | HSGuru | Blizzard Official | Our Approach |
|---------|----------|---------------------|--------|-------------------|--------------|
| Deck database | Yes | Yes | Yes | Yes | MVP: Basic search, v2: Advanced filters |
| Deck builder | Basic | Advanced | Basic | Basic | MVP: List-based, v2: Drag-drop |
| Deck codes | Yes | Yes | Yes | Yes | MVP |
| Mana curve | Yes | Yes | Yes | Yes | MVP |
| Dust cost | Yes | Yes | Yes | Yes | MVP |
| Analytics | Premium | Basic | Free | No | MVP: Basic, Premium: Advanced |
| Deck sharing | Yes | Yes | Yes | Yes | MVP |
| Meta tier lists | Premium | Free | Free | No | v1.x |
| Deck guides | Some | Extensive | Some | No | v1.x |
| Deck comparison | No | Yes | No | No | v1.x (differentiator) |
| Collection import | No | No | No | Yes (in-game) | v2 |
| Replay system | Premium | No | No | No | v2+ (complex) |
| Coaching marketplace | No | No | No | No | v2+ (revenue) |
| Premium subscription | Yes ($4-5/mo) | No | No | N/A | v1.x ($5-10/mo) |
| Ads | Yes | Yes | Yes | No | MVP |
| Affiliate links | Unknown | Yes (Amazon Coins) | Unknown | N/A | MVP |

**Key insights:**
- HSReplay dominates analytics/premium space
- HearthstoneTopDecks has best free content and deck comparison
- No competitor has coaching marketplace - blue ocean opportunity
- All platforms support deck codes - non-negotiable
- Most monetize through subscriptions or ads

## Monetization Strategy Feature Map

### Phase 1: MVP Monetization (Low Friction)
- **Display ads** on high-traffic pages (deck lists, card database)
- **Affiliate links** to Amazon Coins, Blizzard store
- **No paywall** - all features free initially
- **Goal:** Build traffic, validate product-market fit

### Phase 2: Premium Tier (After Validation)
- **Premium subscription ($5-10/mo)** for:
  - Advanced analytics (win rates, mulligan data)
  - Ad-free experience
  - Unlimited deck saving
  - Early access to features
- **Payment processing:** Stripe or Lemon Squeezy
- **Goal:** Convert power users to recurring revenue

### Phase 3: Marketplace (After Premium Validates)
- **Coaching marketplace:** Pro players list services, platform takes 20-30%
- **Paid guide marketplace:** Sell deck guides ($5-20), revenue split with creators
- **Premium creator tools:** Streamer deck pages with branding
- **Goal:** Scale revenue through creator economy

### Phase 4: Enterprise (Optional)
- **API access** for third-party developers
- **White-label deck builder** for content creators
- **Team plans** for esports organizations
- **Goal:** Diversify revenue, high-value contracts

## Sources

- HSReplay.net features and pricing - https://hsreplay.net/
- HearthstoneTopDecks features and deck comparison - https://www.hearthstonetopdecks.com/
- HSGuru features and esports integration - https://www.hsguru.com/
- Reddit: HSReplay vs HearthstoneTopDecks comparison - https://www.reddit.com/r/hearthstone/comments/7veh2m/
- Reddit: What's the best website for decks - https://www.reddit.com/r/hearthstone/comments/18w23b3/
- Reddit: Is HSReplay premium worth it - https://www.reddit.com/r/hearthstone/comments/134qm4w/
- Web search: Deck builder monetization strategies 2025
- Web search: TCG marketplace and coaching platforms 2025
- Web search: Common deck builder app mistakes and anti-patterns

---
*Feature research for: Hearthstone deck builder platform with monetization*
*Researched: 2025-02-06*
