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

    const sorted = [...cards].sort((a, b) => b.rank - a.rank);

    return {
        category: Category.HighCard,
        tiebreak: sorted.map(card => card.rank),
        chosen5: sorted
    };
}