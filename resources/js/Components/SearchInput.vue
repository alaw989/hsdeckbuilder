<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    suggestions: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:modelValue', 'select']);

const input = ref(null);
const showSuggestions = ref(false);

const displayValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

function focus() {
    input.value?.focus();
}

function selectSuggestion(card) {
    emit('select', card);
    showSuggestions.value = false;
}

function onFocus() {
    showSuggestions.value = props.suggestions.length > 0;
}

function onBlur() {
    // Delay hiding to allow click on suggestion
    setTimeout(() => {
        showSuggestions.value = false;
    }, 200);
}

defineExpose({ focus });
</script>

<template>
    <div class="relative">
        <input
            ref="input"
            v-model="displayValue"
            type="text"
            placeholder="Search cards by name..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            @focus="onFocus"
            @blur="onBlur"
        />

        <!-- Autocomplete dropdown -->
        <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
        >
            <div
                v-if="showSuggestions && suggestions.length > 0"
                class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-auto"
            >
                <button
                    v-for="card in suggestions"
                    :key="card.id"
                    type="button"
                    class="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-3"
                    @mousedown.prevent="selectSuggestion(card)"
                >
                    <img
                        :src="`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`"
                        :alt="card.name"
                        class="w-12 h-12 rounded"
                        loading="lazy"
                    />
                    <div>
                        <div class="font-medium text-gray-900">{{ card.name }}</div>
                        <div class="text-sm text-gray-500">
                            {{ card.cost }} Mana • {{ card.rarity?.toLowerCase() }} • {{ card.cardClass?.toLowerCase() }}
                        </div>
                    </div>
                </button>
            </div>
        </Transition>
    </div>
</template>
