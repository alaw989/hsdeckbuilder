import { decode, encode } from '@firestone-hs/deckstrings';

/**
 * Hearthstone card class to hero DBF ID mapping
 * Used for deck code import to determine deck class
 */
const HERO_DBF_IDS = {
  7: 'WARRIOR',
  931: 'DRUID',
  1066: 'HUNTER',
  274: 'MAGE',
  414: 'PALADIN',
  839: 'PRIEST',
  2836: 'ROGUE',
  768: 'SHAMAN',
  893: 'WARLOCK',
  30: 'NEUTRAL',
  1524: 'DEMONHUNTER'
};

/**
 * Reverse mapping: class name to hero DBF ID
 */
const CLASS_TO_HERO_DBF = {
  'WARRIOR': 7,
  'DRUID': 931,
  'HUNTER': 1066,
  'MAGE': 274,
  'PALADIN': 414,
  'PRIEST': 839,
  'ROGUE': 2836,
  'SHAMAN': 768,
  'WARLOCK': 893,
  'NEUTRAL': 30,
  'DEMONHUNTER': 1524
};

/**
 * Format constants matching Hearthstone deckstring spec
 */
const FORMAT = {
  WILD: 1,
  STANDARD: 2,
  TWIST: 3
};

/**
 * Import a Blizzard deck code string
 *
 * @param {string} deckstring - Base64 encoded deckstring
 * @param {Object} cardDbfMap - Map of dbfId to card objects (from all cards)
 * @returns {Object} { cards: Array, class: string, format: string, error: string|null }
 */
export function importDeckCode(deckstring, cardDbfMap) {
  try {
    // Decode the deckstring
    const decoded = decode(deckstring);

    // Extract hero DBF ID to determine class
    const heroDbfId = decoded.heroes[0];
    const deckClass = HERO_DBF_IDS[heroDbfId] || 'NEUTRAL';

    // Determine format
    const formatNum = decoded.format;
    let format = 'wild';
    if (formatNum === FORMAT.STANDARD) format = 'standard';
    else if (formatNum === FORMAT.TWIST) format = 'twist';

    // Convert [dbfId, count] pairs to card objects
    const cards = decoded.cards.map(([dbfId, count]) => {
      const card = cardDbfMap[dbfId];

      if (!card) {
        console.warn(`Card with DBF ID ${dbfId} not found in database`);
        return null;
      }

      return {
        card,
        count
      };
    }).filter(item => item !== null);

    return {
      cards,
      class: deckClass,
      format,
      error: null
    };
  } catch (error) {
    console.error('Deck code import error:', error);
    return {
      cards: [],
      class: 'NEUTRAL',
      format: 'wild',
      error: 'Invalid deck code. Please check and try again.'
    };
  }
}

/**
 * Export current deck to Blizzard deck code string
 *
 * @param {Array} deckCards - Array of { card, count } objects
 * @param {string} deckClass - Selected deck class
 * @param {string} format - 'standard' or 'wild' (default: wild)
 * @returns {Object} { deckCode: string|null, error: string|null }
 */
export function exportDeckCode(deckCards, deckClass, format = 'wild') {
  try {
    // Convert deck cards to [dbfId, count] pairs
    const cards = deckCards.map(item => [item.card.dbfId, item.count]);

    // Get hero DBF ID for class
    const heroDbfId = CLASS_TO_HERO_DBF[deckClass] || 30; // Default to Neutral

    // Determine format number
    const formatNum = format === 'standard' ? FORMAT.STANDARD :
                      format === 'twist' ? FORMAT.TWIST :
                      FORMAT.WILD;

    // Encode deck data
    const deckData = {
      cards,
      heroes: [heroDbfId],
      format: formatNum
    };

    const deckCode = encode(deckData);

    return {
      deckCode,
      error: null
    };
  } catch (error) {
    console.error('Deck code export error:', error);
    return {
      deckCode: null,
      error: 'Failed to export deck code. Please check your deck and try again.'
    };
  }
}

/**
 * Validate if a string looks like a Hearthstone deck code
 * Deck codes are base64 strings, typically 50-100 characters
 */
export function isValidDeckCodeString(str) {
  if (!str || typeof str !== 'string') return false;

  // Remove whitespace
  const cleaned = str.trim();

  // Deck codes are typically 50-100 characters
  if (cleaned.length < 30 || cleaned.length > 200) return false;

  // Should be valid base64 (alphanumeric + / + =)
  const base64Pattern = /^[A-Za-z0-9+/=]+$/;
  return base64Pattern.test(cleaned);
}

/**
 * Format deck code for display (adds line breaks for readability)
 */
export function formatDeckCodeForDisplay(deckCode) {
  if (!deckCode) return '';

  // Split into chunks of 20 characters for readability
  const chunks = [];
  for (let i = 0; i < deckCode.length; i += 20) {
    chunks.push(deckCode.slice(i, i + 20));
  }

  return chunks.join('\n');
}
