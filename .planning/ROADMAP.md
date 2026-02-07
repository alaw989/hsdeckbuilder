# Roadmap: Hearthstone Deck Builder Platform

## Overview

From Laravel 11 + Vue 3 + Inertia.js foundation to a fully functional deck builder with card search, list-based deck construction, visualizations, sharing capabilities, and basic monetization. The platform evolves from infrastructure (card data with caching) to core deck building (validation, deck codes, analytics) to sharing (URL generation, cloning) to monetization (ads, affiliates) — delivering incremental user value at each phase while avoiding common pitfalls (API rate limits, performance issues, ad blocker revenue loss).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Card Data** - Infrastructure, caching, card search/filter
- [ ] **Phase 2: Deck Builder MVP** - List-based builder, validation, visualizations
- [ ] **Phase 3: Deck Sharing & Persistence** - LocalStorage, URLs, cloning
- [ ] **Phase 4: Monetization & Platform Polish** - Ads, affiliates, responsive, performance

## Phase Details

### Phase 1: Foundation & Card Data

**Goal**: Users can search and filter the complete Hearthstone card database through a responsive Vue 3 interface backed by cached Laravel API integration.

**Depends on**: Nothing (first phase)

**Requirements**: CORE-01, CORE-02, CORE-07, CORE-08, CORE-11, PLAT-01, PLAT-03

**Success Criteria** (what must be TRUE):
1. User can search for cards by name with autocomplete suggestions appearing as they type
2. User can filter cards by class, mana cost, type, rarity, and card set simultaneously
3. User can select from all 11 Hearthstone classes and see only class-appropriate cards
4. User can select deck format (Standard/Wild/Twist) and see only valid cards for that format
5. Card data loads quickly (< 3 seconds) and is cached to avoid repeated API calls

**Plans**: TBD

Plans:
- [ ] 01-01: Laravel 11 + Vue 3 + Inertia.js project setup with Tailwind CSS
- [ ] 01-02: Blizzard API integration with Redis caching layer
- [ ] 01-03: Card search UI with autocomplete and multi-filter capabilities

### Phase 2: Deck Builder MVP

**Goal**: Users can construct valid Hearthstone decks using a list-based builder with real-time validation, deck code import/export, and visual analytics.

**Depends on**: Phase 1

**Requirements**: CORE-03, CORE-04, CORE-05, CORE-06, CORE-09, CORE-10, VIS-01, VIS-02, VIS-03, VIS-04

**Success Criteria** (what must be TRUE):
1. User can add cards to deck list and remove cards from deck list
2. System validates deck has exactly 30 cards and only valid class/neutral cards
3. User can import deck via Blizzard deck code string and see the full deck list
4. User can export their deck via Blizzard deck code string
5. User can see mana curve chart, dust cost breakdown, and card tooltips for their deck

**Plans**: TBD

Plans:
- [ ] 02-01: List-based deck builder UI with add/remove card functionality
- [ ] 02-02: Deck validation logic (30 cards, class restrictions, format validation)
- [ ] 02-03: Deck code import/export using Blizzard deck string format
- [ ] 02-04: Visual analytics (mana curve chart, dust cost calculator, card tooltips)

### Phase 3: Deck Sharing & Persistence

**Goal**: Users can save decks locally, share decks via unique URLs, and clone decks from shared links.

**Depends on**: Phase 2

**Requirements**: DECK-01, DECK-02, DECK-03, DECK-04, DECK-05, DECK-06

**Success Criteria** (what must be TRUE):
1. User can save deck to browser LocalStorage and load previously saved decks
2. User can delete saved decks from their local storage
3. System generates unique URL for each deck that can be shared with others
4. User can view deck from shared URL and see complete deck list with analytics
5. User can clone deck from shared URL into their own local storage

**Plans**: TBD

Plans:
- [ ] 03-01: LocalStorage persistence for save/load/delete deck operations
- [ ] 03-02: Unique URL generation and deck encoding for sharing
- [ ] 03-03: Shared deck viewing and cloning functionality

### Phase 4: Monetization & Platform Polish

**Goal**: Platform displays ads and affiliate links for revenue while ensuring responsive mobile design and fast page loads.

**Depends on**: Phase 3

**Requirements**: MON-01, MON-02, MON-03, PLAT-01, PLAT-02

**Success Criteria** (what must be TRUE):
1. System displays banner ads on deck pages without breaking layout
2. System displays affiliate links for card pack purchases on deck pages
3. System properly discloses affiliate relationships (FTC compliance footer)
4. Application is fully responsive and functional on mobile devices
5. Pages load quickly (< 3 seconds) even with ads and affiliate content

**Plans**: TBD

Plans:
- [ ] 04-01: AdSense integration and banner ad placement
- [ ] 04-02: Affiliate link integration with FTC compliance disclosures
- [ ] 04-03: Mobile responsive design refinement and performance optimization

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Card Data | 0/3 | Not started | - |
| 2. Deck Builder MVP | 0/4 | Not started | - |
| 3. Deck Sharing & Persistence | 0/3 | Not started | - |
| 4. Monetization & Platform Polish | 0/3 | Not started | - |
