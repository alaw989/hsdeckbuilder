# Phase 04: Monetization & Platform Polish - Research

**Researched:** 2026-02-07
**Domain:** AdSense Integration, Amazon Affiliate Links, FTC Compliance, Mobile Responsive Design, Performance Optimization
**Confidence:** HIGH

## Summary

This phase focuses on implementing monetization (Google AdSense + Amazon Associates affiliate links) and platform polish (mobile responsive design + performance optimization). Research confirms that AdSense integration with Vue 3 SPAs requires special handling for client-side navigation, Amazon's Product Advertising API 5.0 is still active but has migration deadlines in 2026, and performance optimization requires a multi-layered approach (lazy loading, code splitting, responsive images, Core Web Vitals monitoring).

**Primary recommendation:** Use Google AdSense auto ads with manual ad unit placement for SPAs, implement Amazon affiliate links via direct link generation (not PAAPI 5.0 due to complexity and 2026 migration), adopt mobile-first responsive design with Tailwind CSS breakpoints, and implement lazy loading + code splitting for performance.

## User Constraints (from CONTEXT.md)

No CONTEXT.md exists for Phase 04. However, the following locked decisions were specified in the research request:

### Locked Decisions
- Max 3-4 ads per page, responsive sizing on mobile
- Amazon only for affiliate links, dedicated section placement
- FTC disclosure in footer only
- Show both dust cost AND estimated USD
- Tabbed navigation on mobile (Cards/Deck/Analytics tabs)
- Tap-to-modal for card tooltips on mobile
- Hamburger menu for navigation
- All Core Web Vitals balanced
- Lazy load ads, responsive srcset for images, route-based code splitting

### Claude's Discretion
None specified in the research request. This document provides recommendations for implementation approaches.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Google AdSense | Current (2026) | Display advertising | Industry standard for web monetization, auto ads work with SPAs |
| Amazon Associates | Current (2026) | Affiliate links for card packs | Amazon is the primary Hearthstone card pack retailer |
| Tailwind CSS | v3+ (already in use) | Mobile-first responsive design | Already in project, utility-first approach ideal for responsive design |
| VueUse | @vueuse/core (already in use) | Reactive utilities for breakpoint detection | Already in project, useBreakpoints for responsive detection |
| Vite | v7+ (already in use) | Build tool with code splitting | Already in project, automatic code splitting with import.meta.glob |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vue3-google-adsense | Latest | Vue 3 AdSense component wrapper | If manual ad unit placement needed beyond auto ads |
| vue-lazyload | v3+ | Image lazy loading directive | For enhanced image lazy loading beyond native loading="lazy" |
| sanjayojha/laravel-amazon-paapi5 | Latest | Laravel wrapper for Amazon PAAPI5 | **NOT RECOMMENDED** - complex API with 2026 deprecation, use direct links instead |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| AdSense auto ads | Manual ad units only | Auto ads optimize placement automatically but harder to control exact positions |
| Direct Amazon affiliate links | Amazon PAAPI5 API | API provides dynamic pricing/product data but complex, rate-limited, and deprecated in 2026 |
| Native loading="lazy" | vue-lazyload library | Native browser feature is simpler but library provides more control and fallbacks |
| Mobile-first Tailwind | Desktop-first approach | Mobile-first aligns with actual traffic patterns (majority mobile) and Google's mobile-first indexing |

**Installation:**
```bash
# AdSense - no installation needed, just add script
# Amazon Associates - no installation needed for direct links

# Optional - if enhanced lazy loading needed:
npm install vue-lazyload@next
```

## Architecture Patterns

### Recommended Project Structure
```
resources/js/
├── Components/
│   ├── Ads/
│   │   ├── AdSenseContainer.vue      # AdSense wrapper component
│   │   ├── AdSenseBanner.vue         # Banner ad unit
│   │   └── AdSenseSidebar.vue        # Sidebar ad unit
│   ├── Affiliates/
│   │   └── AmazonCardPacks.vue       # Amazon affiliate links component
│   └── Mobile/
│       ├── MobileNavigation.vue      # Hamburger menu
│       ├── MobileTabs.vue            # Tabbed navigation for mobile
│       └── ResponsiveContainer.vue   # Mobile-responsive wrapper
├── Composables/
│   ├── useAdSense.js                 # AdSense initialization logic
│   ├── useBreakpoints.js             # VueUse breakpoint detection (already exists)
│   └── useResponsive.js              # Custom responsive utilities
└── Pages/
    └── DeckBuilder.vue               # Update with responsive design
```

