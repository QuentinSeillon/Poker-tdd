import type { Card, Suit } from "./types";

const RANK_MAP: Record<string, number> = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
    "7": 7, "8": 8, "9": 9, "T": 10, "J": 11,
    "Q": 12, "K": 13, "A": 14
};

const SUITS: Suit[] = ["S", "H", "D", "C"];

export function analyzeCard(code: string): Card {
    if (code.length !== 2) throw new Error(`Invalid card code: ${code}`);
    const r = code[0]!;
    const s = code[1] as Suit;

    const rank = RANK_MAP[r];
    if (!rank) throw new Error(`Invalid rank: ${r}`);
    if (!SUITS.includes(s)) throw new Error(`Invalid suit: ${s}`);

    return { rank, suit: s, code };
}