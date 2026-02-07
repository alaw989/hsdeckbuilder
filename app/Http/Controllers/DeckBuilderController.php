<?php

namespace App\Http\Controllers;

use App\Services\HearthstoneService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeckBuilderController extends Controller
{
    public function __construct(
        private HearthstoneService $hearthstone
    ) {}

    public function index(Request $request)
    {
        $cards = $this->hearthstone->getAllCards();

        // Get shared deck code from query parameter
        $deckCode = $request->query('deck');
        $sharedDeckCode = null;

        if ($deckCode) {
            // Validate deck code format
            $validator = validator(
                ['deck' => $deckCode],
                [
                    'deck' => 'required|string|min:30|max:200|regex:/^[A-Za-z0-9+\/=]+$/u'
                ]
            );

            if ($validator->fails()) {
                // Redirect to deck builder without deck parameter on validation failure
                return redirect()->route('deck-builder');
            }

            $sharedDeckCode = $deckCode;
        }

        return Inertia::render('DeckBuilder', [
            'cards' => $cards,
            'initialClass' => 'NEUTRAL',
            'sharedDeckCode' => $sharedDeckCode
        ]);
    }
}
