import type { PlayerId, PropertyType, TerrainType, Unit } from "game-engine";
import { Container, Graphics } from "pixi.js";
import { PROPERTY_SPRITES } from "./property";
import { TERRAIN_SPRITES } from "./terrain";
import { UNIT_SPRITES } from "./units";
import { TEAM_TONES, type SpriteTone, type UnitMotif } from "./models";

const DEFAULT_TONE: SpriteTone = {
  base: 0xa3a3a3,
  dark: 0x525252,
  light: 0xe5e5e5,
  accent: 0xffffff,
};

function mixColor(from: number, to: number, amount: number): number {
  const fr = (from >> 16) & 0xff;
  const fg = (from >> 8) & 0xff;
  const fb = from & 0xff;
  const tr = (to >> 16) & 0xff;
  const tg = (to >> 8) & 0xff;
  const tb = to & 0xff;
  const rr = Math.round(fr + (tr - fr) * amount);
  const rg = Math.round(fg + (tg - fg) * amount);
  const rb = Math.round(fb + (tb - fb) * amount);
  return (rr << 16) | (rg << 8) | rb;
}

function tintTone(baseTone: SpriteTone, owner: PlayerId): SpriteTone {
  const team = TEAM_TONES[owner];
  return {
    base: mixColor(baseTone.base, team.base, 0.8),
    dark: mixColor(baseTone.dark, team.dark, 0.85),
    light: mixColor(baseTone.light, team.light, 0.75),
    accent: team.accent,
  };
}

function createTileCard(size: number, tone: SpriteTone): Graphics {
  const g = new Graphics();
  g.roundRect(0, 0, size, size, Math.max(4, size * 0.14)).fill(tone.base);
  g.roundRect(size * 0.03, size * 0.03, size * 0.94, size * 0.42, size * 0.1).fill({
    color: tone.light,
    alpha: 0.35,
  });
  g.roundRect(size * 0.02, size * 0.02, size * 0.96, size * 0.96, Math.max(4, size * 0.14)).stroke({
    width: Math.max(1, size * 0.045),
    color: tone.dark,
    alpha: 0.8,
  });
  return g;
}

