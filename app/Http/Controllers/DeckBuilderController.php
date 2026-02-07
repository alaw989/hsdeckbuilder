<?php

namespace App\Http\Controllers;

use App\Services\HearthstoneService;
use Inertia\Inertia;

class DeckBuilderController extends Controller
{
    public function __construct(
        private HearthstoneService $hearthstone
    ) {}

    public function index()
    {
        $cards = $this->hearthstone->getAllCards();

        return Inertia::render('DeckBuilder', [
            'cards' => $cards,
            'initialClass' => 'NEUTRAL'
        ]);
    }
}
