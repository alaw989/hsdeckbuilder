<script setup>
import { ref } from 'vue';

const emit = defineEmits(['import-deck']);

const deckCodeInput = ref('');
const showInput = ref(false);
const importError = ref(null);

function toggleInput() {
  showInput.value = !showInput.value;
  if (!showInput.value) {
    deckCodeInput.value = '';
    importError.value = null;
  }
}

function handleImport() {
  const code = deckCodeInput.value.trim();

  if (!code) {
    importError.value = 'Please enter a deck code';
    return;
  }

  emit('import-deck', code);
}

function clearError() {
  importError.value = null;
}
</script>

<template>
  <div class="deck-code-import">
    <button @click="toggleInput"
            class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      Import Deck Code
    </button>

    <!-- Import modal -->
    <div v-if="showInput"
         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
         @click.self="toggleInput">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Import Deck Code</h3>
          <button @click="toggleInput"
                  class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p class="text-sm text-gray-500 mb-4">
          Paste a Hearthstone deck code to import. You can find deck codes on sites like Hearthstone Top Decks or Hearthpwn.
        </p>

        <!-- Error message -->
        <div v-if="importError"
             class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start">
            <svg class="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-red-700">{{ importError }}</p>
          </div>
        </div>

        <!-- Input -->
        <textarea
          v-model="deckCodeInput"
          @input="clearError"
          placeholder="AAECAf0EArrsA乓\x30..."
          class="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        ></textarea>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 mt-4">
          <button @click="toggleInput"
                  class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500">
            Cancel
          </button>
          <button @click="handleImport"
                  :disabled="!deckCodeInput.trim()"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Import Deck
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
