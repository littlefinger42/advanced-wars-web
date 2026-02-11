import type { SpriteGrid } from '../helpers/spriteTypes.js'
import {
  cloneGrid,
  createGrid,
  drawHLine,
  fillCircle,
  fillRect,
  mirrorHorizontal,
  setPixel,
} from '../helpers/spriteBuilder.js'

function makeInfantry(): SpriteGrid {
  const g = createGrid(32, 0)
  fillCircle(g, 16, 8, 4, 6)
  fillRect(g, 12, 4, 9, 4, 1)
  drawHLine(g, 12, 20, 8, 2)
  fillRect(g, 11, 12, 11, 10, 1)
  fillRect(g, 13, 22, 3, 7, 2)
  fillRect(g, 17, 22, 3, 7, 2)
  fillRect(g, 10, 13, 2, 7, 2)
  fillRect(g, 22, 14, 2, 5, 2)
  drawHLine(g, 22, 29, 15, 4)
  fillRect(g, 20, 14, 3, 3, 4)
  fillRect(g, 12, 29, 4, 2, 7)
  fillRect(g, 17, 29, 4, 2, 7)
  return g
}

function makeMech(): SpriteGrid {
  const g = makeInfantry()
  fillRect(g, 9, 12, 14, 11, 2)
  fillRect(g, 7, 15, 3, 5, 4)
  fillRect(g, 5, 16, 3, 3, 9)
  fillRect(g, 22, 14, 3, 7, 4)
  fillRect(g, 12, 4, 9, 4, 2)
  return g
}

function makeVehicleBody(bodyW: number, bodyH: number, topY: number): SpriteGrid {
  const g = createGrid(32, 0)
  const x = Math.floor((32 - bodyW) / 2)
  fillRect(g, x, topY, bodyW, bodyH, 1)
  fillRect(g, x - 2, topY + bodyH - 4, bodyW + 4, 4, 7)
  for (let tx = x; tx < x + bodyW; tx += 4) setPixel(g, tx, topY + bodyH - 2, 4)
  return g
}

function makeRecon(): SpriteGrid {
  const g = makeVehicleBody(18, 10, 14)
  fillRect(g, 12, 10, 8, 5, 1)
  fillRect(g, 13, 11, 6, 3, 8)
  fillRect(g, 11, 22, 4, 4, 7)
  fillRect(g, 17, 22, 4, 4, 7)
  return g
}

function makeApc(): SpriteGrid {
  const g = makeVehicleBody(20, 11, 13)
  fillRect(g, 11, 9, 10, 5, 1)
  fillRect(g, 13, 10, 6, 3, 8)
  fillRect(g, 20, 12, 5, 2, 4)
  return g
}

function makeTank(barrelLength: number, heavy = false, neo = false): SpriteGrid {
  const g = makeVehicleBody(heavy ? 22 : 20, heavy ? 12 : 11, 13)
  fillCircle(g, 16, 14, heavy ? 5 : 4, 1)
  fillCircle(g, 16, 14, heavy ? 3 : 2, 3)
  for (let x = 17; x <= 17 + barrelLength; x++) setPixel(g, x, 14, 4)
  if (neo) {
    drawHLine(g, 9, 23, 12, 3)
    fillRect(g, 10, 16, 12, 2, 5)
  }
  return g
}

function makeAntiAir(): SpriteGrid {
  const g = makeVehicleBody(20, 11, 13)
  fillRect(g, 12, 12, 8, 5, 1)
  drawHLine(g, 20, 29, 13, 4)
  drawHLine(g, 20, 29, 15, 4)
  fillRect(g, 11, 20, 10, 2, 5)
  return g
}

function makeArtillery(rocket = false, missiles = false): SpriteGrid {
  const g = makeVehicleBody(20, 10, 14)
  fillRect(g, 10, 12, 10, 4, 1)
  if (missiles) {
    fillRect(g, 20, 8, 3, 7, 9)
    fillRect(g, 24, 8, 3, 7, 9)
  } else if (rocket) {
    fillRect(g, 20, 10, 8, 5, 9)
    drawHLine(g, 20, 28, 12, 4)
  } else {
    drawHLine(g, 20, 29, 13, 4)
    fillRect(g, 18, 13, 2, 2, 4)
  }
  return g
}

function makeBattleship(): SpriteGrid {
  const g = createGrid(32, 0)
  fillRect(g, 4, 16, 24, 10, 1)
  fillRect(g, 9, 12, 14, 5, 4)
  fillRect(g, 11, 10, 3, 3, 8)
  fillRect(g, 18, 10, 3, 3, 8)
  drawHLine(g, 20, 31, 13, 4)
  drawHLine(g, 17, 31, 15, 4)
  fillRect(g, 6, 22, 20, 2, 5)
  return g
}

