<script setup>
const props = defineProps({
    filters: { type: Object, required: true },
    classes: { type: Array, required: true },
    manaCosts: { type: Array, required: true },
    types: { type: Array, required: true },
    rarities: { type: Array, required: true },
    sets: { type: Array, required: true },
});

const emit = defineEmits(['updateFilter']);

function updateFilter(key, event) {
    emit('updateFilter', key, event.target.value);
}
</script>

<template>
    <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Class Filter (CORE-02, CORE-11) -->
            <div>
                <label for="class-filter" class="block text-sm font-medium text-gray-700 mb-1">
                    Class
                </label>
                <select
                    id="class-filter"
                    :value="filters.class"
                    @change="updateFilter('class', $event)"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option v-for="cls in classes" :key="cls.value" :value="cls.value">
                        {{ cls.label }}
                    </option>
                </select>
            </div>

            <!-- Mana Cost Filter (CORE-02) -->
            <div>
                <label for="mana-filter" class="block text-sm font-medium text-gray-700 mb-1">
                    Mana Cost
                </label>
                <select
                    id="mana-filter"
                    :value="filters.manaCost"
                    @change="updateFilter('manaCost', $event)"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option v-for="mana in manaCosts" :key="mana.value ?? 'null'" :value="mana.value">
                        {{ mana.label }}
                    </option>
                </select>
            </div>

            <!-- Type Filter (CORE-02) -->
            <div>
                <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">
                    Type
                </label>
                <select
                    id="type-filter"
                    :value="filters.type"
                    @change="updateFilter('type', $event)"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option v-for="type in types" :key="type.value" :value="type.value">
                        {{ type.label }}
                    </option>
                </select>
            </div>

            <!-- Rarity Filter (CORE-02) -->
            <div>
                <label for="rarity-filter" class="block text-sm font-medium text-gray-700 mb-1">
                    Rarity
                </label>
                <select
                    id="rarity-filter"
                    :value="filters.rarity"
                    @change="updateFilter('rarity', $event)"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option v-for="rarity in rarities" :key="rarity.value" :value="rarity.value">
                        {{ rarity.label }}
                    </option>
                </select>
            </div>

            <!-- Set Filter (CORE-02) -->
            <div>
                <label for="set-filter" class="block text-sm font-medium text-gray-700 mb-1">
                    Card Set
                </label>
                <select
                    id="set-filter"
                    :value="filters.set"
                    @change="updateFilter('set', $event)"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option v-for="set in sets.slice(0, 50)" :key="set.value" :value="set.value">
                        {{ set.label }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>
