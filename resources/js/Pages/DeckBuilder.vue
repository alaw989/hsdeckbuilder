<script setup>
import { ref, reactive, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import { useDeckBuilder } from '@/Composables/useDeckBuilder';
import { importDeckCode, exportDeckCode } from '@/Utils/deckCode';
import { validateDeck } from '@/Utils/deckValidation';
import SearchInput from '@/Components/SearchInput.vue';
import FilterPanel from '@/Components/FilterPanel.vue';
import CardGrid from '@/Components/CardGrid.vue';
import DeckList from '@/Components/DeckList.vue';
import DeckValidation from '@/Components/DeckValidation.vue';
import DeckStats from '@/Components/DeckStats.vue';
import CardTooltip from '@/Components/CardTooltip.vue';
import DeckCodeImport from '@/Components/DeckCodeImport.vue';
import DeckCodeExport from '@/Components/DeckCodeExport.vue';

const props = defineProps({
  cards: {
    type: Array,
    required: true,
    default: () => []
  },
  initialClass: {
    type: String,
    default: 'NEUTRAL'
  }
});

// Use deck builder composable
const {
  selectedClass,
  deckCards,
  deckCount,
  addCard,
  removeCard,
  setCardCount,
  clearDeck,
  getCardsByManaCost
} = useDeckBuilder(props.initialClass);

// Tooltip state
const hoveredCard = ref(null);
const tooltipPosition = ref({ x: 0, y: 0 });

function showTooltip(event, card) {
  hoveredCard.value = card;
  tooltipPosition.value = { x: event.clientX, y: event.clientY };
}

function hideTooltip() {
  hoveredCard.value = null;
}

// Deck code import/export functionality
const validation = computed(() =>
  validateDeck(deckCards, selectedClass.value)
);

const isValidDeck = computed(() => validation.value.isValid);

const deckCode = computed(() => {
  if (!isValidDeck.value) return '';

  const result = exportDeckCode(
    deckCards,
    selectedClass.value,
    'wild' // Default to wild format
  );

  return result.deckCode || '';
});

// Build dbfId to card map for import
const cardDbfMap = computed(() => {
  const map = {};
  for (const card of props.cards) {
    map[card.dbfId] = card;
  }
  return map;
});

function handleImportDeck(deckCodeString) {
  const result = importDeckCode(deckCodeString, cardDbfMap.value);

  if (result.error) {
    alert(result.error);
    return;
  }

  // Clear current deck and import cards
  clearDeck();

  for (const item of result.cards) {
    for (let i = 0; i < item.count; i++) {
      addCard(item.card);
    }
  }

  // Update class if different
  selectedClass.value = result.class;

  alert(`Imported ${result.cards.length} cards (${result.class} deck)`);
}

function handleCopyDeckCode(code) {
  // Optional: track analytics or show notification
  console.log('Deck code copied:', code);
}

// Card search/filter state
const searchQuery = ref('');
const filters = reactive({
  class: 'ALL',
  manaCost: 'ALL',
  type: 'ALL',
  rarity: 'ALL',
  set: 'ALL'
});

// Filter options
const classes = [
  { value: 'ALL', label: 'All Classes' },
  { value: 'DEMONHUNTER', label: 'Demon Hunter' },
  { value: 'DRUID', label: 'Druid' },
  { value: 'HUNTER', label: 'Hunter' },
  { value: 'MAGE', label: 'Mage' },
  { value: 'PALADIN', label: 'Paladin' },
  { value: 'PRIEST', label: 'Priest' },
  { value: 'ROGUE', label: 'Rogue' },
  { value: 'SHAMAN', label: 'Shaman' },
  { value: 'WARLOCK', label: 'Warlock' },
  { value: 'WARRIOR', label: 'Warrior' },
];

const manaCosts = [
  { value: 'ALL', label: 'Any Mana' },
  { value: '0', label: '0 Mana' },
  { value: '1', label: '1 Mana' },
  { value: '2', label: '2 Mana' },
  { value: '3', label: '3 Mana' },
  { value: '4', label: '4 Mana' },
  { value: '5', label: '5 Mana' },
  { value: '6', label: '6 Mana' },
  { value: '7+', label: '7+ Mana' },
];

const types = [
  { value: 'ALL', label: 'All Types' },
  { value: 'MINION', label: 'Minion' },
  { value: 'SPELL', label: 'Spell' },
  { value: 'WEAPON', label: 'Weapon' },
  { value: 'HERO', label: 'Hero' },
  { value: 'HERO_POWER', label: 'Hero Power' },
];

const rarities = [
  { value: 'ALL', label: 'All Rarities' },
  { value: 'FREE', label: 'Free' },
  { value: 'COMMON', label: 'Common' },
  { value: 'RARE', label: 'Rare' },
  { value: 'EPIC', label: 'Epic' },
  { value: 'LEGENDARY', label: 'Legendary' },
];

// Extract unique sets from cards (limited to 50)
const cardSets = computed(() => {
  const sets = new Set(props.cards.map(c => c.set));
  return [
    { value: 'ALL', label: 'All Sets' },
    ...Array.from(sets).slice(0, 50).map(s => ({ value: s, label: s.replace(/_/g, ' ') }))
  ];
});

// Computed: filtered cards for selection
const filteredCards = computed(() => {
  return props.cards.filter(card => {
    // Class filter
    if (filters.class !== 'ALL' && card.cardClass !== filters.class && card.cardClass !== 'NEUTRAL') {
      return false;
    }

    // Already in deck (at max copies)
    const inDeck = deckCards.find(item => item.card.id === card.id);
    const maxCopies = card.rarity === 'LEGENDARY' ? 1 : 2;
    if (inDeck && inDeck.count >= maxCopies) {
      return false;
    }

    // Other filters
    if (filters.manaCost !== 'ALL') {
      if (filters.manaCost === '7+') {
        if (card.cost < 7) return false;
      } else {
        if (card.cost !== parseInt(filters.manaCost)) return false;
      }
    }

    if (filters.type !== 'ALL' && card.type !== filters.type) return false;
    if (filters.rarity !== 'ALL' && card.rarity !== filters.rarity) return false;
    if (filters.set !== 'ALL' && card.set !== filters.set) return false;

    // Search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return card.name.toLowerCase().includes(query) ||
             (card.text && card.text.toLowerCase().includes(query));
    }

    return true;
  });
});

