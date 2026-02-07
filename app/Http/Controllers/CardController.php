<?php

namespace App\Http\Controllers;

use App\Services\HearthstoneService;
use Inertia\Inertia;

class CardController extends Controller
{
    public function __construct(
        private HearthstoneService $hearthstone
    ) {}

    public function index()
    {
        $cards = $this->hearthstone->getAllCards();

        return Inertia::render('CardSearch', [
            'cards' => $cards,
            'selectedClass' => request('class', 'all'),
            'selectedFormat' => request('format', 'wild'),
        ]);
    }

    public function byClass(string $class)
    {
        $cards = $this->hearthstone->getCardsByClass($class);

        return Inertia::render('CardSearch', [
            'cards' => $cards,
            'selectedClass' => strtoupper($class),
            'selectedFormat' => request('format', 'wild'),
        ]);
    }

    public function byFormat(string $format)
    {
        $cards = $this->hearthstone->getCardsByFormat($format);

        return Inertia::render('CardSearch', [
            'cards' => $cards,
            'selectedClass' => request('class', 'all'),
            'selectedFormat' => $format,
        ]);
    }
}
