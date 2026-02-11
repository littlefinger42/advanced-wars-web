import type { SpriteGrid } from "../helpers/spriteTypes.js";
import {
  createGrid,
  drawHLine,
  drawVLine,
  fillCircle,
  fillRect,
  strokeRect,
} from "../helpers/spriteBuilder.js";

const PLAIN_PAL: string[] = ["", "#84cc16", "#65a30d", "#bef264"];
const WOODS_PAL: string[] = [
  "",
  "#84cc16",
  "#65a30d",
  "#4d7c0f",
  "#78350f",
  "#166534",
  "#14532d",
];
const MOUNTAIN_PAL: string[] = [
  "",
  "#84cc16",
  "#65a30d",
  "#d6d3d1",
  "#fafaf9",
  "#78716c",
  "#57534e",
];
const RIVER_PAL: string[] = ["", "#38bdf8", "#0369a1", "#7dd3fc"];
const ROAD_PAL: string[] = ["", "#6b7280", "#374151", "#d1d5db"];
const SEA_PAL: string[] = ["", "#0ea5e9", "#075985", "#38bdf8"];
const SHOAL_PAL: string[] = ["", "#fcd34d", "#f59e0b", "#7dd3fc"];
const REEF_PAL: string[] = ["", "#0ea5e9", "#0369a1", "#64748b"];
const PIPE_PAL: string[] = ["", "#64748b", "#334155", "#94a3b8"];

function makePlain(): SpriteGrid {
  const g = createGrid(32, 1);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      if ((x + y) % 5 === 0) g[y][x] = 2;
      if ((x * 3 + y * 2) % 23 === 0) g[y][x] = 3;
    }
  }
  return g;
}

function makeWoods(): SpriteGrid {
  const g = makePlain();
  fillCircle(g, 9, 9, 6, 5);
  fillCircle(g, 22, 10, 7, 5);
  fillCircle(g, 15, 20, 8, 5);
  fillCircle(g, 12, 10, 5, 6);
  fillCircle(g, 24, 12, 5, 6);
  fillCircle(g, 18, 22, 6, 6);
  fillRect(g, 9, 15, 2, 8, 4);
  fillRect(g, 21, 16, 2, 8, 4);
  fillRect(g, 15, 22, 2, 7, 4);
  return g;
}

function makeMountain(): SpriteGrid {
  const g = makePlain();
  for (let y = 8; y < 30; y++) {
    const half = Math.floor((y - 8) * 0.9);
    fillRect(g, 16 - half, y, half * 2 + 1, 1, 5);
  }
  for (let y = 12; y < 30; y++) {
    const half = Math.floor((y - 12) * 0.7);
    fillRect(g, 8 - half, y, half * 2 + 1, 1, 6);
  }
  for (let y = 14; y < 30; y++) {
    const half = Math.floor((y - 14) * 0.6);
    fillRect(g, 24 - half, y, half * 2 + 1, 1, 6);
  }
  fillCircle(g, 16, 9, 3, 4);
  fillCircle(g, 8, 13, 2, 4);
  fillCircle(g, 24, 15, 2, 4);
  return g;
}

function makeRiver(): SpriteGrid {
  const g = createGrid(32, 0);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const wave = 12 + Math.floor(4 * Math.sin((y + 3) * 0.45));
      if (x >= wave && x <= wave + 9) g[y][x] = 1;
      if (x >= wave + 2 && x <= wave + 7) g[y][x] = 2;
      if (x === wave || x === wave + 9) g[y][x] = 3;
    }
  }
  return g;
}

function makeRoad(): SpriteGrid {
  const g = makePlain();
  for (let y = 0; y < 32; y++) {
    const center = 16 + Math.floor(2 * Math.sin(y * 0.35));
    for (let x = center - 4; x <= center + 4; x++) g[y][x] = 1;
    for (let x = center - 2; x <= center + 2; x++) g[y][x] = 2;
    if (y % 6 < 3) g[y][center] = 3;
  }
  return g;
}

function makeSea(): SpriteGrid {
  const g = createGrid(32, 1);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      if ((x + y) % 4 === 0) g[y][x] = 2;
      if ((x * 2 + y * 3) % 19 === 0) g[y][x] = 3;
    }
  }
  return g;
}

function makeShoal(): SpriteGrid {
  const g = makeSea();
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      if (x + y < 22) g[y][x] = 1;
      if (x + y < 16) g[y][x] = 2;
      if (x + y === 22 || x + y === 21) g[y][x] = 3;
    }
  }
  return g;
}

function makeReef(): SpriteGrid {
  const g = makeSea();
  fillCircle(g, 8, 9, 4, 3);
  fillCircle(g, 17, 20, 5, 3);
  fillCircle(g, 25, 12, 3, 3);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      if (g[y][x] === 3 && (x + y) % 2 === 0) g[y][x] = 2;
    }
  }
  return g;
}

function makePipe(): SpriteGrid {
  const g = createGrid(32, 0);
  fillRect(g, 6, 13, 20, 6, 1);
  fillRect(g, 9, 14, 14, 4, 2);
  for (let x = 7; x < 26; x += 4) drawVLine(g, x, 13, 18, 3);
  strokeRect(g, 6, 13, 20, 6, 3);
  drawHLine(g, 0, 31, 16, 1);
  drawHLine(g, 0, 31, 15, 2);
  drawHLine(g, 0, 31, 17, 2);
  return g;
}

export const TERRAIN_SPRITES: Record<
  string,
  { grid: SpriteGrid; pal: string[] }
> = {
  plain: { grid: makePlain(), pal: PLAIN_PAL },
  woods: { grid: makeWoods(), pal: WOODS_PAL },
  mountain: { grid: makeMountain(), pal: MOUNTAIN_PAL },
  river: { grid: makeRiver(), pal: RIVER_PAL },
  road: { grid: makeRoad(), pal: ROAD_PAL },
  sea: { grid: makeSea(), pal: SEA_PAL },
  shoal: { grid: makeShoal(), pal: SHOAL_PAL },
  reef: { grid: makeReef(), pal: REEF_PAL },
  pipe: { grid: makePipe(), pal: PIPE_PAL },
};
