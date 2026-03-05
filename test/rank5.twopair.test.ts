import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5, Category } from "../src/poker/rank5";

const card = (s: string) => analyzeCard(s);

describe("rank5 - two pair evaluation", () => {
    it("detects two pair and returns correct tiebreak and chosen5 order", () => {

        const cards = [card("3C"), card("KS"), card("AS"), card("KD"), card("3H")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.TwoPair);
        expect(result.tiebreak).toEqual([13, 3, 14]);
        expect(result.chosen5.map(card => card.code)).toEqual(["KS", "KD", "3H", "3C", "AS"]);
    });
});