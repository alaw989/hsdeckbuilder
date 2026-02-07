import { describe, it, expect } from 'vitest';
import { validateDeckSize, validateClassRestrictions, validateDuplicateLimits, validateDeck } from './deckValidation';

// Mock card data
const createCard = (id, name, cardClass, rarity, cost = 0) => ({
  id,
  name,
  cardClass,
  rarity,
  cost
});

const createDeckItem = (card, count = 1) => ({ card, count });

describe('validateDeckSize', () => {
  it('returns error for empty deck', () => {
    const result = validateDeckSize([]);
    expect(result.isValid).toBe(false);
    expect(result.count).toBe(0);
    expect(result.errors).toContain('Deck must have exactly 30 cards, has 0');
  });

  it('returns error for deck with fewer than 30 cards', () => {
    const deck = Array.from({ length: 29 }, (_, i) =>
      createDeckItem(createCard(`card_${i}`, `Card ${i}`, 'MAGE', 'COMMON'))
    );
    const result = validateDeckSize(deck);
    expect(result.isValid).toBe(false);
    expect(result.count).toBe(29);
    expect(result.errors).toContain('Deck must have exactly 30 cards, has 29');
  });

  it('returns error for deck with more than 30 cards', () => {
    const deck = Array.from({ length: 31 }, (_, i) =>
      createDeckItem(createCard(`card_${i}`, `Card ${i}`, 'MAGE', 'COMMON'))
    );
    const result = validateDeckSize(deck);
    expect(result.isValid).toBe(false);
    expect(result.count).toBe(31);
    expect(result.errors).toContain('Deck must have exactly 30 cards, has 31');
  });

  it('returns valid for deck with exactly 30 cards', () => {
    const deck = Array.from({ length: 30 }, (_, i) =>
      createDeckItem(createCard(`card_${i}`, `Card ${i}`, 'MAGE', 'COMMON'))
    );
    const result = validateDeckSize(deck);
    expect(result.isValid).toBe(true);
    expect(result.count).toBe(30);
    expect(result.errors).toHaveLength(0);
  });
});

describe('validateClassRestrictions', () => {
  it('returns valid for neutral cards only', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Neutral Card', 'NEUTRAL', 'COMMON'))
    ];
    const result = validateClassRestrictions(deck, 'MAGE');
    expect(result.isValid).toBe(true);
    expect(result.invalidCards).toHaveLength(0);
  });

  it('returns valid for class cards only', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Mage Card', 'MAGE', 'COMMON'))
    ];
    const result = validateClassRestrictions(deck, 'MAGE');
    expect(result.isValid).toBe(true);
    expect(result.invalidCards).toHaveLength(0);
  });

  it('returns valid for mixed class and neutral cards', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Mage Card', 'MAGE', 'COMMON')),
      createDeckItem(createCard('card_2', 'Neutral Card', 'NEUTRAL', 'COMMON'))
    ];
    const result = validateClassRestrictions(deck, 'MAGE');
    expect(result.isValid).toBe(true);
    expect(result.invalidCards).toHaveLength(0);
  });

  it('returns invalid for wrong class card', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Hunter Card', 'HUNTER', 'COMMON'))
    ];
    const result = validateClassRestrictions(deck, 'MAGE');
    expect(result.isValid).toBe(false);
    expect(result.invalidCards).toHaveLength(1);
    expect(result.invalidCards[0].card.name).toBe('Hunter Card');
  });

  it('returns invalid for multiple wrong class cards', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Hunter Card', 'HUNTER', 'COMMON')),
      createDeckItem(createCard('card_2', 'Warrior Card', 'WARRIOR', 'COMMON'))
    ];
    const result = validateClassRestrictions(deck, 'MAGE');
    expect(result.isValid).toBe(false);
    expect(result.invalidCards).toHaveLength(2);
  });
});

describe('validateDuplicateLimits', () => {
  it('returns valid for 1 copy of legendary', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Legendary', 'MAGE', 'LEGENDARY'), 1)
    ];
    const result = validateDuplicateLimits(deck);
    expect(result.isValid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('returns invalid for 2 copies of legendary', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Legendary', 'MAGE', 'LEGENDARY'), 2)
    ];
    const result = validateDuplicateLimits(deck);
    expect(result.isValid).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].card.name).toBe('Legendary');
    expect(result.violations[0].count).toBe(2);
    expect(result.violations[0].max).toBe(1);
  });

  it('returns valid for 2 copies of common', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Common', 'MAGE', 'COMMON'), 2)
    ];
    const result = validateDuplicateLimits(deck);
    expect(result.isValid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('returns invalid for 3 copies of common', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Common', 'MAGE', 'COMMON'), 3)
    ];
    const result = validateDuplicateLimits(deck);
    expect(result.isValid).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].count).toBe(3);
    expect(result.violations[0].max).toBe(2);
  });

  it('returns invalid for 3 copies of rare', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Rare', 'MAGE', 'RARE'), 3)
    ];
    const result = validateDuplicateLimits(deck);
    expect(result.isValid).toBe(false);
    expect(result.violations).toHaveLength(1);
  });

  it('returns invalid for 3 copies of epic', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Epic', 'MAGE', 'EPIC'), 3)
    ];
    const result = validateDuplicateLimits(deck);
    expect(result.isValid).toBe(false);
    expect(result.violations).toHaveLength(1);
  });
});

describe('validateDeck', () => {
  it('returns valid for complete valid deck', () => {
    // Create 30 valid Mage cards (mix of class and neutral)
    const deck = [];
    for (let i = 0; i < 30; i++) {
      const isNeutral = i % 2 === 0;
      deck.push(createDeckItem(
        createCard(`card_${i}`, `Card ${i}`, isNeutral ? 'NEUTRAL' : 'MAGE', 'COMMON'),
        1
      ));
    }
    const result = validateDeck(deck, 'MAGE');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns all errors for invalid deck', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Mage Card', 'MAGE', 'COMMON'), 1),
      createDeckItem(createCard('card_2', 'Legendary', 'MAGE', 'LEGENDARY'), 2), // Too many
      createDeckItem(createCard('card_3', 'Hunter Card', 'HUNTER', 'COMMON'), 1)  // Wrong class
    ];
    const result = validateDeck(deck, 'MAGE');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('returns valid for 30 card deck with 1 legendary and 29 commons', () => {
    const deck = [
      createDeckItem(createCard('card_1', 'Legendary', 'MAGE', 'LEGENDARY'), 1)
    ];
    for (let i = 2; i <= 30; i++) {
      deck.push(createDeckItem(
        createCard(`card_${i}`, `Common ${i}`, 'MAGE', 'COMMON'),
        1
      ));
    }
    const result = validateDeck(deck, 'MAGE');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