### Pattern 1: AdSense Integration with Vue 3 + Inertia.js

**What:** Google AdSense auto ads with manual ad unit containers for Vue 3 SPA

**When to use:** When implementing display advertising on Inertia.js-powered Vue 3 pages

**Example:**
```javascript
// resources/js/Composables/useAdSense.js
// Source: https://support.google.com/adsense/answer/9261307
// Source: https://github.com/lcw3176/vue3-google-adsense

import { onMounted, onUnmounted } from 'vue'

export function useAdSense() {
    const initAdSense = () => {
        // AdSense auto ads script
        if (window.adsbygoogle) return // Already loaded

        const script = document.createElement('script')
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX'
        script.async = true
        script.crossOrigin = 'anonymous'

        script.onload = () => {
            // Push ad units to page
            window.adsbygoogle = window.adsbygoogle || []
        }

        document.head.appendChild(script)
    }

    const pushAd = (adSlot) => {
        if (!window.adsbygoogle) return

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
            console.error('AdSense error:', error)
        }
    }

    return { initAdSense, pushAd }
}
```

```vue
<!-- resources/js/Components/Ads/AdSenseBanner.vue -->
<!-- Source: https://support.google.com/adsense/answer/9183362 -->
<template>
    <div class="adsense-container w-full flex justify-center my-4">
        <ins
            class="adsbygoogle block"
            :style="{ minHeight: adHeight }"
            :data-ad-client="adClient"
            :data-ad-slot="adSlot"
            :data-ad-format="adFormat"
            data-full-width-responsive="true"
        ></ins>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAdSense } from '@/Composables/useAdSense'

const props = defineProps({
    adSlot: {
        type: String,
        required: true
    },
    adFormat: {
        type: String,
        default: 'auto'
    }
})

const { initAdSense, pushAd } = useAdSense()
const adClient = import.meta.env.VITE_ADSENSE_CLIENT_ID
const adHeight = ref('100px') // Adjust based on ad size

onMounted(() => {
    initAdSense()
    // Wait for script to load, then push ad
    setTimeout(() => pushAd(props.adSlot), 500)
})
</script>
```

### Pattern 2: Amazon Associates Affiliate Links (Direct Link Approach)

**What:** Direct Amazon affiliate links without using Product Advertising API 5.0

**When to use:** When affiliate link functionality is needed without complex product data integration. **RECOMMENDED OVER PAAPI5** due to:
- PAAPI 5.0 deprecation deadline (April 30, 2026)
- Complex OAuth authentication requirements
- Rate limiting (1 request per second max)
- Requires AWS credentials management

**Example:**
```vue
<!-- resources/js/Components/Affiliates/AmazonCardPacks.vue -->
<template>
    <div class="amazon-affiliates bg-gray-50 rounded-lg p-4 mb-4">
        <h3 class="text-lg font-semibold mb-3">Purchase Card Packs</h3>
        <p class="text-sm text-gray-600 mb-4">
            Support the site by purchasing Hearthstone card packs through Amazon
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
                v-for="product in products"
                :key="product.asin"
                :href="product.affiliateUrl"
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                class="flex items-center p-3 bg-white rounded shadow hover:shadow-md transition"
            >
                <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-16 h-16 object-contain"
                />
                <div class="ml-3">
                    <div class="font-medium">{{ product.name }}</div>
                    <div class="text-sm text-green-600 font-semibold">
                        {{ product.price }}
                    </div>
                    <div class="text-xs text-gray-500">
                        View on Amazon
                    </div>
                </div>
            </a>
        </div>

        <p class="text-xs text-gray-500 mt-3">
            As an Amazon Associate, I earn from qualifying purchases.
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Affiliate tag from environment variable
const affiliateTag = import.meta.env.VITE_AMAZON_ASSOCIATES_TAG || 'yourtag-20'

const products = ref([
    {
        asin: 'B00WEWUQTS', // Example ASIN for Hearthstone card bundles
        name: 'Hearthstone Card Bundle',
        image: '/images/amazon-card-bundle.jpg',
        price: '$49.99',
        affiliateUrl: `https://www.amazon.com/dp/B00WEWUQTS?tag=${affiliateTag}`
    },
    // Add more products as needed
])
</script>
```

### Pattern 3: Mobile-First Responsive Design with Tailwind CSS

**What:** Mobile-first responsive design using Tailwind CSS breakpoint system

**When to use:** For all responsive layouts across the application

**Example:**
```vue
<!-- Mobile-first responsive card grid -->
<!-- Source: https://tailwindcss.com/docs/responsive-design -->
<template>
    <!-- Base styles (mobile) applied first -->
    <div class="
        px-4           /* Mobile padding */
        md:px-8        /* Desktop padding */
        py-6
    ">
        <!-- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop, 4 col wide -->
        <div class="
            grid
            grid-cols-1     /* Mobile: 1 column */
            md:grid-cols-2  /* Tablet (768px+): 2 columns */
            lg:grid-cols-3  /* Desktop (1024px+): 3 columns */
            xl:grid-cols-4  /* Wide (1280px+): 4 columns */
            gap-4
        ">
            <div
                v-for="card in cards"
                :key="card.id"
                class="
                    p-4             /* Mobile padding */
                    md:p-6          /* Desktop padding */
                    text-sm         /* Mobile text */
                    md:text-base    /* Desktop text */
                "
            >
                {{ card.name }}
            </div>
        </div>
    </div>
