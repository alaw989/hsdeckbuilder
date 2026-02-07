# External Integrations

**Analysis Date:** 2026-02-06

## APIs & External Services

**Hearthstone APIs:**
- OMGVamp Hearthstone API (Mashape/RapidAPI)
  - Endpoint: `https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/{card}`
  - SDK: unirest + rapidapi-connect
  - Auth: X-Mashape-Key header
  - Usage: `src/App.js` (lines 53-55, 98-100, 145-147)
  - Purpose: Card search functionality
  - API Key: Hardcoded in source

- Blizzard Hearthstone API
  - Endpoint: `https://us.api.blizzard.com/hearthstone/cards`
  - SDK: axios
  - Auth: Access token in URL parameter
  - Usage: `src/ClassCardList.js` (line 28)
  - Purpose: Fetch class-specific cards
  - Access Token: Hardcoded in source

## Data Storage

**Databases:**
- No databases detected
- Local state management only

**File Storage:**
- Local filesystem only
- Images: External URLs via Blizzard API

**Caching:**
- No caching layer detected
- React component state only

## Authentication & Identity

**Auth Provider:**
- Custom authentication
  - No user authentication system detected
  - API keys hardcoded in source code

## Monitoring & Observability

**Error Tracking:**
- No error tracking service detected
- Console.error for debugging

**Logs:**
- Console.log throughout application
  - Usage: `src/App.js`, `src/ClassCardList.js`, `src/DeckList.js`
  - No structured logging

## CI/CD & Deployment

**Hosting:**
- No deployment configuration detected
- Create React App build output for static deployment

**CI Pipeline:**
- No CI configuration detected
- Manual build process likely

## Environment Configuration

**Required env vars:**
- None detected (API keys hardcoded in source)

**Secrets location:**
- Hardcoded in source files (security concern)
  - `src/App.js`: X-Mashape-Key
  - `src/ClassCardList.js`: Blizzard access token

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Image Services

**External Images:**
- Blizzard CDN for card images
  - Endpoints: `https://static.zampolit.com/hearthstone/cards` (from image URLs)
  - Usage: `src/ClassCardList.js` for card images
  - Purpose: Displaying Hearthstone card artwork

---

*Integration audit: 2026-02-06*
*External APIs: 2 (OMGVamp, Blizzard)*
*Authentication: None (hardcoded keys)*
*Data storage: Client-side only*
*Security concern: API keys in source code*