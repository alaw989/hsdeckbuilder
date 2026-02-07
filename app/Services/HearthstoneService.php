<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class HearthstoneService
{
    private const BASE_URL = 'https://api.hearthstonejson.com/v1';
    private const CACHE_TTL_HOURS = 24;

    public function getAllCards(): array
    {
        return Cache::remember('cards.all', now()->addHours(self::CACHE_TTL_HOURS), function () {
            $response = Http::get(self::BASE_URL . '/latest/enUS/cards.collectible.json');

            if (!$response->successful()) {
                throw new \RuntimeException('Failed to fetch cards from HearthstoneJSON');
            }

            return $response->json();
        });
    }

    public function getCardsByClass(string $class): array
    {
        return Cache::remember("cards.class.{$class}", now()->addHours(self::CACHE_TTL_HOURS), function () use ($class) {
            $allCards = $this->getAllCards();

            return collect($allCards)
                ->filter(fn($card) => $card['cardClass'] === strtoupper($class) || $card['cardClass'] === 'NEUTRAL')
                ->values()
                ->all();
        });
    }

    public function getCardsByFormat(string $format): array
    {
        // Current Standard sets as of 2024 (update as needed)
        $standardSets = [
            'PERMITTENOL', 'REVENDRETH', 'FROZEN_THRONE', 'DARKMOON_FAIRE',
            'STORMWIND', 'ALTERAC_VALLEY', 'ONYXIAS_LAIR', 'SHOWCASE',
            'FESTIVAL_OF_LEGENDS', 'TITANS', 'BADLANDS', 'PATH_OF_ARTHAS'
        ];

        return Cache::remember("cards.format.{$format}", now()->addHours(self::CACHE_TTL_HOURS), function () use ($format, $standardSets) {
            $allCards = $this->getAllCards();

            if ($format === 'standard') {
                return collect($allCards)
                    ->filter(fn($card) => in_array($card['set'], $standardSets))
                    ->values()
                    ->all();
            }

            // Wild and Twist include all cards
            return $allCards;
        });
    }

    public function clearCardCache(): void
    {
        Cache::forget('cards.all');
        $classes = ['DEMONHUNTER', 'DRUID', 'HUNTER', 'MAGE', 'PALADIN', 'PRIEST', 'ROGUE', 'SHAMAN', 'WARLOCK', 'WARRIOR'];
        foreach ($classes as $class) {
            Cache::forget("cards.class.{$class}");
        }
        Cache::forget('cards.format.standard');
        Cache::forget('cards.format.wild');
        Cache::forget('cards.format.twist');
    }
}