function drawTerrainMotif(g: Graphics, motif: string, size: number, tone: SpriteTone): void {
  const p = (v: number) => v * size;
  switch (motif) {
    case "plain":
      g.circle(p(0.3), p(0.63), p(0.08)).fill(tone.dark);
      g.circle(p(0.56), p(0.72), p(0.06)).fill(tone.light);
      g.circle(p(0.72), p(0.53), p(0.05)).fill(tone.dark);
      break;
    case "woods":
      g.circle(p(0.35), p(0.44), p(0.16)).fill(tone.dark);
      g.circle(p(0.6), p(0.47), p(0.18)).fill(mixColor(tone.dark, 0x052e16, 0.5));
      g.roundRect(p(0.45), p(0.56), p(0.08), p(0.25), p(0.02)).fill(0x78350f);
      break;
    case "mountain":
      g.poly([
        p(0.2),
        p(0.78),
        p(0.45),
        p(0.3),
        p(0.62),
        p(0.78),
      ]).fill(tone.dark);
      g.poly([
        p(0.45),
        p(0.3),
        p(0.56),
        p(0.52),
        p(0.37),
        p(0.52),
      ]).fill(0xffffff);
      g.poly([
        p(0.52),
        p(0.76),
        p(0.72),
        p(0.44),
        p(0.86),
        p(0.76),
      ]).fill(mixColor(tone.dark, 0x111827, 0.25));
      break;
    case "river":
      g.roundRect(p(0.2), p(0.1), p(0.55), p(0.8), p(0.2)).fill({
        color: tone.dark,
        alpha: 0.9,
      });
      g.roundRect(p(0.34), p(0.15), p(0.2), p(0.7), p(0.1)).fill({
        color: tone.light,
        alpha: 0.55,
      });
      break;
    case "road":
      g.roundRect(p(0.4), p(0.04), p(0.2), p(0.92), p(0.08)).fill(tone.dark);
      g.roundRect(p(0.49), p(0.1), p(0.03), p(0.8), p(0.02)).fill(0xfef3c7);
      break;
    case "sea":
      g.circle(p(0.32), p(0.55), p(0.15)).fill({
        color: tone.dark,
        alpha: 0.65,
      });
      g.circle(p(0.52), p(0.45), p(0.2)).fill({
        color: tone.light,
        alpha: 0.45,
      });
      g.circle(p(0.7), p(0.62), p(0.1)).fill({
        color: tone.dark,
        alpha: 0.65,
      });
      break;
    case "shoal":
      g.roundRect(p(0.1), p(0.56), p(0.8), p(0.28), p(0.11)).fill(0xfef08a);
      g.roundRect(p(0.2), p(0.6), p(0.55), p(0.16), p(0.08)).fill(0xfde68a);
      break;
    case "reef":
      g.circle(p(0.35), p(0.62), p(0.12)).fill(0xfca5a5);
      g.circle(p(0.53), p(0.52), p(0.15)).fill(0xf9a8d4);
      g.circle(p(0.68), p(0.66), p(0.11)).fill(0xc4b5fd);
      break;
    case "pipe":
      g.roundRect(p(0.1), p(0.42), p(0.8), p(0.18), p(0.05)).fill(tone.dark);
      g.roundRect(p(0.35), p(0.15), p(0.18), p(0.7), p(0.06)).fill(tone.dark);
      g.roundRect(p(0.13), p(0.45), p(0.74), p(0.05), p(0.02)).fill(tone.light);
      break;
    default:
      g.circle(p(0.5), p(0.55), p(0.16)).fill(tone.dark);
  }
}

function drawPropertyMotif(g: Graphics, motif: string, size: number, tone: SpriteTone): void {
  const p = (v: number) => v * size;
  g.roundRect(p(0.2), p(0.28), p(0.6), p(0.54), p(0.07)).fill(tone.dark);
  g.roundRect(p(0.26), p(0.35), p(0.48), p(0.4), p(0.05)).fill(tone.light);
  switch (motif) {
    case "hq":
      g.poly([p(0.22), p(0.34), p(0.5), p(0.15), p(0.78), p(0.34)]).fill(tone.base);
      g.roundRect(p(0.47), p(0.06), p(0.06), p(0.13), p(0.02)).fill(0xffffff);
      break;
    case "city":
      g.roundRect(p(0.33), p(0.45), p(0.08), p(0.09), p(0.02)).fill(tone.base);
      g.roundRect(p(0.48), p(0.45), p(0.08), p(0.09), p(0.02)).fill(tone.base);
      g.roundRect(p(0.62), p(0.45), p(0.08), p(0.09), p(0.02)).fill(tone.base);
      break;
    case "base":
      g.roundRect(p(0.3), p(0.55), p(0.4), p(0.08), p(0.03)).fill(tone.base);
      g.roundRect(p(0.46), p(0.42), p(0.08), p(0.13), p(0.03)).fill(tone.base);
      break;
    case "airport":
      g.roundRect(p(0.3), p(0.53), p(0.4), p(0.06), p(0.02)).fill(tone.base);
      g.roundRect(p(0.47), p(0.4), p(0.06), p(0.18), p(0.02)).fill(tone.base);
      break;
    case "port":
      g.roundRect(p(0.3), p(0.52), p(0.32), p(0.09), p(0.04)).fill(tone.base);
      g.roundRect(p(0.62), p(0.38), p(0.06), p(0.23), p(0.02)).fill(tone.base);
      break;
    default:
      break;
  }
}