// Autocomplete suggestions
const autocompleteSuggestions = computed(() => {
  if (!searchQuery.value) return [];

  const query = searchQuery.value.toLowerCase();
  const seen = new Set();

  return props.cards
    .filter(card => card.name.toLowerCase().includes(query))
    .slice(0, 8)
    .filter(card => {
      if (seen.has(card.name)) return false;
      seen.add(card.name);
      return true;
    });
});

// Card selection handlers
function handleCardSelect(card) {
  addCard(card);
}

function handleRemoveCard(cardId) {
  removeCard(cardId);
}

function handleSetCount({ cardId, delta }) {
  const item = deckCards.find(item => item.card.id === cardId);
  if (item) {
    const newCount = item.count + delta;
    setCardCount(cardId, newCount);
  }
}

function updateFilter(key, value) {
  filters[key] = value;
}

function selectCard(card) {
  searchQuery.value = card.name;
}
</script>

<template>
  <Head title="Deck Builder" />

  <div class="deck-builder min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Deck Builder</h1>
        <p class="text-sm text-gray-500 mt-1">
          Build your deck: {{ deckCount }}/30 cards
        </p>
      </div>
    </div>

    <!-- Main content: split panel -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left panel: Card selection (2/3 width) -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Import/Export buttons -->
          <div class="flex space-x-3">
            <div class="flex-1">
              <DeckCodeImport @import-deck="handleImportDeck" />
            </div>
            <div class="flex-1">
              <DeckCodeExport
                :deck-code="deckCode"
                :is-disabled="!isValidDeck"
                @copy-deck-code="handleCopyDeckCode"
              />
            </div>
          </div>

          <!-- Search and filters -->
          <div class="bg-white rounded-lg shadow p-4">
            <SearchInput
              :model-value="searchQuery"
              :suggestions="autocompleteSuggestions"
              @update:model-value="searchQuery = $event"
              @select="selectCard"
              placeholder="Search cards to add to deck..."
            />
            <FilterPanel
              :filters="filters"
              :classes="classes"
              :mana-costs="manaCosts"
              :types="types"
              :rarities="rarities"
              :sets="cardSets"
              @update-filter="updateFilter"
            />
          </div>

          <!-- Available cards grid -->
          <div class="bg-white rounded-lg shadow p-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              Available Cards ({{ filteredCards.length }})
            </h2>
            <CardGrid
              :cards="filteredCards"
              :show-add-button="true"
              @add-card="handleCardSelect"
              @card-hover="showTooltip"
              @card-leave="hideTooltip"
            />
          </div>
        </div>

        <!-- Right panel: Deck list (1/3 width) -->
        <div class="lg:col-span-1">
          <div class="space-y-4">
            <!-- Validation status -->
            <div class="bg-white rounded-lg shadow p-4">
              <DeckValidation
                :deck-cards="deckCards"
                :selected-class="selectedClass"
              />
            </div>

            <!-- Deck stats -->
            <div class="bg-white rounded-lg shadow p-4">
              <DeckStats :deck-cards="deckCards" />
            </div>

            <!-- Deck list -->
            <div class="bg-white rounded-lg shadow p-4">
              <DeckList
                :deck-cards="deckCards"
                @remove-card="handleRemoveCard"
                @set-count="handleSetCount"
              />
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Global tooltip -->
    <CardTooltip
      :card="hoveredCard"
      :show="hoveredCard !== null"
      :x="tooltipPosition.x"
      :y="tooltipPosition.y"
      @close="hideTooltip"
    />
  </div>
</template>
