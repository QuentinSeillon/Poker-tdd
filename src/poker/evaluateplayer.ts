import type { Card } from "./types";
import type { HandRank } from "./rank5";
import { bestOf7 } from "./bestOf7";

export function evaluatePlayer(board: readonly Card[], hole: readonly Card[]): HandRank {
    if (board.length !== 5) throw new Error("evaluatePlayer expects exactly 5 board cards");
    if (hole.length !== 2) throw new Error("evaluatePlayer expects exactly 2 hole cards");

    return bestOf7([...board, ...hole]);
}