<script setup>
import { computed } from 'vue';

const props = defineProps({
  deckCards: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['remove-card', 'set-count']);

const cardsByMana = computed(() => {
  const byCost = {};
  for (let i = 0; i <= 10; i++) {
    byCost[i] = [];
  }

  for (const item of props.deckCards) {
    const cost = Math.min(item.card.cost || 0, 10);
    byCost[cost].push(item);
  }

  // Only return mana costs that have cards
  return Object.entries(byCost)
    .filter(([_, cards]) => cards.length > 0)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
});

const totalCardCount = computed(() =>
  props.deckCards.reduce((sum, item) => sum + item.count, 0)
);

const getManaColor = (cost) => {
  const colors = {
    0: 'text-gray-500',
    1: 'text-gray-700',
    2: 'text-green-600',
    3: 'text-blue-500',
    4: 'text-purple-500',
    5: 'text-orange-500',
    6: 'text-red-500',
    7: 'text-red-600',
    8: 'text-red-700',
    9: 'text-red-800',
    10: 'text-red-900'
  };
  return colors[cost] || 'text-gray-600';
};

const getRarityColor = (rarity) => {
  const colors = {
    'FREE': 'border-gray-300',
    'COMMON': 'border-gray-400',
    'RARE': 'border-blue-500',
    'EPIC': 'border-purple-500',
    'LEGENDARY': 'border-orange-500'
  };
  return colors[rarity] || 'border-gray-300';
};

function removeCard(cardId) {
  emit('remove-card', cardId);
}

function setCount(cardId, delta) {
  emit('set-count', { cardId, delta });
}
</script>

<template>
  <div class="deck-list">
    <!-- Deck header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Current Deck</h2>
      <span class="text-sm font-medium" :class="totalCardCount === 30 ? 'text-green-600' : 'text-gray-500'">
        {{ totalCardCount }}/30 cards
      </span>
    </div>

    <!-- Empty state -->
    <div v-if="deckCards.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No cards in deck</h3>
      <p class="mt-1 text-sm text-gray-500">Click cards to add them to your deck</p>
    </div>

    <!-- Cards grouped by mana cost -->
    <div v-else class="space-y-3">
      <div v-for="[manaCost, cards] in cardsByMana" :key="manaCost" class="mana-group">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 flex items-center">
          <span class="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                :class="getManaColor(parseInt(manaCost))">
            {{ parseInt(manaCost) === 10 ? '10+' : manaCost }}
          </span>
          Mana
        </h3>
        <div class="space-y-1">
          <div v-for="item in cards" :key="item.card.id"
               class="card-item flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
               :class="[getRarityColor(item.card.rarity)]">
            <div class="flex items-center space-x-3">
              <img :src="`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${item.card.id}.png`"
                   :alt="item.card.name"
                   class="w-10 h-10 rounded"
                   loading="lazy" />
              <div>
                <p class="text-sm font-medium text-gray-900">{{ item.card.name }}</p>
                <p class="text-xs text-gray-500">{{ item.card.cardClass }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <!-- Decrement button -->
              <button @click="setCount(item.card.id, -1)"
                      :disabled="item.count <= 1"
                      class="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <!-- Count display -->
              <span class="w-8 text-center font-bold" :class="item.count === 2 ? 'text-blue-600' : 'text-gray-700'">
                {{ item.count }}x
              </span>
              <!-- Increment button -->
              <button @click="setCount(item.card.id, 1)"
                      :disabled="item.card.rarity === 'LEGENDARY' || item.count >= 2"
                      class="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <!-- Remove button -->
              <button @click="removeCard(item.card.id)"
                      class="w-7 h-7 flex items-center justify-center rounded hover:bg-red-100 text-gray-500 hover:text-red-600 ml-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
