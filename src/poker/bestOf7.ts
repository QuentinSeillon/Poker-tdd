import type { Card } from "./types";
import type { HandRank } from "./rank5";
import { rank5 } from "./rank5";
import { compareHandRank } from "./compare";

const SUIT_ORDER: Record<Card["suit"], number> = { S: 4, H: 3, D: 2, C: 1 };

function sortCardsDeterministic(cards: readonly Card[]): Card[] {
    return [...cards].sort((a, b) => {
        if (a.rank !== b.rank) return b.rank - a.rank;
        return SUIT_ORDER[b.suit] - SUIT_ORDER[a.suit];
    });
}

export function bestOf7(cards: readonly Card[]): HandRank {
    if (cards.length !== 7) throw new Error("bestOf7 expects exactly 7 cards");

    // On trie d'abord les 7 cartes pour rendre le résultat déterministe,
    // même si l'entrée est dans un ordre différent.
    const sorted7 = sortCardsDeterministic(cards);

    let best: HandRank | null = null;

    // 7 choose 5 = exclure 2 cartes -> (i, j)
    for (let i = 0; i < 6; i++) {
        for (let j = i + 1; j < 7; j++) {
            const combo5: Card[] = [];
            for (let k = 0; k < 7; k++) {
                if (k !== i && k !== j) combo5.push(sorted7[k]!);
            }

            const current = rank5(combo5);

            if (!best || compareHandRank(current, best) > 0) {
                best = current;
            }
        }
    }

    return best!;
}