# Hearthstone Deck Builder Platform

## What This Is

A modern Hearthstone deck builder and community platform. Users search cards, build decks with a list-based interface, share decks via URLs, and access monetized content through ads and affiliate links. The platform is built with Laravel 12 + Vue 3 + Inertia.js and uses LocalStorage for client-side deck persistence.

## Core Value

Deck builders can easily construct, optimize, and share Hearthstone decks—while discovering ways to improve their gameplay through visual analytics and affiliate card pack purchases.

## Current State

**Version:** v1.0 MVP (shipped 2026-02-07)

**Tech Stack:**
- Backend: Laravel 12 with file-based caching
- Frontend: Vue 3 + Inertia.js + Tailwind CSS
- Build: Vite 7.3.1
- Charts: Chart.js + vue-chart-3
- Deck Codes: @firestone-hs/deckstrings
- Utilities: @vueuse/core

**Shipped Features:**
- Card search with autocomplete and multi-filter
- List-based deck builder with validation
- Deck code import/export (Blizzard format)
- Visual analytics (mana curve, dust cost, USD value)
- LocalStorage deck persistence (save/load/delete)
- URL-based deck sharing and cloning
- AdSense integration (3 ad placements)
- Amazon affiliate links for card packs
- Mobile responsive design with tabbed navigation

**Known Issues:**
- AdSense approval pending (1-2 weeks)
- Amazon Associates account setup required
- Product ASINs are placeholders
- Core Web Vitals monitoring recommended post-deploy

## Requirements

### Validated (v1.0)

- ✓ Card search with autocomplete across all Hearthstone cards — v1.0
- ✓ Card filtering by class, mana, type, rarity, set — v1.0
- ✓ List-based deck construction with add/remove — v1.0
- ✓ Visual deck list with mana curve display — v1.0
- ✓ Deck sharing via unique URLs — v1.0
- ✓ Class selection (all 11 classes) — v1.0
- ✓ Deck persistence (LocalStorage save/load/delete) — v1.0
- ✓ Basic deck analytics (dust cost, USD value, mana curve) — v1.0
- ✓ Deck code import/export (Blizzard format) — v1.0
- ✓ Deck cloning from shared URLs — v1.0
- ✓ AdSense banner ads with FTC disclosure — v1.0
- ✓ Amazon affiliate links for card packs — v1.0
- ✓ Mobile responsive design — v1.0

### Active

(None — awaiting v2 planning)

### Out of Scope

- Real-time multiplayer deck building — Defer to v2 (complexity)
- Native mobile apps — Web-first, mobile responsive only
- Tournament management — Not core to deck building
- Pack opening simulator — Different product
- User accounts — Deferred to v2
- Premium subscriptions — Deferred to v2
- Coaching marketplace — Deferred to v3

### Out of Scope

- Real-time multiplayer deck building — Defer to v2 (complexity)
- Mobile apps — Web-first, mobile responsive only
- Tournament management — Not core to deck building
- Pack opening simulator — Different product

## Context

**Existing codebase:**
- React 16.10 app from 2019 with card search and basic Warlock card grid
- Uses OMGVamp and Blizzard APIs (keys hardcoded, security issue)
- Incomplete drag-and-drop implementation
- No deck persistence, only Warlock class, poor state management
- Outdated dependencies (react-scripts 1.0.17)

**Why rebuild:**
- Original app never finished due to drag-drop complexity
- Want modern stack (Vue 3, Laravel 11, Tailwind CSS)
- Want to build monetization features from ground up
- Learning opportunity with newer technologies

**Target users:**
- Casual Hearthstone players wanting to build decks
- Competitive players wanting analytics and deck sharing
- Pro players wanting to monetize through guides/coaching

## Next Milestone Goals

**v1.1 Planning** — After MVP validation:
- User accounts and authentication
- Cloud deck storage
- Premium subscription tier
- Advanced analytics (win rates, meta data)

## Constraints

- **Tech**: Laravel 12 + Vue 3 + Tailwind CSS — Full stack rewrite shipped
- **Timeline**: Side project, v1.0 shipped in 1 day
- **Budget**: Minimal infra costs (file cache, LocalStorage)
- **APIs**: HearthstoneJSON CDN (cards), Amazon Associates (affiliates), AdSense (ads)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vue 3 + Laravel + Tailwind | Modern stack, want to learn these, good ecosystem | — Pending |
| Full rebuild vs migrate | Existing code too outdated, want clean slate for monetization | — Pending |
| Four revenue streams planned | Ads, affiliates, premium features, coaching marketplace | — Pending |
| Deck persistence required | LocalStorage for MVP, backend later | — Pending |

---
*Last updated: 2026-02-07 after v1.0 milestone*
