import { getMovementCost } from './terrain.js';
import { getUnitDefinition } from './units.js';
export function getReachableTiles(map, unit, units, weather = 'clear') {
    const def = getUnitDefinition(unit.type);
    if (!def)
        return new Map();
    const blocked = new Set(units.filter((u) => u.id !== unit.id).map((u) => u.y * map.width + u.x));
    const costs = new Map();
    costs.set(unit.y * map.width + unit.x, 0);
    const queue = [{ x: unit.x, y: unit.y, cost: 0 }];
    while (queue.length > 0) {
        const { x, y, cost } = queue.shift();
        for (const [dx, dy] of [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0],
        ]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= map.width || ny < 0 || ny >= map.height)
                continue;
            const nkey = ny * map.width + nx;
            if (blocked.has(nkey))
                continue;
            const tile = map.tiles[ny]?.[nx];
            if (!tile)
                continue;
            const terrain = tile.property ?? tile.terrain;
            const moveCost = getMovementCost(terrain, def.movementType, weather);
            if (moveCost < 0)
                continue;
            const newCost = cost + moveCost;
            if (newCost > def.movement)
                continue;
            const prev = costs.get(nkey);
            if (prev !== undefined && newCost >= prev)
                continue;
            costs.set(nkey, newCost);
            queue.push({ x: nx, y: ny, cost: newCost });
        }
    }
    return costs;
}
export function getAttackRange(unit, map) {
    const def = getUnitDefinition(unit.type);
    if (!def)
        return [];
    const [minRange, maxRange] = def.range;
    const tiles = [];
    for (let dy = -maxRange; dy <= maxRange; dy++) {
        for (let dx = -maxRange; dx <= maxRange; dx++) {
            const dist = Math.abs(dx) + Math.abs(dy);
            if (dist < minRange || dist > maxRange)
                continue;
            const x = unit.x + dx;
            const y = unit.y + dy;
            if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
                tiles.push({ x, y });
            }
        }
    }
    return tiles;
}
export function getAttackableTiles(map, unit, units, reachable, isIndirect) {
    const def = getUnitDefinition(unit.type);
    if (!def)
        return [];
    const enemies = units.filter((u) => u.player !== unit.player);
    const enemyPos = new Set(enemies.map((u) => `${u.x},${u.y}`));
    if (isIndirect) {
        const rangeTiles = getAttackRange(unit, map);
        return rangeTiles.filter((t) => enemyPos.has(`${t.x},${t.y}`));
    }
    const attackable = [];
    const rangeTiles = getAttackRange(unit, map);
    for (const t of rangeTiles) {
        if (!enemyPos.has(`${t.x},${t.y}`))
            continue;
        const key = t.y * map.width + t.x;
        if (reachable.has(key))
            attackable.push(t);
    }
    return attackable;
}
