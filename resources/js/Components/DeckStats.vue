<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import { calculateDustCost, getRarityColor } from '../Utils/dustCalculation';

Chart.register(...registerables);

const props = defineProps({
  deckCards: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Mana curve calculation
const manaCurveData = computed(() => {
  const curve = Array(11).fill(0); // 0-10 mana

  for (const item of props.deckCards) {
    const cost = Math.min(item.card.cost || 0, 10);
    curve[cost] += item.count;
  }

  return curve;
});

const chartData = computed(() => ({
  labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
  datasets: [{
    label: 'Card Count',
    data: manaCurveData.value,
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
    borderColor: 'rgba(59, 130, 246, 1)',
    borderWidth: 1,
    borderRadius: 4
  }]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        title: (items) => `${items[0].label} Mana`,
        label: (item) => `${item.parsed.y} cards`
      }
    }
  }
};

// Dust cost calculation
const dustCost = computed(() => calculateDustCost(props.deckCards));

const rarityBreakdown = computed(() => {
  return [
    { rarity: 'Legendary', count: dustCost.value.counts.LEGENDARY, dust: dustCost.value.byRarity.LEGENDARY },
    { rarity: 'Epic', count: dustCost.value.counts.EPIC, dust: dustCost.value.byRarity.EPIC },
    { rarity: 'Rare', count: dustCost.value.counts.RARE, dust: dustCost.value.byRarity.RARE },
    { rarity: 'Common', count: dustCost.value.counts.COMMON, dust: dustCost.value.byRarity.COMMON }
  ].filter(r => r.count > 0);
});

const totalCards = computed(() =>
  props.deckCards.reduce((sum, item) => sum + item.count, 0)
);
</script>

<template>
  <div class="deck-stats space-y-6">
    <!-- Mana Curve Chart -->
    <div>
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Mana Curve</h3>
      <div class="bg-gray-50 rounded-lg p-4" style="height: 180px;">
        <Bar v-if="totalCards > 0"
             :data="chartData"
             :options="chartOptions" />
        <div v-else
             class="h-full flex items-center justify-center text-gray-400 text-sm">
          Add cards to see mana curve
        </div>
      </div>
    </div>

    <!-- Dust Cost Breakdown -->
    <div>
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Dust Cost</h3>
      <div v-if="totalCards > 0" class="space-y-2">
        <!-- Total dust -->
        <div class="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
          <span class="text-sm font-medium text-amber-900">Total to Craft</span>
          <div class="flex items-center">
            <svg class="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h14V7l-7-5zm0 2.236L15.5 8v8H4.5V8L10 4.236z"/>
            </svg>
            <span class="text-lg font-bold text-amber-900">{{ dustCost.total.toLocaleString() }}</span>
          </div>
        </div>

        <!-- By rarity -->
        <div class="space-y-1">
          <div v-for="item in rarityBreakdown" :key="item.rarity"
               class="flex items-center justify-between text-sm p-2 rounded"
               :class="`bg-${item.rarity === 'Legendary' ? 'orange' : item.rarity === 'Epic' ? 'purple' : item.rarity === 'Rare' ? 'blue' : 'gray'}-50`">
            <span class="font-medium" :class="getRarityColor(item.rarity.toUpperCase())">
              {{ item.count }}x {{ item.rarity }}
            </span>
            <span class="text-gray-600">{{ item.dust.toLocaleString() }}</span>
          </div>
        </div>
      </div>
      <div v-else
           class="p-4 bg-gray-50 rounded-lg text-center text-gray-400 text-sm">
        Add cards to see dust cost
      </div>
    </div>
  </div>
</template>
