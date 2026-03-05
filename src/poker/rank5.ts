import type { Card } from "./types";

export enum Category {
    HighCard = 0,
    OnePair = 1,
    TwoPair = 2,
    ThreeKind = 3,
    Straight = 4,
    Flush = 5,
    FullHouse = 6,
    FourKind = 7,
    StraightFlush = 8
}

export type HandRank = {
    category: Category;
    tiebreak: number[];
    chosen5: Card[];
};


const SUIT_ORDER: Record<Card["suit"], number> = { S: 4, H: 3, D: 2, C: 1 };

function sortCardsByType(cards: Card[]): Card[] {
    return [...cards].sort((a, b) => {
        if (a.rank !== b.rank) return b.rank - a.rank;
        return SUIT_ORDER[b.suit] - SUIT_ORDER[a.suit];
    });
}

export function rank5(cards: readonly Card[]): HandRank {
    if (cards.length !== 5) throw new Error("rank5 expects exactly 5 cards");


    const byRank = new Map<number, Card[]>();
    for (const card of cards) {
        const arr = byRank.get(card.rank) ?? [];
        arr.push(card);
        byRank.set(card.rank, arr);
    }

    const pairs: number[] = [];
    for (const [rank, group] of byRank.entries()) {
        if (group.length === 2) pairs.push(rank);
    }


    const trips: number[] = [];
    for (const [rank, group] of byRank.entries()) {
        if (group.length === 3) trips.push(rank);
    }

    // Si on a une tiers (Three of a Kind)
    if (trips.length === 1) {
        const tripRank = trips[0]!;
        const tripCards = sortCardsByType(byRank.get(tripRank) ?? []);

        const kickers = sortCardsByType(
            [...cards].filter(c => c.rank !== tripRank)
        );

        return {
            category: Category.ThreeKind,
            tiebreak: [tripRank, ...kickers.slice(0, 2).map(k => k.rank)],
            chosen5: [...tripCards, ...kickers.slice(0, 2)]
        };
    }

    // Si on a 2 paires
    if (pairs.length === 2) {
        const highPairRank = Math.max(...pairs);

        console.log("High pair rank:", highPairRank);
        const lowPairRank = Math.min(...pairs);
        console.log("Low pair rank:", lowPairRank);

        const highPairCards = sortCardsByType(byRank.get(highPairRank) ?? []);
        const lowPairCards = sortCardsByType(byRank.get(lowPairRank) ?? []);

        const kicker = sortCardsByType(
            [...cards].filter(card => card.rank !== highPairRank && card.rank !== lowPairRank)
        )[0]!;

        return {
            category: Category.TwoPair,
            tiebreak: [highPairRank, lowPairRank, kicker.rank],
            chosen5: [...highPairCards, ...lowPairCards, kicker]
        };
    }

    // Si on a une seul paire
    if (pairs.length === 1) {
        const pairRank = pairs[0]!;
        const pairCards = sortCardsByType(byRank.get(pairRank) ?? []);

        const kickers = sortCardsByType(
            [...cards].filter(c => c.rank !== pairRank)
        );

        return {
            category: Category.OnePair,
            tiebreak: [pairRank, ...kickers.map(k => k.rank)],
            chosen5: [...pairCards, ...kickers]
        };
    }


    const sorted = sortCardsByType([...cards]);
    return {
        category: Category.HighCard,
        tiebreak: sorted.map(c => c.rank),
        chosen5: sorted
    };
}