function drawUnitFrame(g: Graphics, frame: string, size: number, tone: SpriteTone): void {
  const p = (v: number) => v * size;
  if (frame === "foot") {
    g.circle(p(0.5), p(0.31), p(0.11)).fill(tone.light);
    g.roundRect(p(0.34), p(0.44), p(0.32), p(0.3), p(0.08)).fill(tone.base);
    g.roundRect(p(0.36), p(0.71), p(0.1), p(0.18), p(0.04)).fill(tone.dark);
    g.roundRect(p(0.54), p(0.71), p(0.1), p(0.18), p(0.04)).fill(tone.dark);
    return;
  }
  if (frame === "vehicle") {
    g.roundRect(p(0.18), p(0.5), p(0.64), p(0.25), p(0.08)).fill(tone.base);
    g.roundRect(p(0.28), p(0.38), p(0.34), p(0.16), p(0.06)).fill(tone.light);
    g.circle(p(0.3), p(0.8), p(0.07)).fill(tone.dark);
    g.circle(p(0.7), p(0.8), p(0.07)).fill(tone.dark);
    return;
  }
  if (frame === "ship") {
    g.poly([
      p(0.15),
      p(0.72),
      p(0.86),
      p(0.72),
      p(0.72),
      p(0.85),
      p(0.25),
      p(0.85),
    ]).fill(tone.base);
    g.roundRect(p(0.38), p(0.43), p(0.24), p(0.2), p(0.04)).fill(tone.light);
    return;
  }
  g.roundRect(p(0.43), p(0.24), p(0.14), p(0.54), p(0.06)).fill(tone.base);
  g.roundRect(p(0.23), p(0.46), p(0.54), p(0.11), p(0.05)).fill(tone.light);
}

function drawUnitMotif(g: Graphics, motif: UnitMotif, size: number, tone: SpriteTone): void {
  const p = (v: number) => v * size;
  switch (motif) {
    case "infantry":
      g.roundRect(p(0.57), p(0.45), p(0.18), p(0.04), p(0.02)).fill(tone.accent);
      break;
    case "mech":
      g.roundRect(p(0.2), p(0.5), p(0.13), p(0.08), p(0.03)).fill(tone.dark);
      break;
    case "recon":
      g.circle(p(0.56), p(0.46), p(0.05)).fill(tone.accent);
      break;
    case "apc":
      g.roundRect(p(0.63), p(0.45), p(0.12), p(0.06), p(0.03)).fill(tone.dark);
      break;
    case "tank":
      g.roundRect(p(0.56), p(0.45), p(0.2), p(0.04), p(0.02)).fill(tone.dark);
      break;
    case "md_tank":
      g.roundRect(p(0.52), p(0.44), p(0.24), p(0.05), p(0.02)).fill(tone.dark);
      break;
    case "neotank":
      g.roundRect(p(0.5), p(0.44), p(0.26), p(0.05), p(0.02)).fill(0xfde68a);
      break;
    case "anti_air":
      g.roundRect(p(0.58), p(0.4), p(0.03), p(0.16), p(0.02)).fill(tone.dark);
      g.roundRect(p(0.64), p(0.4), p(0.03), p(0.16), p(0.02)).fill(tone.dark);
      break;
    case "artillery":
      g.roundRect(p(0.56), p(0.45), p(0.18), p(0.04), p(0.02)).fill(0xd1d5db);
      break;
    case "rockets":
      g.roundRect(p(0.56), p(0.42), p(0.16), p(0.08), p(0.02)).fill(0xfbbf24);
      break;
    case "missiles":
      g.roundRect(p(0.56), p(0.38), p(0.05), p(0.14), p(0.02)).fill(0xfca5a5);
      g.roundRect(p(0.64), p(0.38), p(0.05), p(0.14), p(0.02)).fill(0xfca5a5);
      break;
    case "battleship":
      g.roundRect(p(0.58), p(0.5), p(0.2), p(0.04), p(0.02)).fill(tone.dark);
      break;
    case "sub":
      g.roundRect(p(0.56), p(0.54), p(0.18), p(0.04), p(0.02)).fill(tone.dark);
      break;
    case "cruiser":
      g.roundRect(p(0.56), p(0.5), p(0.16), p(0.04), p(0.02)).fill(tone.dark);
      break;
    case "lander":
      g.roundRect(p(0.36), p(0.73), p(0.28), p(0.04), p(0.02)).fill(tone.dark);
      break;
    case "fighter":
      g.roundRect(p(0.21), p(0.51), p(0.58), p(0.03), p(0.02)).fill(tone.accent);
      break;
    case "bomber":
      g.roundRect(p(0.22), p(0.51), p(0.56), p(0.03), p(0.02)).fill(0xfde68a);
      g.circle(p(0.5), p(0.64), p(0.04)).fill(tone.dark);
      break;
    case "b_copter":
      g.roundRect(p(0.18), p(0.28), p(0.64), p(0.03), p(0.02)).fill(tone.dark);
      break;
    case "t_copter":
      g.roundRect(p(0.18), p(0.28), p(0.64), p(0.03), p(0.02)).fill(tone.dark);
      g.roundRect(p(0.42), p(0.7), p(0.16), p(0.04), p(0.02)).fill(tone.accent);
      break;
    default:
      break;
  }
}

