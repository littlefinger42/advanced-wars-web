import type { SpriteGrid } from './spriteTypes.js'

/**
 * Draws a pixel sprite grid to the canvas.
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  grid: SpriteGrid,
  palette: string[],
  dx: number,
  dy: number,
  scale: number
): void {
  for (let sy = 0; sy < grid.length; sy++) {
    for (let sx = 0; sx < grid[sy].length; sx++) {
      const idx = grid[sy][sx]
      if (idx === 0) continue
      const color = palette[idx]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(dx + sx * scale, dy + sy * scale, scale + 0.5, scale + 0.5)
    }
  }
}
