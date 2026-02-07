<script setup>
const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['change-tab'])

const tabs = [
  { key: 'cards', label: 'Cards' },
  { key: 'deck', label: 'Deck' },
  { key: 'analytics', label: 'Analytics' }
]
</script>

<template>
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
        <div class="flex justify-around">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="$emit('change-tab', tab.key)"
                :class="[
                    'flex-1 py-3 text-center transition-colors duration-200 flex flex-col items-center justify-center',
                    activeTab === tab.key
                        ? 'text-blue-600 bg-blue-50 border-t-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                ]"
                :aria-label="tab.label"
                :aria-selected="activeTab === tab.key"
            >
                <svg v-if="tab.key === 'cards'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <svg v-else-if="tab.key === 'deck'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span class="text-xs mt-1 font-medium">{{ tab.label }}</span>
            </button>
        </div>
        <!-- Spacer for safe area on iOS -->
        <div class="h-safe-area-inset-bottom"></div>
    </div>
</template>

<style scoped>
.safe-area-inset-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
}
.h-safe-area-inset-bottom {
    height: env(safe-area-inset-bottom, 0px);
}
</style>
