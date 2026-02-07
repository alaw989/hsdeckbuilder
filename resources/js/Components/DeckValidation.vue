<script setup>
import { computed } from 'vue';
import { validateDeck } from '../Utils/deckValidation';

const props = defineProps({
  deckCards: {
    type: Array,
    required: true
  },
  selectedClass: {
    type: String,
    default: 'NEUTRAL'
  }
});

const validation = computed(() =>
  validateDeck(props.deckCards, props.selectedClass)
);

const isValid = computed(() => validation.value.isValid);
const errorCount = computed(() => validation.value.errors.length);
const deckCount = computed(() => validation.value.deckCount || 0);

const isComplete = computed(() => deckCount.value === 30);
const hasErrors = computed(() => !isValid.value);
</script>

<template>
  <div class="deck-validation">
    <!-- Status badge -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-700">Deck Status</h3>
      <span v-if="isValid"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Valid
      </span>
      <span v-else
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        Invalid
      </span>
    </div>

    <!-- Progress bar -->
    <div class="mb-3">
      <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>Cards</span>
        <span>{{ deckCount }}/30</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="h-2 rounded-full transition-all duration-300"
             :class="isComplete ? 'bg-green-500' : 'bg-blue-500'"
             :style="{ width: `${Math.min((deckCount / 30) * 100, 100)}%` }">
        </div>
      </div>
    </div>

    <!-- Error list -->
    <div v-if="hasErrors" class="space-y-2">
      <h4 class="text-xs font-semibold text-red-600 uppercase tracking-wide">
        {{ errorCount }} Issue{{ errorCount > 1 ? 's' : '' }}
      </h4>
      <ul class="space-y-1">
        <li v-for="(error, index) in validation.errors" :key="index"
            class="flex items-start text-xs text-red-600">
          <svg class="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ error }}</span>
        </li>
      </ul>
    </div>

    <!-- Success message -->
    <div v-else-if="isComplete" class="mt-2 p-2 bg-green-50 rounded border border-green-200">
      <div class="flex items-center text-xs text-green-700">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Deck is valid and ready to export!
      </div>
    </div>
  </div>
</template>
