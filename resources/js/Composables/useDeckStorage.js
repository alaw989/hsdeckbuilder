import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import { serializeDeckForStorage, deserializeDeckFromStorage } from '../Utils/deckStorage.js';

const STORAGE_KEY = 'hs-saved-decks';

/**
 * Vue 3 composable for reactive LocalStorage deck management
 * Provides CRUD operations for saved decks with automatic persistence
 */
export function useDeckStorage() {
  // Reactive saved decks array with automatic LocalStorage sync
  const savedDecks = useLocalStorage(STORAGE_KEY, []);

  /**
   * Save current deck to LocalStorage
   *
   * @param {Object} deckData - { cards, class, name }
   * @returns {Object} { data: string|null (deck ID), error: string|null }
   */
  function saveDeck(deckData) {
    try {
      const { cards, class: deckClass, name } = deckData;

      // Serialize deck for storage
      const { data: serialized, error } = serializeDeckForStorage(
        cards,
        deckClass,
        name
      );

      if (error) {
        return { data: null, error };
      }

      // Add to saved decks array (triggers LocalStorage update)
      savedDecks.value.push(serialized);

      return { data: serialized.id, error: null };
    } catch (error) {
      // Handle QuotaExceededError for LocalStorage full
      if (error.name === 'QuotaExceededError') {
        return {
          data: null,
          error: 'Storage full. Please delete some saved decks to save more.'
        };
      }

      console.error('Save deck error:', error);
      return {
        data: null,
        error: 'Failed to save deck'
      };
    }
  }

  /**
   * Load deck by ID from LocalStorage
   *
   * @param {string} deckId - Deck ID to load
   * @returns {Object} { data: Object|null, error: string|null }
   *                   data contains { class, cards, name }
   */
  function loadDeck(deckId) {
    try {
      const deck = savedDecks.value.find(d => d.id === deckId);

      if (!deck) {
        return {
          data: null,
          error: 'Deck not found'
        };
      }

      // Deserialize to useDeckBuilder format
      const { data, error } = deserializeDeckFromStorage(deck);

      return { data, error };
    } catch (error) {
      console.error('Load deck error:', error);
      return {
        data: null,
        error: 'Failed to load deck'
      };
    }
  }

  /**
   * Delete deck by ID from LocalStorage
   *
   * @param {string} deckId - Deck ID to delete
   * @returns {Object} { data: boolean, error: string|null }
   */
  function deleteDeck(deckId) {
    try {
      const index = savedDecks.value.findIndex(d => d.id === deckId);

      if (index === -1) {
        return {
          data: false,
          error: 'Deck not found'
        };
      }

      // Remove from array (triggers LocalStorage update)
      savedDecks.value.splice(index, 1);

      return { data: true, error: null };
    } catch (error) {
      console.error('Delete deck error:', error);
      return {
        data: false,
        error: 'Failed to delete deck'
      };
    }
  }

  /**
   * Update existing deck (e.g., rename)
   *
   * @param {string} deckId - Deck ID to update
   * @param {Object} updates - Fields to update (e.g., { name: 'New Name' })
   * @returns {Object} { data: boolean, error: string|null }
   */
  function updateDeck(deckId, updates) {
    try {
      const deck = savedDecks.value.find(d => d.id === deckId);

      if (!deck) {
        return {
          data: false,
          error: 'Deck not found'
        };
      }

      // Update fields
      Object.assign(deck, updates, { updatedAt: new Date().toISOString() });

      return { data: true, error: null };
    } catch (error) {
      console.error('Update deck error:', error);
      return {
        data: false,
        error: 'Failed to update deck'
      };
    }
  }

  // Computed: count of saved decks
  const deckCount = computed(() => savedDecks.value.length);

  return {
    savedDecks,
    deckCount,
    saveDeck,
    loadDeck,
    deleteDeck,
    updateDeck
  };
}
