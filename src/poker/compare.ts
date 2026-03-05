import type { HandRank } from "./rank5";

/**
 * Compare deux HandRank.
 * @returns >0 si a est meilleure, <0 si b est meilleure, 0 si égalité
 */
export function compareHandRank(a: HandRank, b: HandRank): number {
    if (a.category !== b.category) {
        return a.category - b.category; // plus grand = plus fort
    }

    const n = Math.max(a.tiebreak.length, b.tiebreak.length);
    for (let i = 0; i < n; i++) {
        const av = a.tiebreak[i] ?? 0;
        const bv = b.tiebreak[i] ?? 0;
        if (av !== bv) return av - bv;
    }

    return 0;
}