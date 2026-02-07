<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  suggestedName: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);

const deckName = ref(props.suggestedName);
const nameInput = ref(null);

// Focus input when modal opens
watch(() => props.show, async (isOpen) => {
  if (isOpen) {
    deckName.value = props.suggestedName;
    await nextTick();
    nameInput.value?.focus();
    nameInput.value?.select();
  }
});

function handleConfirm() {
  if (!deckName.value.trim()) {
    return;
  }
  emit('confirm', { name: deckName.value.trim() });
}

function handleKeydown(event) {
  if (event.key === 'Enter') {
    handleConfirm();
  } else if (event.key === 'Escape') {
    emit('close');
  }
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    emit('close');
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="handleBackdropClick"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Clone This Deck
        </h2>
        <p class="text-sm text-gray-600 mb-4">
          Save this deck to your collection
        </p>

        <!-- Deck name input -->
        <div class="mb-6">
          <label for="deck-name" class="block text-sm font-medium text-gray-700 mb-2">
            Deck Name
          </label>
          <input
            ref="nameInput"
            id="deck-name"
            v-model="deckName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter deck name..."
            @keydown="handleKeydown"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            @click="handleConfirm"
            :disabled="!deckName.trim()"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clone to My Decks
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
