import { getBaseDamage } from './damageTable.js';
export function calculateDamage(params) {
    const { attackerType, defenderType, attackerHp, defenderHp, terrainStars, atkBoost = 0, defBoost = 0, luck = Math.floor(Math.random() * 10), } = params;
    const basePct = getBaseDamage(attackerType, defenderType);
    if (basePct < 0)
        return 0;
    const AV = 100 + atkBoost * 100;
    const DV = 100 + defBoost * 100;
    const DTR = terrainStars;
    const attackPart = (basePct * (AV / 100) + luck / 100);
    const defensePart = Math.max(0, (200 - (DV + DTR * defenderHp)) / 100);
    const hpPart = attackerHp / 10;
    let damage = attackPart * hpPart * defensePart;
    damage = Math.max(0, damage);
    damage = Math.ceil(damage * 20) / 20;
    damage = Math.floor(damage * 100);
    return Math.max(0, Math.min(100, damage));
}
export function calculateDamagePreview(params) {
    const min = calculateDamage({ ...params, luck: 0 });
    const max = calculateDamage({ ...params, luck: 9 });
    return { min, max };
}
