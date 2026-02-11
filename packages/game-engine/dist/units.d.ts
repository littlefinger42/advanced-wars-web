import type { UnitDefinition } from './types.js';
export declare const UNIT_DEFINITIONS: Record<string, UnitDefinition>;
export declare const UNIT_TYPES: readonly string[];
export declare function getUnitDefinition(type: string): UnitDefinition | undefined;
export declare function getUnitsProducibleAt(property: string): (keyof typeof UNIT_DEFINITIONS)[];
//# sourceMappingURL=units.d.ts.map