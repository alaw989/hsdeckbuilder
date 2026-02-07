import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import {
  serializeDeckForStorage,
  deserializeDeckFromStorage,
  generateDeckId
} from '@/Utils/deckStorage';

const STORAGE_KEY = 'hs-saved-decks';

/**
 * Composable for LocalStorage-based deck persistence
 * Uses VueUse's useLocalStorage for SSR safety and cross-tab sync
 *
 * @returns {Object} Deck storage API
 */
export function useDeckStorage() {
  // Reactive saved decks array synced with LocalStorage
  const savedDecks = useLocalStorage(STORAGE_KEY, []);

  /**
   * Save a deck to LocalStorage
   *
   * @param {Object} deckData - { deckCards, deckClass, deckName }
   * @returns {Object} { data: { id, name } | null, error: string | null }
   */
  function saveDeck(deckData) {
    try {
      const { deckCards, deckClass, deckName } = deckData;

      // Validate input
      if (!deckCards || !deckClass) {
        return {
          data: null,
          error: 'Deck cards and class are required'
        };
      }

      // Serialize deck for storage
      const { data: serialized, error: serializeError } = serializeDeckForStorage(
        deckCards,
        deckClass,
        deckName
      );

      if (serializeError) {
        return {
          data: null,
          error: serializeError
        };
      }

      // Add to saved decks
      savedDecks.value.push(serialized);

      return {
        data: {
          id: serialized.id,
          name: serialized.name
        },
        error: null
      };
    } catch (error) {
      console.error('Save deck error:', error);

      // Check for QuotaExceededError
      if (error.name === 'QuotaExceededError') {
        return {
          data: null,
          error: 'LocalStorage is full. Please delete some decks to save more.'
        };
      }

      return {
        data: null,
        error: 'Failed to save deck. Please try again.'
      };
    }
  }

  /**
   * Load a deck from LocalStorage by ID
   *
   * @param {string} id - Deck ID
   * @returns {Object} { data: { class, cards, name } | null, error: string | null }
   */
  function loadDeck(id) {
    try {
      const deck = savedDecks.value.find(d => d.id === id);

      if (!deck) {
        return {
          data: null,
          error: 'Deck not found'
        };
      }

      return deserializeDeckFromStorage(deck);
    } catch (error) {
      console.error('Load deck error:', error);
      return {
        data: null,
        error: 'Failed to load deck'
      };
    }
  }

  /**
   * Delete a deck from LocalStorage
   *
   * @param {string} id - Deck ID
   * @returns {Object} { data: boolean, error: string | null }
   */
  function deleteDeck(id) {
    try {
      const index = savedDecks.value.findIndex(d => d.id === id);

      if (index === -1) {
        return {
          data: false,
          error: 'Deck not found'
        };
      }

      savedDecks.value.splice(index, 1);

      return {
        data: true,
        error: null
      };
    } catch (error) {
      console.error('Delete deck error:', error);
      return {
        data: false,
        error: 'Failed to delete deck'
      };
    }
  }

  /**
   * Update a deck (for rename operations)
   *
   * @param {string} id - Deck ID
   * @param {Object} updates - Fields to update
   * @returns {Object} { data: boolean, error: string | null }
   */
  function updateDeck(id, updates) {
    try {
      const deck = savedDecks.value.find(d => d.id === id);

      if (!deck) {
        return {
          data: false,
          error: 'Deck not found'
        };
      }

      // Update allowed fields
      const allowedUpdates = ['name'];
      for (const key of allowedUpdates) {
        if (updates[key] !== undefined) {
          deck[key] = updates[key];
        }
      }

      deck.updatedAt = new Date().toISOString();

      return {
        data: true,
        error: null
      };
    } catch (error) {
      console.error('Update deck error:', error);
      return {
        data: false,
        error: 'Failed to update deck'
      };
    }
  }

  // Computed property for deck count
  const deckCount = computed(() => savedDecks.value.length);

  return {
    savedDecks,
    saveDeck,
    loadDeck,
    deleteDeck,
    updateDeck,
    deckCount
  };
}
