<script setup>
const props = defineProps({
    cards: { type: Array, required: true },
    showAddButton: { type: Boolean, default: false },
});

const emit = defineEmits(['add-card', 'card-hover', 'card-leave']);

function addCard(card) {
    emit('add-card', card);
}

function handleCardHover(event, card) {
    emit('card-hover', event, card);
}

function handleCardLeave() {
    emit('card-leave');
}
</script>

<template>
    <div>
        <!-- Empty state -->
        <div v-if="cards.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No cards found</h3>
            <p class="mt-1 text-sm text-gray-500">Try adjusting your filters or search query.</p>
        </div>

        <!-- Card grid (PLAT-01: mobile responsive) -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <div
                v-for="card in cards"
                :key="card.id"
                @mouseenter="handleCardHover($event, card)"
                @mouseleave="handleCardLeave"
                class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
            >
                <!-- Card image -->
                <div class="relative aspect-[2/3] bg-gradient-to-br from-blue-900 to-purple-900">
                    <img
                        :src="`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`"
                        :alt="card.name"
                        loading="lazy"
                        decoding="async"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                        @click="addCard(card)"
                    />

                    <!-- Mana cost badge -->
                    <div class="absolute top-2 left-2 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-lg">
                        {{ card.cost }}
                    </div>

                    <!-- Class badge -->
                    <div class="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
                        {{ card.cardClass?.toLowerCase() }}
                    </div>

                    <!-- Add button overlay on hover -->
                    <div v-if="showAddButton"
                         class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                         @click="addCard(card)">
                        <div class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
                            Add to Deck
                        </div>
                    </div>
                </div>

                <!-- Card info -->
                <div class="p-3">
                    <h3 class="font-semibold text-gray-900 text-sm truncate" :title="card.name">
                        {{ card.name }}
                    </h3>
                    <div class="flex items-center justify-between mt-1">
                        <span class="text-xs text-gray-500 capitalize">{{ card.type?.toLowerCase() }}</span>
                        <span
                            class="text-xs font-medium px-2 py-0.5 rounded"
                            :class="{
                                'bg-gray-100 text-gray-700': card.rarity === 'FREE' || card.rarity === 'COMMON',
                                'bg-blue-100 text-blue-700': card.rarity === 'RARE',
                                'bg-purple-100 text-purple-700': card.rarity === 'EPIC',
                                'bg-orange-100 text-orange-700': card.rarity === 'LEGENDARY',
                            }"
                        >
                            {{ card.rarity?.toLowerCase() }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Card count -->
        <p v-if="cards.length > 0" class="mt-6 text-center text-sm text-gray-500">
            Showing {{ cards.length }} card{{ cards.length !== 1 ? 's' : '' }}
        </p>
    </div>
</template>
