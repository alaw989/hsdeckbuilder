# Codebase Structure

**Analysis Date:** 2026-02-06

## Directory Layout

```
/home/deck/Sites/hsdeckbuilder/
├── public/              # Static assets
├── src/                # Source code
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## Directory Purposes

**public/:**
- Purpose: Static assets and build destination
- Contains: HTML, images, manifest files
- Key files: `index.html`, `manifest.json`, logo images

**src/:**
- Purpose: React application source code
- Contains: Components, styles, utilities
- Key files: `App.js`, index.js

## Key File Locations

**Entry Points:**
- `/src/index.js`: Application entry point, renders App component
- `/src/App.js`: Main application component with search functionality

**Configuration:**
- `/src/package.json`: Project dependencies and build scripts

**Core Logic:**
- `/src/ClassCardList.js`: Card display and deck management
- `/src/DeckList.js`: Selected cards display
- `/src/CardListContext.js`: Context for state sharing

**Testing:**
- `/src/App.test.js`: Application tests

**Utilities:**
- `/src/Styles.js`: Styled-components definitions
- `/src/Styles.js`: Bootstrap and custom CSS
- `/src/Styles.js`: Utility components

## Naming Conventions

**Files:**
- PascalCase for components: `Header.js`, `CardImg.js`
- camelCase for utility files: `Styles.js`
- kebab-case for CSS: `App.css`, `index.css`

**Directories:**
- All lowercase with kebab-case
- No nested directory structure

## Where to Add New Code

**New Feature:**
- Primary code: `/src/`
- Tests: `/src/*.test.js`

**New Component/Module:**
- Implementation: `/src/[ComponentName].js`
- Styles: `/src/[ComponentName].css` or styled-components in file

**Utilities:**
- Shared helpers: `/src/` alongside existing utilities

## Special Directories

**public/ directory:**
- Purpose: Static assets and build output
- Generated: No (pre-existing assets)
- Committed: Yes

---

*Structure analysis: 2026-02-06*