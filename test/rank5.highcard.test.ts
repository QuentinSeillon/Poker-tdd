import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { rank5, Category } from "../src/poker/rank5";

const parse = (code: string) => analyzeCard(code);

describe("rank5 - high card evaluation", () => {
    it("returns a High Card hand with the correct tiebreak and chosen5 order", () => {
        const cards = [
            parse("AS"),
            parse("KD"),
            parse("7H"),
            parse("4C"),
            parse("2D")
        ];

        const result = rank5(cards);

        // console.log(result);

        expect(result.category).toBe(Category.HighCard);
        expect(result.tiebreak).toEqual([14, 13, 7, 4, 2]);
        expect(result.chosen5.map(card => card.code)).toEqual([
            "AS",
            "KD",
            "7H",
            "4C",
            "2D"
        ]);
    });
});