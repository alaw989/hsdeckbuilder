<script setup>
import { ref } from 'vue'

const associateTag = import.meta.env.VITE_AMAZON_ASSOCIATES_TAG || 'hearthstone20-20'

// Hearthstone card pack products on Amazon
// These are representative ASINs - replace with actual valid ASINs
const products = ref([
    {
        asin: 'B07FCWSKX5', // Example: Hearthstone 15 Card Packs
        name: 'Hearthstone 15 Card Packs',
        description: 'Classic card pack bundle',
        price: '$14.99',
        image: '/images/amazon/hs-packs-15.jpg'
    },
    {
        asin: 'B07FCTC3RV', // Example: Hearthstone 40 Card Packs
        name: 'Hearthstone 40 Card Packs',
        description: 'Bundle with bonus Legendary',
        price: '$39.99',
        image: '/images/amazon/hs-packs-40.jpg'
    }
])

const getAffiliateUrl = (asin) => {
    return `https://www.amazon.com/dp/${asin}?tag=${associateTag}`
}
</script>

<template>
    <div class="amazon-affiliates bg-gray-50 rounded-lg p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900">Purchase Card Packs</h3>
            <svg class="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
        </div>

        <p class="text-sm text-gray-600 mb-4">
            Support the site by purchasing Hearthstone card packs through Amazon
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
                v-for="product in products"
                :key="product.asin"
                :href="getAffiliateUrl(product.asin)"
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
                <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    HS
                </div>
                <div class="ml-3 flex-1">
                    <div class="font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">{{ product.description }}</div>
                    <div class="flex items-center justify-between mt-1">
                        <span class="text-sm font-semibold text-green-600">{{ product.price }}</span>
                        <span class="text-xs text-gray-400">View on Amazon</span>
                    </div>
                </div>
                <svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
            </a>
        </div>

        <p class="text-xs text-gray-500 mt-3 text-center">
            As an Amazon Associate, I earn from qualifying purchases.
        </p>
    </div>
</template>
