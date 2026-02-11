import { calculateDamage } from "./damage.js";
import { getDefenseStars } from "./terrain.js";
import { getUnitDefinition } from "./units.js";
export function resolveCombat(state, attacker, defender) {
    const attDef = getUnitDefinition(attacker.type);
    const defDef = getUnitDefinition(defender.type);
    if (!attDef || !defDef) {
        return {
            attackerDamage: 0,
            defenderDamage: 0,
            attackerDestroyed: false,
            defenderDestroyed: false,
            defenderHpAfter: defender.hp,
            attackerHpAfter: attacker.hp,
        };
    }
    const tile = state.map.tiles[defender.y]?.[defender.x];
    const terrainStars = tile ? getDefenseStars(tile.terrain, tile.property) : 0;
    const defenderDamage = calculateDamage({
        attackerType: attacker.type,
        defenderType: defender.type,
        attackerHp: attacker.hp,
        defenderHp: defender.hp,
        terrainStars,
    });
    const defenderHpAfter = defender.hp - defenderDamage;
    const defenderDestroyed = defenderHpAfter <= 0;
    let attackerDamage = 0;
    let attackerHpAfter = attacker.hp;
    let attackerDestroyed = false;
    if (!attDef.isIndirect &&
        !defenderDestroyed &&
        defDef.range[0] === 1 &&
        defDef.range[1] >= 1) {
        const dist = Math.abs(attacker.x - defender.x) + Math.abs(attacker.y - defender.y);
        if (dist <= 1) {
            const attTile = state.map.tiles[attacker.y]?.[attacker.x];
            const attTerrainStars = attTile
                ? getDefenseStars(attTile.terrain, attTile.property)
                : 0;
            attackerDamage = calculateDamage({
                attackerType: defender.type,
                defenderType: attacker.type,
                attackerHp: defenderHpAfter,
                defenderHp: attacker.hp,
                terrainStars: attTerrainStars,
            });
            attackerHpAfter = attacker.hp - attackerDamage;
            attackerDestroyed = attackerHpAfter <= 0;
        }
    }
    return {
        attackerDamage: attackerDamage,
        defenderDamage: defender.hp - defenderHpAfter,
        attackerDestroyed,
        defenderDestroyed,
        defenderHpAfter,
        attackerHpAfter,
    };
}
