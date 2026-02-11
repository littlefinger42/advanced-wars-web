import type { UnitType } from './types.js';
/**
 * Advance Wars 2 / AWBW damage formula.
 * Damage% = (B·AV/100 + L - LB) · HP_A/10 · (200 - (DV + DTR·HP_D))/100
 *
 * B = base damage (0-1.2), AV = attack value (100), L = luck (0-9), LB = bad luck (0)
 * HP_A = attacker visual HP (1-10), DV = defense value (100), DTR = terrain stars
 * HP_D = defender visual HP (1-10). Each terrain star = +10% defense per HP.
 *
 * Rounding (per AWBW): 1) round UP to nearest 0.05, 2) round DOWN to integer.
 */
export interface DamageParams {
    attackerType: UnitType;
    defenderType: UnitType;
    attackerHp: number;
    defenderHp: number;
    terrainStars: number;
    atkBoost?: number;
    defBoost?: number;
    luck?: number;
}
export declare function calculateDamage(params: DamageParams): number;
export declare function calculateDamagePreview(params: DamageParams): {
    min: number;
    max: number;
};
//# sourceMappingURL=damage.d.ts.map