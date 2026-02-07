import { exportDeckCode } from './deckCode.js';

/**
 * Generate unique deck ID using timestamp + random string
 * Format: "{timestamp}-{random9chars}"
 *
 * @returns {string} Unique deck identifier
 */
export function generateDeckId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${timestamp}-${random}`;
}

/**
 * Serialize deck data for LocalStorage storage
 * Stores full card data for offline display and compact deckCode for efficiency
 *
 * @param {Array} deckCards - Array of { card, count } objects
 * @param {string} deckClass - Selected deck class
 * @param {string} deckName - Custom deck name
 * @returns {Object} { data: Object|null, error: string|null }
 */
export function serializeDeckForStorage(deckCards, deckClass, deckName) {
  try {
    // Generate compact deck code
    const { deckCode, error: deckCodeError } = exportDeckCode(deckCards, deckClass);

    if (deckCodeError) {
      return {
        data: null,
        error: deckCodeError
      };
    }

    const now = new Date().toISOString();

    // Store full card data for offline display (LocalStorage has 5-10MB capacity)
    const serialized = {
      id: generateDeckId(),
      name: deckName || `Untitled ${deckClass} Deck`,
      class: deckClass,
      deckCode, // Compact representation
      cards: deckCards, // Full data for offline display
      createdAt: now,
      updatedAt: now
    };

    return {
      data: serialized,
      error: null
    };
  } catch (error) {
    console.error('Deck serialization error:', error);
    return {
      data: null,
      error: 'Failed to serialize deck data'
    };
  }
}

/**
 * Deserialize deck data from storage format for useDeckBuilder
 *
 * @param {Object} savedDeck - Deck object from LocalStorage
 * @returns {Object} { data: Object|null, error: string|null }
 *                   data contains { class, cards, name } for loading
 */
export function deserializeDeckFromStorage(savedDeck) {
  try {
    if (!savedDeck || !savedDeck.cards) {
      return {
        data: null,
        error: 'Invalid saved deck data'
      };
    }

    // Return format compatible with useDeckBuilder
    const deserialized = {
      class: savedDeck.class,
      cards: savedDeck.cards, // Array of { card, count }
      name: savedDeck.name
    };

    return {
      data: deserialized,
      error: null
    };
  } catch (error) {
    console.error('Deck deserialization error:', error);
    return {
      data: null,
      error: 'Failed to deserialize deck data'
    };
  }
}
