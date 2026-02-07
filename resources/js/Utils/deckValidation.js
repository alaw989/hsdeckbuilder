/**
 * Hearthstone Deck Validation
 *
 * Implements official Hearthstone deck construction rules:
 * - Exactly 30 cards
 * - Only class cards + neutral cards
 * - Max 1 copy of each Legendary
 * - Max 2 copies of all other cards
 */

/**
 * Validates deck has exactly 30 cards (CORE-05)
 */
export function validateDeckSize(deckCards) {
  const count = deckCards.reduce((sum, item) => sum + item.count, 0);
  const errors = [];

  if (count !== 30) {
    errors.push(`Deck must have exactly 30 cards, has ${count}`);
  }

  return {
    isValid: count === 30,
    count,
    errors
  };
}

/**
 * Validates deck contains only cards from selected class or neutral (CORE-06)
 */
export function validateClassRestrictions(deckCards, selectedClass) {
  const invalidCards = [];
  const targetClass = selectedClass?.toUpperCase() || 'NEUTRAL';

  for (const item of deckCards) {
    const cardClass = item.card.cardClass?.toUpperCase() || 'NEUTRAL';

    if (cardClass !== 'NEUTRAL' && cardClass !== targetClass) {
      invalidCards.push({
        card: item.card,
        count: item.count,
        expectedClass: targetClass,
        actualClass: cardClass
      });
    }
  }

  return {
    isValid: invalidCards.length === 0,
    invalidCards,
    errors: invalidCards.map(ic =>
      `${ic.card.name} is a ${ic.actualClass} card (deck is ${ic.expectedClass})`
    )
  };
}

/**
 * Validates duplicate limits (1 Legendary, 2 others)
 */
export function validateDuplicateLimits(deckCards) {
  const violations = [];

  for (const item of deckCards) {
    const rarity = item.card.rarity?.toUpperCase() || 'FREE';
    const maxCopies = rarity === 'LEGENDARY' ? 1 : 2;

    if (item.count > maxCopies) {
      violations.push({
        card: item.card,
        count: item.count,
        max: maxCopies,
        rarity
      });
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    errors: violations.map(v =>
      `${v.card.name} has ${v.count} copies, max ${v.max} for ${v.rarity}`
    )
  };
}

/**
 * Complete deck validation - runs all checks
 */
export function validateDeck(deckCards, selectedClass) {
  const sizeValidation = validateDeckSize(deckCards);
  const classValidation = validateClassRestrictions(deckCards, selectedClass);
  const duplicateValidation = validateDuplicateLimits(deckCards);

  const errors = [
    ...sizeValidation.errors,
    ...classValidation.errors,
    ...duplicateValidation.errors
  ];

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [], // Future: format warnings, etc.
    validations: {
      size: sizeValidation,
      class: classValidation,
      duplicates: duplicateValidation
    },
    deckCount: sizeValidation.count
  };
}
