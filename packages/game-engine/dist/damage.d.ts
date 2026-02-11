import type { UnitType } from './types.js';
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