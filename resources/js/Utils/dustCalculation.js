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
