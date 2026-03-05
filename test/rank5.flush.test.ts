import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5, Category } from "../src/poker/rank5";

const card = (s: string) => analyzeCard(s);

describe("rank5 - flush evaluation", () => {
    it("detects a flush and uses ranks as tiebreak", () => {
        // Flush pique (ordre d'entrée mélangé)
        const cards = [card("2S"), card("AS"), card("7S"), card("KS"), card("4S")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.Flush);
        expect(result.tiebreak).toEqual([14, 13, 7, 4, 2]);
        expect(result.chosen5.map(x => x.code)).toEqual(["AS", "KS", "7S", "4S", "2S"]);
    });

    it("detects a straight flush (not just a flush)", () => {
        const cards = [card("9S"), card("8S"), card("7S"), card("6S"), card("5S")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.StraightFlush);
        expect(result.tiebreak).toEqual([9]);
        expect(result.chosen5.map(x => x.code)).toEqual(["9S", "8S", "7S", "6S", "5S"]);
    });
});