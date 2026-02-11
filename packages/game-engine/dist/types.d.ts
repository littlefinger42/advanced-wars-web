export type UnitType = 'infantry' | 'mech' | 'recon' | 'apc' | 'tank' | 'md_tank' | 'neotank' | 'anti_air' | 'artillery' | 'rockets' | 'missiles' | 'battleship' | 'sub' | 'cruiser' | 'lander' | 'fighter' | 'bomber' | 'b_copter' | 't_copter';
export type MovementType = 'foot' | 'mech' | 'treads' | 'wheels' | 'ship' | 'lander' | 'air';
export type TerrainType = 'plain' | 'mountain' | 'woods' | 'river' | 'road' | 'sea' | 'shoal' | 'reef' | 'pipe';
export type PropertyType = 'hq' | 'city' | 'base' | 'airport' | 'port' | null;
export type PlayerId = 1 | 2;
export interface Position {
    x: number;
    y: number;
}
export interface Tile {
    terrain: TerrainType;
    property: PropertyType;
    owner: PlayerId | null;
    capturePoints: number;
}
export interface Unit {
    id: string;
    type: UnitType;
    player: PlayerId;
    x: number;
    y: number;
    hp: number;
    ammo: number;
    fuel: number;
    hasMoved: boolean;
    hasAttacked: boolean;
}
export interface MapData {
    width: number;
    height: number;
    tiles: Tile[][];
}
export interface GameState {
    map: MapData;
    units: Unit[];
    currentPlayer: PlayerId;
    turn: number;
    funds: Record<PlayerId, number>;
    day: number;
    weather: 'clear' | 'rain' | 'snow';
    winner: PlayerId | null;
    phase: 'move' | 'attack' | 'capture' | 'produce' | 'end';
}
export interface UnitDefinition {
    type: UnitType;
    name: string;
    cost: number;
    movement: number;
    movementType: MovementType;
    vision: number;
    range: [number, number];
    ammo: number;
    fuel: number;
    canCapture: boolean;
    isIndirect: boolean;
}
export type GameAction = {
    type: 'move';
    unitId: string;
    x: number;
    y: number;
} | {
    type: 'attack';
    attackerId: string;
    defenderId: string;
} | {
    type: 'capture';
    unitId: string;
} | {
    type: 'produce';
    propertyX: number;
    propertyY: number;
    unitType: string;
} | {
    type: 'end_turn';
};
//# sourceMappingURL=types.d.ts.map