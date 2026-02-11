import type { MapData, Tile, Unit } from "../types.js";
import { getUnitDefinition } from "../units.js";

export function setTile(
  tiles: MapData["tiles"],
  row: number,
  col: number,
  tile: Tile,
  width: number,
  height: number,
): void {
  if (row < 0 || row >= height || col < 0 || col >= width) {
    throw new Error(
      `Map tile out of bounds: tiles[${row}][${col}] on ${width}×${height} map`,
    );
  }
  tiles[row][col] = tile;
}

export function createTile(
  terrain: Tile["terrain"],
  property: Tile["property"] = null,
  owner: 1 | 2 | null = null,
): Tile {
  return {
    terrain,
    property,
    owner,
    capturePoints: property && property !== "hq" ? 20 : 0,
  };
}

export function makeUnit(
  type: Unit["type"],
  player: 1 | 2,
  x: number,
  y: number,
  id: string,
): Unit {
  const def = getUnitDefinition(type)!;
  return {
    id,
    type,
    player,
    x,
    y,
    hp: 100,
    ammo: def.ammo,
    fuel: def.fuel,
    hasMoved: false,
    hasAttacked: false,
  };
}
