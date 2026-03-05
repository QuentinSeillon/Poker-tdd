import { describe, it, expect } from "vitest";
import { analyzeCard } from "../src/poker/parse";

describe("analyzeCard", () => {
    it("analyze 'AS' as Ace of Spades", () => {
        expect(analyzeCard("AS")).toEqual({ rank: 14, suit: "S", code: "AS" });
    });

    it("analyze 'TD' as Ten of Diamonds", () => {
        expect(analyzeCard("TD")).toEqual({ rank: 10, suit: "D", code: "TD" });
    });
});