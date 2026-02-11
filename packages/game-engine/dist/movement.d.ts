import type { MapData, Unit } from './types.js';
export declare function getReachableTiles(map: MapData, unit: Unit, units: Unit[], weather?: 'clear' | 'rain' | 'snow'): Map<number, number>;
export declare function getAttackRange(unit: Unit, map: MapData): {
    x: number;
    y: number;
}[];
export declare function getAttackableTiles(map: MapData, unit: Unit, units: Unit[]): {
    x: number;
    y: number;
}[];
//# sourceMappingURL=movement.d.ts.map