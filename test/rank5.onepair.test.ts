import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5, Category } from "../src/poker/rank5";

const card = (s: string) => analyzeCard(s);

describe("rank5 - one pair evaluation", () => {
    it("detects a pair and returns correct tiebreak and chosen5 order", () => {

        const cards = [card("7S"), card("7D"), card("AS"), card("KD"), card("2H")];

        const result = rank5(cards);

        expect(result.category).toBe(Category.OnePair);
        expect(result.tiebreak).toEqual([7, 14, 13, 2]);
        expect(result.chosen5.map(x => x.code)).toEqual(["7S", "7D", "AS", "KD", "2H"]);
    });
});