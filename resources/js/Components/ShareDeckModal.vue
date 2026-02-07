<script setup>
import { ref } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  shareUrl: {
    type: String,
    default: ''
  },
  isDisabled: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

const copySuccess = ref(false);
const copied = ref(false);

function closeModal() {
  emit('close');
  copySuccess.value = false;
  copied.value = false;
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.shareUrl);
    copied.value = true;
    copySuccess.value = true;

    // Reset success message after 2 seconds
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy share URL:', error);
    // Fallback: show error to user
    alert('Failed to copy to clipboard. Please copy the URL manually.');
  }
}
</script>

<template>
  <!-- Share deck modal -->
  <div v-if="show"
       class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
       @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Share Your Deck</h3>
        <button @click="closeModal"
                class="text-gray-400 hover:text-gray-500">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p class="text-sm text-gray-500 mb-4">
        Share this URL with others to let them view and use your deck.
      </p>

      <!-- Share URL display -->
      <div class="relative mb-4">
        <textarea
          readonly
          :value="shareUrl"
          class="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-800 resize-none"
          rows="3"
        ></textarea>

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
           class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-green-700">Share URL copied to clipboard!</p>
        </div>
      </div>

      <!-- Close button -->
      <div class="flex justify-end">
        <button @click="closeModal"
                class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
