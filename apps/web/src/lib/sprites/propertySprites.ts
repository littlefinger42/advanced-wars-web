import type { SpriteGrid } from '../helpers/spriteTypes.js'
import {
  createGrid,
  drawHLine,
  drawVLine,
  fillRect,
  strokeRect,
} from '../helpers/spriteBuilder.js'

const HQ_PAL: string[] = ['', '#991b1b', '#ef4444', '#fca5a5', '#fde68a']
const CITY_PAL: string[] = ['', '#52525b', '#a1a1aa', '#e4e4e7', '#facc15']
const BASE_PAL: string[] = ['', '#78350f', '#f97316', '#fdba74', '#6b7280']
const AIRPORT_PAL: string[] = ['', '#115e59', '#14b8a6', '#99f6e4', '#6b7280']
const PORT_PAL: string[] = ['', '#0c4a6e', '#0ea5e9', '#7dd3fc', '#6b7280']

function makeBuilding(roof: number, wall: number, detail: number, accent: number): SpriteGrid {
  const g = createGrid(32, 0)
  fillRect(g, 6, 10, 20, 18, wall)
  strokeRect(g, 6, 10, 20, 18, roof)
  fillRect(g, 8, 12, 16, 5, roof)
  fillRect(g, 13, 21, 6, 7, detail)
  fillRect(g, 9, 19, 4, 4, detail)
  fillRect(g, 19, 19, 4, 4, detail)
  drawHLine(g, 6, 25, 18, accent)
  return g
}

function makeHQ(): SpriteGrid {
  const g = makeBuilding(1, 2, 3, 4)
  drawVLine(g, 16, 3, 10, 4)
  fillRect(g, 17, 3, 8, 5, 4)
  drawHLine(g, 8, 24, 27, 1)
  return g
}

function makeCity(): SpriteGrid {
  const g = createGrid(32, 0)
  fillRect(g, 5, 13, 9, 15, 2)
  fillRect(g, 14, 10, 13, 18, 1)
  fillRect(g, 8, 20, 4, 4, 3)
  fillRect(g, 17, 15, 3, 3, 3)
  fillRect(g, 22, 15, 3, 3, 3)
  fillRect(g, 17, 20, 3, 3, 3)
  fillRect(g, 22, 20, 3, 3, 3)
  strokeRect(g, 5, 13, 9, 15, 4)
  strokeRect(g, 14, 10, 13, 18, 4)
  return g
}

function makeBase(): SpriteGrid {
  const g = makeBuilding(1, 2, 3, 4)
  fillRect(g, 6, 24, 20, 4, 4)
  drawVLine(g, 11, 11, 17, 3)
  drawVLine(g, 16, 11, 17, 3)
  drawVLine(g, 21, 11, 17, 3)
  return g
}

function makeAirport(): SpriteGrid {
  const g = createGrid(32, 0)
  fillRect(g, 3, 17, 26, 10, 2)
  strokeRect(g, 3, 17, 26, 10, 1)
  drawHLine(g, 6, 26, 22, 3)
  drawVLine(g, 16, 12, 27, 3)
  fillRect(g, 12, 9, 9, 8, 4)
  strokeRect(g, 12, 9, 9, 8, 1)
  return g
}

function makePort(): SpriteGrid {
  const g = createGrid(32, 0)
  fillRect(g, 0, 20, 32, 12, 3)
  fillRect(g, 4, 13, 17, 12, 2)
  strokeRect(g, 4, 13, 17, 12, 1)
  fillRect(g, 21, 11, 3, 14, 4)
  fillRect(g, 24, 11, 2, 2, 4)
  drawHLine(g, 6, 18, 18, 4)
  return g
}

export const PROPERTY_SPRITES: Record<string, { grid: SpriteGrid; pal: string[] }> = {
  hq: { grid: makeHQ(), pal: HQ_PAL },
  city: { grid: makeCity(), pal: CITY_PAL },
  base: { grid: makeBase(), pal: BASE_PAL },
  airport: { grid: makeAirport(), pal: AIRPORT_PAL },
  port: { grid: makePort(), pal: PORT_PAL },
}
