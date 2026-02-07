import { ref, reactive, computed } from 'vue';

export function useDeckBuilder(initialClass = 'NEUTRAL') {
  // Reactive state
  const selectedClass = ref(initialClass);
  const deckCards = reactive([]); // Array of { card, count }

  // Computed properties
  const deckCount = computed(() =>
    deckCards.reduce((sum, item) => sum + item.count, 0)
  );

  const uniqueCardCount = computed(() => deckCards.length);

  // Actions
  function addCard(card) {
    const existing = deckCards.find(item => item.card.id === card.id);

    if (existing) {
      // Check max copies (1 for Legendary, 2 for others)
      const maxCopies = card.rarity === 'LEGENDARY' ? 1 : 2;
      if (existing.count < maxCopies) {
        existing.count++;
      }
    } else {
      // Add new card to deck
      deckCards.push({ card, count: 1 });
    }
  }

  function removeCard(cardId) {
    const index = deckCards.findIndex(item => item.card.id === cardId);
    if (index === -1) return;

    if (deckCards[index].count > 1) {
      deckCards[index].count--;
    } else {
      deckCards.splice(index, 1);
    }
  }

  function setCardCount(cardId, newCount) {
    const index = deckCards.findIndex(item => item.card.id === cardId);
    if (index === -1) return;

    if (newCount <= 0) {
      deckCards.splice(index, 1);
    } else {
      const maxCopies = deckCards[index].card.rarity === 'LEGENDARY' ? 1 : 2;
      deckCards[index].count = Math.min(newCount, maxCopies);
    }
  }

  function clearDeck() {
    deckCards.splice(0, deckCards.length);
  }

  function getCardsByManaCost() {
    const byCost = {};
    for (let i = 0; i <= 10; i++) {
      byCost[i] = [];
    }

    for (const item of deckCards) {
      const cost = Math.min(item.card.cost || 0, 10);
      byCost[cost].push(item);
    }

    return byCost;
  }

  return {
    selectedClass,
    deckCards,
    deckCount,
    uniqueCardCount,
    addCard,
    removeCard,
    setCardCount,
    clearDeck,
    getCardsByManaCost
  };
}
