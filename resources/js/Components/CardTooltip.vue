<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  card: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close']);

const tooltipRef = ref(null);
const position = ref({ top: '0px', left: '0px' });
const isMobile = ref(false);
const showModal = ref(false);

// Detect mobile
const checkMobile = () => {
    isMobile.value = typeof window !== 'undefined' && window.innerWidth < 768;
}

// Calculate position to keep tooltip in viewport
const calculatedPosition = computed(() => {
  if (typeof window === 'undefined') {
    return { top: `${props.y}px`, left: `${props.x}px` };
  }

  const tooltipWidth = 256; // Card image width
  const tooltipHeight = 380; // Approximate card height

  let left = props.x + 15;
  let top = props.y - 10;

  // Prevent overflow on right
  if (left + tooltipWidth > window.innerWidth - 20) {
    left = props.x - tooltipWidth - 15;
  }

  // Prevent overflow on bottom
  if (top + tooltipHeight > window.innerHeight - 20) {
    top = window.innerHeight - tooltipHeight - 20;
  }

  // Prevent overflow on top
  if (top < 10) {
    top = 10;
  }

  return { top: `${top}px`, left: `${left}px` };
});

const rarityColor = computed(() => {
  const colors = {
    FREE: 'from-gray-400 to-gray-500',
    COMMON: 'from-gray-400 to-gray-500',
    RARE: 'from-blue-400 to-blue-600',
    EPIC: 'from-purple-400 to-purple-600',
    LEGENDARY: 'from-orange-400 to-orange-600'
  };
  return colors[props.card?.rarity] || colors.FREE;
});

const classIcon = computed(() => {
  // Could return class icon URLs in the future
  return null;
});

function handleEscape(e) {
  if (e.key === 'Escape') {
    emit('close');
  }
}

function closeModal() {
    showModal.value = false;
    emit('close');
}

function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
        closeModal();
    }
}

// Watch for card changes to show modal on mobile
watch(() => props.show, (newVal) => {
    if (newVal && isMobile.value) {
        showModal.value = true;
    }
});

onMounted(() => {
  checkMobile();
  if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
  }
  document.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
      window.removeEventListener('resize', checkMobile);
  }
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <!-- Desktop tooltip (existing behavior) -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="show && card && !isMobile"
           ref="tooltipRef"
           class="fixed z-50 pointer-events-none"
           :style="calculatedPosition">
        <div class="relative">
          <!-- Card image -->
          <img
            :srcset="`
              https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png 1x,
              https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${card.id}.png 2x
            `"
            :src="`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`"
            :alt="card.name"
            class="w-64 rounded-lg shadow-2xl"
            loading="eager"
          />

          <!-- Overlay info -->
          <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
            <p class="text-white text-sm font-medium">{{ card.name }}</p>
            <div class="flex items-center space-x-2 mt-1">
              <span class="text-xs text-gray-300">{{ card.cardClass }}</span>
              <span class="text-gray-500">•</span>
              <span class="text-xs" :class="rarityColor">{{ card.rarity }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showModal && card && isMobile"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
           @click="handleBackdropClick">
        <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden relative">
          <!-- Close button -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            aria-label="Close">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Card image -->
          <img
            :srcset="`
              https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png 1x,
              https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${card.id}.png 2x
            `"
            :src="`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`"
            :alt="card.name"
            class="w-full"
          />

          <!-- Card info -->
          <div class="p-4 bg-gray-900 text-white">
            <h3 class="text-lg font-semibold">{{ card.name }}</h3>
            <div class="flex items-center justify-between mt-2 text-sm">
              <span class="text-gray-300">{{ card.cardClass }}</span>
              <span class="px-2 py-1 rounded text-xs font-medium"
                    :class="{
                      'bg-orange-500': card.rarity === 'LEGENDARY',
                      'bg-purple-500': card.rarity === 'EPIC',
                      'bg-blue-500': card.rarity === 'RARE',
                      'bg-gray-500': ['FREE', 'COMMON'].includes(card.rarity)
                    }">
                {{ card.rarity }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
