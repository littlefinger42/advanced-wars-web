import { getUnitDefinition } from './units.js';
function createTile(terrain, property = null, owner = null) {
    return {
        terrain,
        property,
        owner,
        capturePoints: property && property !== 'hq' ? 20 : 0,
    };
}
export function createTestMap() {
    const w = 10;
    const h = 8;
    const tiles = [];
    for (let y = 0; y < h; y++) {
        tiles[y] = [];
        for (let x = 0; x < w; x++) {
            tiles[y][x] = createTile('plain');
        }
    }
    // Player 1 (left)
    tiles[1][1] = createTile('plain', 'hq', 1);
    tiles[2][1] = createTile('plain', 'city', 1);
    tiles[0][2] = createTile('plain', 'base', 1);
    tiles[1][0] = createTile('plain', 'city', 1);
    // Player 2 (right)
    tiles[6][6] = createTile('plain', 'hq', 2);
    tiles[5][6] = createTile('plain', 'city', 2);
    tiles[7][5] = createTile('plain', 'base', 2);
    tiles[6][7] = createTile('plain', 'city', 2);
    // Neutral cities
    tiles[3][3] = createTile('plain', 'city', null);
    tiles[5][3] = createTile('plain', 'city', null);
    tiles[4][5] = createTile('plain', 'city', null);
    return { width: w, height: h, tiles };
}
export function createSmallMap() {
    const w = 8;
    const h = 6;
    const tiles = [];
    for (let y = 0; y < h; y++) {
        tiles[y] = [];
        for (let x = 0; x < w; x++) {
            tiles[y][x] = createTile('plain');
        }
    }
    tiles[1][1] = createTile('plain', 'hq', 1);
    tiles[1][2] = createTile('plain', 'base', 1);
    tiles[0][1] = createTile('plain', 'city', 1);
    tiles[6][4] = createTile('plain', 'hq', 2);
    tiles[6][3] = createTile('plain', 'base', 2);
    tiles[7][4] = createTile('plain', 'city', 2);
    tiles[3][2] = createTile('plain', 'city', null);
    tiles[4][3] = createTile('plain', 'city', null);
    return { width: w, height: h, tiles };
}
function makeUnit(type, player, x, y, id) {
    const def = getUnitDefinition(type);
    return {
        id,
        type,
        player,
        x,
        y,
        hp: 10,
        ammo: def.ammo,
        fuel: def.fuel,
        hasMoved: false,
        hasAttacked: false,
    };
}
export function createTestMapWithUnits() {
    const map = createTestMap();
    const units = [];
    units.push(makeUnit('infantry', 1, 1, 2, 'p1-inf-1'));
    units.push(makeUnit('tank', 1, 0, 2, 'p1-tank-1'));
    units.push(makeUnit('infantry', 2, 6, 5, 'p2-inf-1'));
    units.push(makeUnit('tank', 2, 7, 5, 'p2-tank-1'));
    return { map, units };
}