</template>
```

### Pattern 4: Mobile Tabbed Navigation

**What:** Tabbed navigation for mobile views (Cards/Deck/Analytics)

**When to use:** On mobile screens to switch between different deck builder views

**Example:**
```vue
<!-- resources/js/Components/Mobile/MobileTabs.vue -->
<template>
    <div class="md:hidden"> <!-- Only show on mobile -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div class="flex justify-around">
                <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    @click="$emit('change-tab', tab.key)"
                    :class="[
                        'flex-1 py-3 text-center transition',
                        activeTab === tab.key
                            ? 'text-blue-600 border-t-2 border-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:bg-gray-50'
                    ]"
                >
                    <span class="text-sm font-medium">{{ tab.label }}</span>
                </button>
            </div>
        </div>
        <!-- Spacer to prevent content from being hidden behind tabs -->
        <div class="h-16 md:hidden"></div>
    </div>
</template>

<script setup>
defineProps({
    activeTab: {
        type: String,
        required: true
    }
})

defineEmits(['change-tab'])

const tabs = [
    { key: 'cards', label: 'Cards' },
    { key: 'deck', label: 'Deck' },
    { key: 'analytics', label: 'Analytics' }
]
</script>
```

### Pattern 5: Route-Based Code Splitting with Inertia.js + Vite

**What:** Lazy load pages automatically using Vite's import.meta.glob

**When to use:** All Inertia.js pages are automatically code-split by default in the current setup

**Example:**
```javascript
// resources/js/app.js
// Source: https://inertiajs.com/docs/v2/advanced/code-splitting

// Current setup - ALREADY CODE SPLIT BY DEFAULT
createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob('./Pages/**/*.vue'), // Auto code-splitting
        ),
    // ... rest of config
})
```

**No changes needed** - the current app.js already implements code splitting correctly. Vite automatically creates separate chunks for each page.

### Pattern 6: Lazy Loading Images with Native Browser Support

**What:** Use native browser lazy loading with loading="lazy" attribute

**When to use:** For all below-fold images to improve Core Web Vitals (LCP)

**Example:**
```vue
<template>
    <img
        :src="card.image"
        :alt="card.name"
        loading="lazy"
        decoding="async"
        class="card-image"
    />
</template>
```

### Pattern 7: Responsive Images with srcset

**What:** Provide multiple image sizes for different screen densities

**When to use:** For card images and other responsive graphics

**Example:**
```vue
<template>
    <img
        :srcset="`
            ${card.image256} 1x,
            ${card.image512} 2x
        `"
        :src="card.image256"
        :alt="card.name"
        loading="lazy"
        class="w-full h-auto"
    />
</template>
```

### Anti-Patterns to Avoid

