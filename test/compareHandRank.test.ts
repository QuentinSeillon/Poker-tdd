import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5 } from "../src/poker/rank5";
import { compareHandRank } from "../src/poker/compare";


const card = (s: string) => analyzeCard(s);

describe("compareHandRank", () => {
    it("returns > 0 when category of a is stronger than b", () => {
        const straight = rank5([card("AS"), card("KD"), card("QH"), card("JC"), card("TD")]); // Straight
        const flush = rank5([card("AS"), card("KS"), card("7S"), card("4S"), card("2S")]);    // Flush

        expect(compareHandRank(flush, straight)).toBeGreaterThan(0); // Flush (5) beats Straight (4)
        expect(compareHandRank(straight, flush)).toBeLessThan(0); // Straight (4) loses to Flush (5)
    });

    it("when categories match, uses the tiebreak array to decide winner", () => {
        const pairA = rank5([card("AS"), card("AD"), card("9H"), card("5C"), card("2D")]); // Pair of A
        const pairK = rank5([card("KS"), card("KD"), card("QH"), card("5D"), card("2C")]); // Pair of K

        expect(compareHandRank(pairA, pairK)).toBeGreaterThan(0); // A (14) beats K (13)
        expect(compareHandRank(pairK, pairA)).toBeLessThan(0); // K (13) loses to A (14)
    });

    it("returns 0 for exact ties (same category + same tiebreak)", () => {
        const h1 = rank5([card("AS"), card("KD"), card("7H"), card("4C"), card("2D")]);
        const h2 = rank5([card("AS"), card("KD"), card("7H"), card("4C"), card("2D")]);

        expect(compareHandRank(h1, h2)).toBe(0);
    });
});