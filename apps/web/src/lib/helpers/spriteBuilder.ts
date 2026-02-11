import type { SpriteGrid } from './spriteTypes.js'

export function createGrid(size: number, fill = 0): SpriteGrid {
  return Array.from({ length: size }, () => Array(size).fill(fill))
}

export function cloneGrid(grid: SpriteGrid): SpriteGrid {
  return grid.map((row) => [...row])
}

export function setPixel(grid: SpriteGrid, x: number, y: number, value: number): void {
  if (y < 0 || y >= grid.length) return
  if (x < 0 || x >= grid[y].length) return
  grid[y][x] = value
}

export function fillRect(
  grid: SpriteGrid,
  x: number,
  y: number,
  w: number,
  h: number,
  value: number
): void {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      setPixel(grid, xx, yy, value)
    }
  }
}

export function strokeRect(
  grid: SpriteGrid,
  x: number,
  y: number,
  w: number,
  h: number,
  value: number
): void {
  for (let xx = x; xx < x + w; xx++) {
    setPixel(grid, xx, y, value)
    setPixel(grid, xx, y + h - 1, value)
  }
  for (let yy = y; yy < y + h; yy++) {
    setPixel(grid, x, yy, value)
    setPixel(grid, x + w - 1, yy, value)
  }
}

export function drawHLine(
  grid: SpriteGrid,
  x1: number,
  x2: number,
  y: number,
  value: number
): void {
  const from = Math.min(x1, x2)
  const to = Math.max(x1, x2)
  for (let x = from; x <= to; x++) setPixel(grid, x, y, value)
}

export function drawVLine(
  grid: SpriteGrid,
  x: number,
  y1: number,
  y2: number,
  value: number
): void {
  const from = Math.min(y1, y2)
  const to = Math.max(y1, y2)
  for (let y = from; y <= to; y++) setPixel(grid, x, y, value)
}

export function fillCircle(
  grid: SpriteGrid,
  cx: number,
  cy: number,
  r: number,
  value: number
): void {
  const r2 = r * r
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      const dx = x - cx
      const dy = y - cy
      if (dx * dx + dy * dy <= r2) setPixel(grid, x, y, value)
    }
  }
}

export function mirrorHorizontal(grid: SpriteGrid, centerX: number): void {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x <= centerX; x++) {
      const mirroredX = centerX + (centerX - x)
      if (mirroredX >= 0 && mirroredX < grid[y].length) {
        if (grid[y][x] !== 0) grid[y][mirroredX] = grid[y][x]
      }
    }
  }
}

export function upsample2x(source: SpriteGrid): SpriteGrid {
  const h = source.length
  const w = source[0]?.length ?? 0
  const out = createGrid(h * 2)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = source[y][x]
      out[y * 2][x * 2] = v
      out[y * 2][x * 2 + 1] = v
      out[y * 2 + 1][x * 2] = v
      out[y * 2 + 1][x * 2 + 1] = v
    }
  }
  return out
}