- **Loading AdSense on every route navigation:** AdSense script should load once globally, not reinitialize on every page visit
- **Using Amazon PAAPI5 for simple affiliate links:** API is deprecated (April 2026), complex, and rate-limited. Direct links are sufficient for affiliate revenue
- **Desktop-first responsive design:** Always design mobile-first, it's easier to add complexity for larger screens
- **Hardcoded ad sizes everywhere:** Use responsive ad units with data-full-width-responsive="true"
- **Blocking page load for ads:** Ads should load asynchronously, never block critical rendering path
- **Lazy loading above-fold images:** Above-fold content should load immediately for better LCP
- **Missing FTC disclosure:** FTC requires clear and conspicuous disclosure of affiliate relationships
- **More than 3-4 ads per page:** Violates best practices, degrades UX, can hurt SEO

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Ad injection for SPAs | Custom ad management system | Google AdSense auto ads | Google optimizes placement automatically, handles SPA routing complexities |
| Affiliate link tracking | Custom click tracking | Amazon Associate tag URLs | Amazon handles all tracking, commission calculation, payments |
| Breakpoint detection | Custom window resize listeners | @vueuse/core useBreakpoints | VueUse provides reactive breakpoints with debouncing, handles edge cases |
| Lazy loading images | Custom IntersectionObserver implementation | Native loading="lazy" or vue-lazyload | Native browser feature is performant, library provides fallbacks |
| Code splitting | Manual webpack/vite config | Vite's import.meta.glob | Automatic code splitting with zero config, handles dependencies correctly |
| Responsive design utilities | Custom CSS classes | Tailwind CSS responsive utilities | Utility-first approach, consistent spacing, mobile-first breakpoints |

**Key insight:** Monetization and performance optimization are solved problems. Use existing services and browser APIs rather than building custom solutions. Focus implementation effort on integration and UX, not reinventing ad servers or affiliate systems.

## Common Pitfalls

### Pitfall 1: AdSense Not Rendering in Vue SPA

**What goes wrong:** AdSense ads appear on initial page load but disappear or don't render after client-side navigation.

**Why it happens:** AdSense script needs to be notified of route changes in SPAs. The adsbygoogle array needs to be pushed after navigation.

**How to avoid:**
- Load AdSense script once globally (in app.js or root layout)
- Use AdSense auto ads which handle SPA routing automatically
- For manual ads, push new ad units to adsbygoogle array after Inertia navigation
- Test ads across all routes after client-side navigation

**Warning signs:** Ads work on hard refresh but not after clicking internal links.

### Pitfall 2: Ad Blocker Revenue Loss

**What goes wrong:** Significant portion of users (20-40%) block ads, resulting in zero revenue from those users.

**Why it happens:** Popular ad blockers (uBlock Origin, AdBlock) block Google AdSense by default.

**How to avoid:**
- Diversify revenue: include affiliate links which are less likely to be blocked
- Don't build ad blocker detection (can be circumvented and degrades UX)
- Focus on value to encourage users to whitelist
- Consider premium tier (v2 requirement) for ad-free experience

**Warning signs:** Analytics shows ad impressions far below page views.

### Pitfall 3: Amazon PAAPI5 Integration Complexity

**What goes wrong:** Spending significant development effort on Amazon Product Advertising API 5.0 integration only to hit rate limits or face migration in 2026.

**Why it happens:** PAAPI5 looks like the "professional" approach but is overkill for simple affiliate links.

**How to avoid:**
- Use direct Amazon affiliate links with associate tag for this phase
- Only consider PAAPI5 for v2 when dynamic pricing/data is needed
- Reevaluate after April 2026 deprecation deadline
- Focus on simpler integration first

**Warning signs:** Spending more than 2-3 hours on Amazon API integration.

### Pitfall 4: Poor Mobile UX with Too Many Ads

**What goes wrong:** Mobile screens become cluttered with ads, making content difficult to access.

**Why it happens:** Desktop ad placement doesn't scale down well to mobile screens.

**How to avoid:**
- Max 3-4 ads per page (locked decision)
- Use responsive ad units that adapt to screen size
- On mobile, place ads strategically (not between every card)
- Test on actual mobile devices, not just browser dev tools
- Consider tabbed mobile interface to separate content from ads

**Warning signs:** Users complain about ads, high bounce rate on mobile.

### Pitfall 5: Core Web Vitals Degradation

**What goes wrong:** Adding ads and affiliate content significantly degrades page load performance (LCP, CLS, INP).

**Why it happens:** Ad scripts and images add weight without optimization, causing layout shifts and slow loading.

