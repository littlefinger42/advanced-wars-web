// Defense stars: each star = +10% defense per defender HP
export const TERRAIN_DEFENSE = {
    plain: 1,
    mountain: 4,
    woods: 2,
    river: 0,
    road: 0,
    sea: 0,
    shoal: 0,
    reef: 1,
    pipe: 0,
    // Properties
    hq: 4,
    city: 3,
    base: 3,
    airport: 3,
    port: 3,
};
// Movement costs: -1 or undefined = impassable
// TerrainType -> MovementType -> cost
export const MOVEMENT_COSTS = {
    plain: { foot: 1, mech: 1, treads: 1, wheels: 2, ship: -1, lander: -1, air: 1 },
    mountain: { foot: 2, mech: 1, treads: -1, wheels: -1, ship: -1, lander: -1, air: 1 },
    woods: { foot: 1, mech: 1, treads: 2, wheels: 3, ship: -1, lander: -1, air: 1 },
    river: { foot: 2, mech: 1, treads: -1, wheels: -1, ship: -1, lander: -1, air: 1 },
    road: { foot: 1, mech: 1, treads: 1, wheels: 1, ship: -1, lander: -1, air: 1 },
    sea: { foot: -1, mech: -1, treads: -1, wheels: -1, ship: 1, lander: 1, air: 1 },
    shoal: { foot: 1, mech: 1, treads: 1, wheels: 1, ship: -1, lander: 1, air: 1 },
    reef: { foot: -1, mech: -1, treads: -1, wheels: -1, ship: 2, lander: 2, air: 1 },
    pipe: { foot: -1, mech: -1, treads: -1, wheels: -1, ship: -1, lander: -1, air: -1 },
    hq: { foot: 1, mech: 1, treads: 1, wheels: 1, ship: -1, lander: -1, air: 1 },
    city: { foot: 1, mech: 1, treads: 1, wheels: 1, ship: -1, lander: -1, air: 1 },
    base: { foot: 1, mech: 1, treads: 1, wheels: 1, ship: -1, lander: -1, air: 1 },
    airport: { foot: 1, mech: 1, treads: 1, wheels: 1, ship: -1, lander: -1, air: 1 },
    port: { foot: 1, mech: 1, treads: 1, wheels: 1, ship: 1, lander: 1, air: 1 },
};
// Rain: increased cost for ground
const RAIN_MULTIPLIER = {
    treads: 2,
    wheels: 2,
    foot: 1,
    mech: 1,
};
export function getMovementCost(terrain, movementType, weather = 'clear') {
    const costs = MOVEMENT_COSTS[terrain] ?? MOVEMENT_COSTS.plain;
    let cost = costs[movementType] ?? -1;
    if (cost === -1)
        return -1;
    if (weather === 'rain' || weather === 'snow') {
        const mult = RAIN_MULTIPLIER[movementType] ?? 1;
        cost = Math.min(cost * mult, 4);
    }
    return cost;
}
export function getDefenseStars(terrain, property) {
    if (property) {
        return TERRAIN_DEFENSE[property] ?? 0;
    }
    return TERRAIN_DEFENSE[terrain] ?? 0;
}
export function canMoveOn(terrain, movementType) {
    const cost = getMovementCost(terrain, movementType);
    return cost >= 0;
}