function makeSub(): SpriteGrid {
  const g = createGrid(32, 0)
  fillRect(g, 6, 15, 20, 8, 4)
  fillRect(g, 13, 11, 6, 4, 1)
  fillRect(g, 15, 8, 2, 3, 1)
  setPixel(g, 16, 7, 9)
  fillRect(g, 22, 18, 4, 2, 8)
  return g
}

function makeCruiser(): SpriteGrid {
  const g = createGrid(32, 0)
  fillRect(g, 5, 16, 22, 9, 1)
  fillRect(g, 10, 12, 10, 5, 4)
  fillRect(g, 12, 10, 6, 2, 8)
  drawHLine(g, 18, 29, 13, 4)
  fillRect(g, 7, 22, 18, 2, 5)
  return g
}

function makeLander(): SpriteGrid {
  const g = createGrid(32, 0)
  fillRect(g, 4, 17, 24, 8, 4)
  fillRect(g, 10, 14, 12, 4, 1)
  fillRect(g, 13, 12, 6, 2, 8)
  fillRect(g, 11, 22, 10, 3, 3)
  return g
}

function makeFighter(bomber = false): SpriteGrid {
  const g = createGrid(32, 0)
  fillRect(g, 14, 7, 4, 18, 1)
  fillRect(g, 8, 12, 16, 5, bomber ? 1 : 3)
  fillRect(g, 5, 14, 6, 3, bomber ? 1 : 2)
  fillRect(g, 21, 14, 6, 3, bomber ? 1 : 2)
  fillRect(g, 13, 10, 6, 3, 8)
  fillRect(g, 13, 23, 6, 3, 4)
  if (bomber) fillRect(g, 12, 18, 8, 3, 9)
  return g
}

function makeCopter(transport = false): SpriteGrid {
  const g = createGrid(32, 0)
  drawHLine(g, 6, 26, 8, 4)
  fillRect(g, 14, 9, 4, 2, 4)
  fillRect(g, 11, 11, 10, 10, 1)
  fillRect(g, 12, 13, 8, 4, 8)
  fillRect(g, 20, 15, 8, 2, 4)
  fillRect(g, 27, 13, 2, 6, 4)
  drawHLine(g, 9, 20, 22, 7)
  drawHLine(g, 9, 20, 24, 7)
  if (!transport) {
    fillRect(g, 9, 16, 2, 2, 9)
    fillRect(g, 21, 16, 2, 2, 9)
  }
  return g
}

function mirrorForStyle(base: SpriteGrid): SpriteGrid {
  const g = cloneGrid(base)
  mirrorHorizontal(g, 15)
  return g
}

const INFANTRY = mirrorForStyle(makeInfantry())
const MECH = mirrorForStyle(makeMech())
const RECON = mirrorForStyle(makeRecon())
const APC = mirrorForStyle(makeApc())
const TANK = mirrorForStyle(makeTank(8))
const MD_TANK = mirrorForStyle(makeTank(10, true))
const NEOTANK = mirrorForStyle(makeTank(11, true, true))
const ANTI_AIR = mirrorForStyle(makeAntiAir())
const ARTILLERY = mirrorForStyle(makeArtillery())
const ROCKETS = mirrorForStyle(makeArtillery(true))
const MISSILES = mirrorForStyle(makeArtillery(false, true))
const BATTLESHIP = mirrorForStyle(makeBattleship())
const SUB = mirrorForStyle(makeSub())
const CRUISER = mirrorForStyle(makeCruiser())
const LANDER = mirrorForStyle(makeLander())
const FIGHTER = mirrorForStyle(makeFighter())
const BOMBER = mirrorForStyle(makeFighter(true))
const B_COPTER = mirrorForStyle(makeCopter())
const T_COPTER = mirrorForStyle(makeCopter(true))

export const UNIT_SPRITES: Record<string, SpriteGrid> = {
  infantry: INFANTRY,
  mech: MECH,
  recon: RECON,
  apc: APC,
  tank: TANK,
  md_tank: MD_TANK,
  neotank: NEOTANK,
  anti_air: ANTI_AIR,
  artillery: ARTILLERY,
  rockets: ROCKETS,
  missiles: MISSILES,
  battleship: BATTLESHIP,
  sub: SUB,
  cruiser: CRUISER,
  lander: LANDER,
  fighter: FIGHTER,
  bomber: BOMBER,
  b_copter: B_COPTER,
  t_copter: T_COPTER,
}