**How to avoid:**
- Lazy load ads (only load when scrolled into view)
- Preallocate space for ad units to prevent CLS
- Use responsive ad units with data-full-width-responsive="true"
- Optimize images (WebP format, compression, srcset)
- Implement route-based code splitting (already configured)
- Monitor Core Web Vitals with Chrome DevTools Lighthouse

**Warning signs:** Lighthouse score drops below 80 after adding ads.

### Pitfall 6: FTC Compliance Issues

**What goes wrong:** Affiliate links without proper disclosure violate FTC guidelines and can result in penalties.

**Why it happens:** Forgetting or placing disclosure where users won't see it.

**How to avoid:**
- Place disclosure in footer (locked decision - footer only)
- Use clear language: "As an Amazon Associate, I earn from qualifying purchases"
- Make disclosure visible, not hidden in fine print
- Ensure disclosure appears on pages with affiliate links

**Warning signs:** Affiliate links present but no disclosure visible.

### Pitfall 7: Route-Based Code Splitting Not Working

**What goes wrong:** Vite builds all pages into single bundle despite using import.meta.glob

**Why it happens:** Using `{ eager: true }` in import.meta.glob causes immediate loading

**How to avoid:**
- Ensure import.meta.glob is called without `{ eager: true }`
- Current app.js is correctly configured (already verified)
- Verify by checking network tab in browser dev tools for separate chunks
- Each page should load as separate .js file

**Warning signs:** Single large bundle file containing all page components.

## Code Examples

Verified patterns from official sources:

### AdSense Auto Ads Setup

```vue
<!-- resources/js/Layouts/AppLayout.vue -->
<template>
    <main>
        <slot />
    </main>
    <footer>
        <!-- FTC disclosure -->
        <div class="text-sm text-gray-500">
            As an Amazon Associate, I earn from qualifying purchases.
        </div>
    </footer>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
    // Load AdSense auto ads script once
    if (document.querySelector('#adsense-script')) return

    const script = document.createElement('script')
    script.id = 'adsense-script'
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_ADSENSE_CLIENT_ID}`
    script.async = true
    script.crossOrigin = 'anonymous'

    document.head.appendChild(script)
})
</script>
```

**Source:** [Google AdSense Auto Ads Documentation](https://support.google.com/adsense/answer/9261307)

### Responsive Image Component

```vue
<!-- resources/js/Components/CardImage.vue -->
<template>
    <img
        :srcset="`
            /images/cards/${card.id}-256.jpg 1x,
            /images/cards/${card.id}-512.jpg 2x
        `"
        :src="`/images/cards/${card.id}-256.jpg`"
        :alt="card.name"
        loading="lazy"
        decoding="async"
        class="w-full h-auto rounded"
        :style="{ aspectRatio: '256/352' }"
    />
</template>

<script setup>
defineProps({
    card: {
        type: Object,
        required: true
    }
})
</script>
```

