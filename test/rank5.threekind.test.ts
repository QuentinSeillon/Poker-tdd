import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5, Category } from "../src/poker/rank5";

const card = (s: string) => analyzeCard(s);

describe("rank5 - three of a kind evaluation", () => {
    it("detects three of a kind and returns correct tiebreak and chosen5 order", () => {
        // Brelan de 2 + kickers A, K
        const cards = [card("2S"), card("AS"), card("2D"), card("KD"), card("2H")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.ThreeKind);
        expect(result.tiebreak).toEqual([2, 14, 13]);
        expect(result.chosen5.map(x => x.code)).toEqual(["2S", "2H", "2D", "AS", "KD"]);
    });
});