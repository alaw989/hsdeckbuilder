# Requirements: Hearthstone Deck Builder Platform

**Defined:** 2026-02-06
**Core Value:** Deck builders can easily construct, optimize, and share Hearthstone decks with visual drag-and-drop—while discovering ways to improve their gameplay through analytics and expert guides.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Deck Building

- [x] **CORE-01**: User can search Hearthstone cards by name with autocomplete
- [x] **CORE-02**: User can filter cards by class, mana cost, type, rarity, and card set
- [x] **CORE-03**: User can add cards to deck list (list-based builder)
- [x] **CORE-04**: User can remove cards from deck list
- [x] **CORE-05**: System validates deck has exactly 30 cards
- [x] **CORE-06**: System validates deck contains only cards from selected class plus neutral cards
- [x] **CORE-07**: User can select deck format (Standard/Wild/Twist)
- [x] **CORE-08**: System filters available cards based on selected format
- [x] **CORE-09**: User can import deck via Blizzard deck code string
- [x] **CORE-10**: User can export deck via Blizzard deck code string
- [x] **CORE-11**: User can select from all 11 Hearthstone classes

### Visualization & Analytics

- [x] **VIS-01**: System displays mana curve chart for current deck
- [x] **VIS-02**: System displays dust cost breakdown (common/rare/epic/legendary)
- [x] **VIS-03**: System displays card images and tooltips
- [x] **VIS-04**: User can see card count by mana cost (1-10)

### Deck Management

- [ ] **DECK-01**: User can save deck to LocalStorage
- [ ] **DECK-02**: User can load previously saved decks
- [ ] **DECK-03**: User can delete saved decks
- [ ] **DECK-04**: System generates unique URL for each deck
- [ ] **DECK-05**: User can view deck from shared URL
- [ ] **DECK-06**: User can clone deck from shared URL

### Monetization - MVP

- [x] **MON-01**: System displays banner ads on deck pages
- [x] **MON-02**: System displays affiliate links for card pack purchases
- [x] **MON-03**: System properly discloses affiliate relationships (FTC compliance)

### Platform

- [x] **PLAT-01**: Application is responsive on mobile devices
- [x] **PLAT-02**: Pages load quickly (< 3 seconds)
- [ ] **PLAT-03**: Card data is cached to avoid API rate limits

## v2 Requirements

Deferred to after MVP validation. Added when consistent traffic and user engagement confirmed.

### User Accounts

- **AUTH-01**: User can create account with email/password
- **AUTH-02**: User can log in and stay logged in across sessions
- **AUTH-03**: User can reset password via email link
- **AUTH-04**: User can log out from any page

### Premium Features

- **PREM-01**: User can subscribe to premium tier ($5-10/mo)
- **PREM-02**: Premium users see advanced analytics (win rates, mulligan data)
- **PREM-03**: Premium users get ad-free experience
- **PREM-04**: Premium users can save unlimited decks to cloud
- **PREM-05**: User can manage subscription via Stripe

### Content

- **CONT-01**: System displays meta tier lists
- **CONT-02**: Users can read deck guides and strategy articles
- **CONT-03**: Users can compare two decks side-by-side

### Advanced Features

- **ADV-01**: User can build decks using visual drag-and-drop interface
- **ADV-02**: System provides AI-powered card suggestions
- **ADV-03**: Users can import their Blizzard collection data

## v3 Requirements

Deferred until premium validates and user base is established.

### Coaching Marketplace

- **COACH-01**: Pro players can create coaching profiles
- **COACH-02**: Users can browse and purchase coaching services
- **COACH-03**: Platform processes payments and takes commission
- **COACH-04**: Pro players can sell deck guides

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time multiplayer deck building | HIGH complexity for MVP. Asynchronous collaboration sufficient. |
| Native mobile apps (iOS/Android) | Web-first with responsive design is faster to build. PWA later if needed. |
| Tournament management platform | Separate product, scope creep. Focus on deck building. |
| Pack opening simulator | Different product entirely. Monetization conflicts with affiliate links. |
| Live gameplay tracking / overlays | Requires desktop app, complex Blizzard API integration. |
| Social network features | Moderation burden. Players already use Discord/Reddit. |
| Trading/selling cards | Not applicable to Hearthstone (digital-only game). |
| AI deck building from scratch | Removes creativity. Players want guidance, not automation. |
| Chat rooms / discussion forums | Use existing platforms (Discord) instead. |
| Video streaming integration | Twitch embeds sufficient. Bandwidth costs. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Complete |
| CORE-02 | Phase 1 | Complete |
| CORE-03 | Phase 2 | Complete |
| CORE-04 | Phase 2 | Complete |
| CORE-05 | Phase 2 | Complete |
| CORE-06 | Phase 2 | Complete |
| CORE-07 | Phase 1 | Complete |
| CORE-08 | Phase 1 | Complete |
| CORE-09 | Phase 2 | Complete |
| CORE-10 | Phase 2 | Complete |
| CORE-11 | Phase 1 | Complete |
| VIS-01 | Phase 2 | Complete |
| VIS-02 | Phase 2 | Complete |
| VIS-03 | Phase 2 | Complete |
| VIS-04 | Phase 2 | Complete |
| DECK-01 | Phase 3 | Pending |
| DECK-02 | Phase 3 | Pending |
| DECK-03 | Phase 3 | Pending |
| DECK-04 | Phase 3 | Pending |
| DECK-05 | Phase 3 | Pending |
| DECK-06 | Phase 3 | Pending |
| MON-01 | Phase 4 | Complete |
| MON-02 | Phase 4 | Complete |
| MON-03 | Phase 4 | Complete |
| PLAT-01 | Phase 4 | Complete |
| PLAT-02 | Phase 4 | Complete |
| PLAT-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-06*
*Last updated: 2026-02-06 after roadmap creation*
