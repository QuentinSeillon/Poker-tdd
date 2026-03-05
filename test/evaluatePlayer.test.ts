import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { evaluatePlayer } from "../src/poker/evaluateplayer";
import { Category } from "../src/poker/rank5";

const card = (s: string) => analyzeCard(s);

describe("evaluatePlayer", () => {
    it("combines board + hole cards and returns best hand", () => {
        const board = [card("AS"), card("KD"), card("QH"), card("JC"), card("TD")];
        const hole = [card("2S"), card("2H")]; // n'améliore pas

        const result = evaluatePlayer(board, hole);

        expect(result.category).toBe(Category.Straight);
        expect(result.tiebreak).toEqual([14]);
        expect(result.chosen5.map(x => x.code)).toEqual(["AS", "KD", "QH", "JC", "TD"]);
    });

    it("supports 'board plays' (hole cards not used)", () => {
        const board = [card("9S"), card("8S"), card("7S"), card("6S"), card("5S")];
        const hole = [card("AD"), card("KC")];

        const result = evaluatePlayer(board, hole);

        expect(result.category).toBe(Category.StraightFlush);
        expect(result.tiebreak).toEqual([9]);
        expect(result.chosen5.map(card => card.code)).toEqual(["9S", "8S", "7S", "6S", "5S"]);
    });
});