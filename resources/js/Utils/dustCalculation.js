/**
 * Hearthstone Arcane Dust crafting costs
 * Source: https://hearthstone.fandom.com/wiki/Crafting
 */
const DUST_COSTS = {
  FREE: 0,
  COMMON: 40,
  RARE: 100,
  EPIC: 400,
  LEGENDARY: 1600
};

/**
 * Calculate total dust cost to craft deck
 *
 * @param {Array} deckCards - Array of { card, count } objects
 * @returns {Object} { total, byRarity, counts }
 */
export function calculateDustCost(deckCards) {
  const byRarity = {
    FREE: 0,
    COMMON: 0,
    RARE: 0,
    EPIC: 0,
    LEGENDARY: 0,
    total: 0
  };

  const counts = {
    FREE: 0,
    COMMON: 0,
    RARE: 0,
    EPIC: 0,
    LEGENDARY: 0
  };

  for (const item of deckCards) {
    const rarity = (item.card.rarity || 'FREE').toUpperCase();
    const dust = DUST_COSTS[rarity] || 0;
    const total = dust * item.count;

    byRarity[rarity] = (byRarity[rarity] || 0) + total;
    byRarity.total += total;

    counts[rarity] = (counts[rarity] || 0) + item.count;
  }

  return {
    total: byRarity.total,
    byRarity,
    counts
  };
}

/**
 * Get dust cost for a single card
 */
export function getCardDustCost(rarity) {
  return DUST_COSTS[rarity] || 0;
}

/**
 * Get dust color for rarity (for display)
 */
export function getRarityColor(rarity) {
  const colors = {
    FREE: 'text-gray-500',
    COMMON: 'text-gray-400',
    RARE: 'text-blue-500',
    EPIC: 'text-purple-500',
    LEGENDARY: 'text-orange-500'
  };
  return colors[rarity] || 'text-gray-500';
}

/**
 * Calculate USD equivalent cost of dust
 * Based on pack value: ~$43 for 3000 dust (minus ~400 average duplicate value)
 * USD per dust: ~$0.0143
 *
 * @param {number} dustCost - Total dust cost
 * @returns {string} Formatted USD string (e.g., "$12.45")
 */
export function calculateUsdCost(dustCost) {
  const USD_PER_DUST = 0.0143; // Based on pack economics
  const usdCost = dustCost * USD_PER_DUST;
  return `$${usdCost.toFixed(2)}`;
}

/**
 * Calculate dust cost per rarity breakdown with USD values
 *
 * @param {Array} deckCards - Array of {card, count}
 * @returns {Object} { total, counts, byRarity, usdTotal }
 */
export function calculateDustCostWithUsd(deckCards) {
  const baseResult = calculateDustCost(deckCards);

  return {
    ...baseResult,
    usdTotal: calculateUsdCost(baseResult.total)
  };
}

/**
 * Get rarity border color
 */
export function getRarityBorderColor(rarity) {
  const colors = {
    FREE: 'border-gray-300',
    COMMON: 'border-gray-400',
    RARE: 'border-blue-500',
    EPIC: 'border-purple-500',
    LEGENDARY: 'border-orange-500'
  };
  return colors[rarity] || 'border-gray-300';
}
