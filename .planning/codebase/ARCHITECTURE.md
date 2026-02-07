# Architecture

**Analysis Date:** 2026-02-06

## Pattern Overview

**Overall:** Layered React Application with Context API

**Key Characteristics:**
- Component-based architecture with clear separation of concerns
- Context API for state management between sibling components
- Fetch-based data retrieval from external APIs
- Styled-components for CSS-in-JS styling

## Layers

**Presentation Layer:**
- Purpose: UI components and user interactions
- Location: `/src/`
- Contains: React components for UI rendering
- Depends on: Context state and props
- Used by: ReactDOM for rendering

**Data Layer:**
- Purpose: API integration and data transformation
- Location: `/src/App.js`, `/src/ClassCardList.js`
- Contains: API calls, data filtering, and state management
- Depends on: External APIs (OMG API, Blizzard API)
- Used by: Presentation layer for data display

**Context Layer:**
- Purpose: State sharing between components
- Location: `/src/CardListContext.js`
- Contains: React Context definition
- Depends on: React createContext
- Used by: ClassCardList and DeckList components

**Styling Layer:**
- Purpose: Component styling theming
- Location: `/src/Styles.js`, `/src/` CSS files
- Contains: Styled-components and CSS
- Depends on: Styled-components library
- Used by: All visual components

## Data Flow

**Card Search Flow:**

1. User types in search field (AsyncTypeahead)
2. App.js calls OMG Vamp API with card name
3. API returns card data
4. App.js filters results (removes non-collectible cards, heroes, etc.)
5. Card data stored in component state
6. CardTitle, CardImg, CardContent components display data

**Deck Building Flow:**

1. ClassCardList fetches Warlock cards from Blizzard API
2. Cards are filtered and mapped to simplified format
3. User clicks card image
4. Card data added to card_obj array
5. Context Provider passes updated data to DeckList
6. DeckList displays selected cards

**State Management:**
- Local component state for search results
- Context API for shared deck state
- Global counter variable for temporary data storage

## Key Abstractions

**Card Data Object:**
- Purpose: Standardized card representation
- Examples: `ClassCardList.js`, lines 50-58
- Pattern: Object with image, name, cardSetId, cropImage, id properties

**API Integration:**
- Purpose: Centralized external API calls
- Examples: `App.js` lines 47-79, 95-124
- Pattern: unirest GET requests with error handling

**Context Provider:**
- Purpose: State sharing between unrelated components
- Examples: `ClassCardList.js` lines 105-107
- Pattern: Context Provider wrapping child components

## Entry Points

**Application Entry:**
- Location: `/src/index.js`
- Triggers: ReactDOM.render for app initialization
- Responsibilities: Bootstrap React app, import global styles

**Component Entry:**
- Location: `/src/App.js`
- Triggers: User interactions and API calls
- Responsibilities: Main app logic, search functionality, routing

**Deck Builder Entry:**
- Location: `/src/ClassCardList.js`
- Triggers: Component mount and card selection
- Responsibilities: Card display, deck management

## Error Handling

**Strategy:** Basic console logging

**Patterns:**
- unirest error handling with result.error check
- API response validation
- Try-catch not implemented for async operations

## Cross-Cutting Concerns

**Logging:** Console.log for debugging and API response tracking
**Validation:** Data filtering for card validity
**Styling:** Styled-components with CSS fallbacks

---

*Architecture analysis: 2026-02-06*