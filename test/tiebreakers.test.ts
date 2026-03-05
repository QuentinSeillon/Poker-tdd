import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5, Category } from "../src/poker/rank5";
import { compareHandRank } from "../src/poker/compare";

const card = (s: string) => analyzeCard(s);

describe("Tie-breakers (same category)", () => {
    it("Flush vs Flush: highest kicker decides", () => {
        // Flush A-high: A K 9 6 2
        const flushA = rank5([card("AS"), card("KS"), card("9S"), card("6S"), card("2S")]);
        // Flush A-high but weaker: A K 8 6 2
        const flushB = rank5([card("AS"), card("KS"), card("8S"), card("6S"), card("2S")]);

        expect(flushA.category).toBe(Category.Flush);
        expect(flushB.category).toBe(Category.Flush);
        expect(compareHandRank(flushA, flushB)).toBeGreaterThan(0);
    });

    it("TwoPair vs TwoPair: kicker decides when both pairs are equal", () => {
        // KK + 33 + A kicker
        const tpA = rank5([card("KS"), card("KD"), card("3H"), card("3C"), card("AS")]);
        // KK + 33 + Q kicker
        const tpB = rank5([card("KS"), card("KD"), card("3H"), card("3C"), card("QH")]);

        expect(tpA.category).toBe(Category.TwoPair);
        expect(tpB.category).toBe(Category.TwoPair);
        expect(compareHandRank(tpA, tpB)).toBeGreaterThan(0);
    });

    it("FullHouse vs FullHouse: trip rank decides first", () => {
        // 7-7-7 + 2-2
        const fh7 = rank5([card("7S"), card("7H"), card("7D"), card("2C"), card("2D")]);
        // 6-6-6 + A-A (paire plus haute, mais brelan plus bas)
        const fh6 = rank5([card("6S"), card("6H"), card("6D"), card("AS"), card("AD")]);

        expect(fh7.category).toBe(Category.FullHouse);
        expect(fh6.category).toBe(Category.FullHouse);
        expect(compareHandRank(fh7, fh6)).toBeGreaterThan(0);
    });

    it("Straight vs Straight: 6-high beats 5-high (wheel)", () => {
        // 2-3-4-5-6 (6-high)
        const s6 = rank5([card("2S"), card("3D"), card("4H"), card("5C"), card("6S")]);
        // A-2-3-4-5 (wheel, 5-high)
        const s5 = rank5([card("AS"), card("2D"), card("3H"), card("4C"), card("5S")]);

        expect(s6.category).toBe(Category.Straight);
        expect(s5.category).toBe(Category.Straight);
        expect(compareHandRank(s6, s5)).toBeGreaterThan(0);
    });
});