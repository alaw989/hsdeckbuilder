<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

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

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="show && card"
           ref="tooltipRef"
           class="fixed z-50 pointer-events-none"
           :style="calculatedPosition">
        <div class="relative">
          <!-- Card image -->
          <img
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
  </Teleport>
</template>
