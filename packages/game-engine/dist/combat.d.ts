import type { GameState, Unit } from "./types.js";
export interface CombatResult {
    attackerDamage: number;
    defenderDamage: number;
    attackerDestroyed: boolean;
    defenderDestroyed: boolean;
    defenderHpAfter: number;
    attackerHpAfter: number;
}
export declare function resolveCombat(state: GameState, attacker: Unit, defender: Unit): CombatResult;
//# sourceMappingURL=combat.d.ts.map