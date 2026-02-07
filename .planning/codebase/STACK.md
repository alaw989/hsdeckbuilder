# Technology Stack

**Analysis Date:** 2026-02-06

## Languages

**Primary:**
- JavaScript ES6+ - Throughout the application in `src/` directory
- JSX - React components in `src/` directory

## Runtime

**Environment:**
- Node.js - Development and production runtime
- React Scripts v1.0.17 - Build tool and development server

**Package Manager:**
- npm - Package management
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- React 16.10.2 - UI framework
  - Entry point: `src/index.js`
  - Main component: `src/App.js`

**UI Components:**
- Bootstrap 3.4.1 - CSS framework
- React-bootstrap 1.0.0-beta.14 - Bootstrap components for React
- React-bootstrap-typeahead 2.0.0 - Typeahead component
- jQuery 3.4.1 - DOM manipulation library
- Popper.js 1.15.0 - Tooltip/popup library

**Styling:**
- Styled-components 2.2.3 - CSS-in-JS styling
  - Usage: `src/Styles.js`, `src/App.js`

**Testing:**
- Jest - Testing framework (via react-scripts test)
- React Scripts testing utilities

**Build/Dev:**
- Create React App - Development environment
  - Scripts: `start`, `build`, `test`, `eject`
  - Service Worker: `src/registerServiceWorker.js`

## Key Dependencies

**Critical:**
- axios 0.19.0 - HTTP client for API requests
  - Usage: `src/ClassCardList.js`
- unirest 0.6.0 - HTTP client for API requests
  - Usage: `src/App.js`
- rapidapi-connect 0.0.6 - RapidAPI client library
- ramda 0.25.0 - Functional programming library

## Configuration

**Environment:**
- No environment-specific configuration files detected
- API keys hardcoded in source files
- React Scripts configuration built into tooling

**Build:**
- Create React App default configuration
- Manifest file: `public/manifest.json`

## Platform Requirements

**Development:**
- Node.js runtime
- npm package manager

**Production:**
- Web browser supporting ES6+
- Static web server (any HTTP server)

---

*Stack analysis: 2026-02-06*
*Runtime dependencies: 17 packages
*Build tool: Create React App v1.0.17*
*Framework: React 16.10.2 with Bootstrap UI*
*HTTP clients: axios 0.19.0, unirest 0.6.0*