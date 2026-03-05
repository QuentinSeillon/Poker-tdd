import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5, Category } from "../src/poker/rank5";

const card = (s: string) => analyzeCard(s);

describe("rank5 - full house evaluation", () => {
    it("detects a full house and returns correct tiebreak and chosen5 order", () => {
        const cards = [card("3S"), card("AD"), card("3D"), card("AS"), card("3H")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.FullHouse);
        expect(result.tiebreak).toEqual([3, 14]);
        expect(result.chosen5.map(x => x.code)).toEqual(["3S", "3H", "3D", "AS", "AD"]);
    });

    it("does not classify a full house as just three of a kind", () => {
        const cards = [card("7S"), card("7H"), card("7D"), card("KC"), card("KD")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.FullHouse);
        expect(result.tiebreak).toEqual([7, 13]);
    });
});