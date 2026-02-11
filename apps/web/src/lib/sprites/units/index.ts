import type { UnitType } from "game-engine";
import type { UnitSpriteDef } from "../models";
import { antiAirUnitSprite } from "./anti_air";
import { apcUnitSprite } from "./apc";
import { artilleryUnitSprite } from "./artillery";
import { bCopterUnitSprite } from "./b_copter";
import { battleshipUnitSprite } from "./battleship";
import { bomberUnitSprite } from "./bomber";
import { cruiserUnitSprite } from "./cruiser";
import { fighterUnitSprite } from "./fighter";
import { infantryUnitSprite } from "./infantry";
import { landerUnitSprite } from "./lander";
import { mdTankUnitSprite } from "./md_tank";
import { mechUnitSprite } from "./mech";
import { missilesUnitSprite } from "./missiles";
import { neotankUnitSprite } from "./neotank";
import { reconUnitSprite } from "./recon";
import { rocketsUnitSprite } from "./rockets";
import { subUnitSprite } from "./sub";
import { tCopterUnitSprite } from "./t_copter";
import { tankUnitSprite } from "./tank";

export const UNIT_SPRITES: Record<UnitType | string, UnitSpriteDef> = {
  infantry: infantryUnitSprite,
  mech: mechUnitSprite,
  recon: reconUnitSprite,
  apc: apcUnitSprite,
  tank: tankUnitSprite,
  md_tank: mdTankUnitSprite,
  neotank: neotankUnitSprite,
  anti_air: antiAirUnitSprite,
  artillery: artilleryUnitSprite,
  rockets: rocketsUnitSprite,
  missiles: missilesUnitSprite,
  battleship: battleshipUnitSprite,
  sub: subUnitSprite,
  cruiser: cruiserUnitSprite,
  lander: landerUnitSprite,
  fighter: fighterUnitSprite,
  bomber: bomberUnitSprite,
  b_copter: bCopterUnitSprite,
  t_copter: tCopterUnitSprite,
};