export function renderTerrainSprite(terrain: TerrainType | string, tileSize: number): Container {
  const sprite = TERRAIN_SPRITES[terrain] ?? TERRAIN_SPRITES.plain;
  const root = new Container();
  root.addChild(createTileCard(tileSize, sprite.tone));
  const motif = new Graphics();
  drawTerrainMotif(motif, sprite.motif, tileSize, sprite.tone);
  root.addChild(motif);
  return root;
}

export function renderPropertySprite(
  property: Exclude<PropertyType, null> | string,
  owner: PlayerId | null,
  tileSize: number,
): Container {
  const sprite = PROPERTY_SPRITES[property] ?? PROPERTY_SPRITES.city;
  const tone = owner ? tintTone(sprite.tone, owner) : sprite.tone;
  const root = new Container();
  root.addChild(createTileCard(tileSize, mixTone(tone, 0xf8fafc, 0.15)));
  const motif = new Graphics();
  drawPropertyMotif(motif, sprite.motif, tileSize, tone);
  root.addChild(motif);
  return root;
}

function mixTone(tone: SpriteTone, withColor: number, amount: number): SpriteTone {
  return {
    base: mixColor(tone.base, withColor, amount),
    dark: mixColor(tone.dark, withColor, amount * 0.5),
    light: mixColor(tone.light, withColor, amount * 0.8),
    accent: tone.accent,
  };
}

export function renderUnitSprite(
  unit: Pick<Unit, "type" | "player" | "hasMoved">,
  tileSize: number,
  options?: { selected?: boolean; ghost?: boolean },
): Container {
  const sprite = UNIT_SPRITES[unit.type] ?? UNIT_SPRITES.infantry;
  const tone = tintTone(sprite.tone ?? DEFAULT_TONE, unit.player);
  const root = new Container();
  if (options?.ghost) {
    root.alpha = 0.6;
  } else if (unit.hasMoved) {
    root.alpha = 0.75;
  }

  const body = new Graphics();
  drawUnitFrame(body, sprite.frame, tileSize, tone);
  drawUnitMotif(body, sprite.motif, tileSize, tone);
  root.addChild(body);

  if (options?.selected) {
    const ring = new Graphics();
    ring.roundRect(
      tileSize * 0.06,
      tileSize * 0.06,
      tileSize * 0.88,
      tileSize * 0.88,
      tileSize * 0.2,
    ).stroke({ width: Math.max(2, tileSize * 0.05), color: 0xfef3c7, alpha: 0.95 });
    root.addChild(ring);
  }

  return root;
}
