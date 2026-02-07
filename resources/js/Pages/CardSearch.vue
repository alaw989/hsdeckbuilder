<script setup>
import { ref, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { Head } from '@inertiajs/vue3';
import SearchInput from '@/Components/SearchInput.vue';
import FilterPanel from '@/Components/FilterPanel.vue';
import CardGrid from '@/Components/CardGrid.vue';

const props = defineProps({
    cards: Array,
    selectedClass: { type: String, default: 'all' },
    selectedFormat: { type: String, default: 'wild' },
});

// Reactive state
const searchQuery = ref('');
const filters = ref({
    class: props.selectedClass || 'all',
    manaCost: null,
    type: 'all',
    rarity: 'all',
    set: 'all',
});

// Debounced search (300ms per research)
const debouncedSearch = useDebounceFn((value) => {
    searchQuery.value = value;
}, 300);

// Hearthstone classes (CORE-11: all 11 classes)
const classes = [
    { value: 'all', label: 'All Classes' },
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
    { value: null, label: 'Any Mana' },
    { value: 0, label: '0 Mana' },
    { value: 1, label: '1 Mana' },
    { value: 2, label: '2 Mana' },
    { value: 3, label: '3 Mana' },
    { value: 4, label: '4 Mana' },
    { value: 5, label: '5 Mana' },
    { value: 6, label: '6 Mana' },
    { value: 7, label: '7+ Mana' },
];

const types = [
    { value: 'all', label: 'All Types' },
    { value: 'MINION', label: 'Minion' },
    { value: 'SPELL', label: 'Spell' },
    { value: 'WEAPON', label: 'Weapon' },
    { value: 'HERO', label: 'Hero' },
    { value: 'HERO_POWER', label: 'Hero Power' },
];

const rarities = [
    { value: 'all', label: 'All Rarities' },
    { value: 'FREE', label: 'Free' },
    { value: 'COMMON', label: 'Common' },
    { value: 'RARE', label: 'Rare' },
    { value: 'EPIC', label: 'Epic' },
    { value: 'LEGENDARY', label: 'Legendary' },
];

// Extract unique sets from cards
const cardSets = computed(() => {
    const sets = new Set(props.cards.map(c => c.set));
    return [
        { value: 'all', label: 'All Sets' },
        ...Array.from(sets).map(s => ({ value: s, label: s.replace(/_/g, ' ') }))
    ];
});

// Standard sets for format filtering (CORE-08)
const standardSets = [
    'PERMITTENOL', 'REVENDRETH', 'FROZEN_THRONE', 'DARKMOON_FAIRE',
    'STORMWIND', 'ALTERAC_VALLEY', 'ONYXIAS_LAIR', 'SHOWCASE',
    'FESTIVAL_OF_LEGENDS', 'TITANS', 'BADLANDS', 'PATH_OF_ARTHAS'
];

// Main filtered cards computed property
const filteredCards = computed(() => {
    let results = props.cards;

    // Class filter (CORE-02: include neutral cards)
    if (filters.value.class !== 'all') {
        results = results.filter(card =>
            card.cardClass === filters.value.class ||
            card.cardClass === 'NEUTRAL'
        );
    }

    // Format filter (CORE-08: Standard/Wild/Twist)
    if (props.selectedFormat === 'standard') {
        results = results.filter(card => standardSets.includes(card.set));
    }

    // Mana cost filter (CORE-02)
    if (filters.value.manaCost !== null) {
        if (filters.value.manaCost === 7) {
            results = results.filter(card => card.cost >= 7);
        } else {
            results = results.filter(card => card.cost === filters.value.manaCost);
        }
    }

    // Type filter (CORE-02)
    if (filters.value.type !== 'all') {
        results = results.filter(card => card.type === filters.value.type);
    }

    // Rarity filter (CORE-02)
    if (filters.value.rarity !== 'all') {
        results = results.filter(card => card.rarity === filters.value.rarity);
    }

    // Set filter (CORE-02)
    if (filters.value.set !== 'all') {
        results = results.filter(card => card.set === filters.value.set);
    }

    // Search query filter (CORE-01)
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        results = results.filter(card =>
            card.name.toLowerCase().includes(query) ||
            card.text?.toLowerCase().includes(query)
        );
    }

    return results;
});

// Autocomplete suggestions (CORE-01)
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

function updateFilter(key, value) {
    filters.value[key] = value;
}

function selectCard(card) {
    searchQuery.value = card.name;
    debouncedSearch(card.name);
}
</script>

<template>
    <Head title="Card Search" />

    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Card Search</h1>
                <p class="mt-2 text-gray-600">
                    Search and filter {{ cards.length }} Hearthstone cards
                </p>
            </div>

            <!-- Search and Filters -->
            <div class="space-y-6 mb-8">
                <!-- Search Input (CORE-01) -->
                <SearchInput
                    :model-value="searchQuery"
                    :suggestions="autocompleteSuggestions"
                    @update:model-value="debouncedSearch"
                    @select="selectCard"
                />

                <!-- Filter Panel (CORE-02) -->
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

            <!-- Results count -->
            <div class="mb-4 flex items-center justify-between">
                <p class="text-gray-600">
                    Showing <span class="font-semibold">{{ filteredCards.length }}</span> cards
                </p>
                <p class="text-sm text-gray-500">
                    Format: <span class="font-medium">{{ selectedFormat.toUpperCase() }}</span>
                </p>
            </div>

            <!-- Card Grid (PLAT-01: responsive) -->
            <CardGrid :cards="filteredCards" />
        </div>
    </div>
</template>
