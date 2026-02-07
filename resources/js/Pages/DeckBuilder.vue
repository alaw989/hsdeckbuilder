<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Head } from '@inertiajs/vue3';
import { useDeckBuilder } from '@/Composables/useDeckBuilder';
import { importDeckCode, exportDeckCode } from '@/Utils/deckCode';
import { generateShareUrl, parseSharedDeckFromUrl } from '@/Utils/deckShare';
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
import ShareDeckModal from '@/Components/ShareDeckModal.vue';
import SavedDecksModal from '@/Components/SavedDecksModal.vue';
import ConfirmCloneModal from '@/Components/ConfirmCloneModal.vue';
import AdSenseBanner from '@/Components/Ads/AdSenseBanner.vue';
import { useDeckStorage } from '@/Composables/useDeckStorage';
import { serializeDeckForStorage } from '@/Utils/deckStorage';

const props = defineProps({
  cards: {
    type: Array,
    required: true,
    default: () => []
  },
  initialClass: {
    type: String,
    default: 'NEUTRAL'
  },
  sharedDeckCode: {
    type: String,
    default: null
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

// Share deck functionality
const showShareModal = ref(false);
const shareUrl = ref('');
const sharedDeck = ref(null);

// Saved decks functionality
const showSavedDecksModal = ref(false);
const showCloneModal = ref(false);
const cloneSuggestedName = ref('');
const { saveDeck, loadDeck, deleteDeck } = useDeckStorage();

/**
 * Handle save deck button click
 */
function handleSaveDeck() {
  if (!isValidDeck.value) {
    alert('Please build a valid deck (30 cards, correct class) before saving.');
    return;
  }

  // Prompt user for deck name
  const defaultName = `Untitled ${selectedClass.value} Deck`;
  const deckName = window.prompt('Enter a name for your deck:', defaultName);

  if (deckName === null) {
    // User cancelled
    return;
  }

  // Use default if user entered empty string
  const finalName = deckName.trim() || defaultName;

  // Save deck
  const { data, error } = saveDeck({
    cards: deckCards.value,
    class: selectedClass.value,
    name: finalName
  });

  if (error) {
    alert(`Failed to save deck: ${error}`);
    return;
  }

  alert(`Deck "${finalName}" saved successfully!`);
}

/**
 * Handle load deck event from SavedDecksModal
 */
function handleLoadDeck(deckData) {
  clearDeck();

  // Add each card to the deck
  for (const item of deckData.cards) {
    for (let i = 0; i < item.count; i++) {
      addCard(item.card);
    }
  }

  // Update class
  selectedClass.value = deckData.class;

  alert(`Loaded "${deckData.name}" (${deckData.class} deck)`);
}

/**
 * Handle delete deck event from SavedDecksModal
 */
function handleDeleteDeck(deckId) {
  // Deletion already handled in modal
  console.log('Deck deleted:', deckId);
}

/**
 * Open clone modal for shared deck
 */
function openCloneModal() {
  cloneSuggestedName.value = `Clone of ${selectedClass.value} Deck`;
  showCloneModal.value = true;
}

/**
 * Handle confirm clone from modal
 */
function handleConfirmClone({ name }) {
  // Serialize deck for storage
  const { data: serialized, error: serializeError } = serializeDeckForStorage(
    deckCards.value,
    selectedClass.value,
    name
  );

  if (serializeError) {
    alert(`Failed to clone deck: ${serializeError}`);
    return;
  }

  // Save deck to LocalStorage
  const { data, error } = saveDeck({
    deckCards: deckCards.value,
    deckClass: selectedClass.value,
    deckName: name
  });

  if (error) {
    alert(`Failed to clone deck: ${error}`);
    return;
  }

  // Clear shared deck flag - now editing local copy
  sharedDeck.value = null;

  // Close modal and show success
  showCloneModal.value = false;
  alert(`Deck "${name}" cloned successfully!`);
}

const shareUrlComputed = computed(() => {
  if (!isValidDeck.value) return '';

  const result = generateShareUrl(
    deckCards.value,
    selectedClass.value,
    window.location.origin
  );

  return result.url || '';
});

function openShareModal() {
  if (!isValidDeck.value) return;
  shareUrl.value = shareUrlComputed.value;
  showShareModal.value = true;
}

function closeShareModal() {
  showShareModal.value = false;
}

function clearSharedDeck() {
  sharedDeck.value = null;
  clearDeck();
}

// Load shared deck on mount
onMounted(() => {
  if (props.sharedDeckCode) {
    handleImportDeck(props.sharedDeckCode);

    // Track shared deck info
    sharedDeck.value = {
      deckCode: props.sharedDeckCode,
      class: selectedClass.value,
      cards: [...deckCards.value]
    };

    // Clear URL parameter without reloading
    const url = new URL(window.location);
    url.searchParams.delete('deck');
    window.history.replaceState({}, '', url);
  }
});

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
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Deck Builder</h1>
            <p class="text-sm text-gray-500 mt-1">
              Build your deck: {{ deckCount }}/30 cards
            </p>
          </div>
          <button
            @click="openShareModal"
            class="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!isValidDeck"
          >
            Share Deck
          </button>
        </div>
      </div>
    </div>

    <!-- Top banner ad -->
    <div class="max-w-7xl mx-auto px-4">
      <AdSenseBanner ad-slot="1234567890" ad-format="horizontal" min-height="90px" />
    </div>

    <!-- Shared deck banner -->
    <div
      v-if="sharedDeck"
      class="bg-blue-100 border-l-4 border-blue-500 p-4 mx-4 mt-4 rounded"
    >
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-sm font-medium text-blue-800">
              Viewing a shared deck
            </h3>
            <p class="text-sm text-blue-700 mt-1">
              {{ sharedDeck.class }} deck • {{ deckCount }} cards
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="openCloneModal"
              class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clone to My Decks
            </button>
            <button
              @click="clearSharedDeck"
              class="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start New Deck
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content: split panel -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left panel: Card selection (2/3 width) -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Import/Export/Save/Load buttons -->
          <div class="grid grid-cols-2 gap-3">
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
            <div class="flex space-x-3">
              <button
                @click="handleSaveDeck"
                class="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!isValidDeck"
              >
                Save Deck
              </button>
              <button
                @click="showSavedDecksModal = true"
                class="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Load Decks
              </button>
            </div>
          </div>

          <!-- Mid-page banner ad -->
          <AdSenseBanner ad-slot="2345678901" ad-format="auto" min-height="250px" />

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

            <!-- Sidebar ad -->
            <AdSenseBanner ad-slot="3456789012" ad-format="vertical" min-height="250px" />

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

    <!-- Saved Decks Modal -->
    <SavedDecksModal
      :show="showSavedDecksModal"
      @close="showSavedDecksModal = false"
      @load-deck="handleLoadDeck"
      @delete-deck="handleDeleteDeck"
    />

    <!-- Share Deck Modal -->
    <ShareDeckModal
      :show="showShareModal"
      :share-url="shareUrl"
      :is-disabled="!isValidDeck"
      @close="closeShareModal"
    />

    <!-- Confirm Clone Modal -->
    <ConfirmCloneModal
      :show="showCloneModal"
      :suggested-name="cloneSuggestedName"
      @close="showCloneModal = false"
      @confirm="handleConfirmClone"
    />
  </div>
</template>
