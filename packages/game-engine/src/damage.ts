import { getBaseDamage } from "./damageTable.js";
import type { UnitType } from "./types.js";

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

export function calculateDamage(params: DamageParams): number {
  const {
    attackerType,
    defenderType,
    attackerHp,
    defenderHp,
    terrainStars,
    atkBoost = 0,
    defBoost = 0,
    luck = Math.floor(Math.random() * 10),
  } = params;

  const basePct = getBaseDamage(attackerType, defenderType);
  if (basePct < 0) return 0;

  const AV = 100 + atkBoost * 100;
  const DV = 100 + defBoost * 100;
  const DTR = terrainStars;

  const attackPart = basePct * (AV / 100) + luck / 100;
  const defensePart = Math.max(0, (200 - (DV + DTR * (defenderHp / 10))) / 100);
  const hpPart = attackerHp / 100;

  let damage = attackPart * hpPart * defensePart;
  damage = Math.max(0, damage);
  damage = Math.ceil(damage * 20) / 20;
  damage = Math.floor(damage * 100);

  return Math.max(0, Math.min(100, damage));
}

export function calculateDamagePreview(params: DamageParams): {
  min: number;
  max: number;
} {
  const min = calculateDamage({ ...params, luck: 0 });
  const max = calculateDamage({ ...params, luck: 9 });
  return { min, max };
}
