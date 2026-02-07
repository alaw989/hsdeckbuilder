# Coding Conventions

**Analysis Date:** 2026-02-06

## Naming Patterns

**Files:**
- MixedCase for components (e.g., `CardTitle.js`, `CardContent.js`)
- camelCase for utility functions and variables
- PascalCase for class components
- CSS files use kebab-case (e.g., `App.css`, `DeckList.css`)

**Functions:**
- Class methods use camelCase (e.g., `handleAction`, `handleClick`)
- Function components use camelCase (e.g., `ClassCardList`)
- Helper functions use camelCase (e.g., `getData`, `doSomething`)

**Variables:**
- Local variables use camelCase (e.g., `cardInfo`, `items`)
- Constants use PascalCase (e.g., `AsyncTypeahead`, `AppContents`)
- State variables use camelCase (e.g., `warlockCards`, `warlockList`)
- Module-level variables use camelCase (e.g., `counter`, `card_obj`)

**Types:**
- No TypeScript detected - JavaScript only
- PropTypes not used for type checking

## Code Style

**Formatting:**
- No automated formatter detected
- No linter detected
- Inconsistent spacing in some files
- Mixed single and double quotes for strings

**Linting:**
- No ESLint configuration found
- No Prettier configuration found
- No automated code quality checks

## Import Organization

**Order:**
1. React imports always first
2. Third-party imports second
3. Local imports last
4. Groups separated by blank lines

**Path Aliases:**
- No path aliases configured
- Relative imports used throughout (e.g., `./CardImg.js`, `./CardTitle.js`)

## Error Handling

**Patterns:**
- Basic try-catch not used in API calls
- Promise errors handled with `.catch()`
- Console logging for error tracking
- No centralized error handling
- No error boundaries implemented

## Logging

**Framework:** console.log

**Patterns:**
- Debug logging in production code (e.g., `console.log("GET response", result.error)`)
- No structured logging
- No logging levels implemented
- Comments suggest some logging was intentionally removed

## Comments

**When to Comment:**
- Minimal commenting throughout codebase
- Some commented-out code preserved
- Inline comments for complex logic (e.g., filter conditions)

**JSDoc/TSDoc:**
- No JSDoc comments detected
- No function documentation
- No component prop documentation

## Function Design

**Size:** Functions vary significantly in size
- Some functions are very large (e.g., `App.js` methods)
- Others are small and focused (e.g., `CardListContext.js`)

**Parameters:** Mixed patterns
- Some functions use destructuring
- Others use direct parameter access
- No consistent parameter validation

**Return Values:** Inconsistent patterns
- Some functions return values
- Others use side effects
- No consistent return type expectations

## Module Design

**Exports:**
- Default exports used for most components
- Named exports for context and utility functions
- No re-exports pattern observed

**Barrel Files:** Not used
- No index files for organizing exports
- Direct imports from individual files

---

*Convention analysis: 2026-02-06*