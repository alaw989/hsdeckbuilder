# Codebase Concerns

**Analysis Date:** 2026-02-06

## Security Vulnerabilities

**Hardcoded API Keys:**
- Issue: API keys are hardcoded in source code
- Files: `src/App.js` (lines 54, 99, 146), `src/ClassCardList.js` (line 28)
- Impact: Keys exposed in version control, potential API abuse
- Fix approach: Move to environment variables, use .env.local

**React Scripts Vulnerability:**
- Issue: Using outdated `react-scripts@1.0.17` (2019)
- Files: `package.json` (line 16)
- Impact: Multiple security vulnerabilities, outdated tooling
- Fix approach: Upgrade to Create React App latest or Vite

## Tech Debt

**Duplicate Code:**
- Issue: Identical filtering logic repeated 3 times in App.js
- Files: `src/App.js` (lines 62-71, 107-115, 157-164)
- Impact: Maintenance burden, inconsistent filtering
- Fix approach: Extract to utility function, centralize filtering rules

**Global Variable Usage:**
- Issue: `counter` variable declared globally but scoped to App component
- Files: `src/App.js` (line 33, 72, 117)
- Impact: Potential memory leaks, unclear state management
- Fix approach: Remove global variable, use state properly

**Inline Style Logic:**
- Issue: Filtering logic mixed with API calls in multiple places
- Files: `src/App.js`, `src/ClassCardList.js`
- Impact: Difficult to maintain and test
- Fix approach: Separate concerns, create filtering utilities

## Performance Issues

**Unnecessary Rerenders:**
- Issue: Multiple state updates causing excessive rerenders
- Files: `src/App.js` (setState in multiple handlers)
- Impact: Poor user experience, wasted resources
- Fix approach: Batch state updates, use memoization

**Inefficient Deck List Updates:**
- Issue: DeckList re-renders on every card click
- Files: `src/DeckList.js` (lines 16-38)
- Impact: UI lag when building decks
- Fix approach: Optimize with React.memo, separate count logic

**API Over-usage:**
- Issue: Multiple API calls for same data
- Files: `src/ClassCardList.js` (line 26), `src/App.js` (lines 50, 95, 142)
- Impact: Rate limiting risk, poor performance
- Fix approach: Implement caching, deduplicate requests

## Fragile Areas

**Context State Management:**
- Issue: CardListContext uses array for state, mutations directly
- Files: `src/ClassCardList.js` (lines 83-85), `src/DeckList.js` (lines 11-13)
- Impact: Unpredictable state updates, difficult debugging
- Fix approach: Use proper context state management

**Hardcoded Magic Numbers:**
- Issue: Card Set IDs hardcoded throughout code
- Files: `src/ClassCardList.js` (lines 36-48)
- Impact: Maintenance burden when new sets added
- Fix approach: Create constant configuration file

**External API Dependencies:**
- Issue: Direct API calls without error handling
- Files: `src/ClassCardList.js` (line 28), `src/App.js` (lines 50, 95, 142)
- Impact: App breaks if API fails or changes
- Fix approach: Add error boundaries, implement fallback UI

## Testing Gaps

**Missing Test Coverage:**
- Issue: Only one test file exists, no functional tests
- Files: `src/App.test.js`
- Impact: Poor confidence in changes, regression risk
- Fix approach: Implement Jest tests for all components and utilities

**Manual Debugging Code:**
- Issue: Console.log statements throughout production code
- Files: `src/App.js` (lines 58, 60, 103, 105, 150, 152), `src/ClassCardList.js` (lines 32, 68), `src/DeckList.js` (lines 25, 34)
- Impact: Performance impact, poor user experience
- Fix approach: Replace with proper logging framework

## Scaling Limits

**Single Class Limitation:**
- Issue: Only warlock cards supported, hardcoded
- Files: `src/ClassCardList.js` (lines 11-21, 28)
- Impact: Cannot expand to other classes
- Fix approach: Make class selection dynamic

**No Persistence Layer:**
- Issue: Deck data lost on refresh
- Files: `src/DeckList.js`
- Impact: User data not preserved
- Fix approach: Implement localStorage or backend storage

## Dependencies at Risk

**Outdated Dependencies:**
- Issue: Multiple deprecated packages in use
- Files: `package.json`
- Impact: Security vulnerabilities, compatibility issues
- Fix approach: Update or replace:
  - `unirest@0.6.0` → `axios` or `fetch`
  - `react-scripts@1.0.17` → latest
  - `rapidapi-connect@0.0.6` → modern alternative

## Code Quality Issues

**Inconsistent Error Handling:**
- Issue: Different error handling patterns in different components
- Files: `src/App.js`, `src/ClassCardList.js`
- Impact: Unreliable error reporting
- Fix approach: Standardize error handling approach

**Unnecessary Comments:**
- Issue: Commented code that should be removed
- Files: `src/ClassCardList.js` (line 60), `src/DeckList.js` (lines 6-7, 15)
- Impact: Code clutter, confusion
- Fix approach: Remove dead code and comments

*Concerns audit: 2026-02-06*