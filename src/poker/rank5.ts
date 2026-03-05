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


    if (pairs.length === 1) {
        const pairRank = pairs[0]!;
        const pairCards = [...(byRank.get(pairRank) ?? [])];

        const kickers = [...cards]
            .filter(c => c.rank !== pairRank)
            .sort((a, b) => b.rank - a.rank);

        return {
            category: Category.OnePair,
            tiebreak: [pairRank, ...kickers.map(k => k.rank)],
            chosen5: [...pairCards, ...kickers]
        };
    }


    const sorted = [...cards].sort((a, b) => b.rank - a.rank);
    return {
        category: Category.HighCard,
        tiebreak: sorted.map(c => c.rank),
        chosen5: sorted
    };
}