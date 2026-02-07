<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  deckCode: {
    type: String,
    default: ''
  },
  isDisabled: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['copy-deck-code']);

const showExportModal = ref(false);
const copySuccess = ref(false);
const copied = ref(false);

// Format deck code for display (with line breaks)
const formattedDeckCode = computed(() => {
  if (!props.deckCode) return '';

  // Split into chunks of 20 characters
  const chunks = [];
  for (let i = 0; i < props.deckCode.length; i += 20) {
    chunks.push(props.deckCode.slice(i, i + 20));
  }

  return chunks.join('\n');
});

function openExportModal() {
  if (props.isDisabled) return;
  showExportModal.value = true;
  copySuccess.value = false;
  copied.value = false;
}

function closeExportModal() {
  showExportModal.value = false;
  copySuccess.value = false;
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.deckCode);
    copied.value = true;
    copySuccess.value = true;

    // Reset success message after 2 seconds
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);

    emit('copy-deck-code', props.deckCode);
  } catch (error) {
    console.error('Failed to copy deck code:', error);
  }
}
</script>

<template>
  <div class="deck-code-export">
    <button @click="openExportModal"
            :disabled="isDisabled"
            class="w-full flex items-center justify-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium transition-colors"
            :class="isDisabled
              ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
              : 'border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100'">
      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      {{ isDisabled ? 'Finish Deck to Export' : 'Copy Deck Code' }}
    </button>

    <!-- Export modal -->
    <div v-if="showExportModal"
         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
         @click.self="closeExportModal">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Your Deck Code</h3>
          <button @click="closeExportModal"
                  class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p class="text-sm text-gray-500 mb-4">
          Copy this deck code and paste it into Hearthstone to import your deck.
        </p>

        <!-- Deck code display -->
        <div class="relative">
          <pre class="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap break-all">{{ formattedDeckCode }}</pre>

          <!-- Copy button overlay -->
          <button @click="copyToClipboard"
                  class="absolute top-2 right-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Copy to clipboard">
            <svg v-if="!copied" class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Success message -->
        <div v-if="copySuccess"
             class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-green-700">Deck code copied to clipboard!</p>
          </div>
        </div>

        <!-- Close button -->
        <div class="flex justify-end mt-4">
          <button @click="closeExportModal"
                  class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
