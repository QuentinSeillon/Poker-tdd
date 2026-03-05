import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5, Category } from "../src/poker/rank5";

const card = (s: string) => analyzeCard(s);

describe("rank5 - straight evaluation", () => {
    it("detects a normal straight and uses the highest card as tiebreak", () => {
        const cards = [card("AS"), card("KD"), card("QH"), card("JC"), card("TD")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.Straight);
        expect(result.tiebreak).toEqual([14]); // A-high straight
        expect(result.chosen5.map(x => x.code)).toEqual(["AS", "KD", "QH", "JC", "TD"]);
    });

    it("detects the wheel straight (A-2-3-4-5) with 5 as high card", () => {
        const cards = [card("AS"), card("2D"), card("3H"), card("4C"), card("5S")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.Straight);
        expect(result.tiebreak).toEqual([5]); // wheel = 5-high straight
        expect(result.chosen5.map(x => x.code)).toEqual(["5S", "4C", "3H", "2D", "AS"]);
    });
});