# Hearthstone Deck Builder Platform

## What This Is

A modern Hearthstone deck builder and community platform. Users search cards, build decks with drag-and-drop, share decks, and access premium analytics and guides. The platform aims to generate revenue through ads, affiliate links, premium subscriptions, and a coaching marketplace.

## Core Value

Deck builders can easily construct, optimize, and share Hearthstone decks with visual drag-and-drop—while discovering ways to improve their gameplay through analytics and expert guides.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Card search with autocomplete across all Hearthstone cards
- [ ] Drag-and-drop deck construction with card positioning
- [ ] Visual deck list with mana curve display
- [ ] Deck sharing via unique URLs
- [ ] Class selection (all 11 classes, not just Warlock)
- [ ] Deck persistence (save/load decks)
- [ ] Basic deck analytics (dust cost, card count by mana)
- [ ] User accounts (authentication)
- [ ] Deck cloning from shared URLs

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

## Constraints

- **Tech**: Vue 3 + Laravel 11 + Tailwind CSS — Full stack rewrite chosen
- **Timeline**: Side project, no deadline — Learning pace acceptable
- **Budget**: Personal project, minimal infra costs initially
- **APIs**: Hearthstone Blizzard API (free tier), may need backup data source

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vue 3 + Laravel + Tailwind | Modern stack, want to learn these, good ecosystem | — Pending |
| Full rebuild vs migrate | Existing code too outdated, want clean slate for monetization | — Pending |
| Four revenue streams planned | Ads, affiliates, premium features, coaching marketplace | — Pending |
| Deck persistence required | LocalStorage for MVP, backend later | — Pending |

---
*Last updated: 2026-02-06 after initialization*
