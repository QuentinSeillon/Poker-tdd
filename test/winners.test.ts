import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";
import { winners } from "../src/poker/winners";

const card = (s: string) => analyzeCard(s);

describe("winners", () => {
    it("returns the single winner", () => {
        const board = [card("AS"), card("KS"), card("7S"), card("4S"), card("2D")];

        const players = [
            { id: "p1", hole: [card("QD"), card("JC")] }, // High card / nothing special
            { id: "p2", hole: [card("2S"), card("9S")] }  // Flush (pique) via 4 piques board + 2S/9S => 5 piques
        ];

        const result = winners(board, players);

        expect(result.winners).toEqual(["p2"]);
        expect(result.rank.category).toBeDefined();
    });

    it("returns multiple winners when tied (board plays)", () => {
        const board = [card("AS"), card("KD"), card("QH"), card("JC"), card("TD")]; // Straight au board

        const players = [
            { id: "p1", hole: [card("2S"), card("3S")] },
            { id: "p2", hole: [card("4D"), card("5D")] }
        ];

        const result = winners(board, players);

        expect(result.winners.sort()).toEqual(["p1", "p2"]);
    });
});