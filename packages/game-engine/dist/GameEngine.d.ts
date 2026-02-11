import type { GameState, GameAction, Unit, MapData } from "./types.js";
export declare class GameEngine {
    private state;
    constructor(map: MapData, initialUnits?: Unit[]);
    private createInitialState;
    getState(): GameState;
    getUnits(): Unit[];
    getUnitAt(x: number, y: number): Unit | undefined;
    processIncome(): void;
    resetUnitFlags(): void;
    endTurn(): void;
    validateMove(unitId: string, x: number, y: number): string | null;
    move(unitId: string, x: number, y: number): string | null;
    validateAttack(attackerId: string, defenderId: string): string | null;
    attack(attackerId: string, defenderId: string): string | null;
    validateCapture(unitId: string): string | null;
    capture(unitId: string): string | null;
    validateProduce(propertyX: number, propertyY: number, unitType: string): string | null;
    produce(propertyX: number, propertyY: number, unitType: string): string | null;
    processAction(action: GameAction): string | null;
    private checkWinCondition;
    getReachableTiles(unit: Unit): Map<number, number>;
    getAttackableTiles(unit: Unit): {
        x: number;
        y: number;
    }[];
    getPath(unit: Unit, destX: number, destY: number): {
        x: number;
        y: number;
    }[];
    getAttackableTilesFromPosition(unit: Unit, fromX: number, fromY: number): {
        x: number;
        y: number;
    }[];
}
//# sourceMappingURL=GameEngine.d.ts.map