import { onMounted, onUnmounted } from 'vue'

const ADSENSE_SCRIPT_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
const SCRIPT_ID = 'adsense-script'

export function useAdSense() {
    let isInitialized = false

    const initAdSense = () => {
        if (typeof window === 'undefined') return

        // Check if already loaded
        if (document.querySelector(`#${SCRIPT_ID}`)) {
            isInitialized = true
            return
        }

        const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID
        if (!clientId) {
            console.warn('VITE_ADSENSE_CLIENT_ID not set - AdSense disabled')
            return
        }

        // Initialize adsbygoogle array
        window.adsbygoogle = window.adsbygoogle || []

        // Create and inject script
        const script = document.createElement('script')
        script.id = SCRIPT_ID
        script.src = `${ADSENSE_SCRIPT_URL}?client=${clientId}`
        script.async = true
        script.crossOrigin = 'anonymous'

        script.onload = () => {
            isInitialized = true
            console.log('AdSense initialized')
        }

        script.onerror = () => {
            console.error('Failed to load AdSense script')
        }

        document.head.appendChild(script)
    }

    const pushAd = (adSlot) => {
        if (!isInitialized && typeof window !== 'undefined') {
            // Try to initialize if not already done
            initAdSense()

            // Wait a bit for script to load
            setTimeout(() => pushAd(adSlot), 500)
            return
        }

        if (!window.adsbygoogle) {
            console.warn('AdSense not available')
            return
        }

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
            console.error('AdSense push error:', error)
        }
    }

    const isAdSenseReady = () => isInitialized

    return {
        initAdSense,
        pushAd,
        isAdSenseReady
    }
}
