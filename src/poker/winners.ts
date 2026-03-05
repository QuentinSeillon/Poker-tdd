import type { Card } from "./types";
import type { HandRank } from "./rank5";
import { evaluatePlayer } from "./evaluateplayer";
import { compareHandRank } from "./compare";

export type PlayerInput = {
    id: string;
    hole: readonly Card[];
};

export type WinnersResult = {
    winners: string[];   // ids des gagnants (1 ou plusieurs si draw)
    rank: HandRank;
    evaluated: { id: string; rank: HandRank }[];
};

export function winners(board: readonly Card[], players: readonly PlayerInput[]): WinnersResult {
    if (board.length !== 5) throw new Error("winners expects exactly 5 board cards");
    if (players.length === 0) throw new Error("winners expects at least 1 player");

    const evaluated = players.map(p => ({
        id: p.id,
        rank: evaluatePlayer(board, p.hole)
    }));

    let best = evaluated[0]!;
    for (const e of evaluated.slice(1)) {
        if (compareHandRank(e.rank, best.rank) > 0) best = e;
    }

    const winnerIds = evaluated
        .filter(e => compareHandRank(e.rank, best.rank) === 0)
        .map(e => e.id);

    return {
        winners: winnerIds,
        rank: best.rank,
        evaluated
    };
}