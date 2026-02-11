import type { PropertyType } from "game-engine";
import type { PropertySpriteDef } from "../models";
import { airportPropertySprite } from "./airport";
import { basePropertySprite } from "./base";
import { cityPropertySprite } from "./city";
import { hqPropertySprite } from "./hq";
import { portPropertySprite } from "./port";

export const PROPERTY_SPRITES: Record<Exclude<PropertyType, null> | string, PropertySpriteDef> =
  {
    hq: hqPropertySprite,
    city: cityPropertySprite,
    base: basePropertySprite,
    airport: airportPropertySprite,
    port: portPropertySprite,
  };
