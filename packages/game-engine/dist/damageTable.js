// Base damage table (attacker -> defender), as percentage 0-120
// -1 = cannot attack
// Order: infantry, mech, recon, apc, tank, md_tank, neotank, anti_air, artillery, rockets, missiles,
//        battleship, sub, cruiser, lander, fighter, bomber, b_copter, t_copter
const UNIT_INDEX = [
    'infantry',
    'mech',
    'recon',
    'apc',
    'tank',
    'md_tank',
    'neotank',
    'anti_air',
    'artillery',
    'rockets',
    'missiles',
    'battleship',
    'sub',
    'cruiser',
    'lander',
    'fighter',
    'bomber',
    'b_copter',
    't_copter',
];
function idx(type) {
    const i = UNIT_INDEX.indexOf(type);
    return i >= 0 ? i : 0;
}
// 19x19 matrix: [attacker][defender], values 0-120 (%)
// From AWBW/StrategyWiki, adapted for AW2 unit set
const DAMAGE_MATRIX = [
    [55, 45, 70, 5, 5, 1, 1, 5, 15, 12, 25, -1, -1, -1, -1, -1, -1, 7, 30], // infantry
    [65, 55, 65, 20, 55, 15, 15, 9, 70, 35, 55, -1, -1, -1, -1, -1, -1, 9, 35], // mech
    [70, 65, 35, 45, 55, 1, 6, 10, 45, 55, 35, -1, -1, -1, -1, -1, -1, 10, 35], // recon
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // apc
    [75, 70, 75, 10, 70, 15, 15, 10, 70, 55, 55, 1, -1, 5, -1, -1, -1, 10, 40], // tank
    [105, 95, 85, 45, 85, 55, 55, 45, 80, 80, 80, 10, -1, 45, -1, -1, -1, 12, 45], // md_tank
    [125, 115, 105, 55, 105, 55, 55, 55, 90, 90, 90, 15, -1, 50, -1, -1, -1, 22, 55], // neotank
    [105, 95, 35, 50, 45, 7, 8, 45, 75, 60, 55, -1, -1, -1, -1, 65, 75, 120, 25], // anti_air
    [90, 85, 80, 70, 70, 45, 40, 75, 75, 80, 80, 55, -1, 65, -1, -1, -1, 65, 70], // artillery
    [95, 90, 95, 80, 80, 55, 50, 85, 85, 85, 85, 60, -1, 85, -1, -1, -1, 85, 80], // rockets
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 100, 100, 120, -1], // missiles
    [95, 95, 95, 95, 95, 90, 80, -1, 90, 95, 90, 50, 95, 80, 95, -1, -1, -1, -1], // battleship
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 95, 55, 25, -1, -1, -1, -1, -1], // sub
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 95, 90, 55, -1, 55, 65, 115, 95], // cruiser
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // lander
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 55, 100, 100, 100], // fighter
    [110, 110, 110, -1, 105, 110, 105, 75, 105, 105, 105, 75, -1, 85, -1, -1, -1, 95, 105], // bomber
    [75, 75, 75, 25, 55, 20, 20, 65, 65, 65, 65, 25, -1, 55, -1, 85, -1, 65, 95], // b_copter
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // t_copter
];
export function getBaseDamage(attacker, defender) {
    const ai = idx(attacker);
    const di = idx(defender);
    const val = DAMAGE_MATRIX[ai]?.[di] ?? -1;
    return val < 0 ? -1 : val / 100;
}
export function canAttack(attacker, defender) {
    return getBaseDamage(attacker, defender) >= 0;
}
