import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { bestOf7 } from "../src/poker/bestOf7";
import { Category } from "../src/poker/rank5";

const card = (s: string) => analyzeCard(s);

describe("bestOf7", () => {
    it("picks the best hand among 7 cards (straight beats pair)", () => {
        // 7 cartes contiennent une suite A-K-Q-J-T + une paire de 2
        const cards7 = [card("AS"), card("KD"), card("QH"), card("JC"), card("TD"), card("2S"), card("2H")];

        const result = bestOf7(cards7);

        expect(result.category).toBe(Category.Straight);
        expect(result.tiebreak).toEqual([14]);
        expect(result.chosen5.map(x => x.code)).toEqual(["AS", "KD", "QH", "JC", "TD"]);
    });

    it("picks the best 5 cards for a flush when 6 suited cards exist", () => {
        // 6 piques -> le meilleur flush doit prendre les 5 plus hautes
        const cards7 = [card("AS"), card("KS"), card("QS"), card("JS"), card("9S"), card("2S"), card("3D")];

        const result = bestOf7(cards7);

        expect(result.category).toBe(Category.Flush);
        expect(result.tiebreak).toEqual([14, 13, 12, 11, 9]);
        expect(result.chosen5.map(card => card.code)).toEqual(["AS", "KS", "QS", "JS", "9S"]);
    });
});