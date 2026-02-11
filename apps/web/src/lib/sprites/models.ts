import type { PlayerId } from "game-engine";

export interface SpriteTone {
  base: number;
  dark: number;
  light: number;
  accent: number;
}

export type TerrainMotif =
  | "plain"
  | "woods"
  | "mountain"
  | "river"
  | "road"
  | "sea"
  | "shoal"
  | "reef"
  | "pipe";

export type PropertyMotif = "hq" | "city" | "base" | "airport" | "port";

export type UnitFrame = "foot" | "vehicle" | "ship" | "air";

export type UnitMotif =
  | "infantry"
  | "mech"
  | "recon"
  | "apc"
  | "tank"
  | "md_tank"
  | "neotank"
  | "anti_air"
  | "artillery"
  | "rockets"
  | "missiles"
  | "battleship"
  | "sub"
  | "cruiser"
  | "lander"
  | "fighter"
  | "bomber"
  | "b_copter"
  | "t_copter";

export interface TerrainSpriteDef {
  tone: SpriteTone;
  motif: TerrainMotif;
}

export interface PropertySpriteDef {
  tone: SpriteTone;
  motif: PropertyMotif;
}

export interface UnitSpriteDef {
  tone: SpriteTone;
  frame: UnitFrame;
  motif: UnitMotif;
}

export const TEAM_TONES: Record<PlayerId, SpriteTone> = {
  1: { base: 0x60a5fa, dark: 0x1d4ed8, light: 0xbfdbfe, accent: 0xffffff },
  2: { base: 0xfb7185, dark: 0xbe123c, light: 0xfda4af, accent: 0xffffff },
};
