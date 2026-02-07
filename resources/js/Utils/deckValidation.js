export function validateDeckSize(deckCards) {
  return { isValid: false, count: 0, errors: ['Not implemented'] };
}

export function validateClassRestrictions(deckCards, selectedClass) {
  return { isValid: false, invalidCards: [] };
}

export function validateDuplicateLimits(deckCards) {
  return { isValid: false, violations: [] };
}

export function validateDeck(deckCards, selectedClass) {
  return { isValid: false, errors: ['Not implemented'] };
}
