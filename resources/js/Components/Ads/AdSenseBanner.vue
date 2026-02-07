<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAdSense } from '@/Composables/useAdSense'

const props = defineProps({
  adSlot: {
    type: String,
    required: true
  },
  adFormat: {
    type: String,
    default: 'auto'
  },
  minHeight: {
    type: String,
    default: '100px'
  },
  fullWidth: {
    type: Boolean,
    default: true
  }
})

const { initAdSense, pushAd, isAdSenseReady } = useAdSense()
const adLoaded = ref(false)
const adClientId = computed(() => import.meta.env.VITE_ADSENSE_CLIENT_ID)

onMounted(() => {
  if (!adClientId.value) return

  // Initialize AdSense globally
  initAdSense()

  // Wait for script, then push ad
  const pushWithDelay = () => {
    if (isAdSenseReady()) {
      pushAd(props.adSlot)
      adLoaded.value = true
    } else {
      setTimeout(pushWithDelay, 500)
    }
  }

  pushWithDelay()
})
</script>

<template>
  <div v-if="adClientId" class="adsense-container w-full flex justify-center my-4">
    <ins
      class="adsbygoogle block"
      :style="{ minHeight }"
      :data-ad-client="adClientId"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="fullWidth ? 'true' : 'false'"
    ></ins>
  </div>
  <div v-else class="ad-placeholder w-full flex items-center justify-center bg-gray-100 rounded my-4" :style="{ minHeight }">
    <span class="text-sm text-gray-400">Ad space</span>
  </div>
</template>
