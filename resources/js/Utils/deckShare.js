import { exportDeckCode } from './deckCode';

/**
 * Generate a shareable URL for a deck
 *
 * @param {Array} deckCards - Array of { card, count } objects
 * @param {string} deckClass - Selected deck class
 * @param {string} baseUrl - Base URL for the share link (default: current origin)
 * @returns {Object} { url: string|null, error: string|null }
 */
export function generateShareUrl(deckCards, deckClass, baseUrl = window.location.origin) {
  try {
    // Export deck to deck code
    const result = exportDeckCode(deckCards, deckClass, 'wild');

    if (result.error) {
      return {
        url: null,
        error: result.error
      };
    }

    // Encode deck code for URL
    const encodedDeckCode = encodeURIComponent(result.deckCode);

    // Generate shareable URL
    const shareUrl = `${baseUrl}/deck-builder?deck=${encodedDeckCode}`;

    return {
      url: shareUrl,
      error: null
    };
  } catch (error) {
    console.error('Share URL generation error:', error);
    return {
      url: null,
      error: 'Failed to generate share URL. Please check your deck and try again.'
    };
  }
}

/**
 * Parse shared deck code from URL query parameters
 *
 * @returns {Object} { deckCode: string|null, error: string|null }
 */
export function parseSharedDeckFromUrl() {
  try {
    // Get URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const deckCode = searchParams.get('deck');

    if (!deckCode) {
      return {
        deckCode: null,
        error: null
      };
    }

    // Decode the deck code
    const decodedDeckCode = decodeURIComponent(deckCode);

    return {
      deckCode: decodedDeckCode,
      error: null
    };
  } catch (error) {
    console.error('Shared deck parsing error:', error);
    return {
      deckCode: null,
      error: 'Failed to parse shared deck from URL.'
    };
  }
}
