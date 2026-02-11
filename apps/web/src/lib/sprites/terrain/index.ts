import type { TerrainType } from "game-engine";
import type { TerrainSpriteDef } from "../models";
import { mountainTerrainSprite } from "./mountain";
import { pipeTerrainSprite } from "./pipe";
import { plainTerrainSprite } from "./plain";
import { reefTerrainSprite } from "./reef";
import { riverTerrainSprite } from "./river";
import { roadTerrainSprite } from "./road";
import { seaTerrainSprite } from "./sea";
import { shoalTerrainSprite } from "./shoal";
import { woodsTerrainSprite } from "./woods";

export const TERRAIN_SPRITES: Record<TerrainType | string, TerrainSpriteDef> = {
  plain: plainTerrainSprite,
  mountain: mountainTerrainSprite,
  woods: woodsTerrainSprite,
  river: riverTerrainSprite,
  road: roadTerrainSprite,
  sea: seaTerrainSprite,
  shoal: shoalTerrainSprite,
  reef: reefTerrainSprite,
  pipe: pipeTerrainSprite,
};
