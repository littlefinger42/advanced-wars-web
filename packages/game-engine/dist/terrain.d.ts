import type { TerrainType, MovementType, PropertyType } from './types.js';
export declare const TERRAIN_DEFENSE: Record<TerrainType | string, number>;
export declare const MOVEMENT_COSTS: Record<TerrainType | string, Partial<Record<MovementType, number>>>;
export declare function getMovementCost(terrain: TerrainType | string, movementType: MovementType, weather?: 'clear' | 'rain' | 'snow'): number;
export declare function getDefenseStars(terrain: TerrainType | string, property: PropertyType): number;
export declare function canMoveOn(terrain: TerrainType | string, movementType: MovementType): boolean;
//# sourceMappingURL=terrain.d.ts.map