**Source:** [MDN Web Docs - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

### Mobile Breakpoint Detection

```javascript
// resources/js/Composables/useBreakpoints.js
// Source: https://vueuse.org/core/usebreakpoints/

import { useBreakpoints } from '@vueuse/core'

export function useMobileBreakpoints() {
    const breakpoints = useBreakpoints({
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536
    })

    const isMobile = breakpoints.smaller('md')
    const isTablet = breakpoints.between('md', 'lg')
    const isDesktop = breakpoints.greater('lg')

    return {
        isMobile,
        isTablet,
        isDesktop,
        breakpoints
    }
}
```

**Source:** [VueUse useBreakpoints](https://vueuse.org/core/usebreakpoints/)

### Hamburger Menu Component

```vue
<!-- resources/js/Components/Mobile/HamburgerMenu.vue -->
<template>
    <div class="md:hidden">
        <!-- Hamburger button -->
        <button
            @click="isOpen = !isOpen"
            class="p-2 rounded hover:bg-gray-100"
            aria-label="Toggle menu"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <!-- Mobile menu overlay -->
        <div
            v-if="isOpen"
            class="fixed inset-0 z-50 bg-black bg-opacity-50"
            @click="isOpen = false"
        >
            <div class="bg-white w-64 h-full shadow-lg" @click.stop>
                <nav class="p-4">
                    <a href="/" class="block py-2 px-4 rounded hover:bg-gray-100">Home</a>
                    <a href="/deck-builder" class="block py-2 px-4 rounded hover:bg-gray-100">Deck Builder</a>
                    <!-- Add more navigation items -->
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>
```

**Source:** [Tailwind CSS Mobile Navigation Patterns](https://tailwindcss.com/docs/responsive-design)

### Dust Cost to USD Conversion

```vue
<!-- resources/js/Components/DustCostDisplay.vue -->
<template>
    <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
            <img src="/images/dust-icon.png" alt="Dust" class="w-5 h-5" />
            <span class="font-semibold">{{ totalDust }}</span>
        </div>
        <div class="text-sm text-gray-600">
            ≈ ${{ estimatedUSD }}
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

// Official Hearthstone dust costs
const DUST_COSTS = {
    common: 40,
    rare: 100,
    epic: 400,
    legendary: 1600
}

// USD value per dust (based on pack value)
const USD_PER_DUST = 0.0143 // ~$43 per 3000 dust pack

const props = defineProps({
    cards: {
        type: Array,
        required: true
    }
})

const totalDust = computed(() => {
    return props.cards.reduce((total, card) => {
        return total + DUST_COSTS[card.rarity] * card.count
    }, 0)
})

const estimatedUSD = computed(() => {
    return (totalDust.value * USD_PER_DUST).toFixed(2)
})
</script>
```

**Source:** Official Hearthstone dust costs (hardcoded from game values)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Fixed ad sizes | Responsive ad units with data-full-width-responsive | 2020+ | Ads automatically adapt to screen size, better mobile UX |
| Manual affiliate link building | Direct Amazon associate tag URLs | Ongoing | Simpler integration, avoids deprecated PAAPI5 (2026) |
| Desktop-first design | Mobile-first responsive design | 2019+ (Google mobile-first indexing) | Better mobile UX, improved SEO, aligned with traffic patterns |
| Manual ad placement on route change | AdSense auto ads for SPAs | 2021+ | Automatic SPA routing support, less maintenance |
| Custom lazy loading implementations | Native loading="lazy" browser support | 2020+ | Zero-JS solution, better performance, browser-native |
| AdSense in footer only | Strategic ad placement throughout content | Ongoing best practice | Better visibility, higher CTR while maintaining UX |

**Deprecated/outdated:**
- **vue-google-adsense plugin:** Does not support Vue 3, use custom implementation or vue3-google-adsense
- **Amazon Product Advertising API (PAAPI 5.0):** Deprecated April 30, 2026, migrating to Creators API (not needed for simple affiliate links)
- **Desktop-only ad layouts:** Mobile-first responsive design is now standard and required by Google
- **Hardcoded ad sizes:** Responsive ad units are now standard and provide better UX
- **Missing FTC disclosures:** FTC actively enforces disclosure requirements, non-compliance risks penalties

## Open Questions

### 1. AdSense Approval Timeline

**What we know:** AdSense requires application approval, new sites typically take 1-2 weeks for approval.

**What's unclear:** Whether current traffic levels are sufficient for approval, or if approval should be delayed until after Phase 4 implementation.

**Recommendation:** Apply for AdSense account during Phase 4 implementation, include affiliate links and content-rich pages to improve approval chances. Can proceed with implementation regardless of approval status (ads won't show until approved).

### 2. Optimal Ad Placement for UX vs Revenue

**What we know:** Locked decision specifies max 3-4 ads per page with responsive sizing.

**What's unclear:** Which specific positions perform best while maintaining good UX (above-fold vs below-fold, sidebar vs inline).

**Recommendation:** Start with conservative placement (1-2 ads visible initially, rest below-fold), use A/B testing if traffic justifies it. Monitor bounce rate and time on site as UX signals.

### 3. Amazon Associate Tag Integration

**What we know:** Need to generate Amazon Associate tag and append to product URLs.

**What's unclear:** Whether to use existing card pack ASINs or create custom Amazon lists.

**Recommendation:** Use direct product links for standard Hearthstone card bundles, hardcode ASINs for major card pack offerings. Associate tag should be stored in .env file for easy management.

### 4. Core Web Vitals Thresholds

**What we know:** Google's recommended thresholds are "Good" if LCP < 2.5s, INP < 200ms, CLS < 0.1.

**What's unclear:** Current baseline metrics before optimization, specific impact of ads on these metrics.

**Recommendation:** Run Lighthouse audit before Phase 4 implementation to establish baseline. Re-run after each optimization (lazy loading, code splitting, image optimization) to measure improvement.

## Sources

### Primary (HIGH confidence)

- **Inertia.js Code Splitting Documentation** - https://inertiajs.com/docs/v2/advanced/code-splitting
  - Verified that import.meta.glob without eager: true enables automatic code splitting
  - Confirmed current app.js setup is correct

- **Google AdSense Auto Ads Documentation** - https://support.google.com/adsense/answer/9261307
  - Official documentation for AdSense auto ads implementation
  - Covers SPA integration requirements

- **Google AdSense Responsive Ad Units** - https://support.google.com/adsense/answer/9183362
  - Official documentation for responsive ad unit behavior
  - Confirms data-full-width-responsive="true" enables automatic sizing

- **Google Developers - Core Web Vitals** - https://developers.google.com/search/docs/appearance/core-web-vitals
  - Official Google documentation on Core Web Vitals metrics
  - Thresholds for LCP, INP, CLS

- **Tailwind CSS Responsive Design** - https://tailwindcss.com/docs/responsive-design
  - Official Tailwind CSS documentation on mobile-first responsive design
  - Breakpoint system and utility classes

- **VueUse useBreakpoints** - https://vueuse.org/core/usebreakpoints/
  - Official VueUse documentation for reactive breakpoint detection
  - Recommended approach for responsive state in Vue 3

### Secondary (MEDIUM confidence)

- **Jason Watmore - AdSense in SPAs** - https://jasonwatmore.com/add-google-adsense-to-a-single-page-app-react-angular-vue-next-etc
  - Verified with official AdSense docs
  - Covers Vue-specific SPA integration patterns

- **Sky SEO Digital - Core Web Vitals 2026 Guide** - https://skyseodigital.com/core-web-vitals-optimization-complete-guide-for-2026/
  - Current 2025-2026 best practices for CWV optimization
  - Confirmed thresholds match official Google docs

- **Vue 3 Performance Optimization (Medium)** - https://medium.com/@betecieai/vue-performance-optimization-of-component-of-a-large-scale-application-vue3-cf86db8816f2
  - Lazy loading and code splitting patterns for Vue 3
  - Verified with official Vue documentation

- **Vue3图片自适应组件实现** (Vue 3 Responsive Image Component) - https://comate.baidu.com/zh/page/7q5jzt2gc3s
  - December 2025 article covering srcset implementation in Vue 3
  - Verified technical approach with MDN documentation

- **Amazon Product Advertising API 5.0 Documentation** - https://webservices.amazon.com/paapi5/documentation/
  - Official API documentation
  - Confirms complexity and deprecation timeline (April 2026)

### Tertiary (LOW confidence - marked for validation)

- **vue3-google-adsense GitHub Repository** - https://github.com/lcw3176/vue3-google-adsense
  - Community-maintained Vue 3 AdSense component
  - Should verify maintenance status and compatibility before using

- **sanjayojha/laravel-amazon-paapi5** - https://github.com/sanjayojha/laravel-amazon-paapi5
  - Laravel wrapper for Amazon PAAPI5
  - Marked as NOT RECOMMENDED due to API deprecation

- **FTC Affiliate Disclosure Requirements (Multiple Sources)**:
  - https://www.referralcandy.com/blog/ftc-affiliate-disclosure
  - https://thesocialmedialawfirm.com/blog/influencer-law/what-are-ftc-disclosure-rules-for-influencers-in-2026-complete-guide-examples/
  - Multiple legal firm interpretations of FTC requirements
  - Should verify with official FTC documentation or legal counsel for production use

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation and widely-used industry standards
- Architecture: HIGH - Verified with official Inertia.js, Vue 3, Tailwind CSS, and AdSense documentation
- Pitfalls: HIGH - Based on common issues documented in community discussions and official best practices

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - stable domain with some 2026 API changes to monitor)

**Key 2026 updates to monitor:**
- **April 30, 2026:** Amazon PAAPI 5.0 deprecation deadline (use direct links instead)
- **Ongoing:** Core Web Vitals thresholds (Google may update INP threshold based on 2024-2025 data)
- **Ongoing:** AdSense policy updates (monitor for SPA-specific requirements)
