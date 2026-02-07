<script setup>
import { computed } from 'vue';
import Modal from './Modal.vue';
import { useDeckStorage } from '../Composables/useDeckStorage.js';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'load-deck', 'delete-deck']);

// Composable
const { savedDecks, deleteDeck: deleteDeckFromStorage } = useDeckStorage();

/**
 * Format date for readable display (e.g., "Feb 7, 2026")
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Handle load button click
 */
function handleLoadDeck(deck) {
  const { data, error } = deserializeDeckForStorage(deck);

  if (error) {
    console.error('Failed to load deck:', error);
    return;
  }

  emit('load-deck', data);
  emit('close');
}

/**
 * Handle delete button click
 */
function handleDeleteDeck(deckId) {
  if (!confirm('Are you sure you want to delete this deck?')) {
    return;
  }

  const { error } = deleteDeckFromStorage(deckId);

  if (error) {
    console.error('Failed to delete deck:', error);
    return;
  }

  emit('delete-deck', deckId);
}

/**
 * Import deserializeDeckFromStorage to get useDeckBuilder format
 */
import { deserializeDeckFromStorage } from '../Utils/deckStorage.js';
</script>

<template>
  <Modal :show="show" @close="emit('close')" maxWidth="2xl">
    <div class="p-6">
      <!-- Header -->
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Saved Decks</h2>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Deck List -->
      <div v-if="savedDecks.length > 0" class="space-y-3">
        <div
          v-for="deck in savedDecks"
          :key="deck.id"
          class="rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100"
        >
          <div class="flex items-center justify-between">
            <!-- Deck Info -->
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">{{ deck.name }}</h3>
              <div class="mt-1 flex items-center gap-3 text-sm text-gray-600">
                <span class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  {{ deck.class }}
                </span>
                <span>{{ deck.cards.reduce((sum, item) => sum + item.count, 0) }} cards</span>
                <span>{{ formatDate(deck.createdAt) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="ml-4 flex gap-2">
              <button
                @click="handleLoadDeck(deck)"
                class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Load
              </button>
              <button
                @click="handleDeleteDeck(deck.id)"
                class="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No saved decks</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by saving your first deck.</p>
      </div>
    </div>
  </Modal>
</template>
