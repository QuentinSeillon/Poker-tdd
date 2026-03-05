import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5, Category } from "../src/poker/rank5";

const card = (s: string) => analyzeCard(s);

describe("rank5 - four of a kind evaluation", () => {
    it("detects four of a kind and returns correct tiebreak and chosen5 order", () => {
        const cards = [card("9S"), card("AD"), card("9D"), card("9H"), card("9C")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.FourKind);
        expect(result.tiebreak).toEqual([9, 14]);
        expect(result.chosen5.map(x => x.code)).toEqual(["9S", "9H", "9D", "9C", "AD"]);
    });

    it("does not classify four of a kind as full house / three of a kind", () => {
        const cards = [card("KS"), card("KD"), card("KH"), card("KC"), card("2D")];
        const result = rank5(cards);

        expect(result.category).toBe(Category.FourKind);
        expect(result.tiebreak).toEqual([13, 2]);
    });
});