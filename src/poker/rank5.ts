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

    const sortedByType = sortCardsByType([...cards]);
    const byRank = groupByRank(cards);
    const { pairs, trips, quads } = findMultiples(byRank);


    const three = evaluateThreeOfKind(cards, byRank, trips);
    if (three) return three;

    const two = evaluateTwoPair(cards, byRank, pairs);
    if (two) return two;

    const one = evaluateOnePair(cards, byRank, pairs);
    if (one) return one;

    const straight = evaluateStraight(byRank);
    if (straight) return straight;


    return {
        category: Category.HighCard,
        tiebreak: sortedByType.map(c => c.rank),
        chosen5: sortedByType
    };
}

// ---------------------------- helpers -----------------------


function groupByRank(cards: readonly Card[]): Map<number, Card[]> {
    const map = new Map<number, Card[]>();
    for (const card of cards) {
        const arr = map.get(card.rank) ?? [];
        arr.push(card);
        map.set(card.rank, arr);
    }
    return map;
}

function findMultiples(
    byRank: Map<number, Card[]>
): { pairs: number[]; trips: number[]; quads: number[] } {
    const pairs: number[] = [];
    const trips: number[] = [];
    const quads: number[] = [];

    for (const [rank, group] of byRank.entries()) {
        if (group.length === 2) pairs.push(rank);
        else if (group.length === 3) trips.push(rank);
        else if (group.length === 4) quads.push(rank);
    }

    return { pairs, trips, quads };
}

function evaluateThreeOfKind(
    cards: readonly Card[],
    byRank: Map<number, Card[]>,
    trips: number[]
): HandRank | null {
    if (trips.length !== 1) return null;

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

function evaluateTwoPair(
    cards: readonly Card[],
    byRank: Map<number, Card[]>,
    pairs: number[]
): HandRank | null {
    if (pairs.length !== 2) return null;

    const highPairRank = Math.max(...pairs);
    const lowPairRank = Math.min(...pairs);

    const highPairCards = sortCardsByType(byRank.get(highPairRank) ?? []);
    const lowPairCards = sortCardsByType(byRank.get(lowPairRank) ?? []);

    const kicker = sortCardsByType(
        [...cards].filter(
            card => card.rank !== highPairRank && card.rank !== lowPairRank
        )
    )[0]!;

    return {
        category: Category.TwoPair,
        tiebreak: [highPairRank, lowPairRank, kicker.rank],
        chosen5: [...highPairCards, ...lowPairCards, kicker]
    };
}

function evaluateOnePair(
    cards: readonly Card[],
    byRank: Map<number, Card[]>,
    pairs: number[]
): HandRank | null {
    if (pairs.length !== 1) return null;

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

function evaluateStraight(byRank: Map<number, Card[]>): HandRank | null {
    const uniqueRanksAsc = [...byRank.keys()].sort((a, b) => a - b);

    if (uniqueRanksAsc.length !== 5) return null;

    const {
        isStraight,
        high,
        order
    } = computeStraightInfo(uniqueRanksAsc);

    if (!isStraight) return null;

    const chosen5 = order.map(rank => {
        const group = byRank.get(rank) ?? [];
        return sortCardsByType(group)[0]!;
    });

    return {
        category: Category.Straight,
        tiebreak: [high],
        chosen5
    };
}

function computeStraightInfo(
    uniqueRanksAsc: number[]
): { isStraight: boolean; high: number; order: number[] } {

    const isWheel =
        uniqueRanksAsc[0] === 2 &&
        uniqueRanksAsc[1] === 3 &&
        uniqueRanksAsc[2] === 4 &&
        uniqueRanksAsc[3] === 5 &&
        uniqueRanksAsc[4] === 14;

    if (isWheel) {
        return { isStraight: true, high: 5, order: [5, 4, 3, 2, 14] };
    }

    const min = uniqueRanksAsc[0]!;
    const max = uniqueRanksAsc[4]!;
    const consecutive =
        max - min === 4 &&
        uniqueRanksAsc.every((r, i) => i === 0 || r === uniqueRanksAsc[i - 1]! + 1);

    if (consecutive) {
        return {
            isStraight: true,
            high: max,
            order: [max, max - 1, max - 2, max - 3, max - 4]
        };
    }

    return { isStraight: false, high: 0, order: [] };
}