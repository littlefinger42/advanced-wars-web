import { drawSprite } from './helpers/drawSprite.js'
import { TILE_BASE } from './helpers/spriteTypes.js'
import { getTeamColors } from './helpers/teamColors.js'
import { TERRAIN_SPRITES } from './sprites/terrainSprites.js'
import { PROPERTY_SPRITES } from './sprites/propertySprites.js'

export function drawTerrain(
  ctx: CanvasRenderingContext2D,
  tile: { terrain: string; property: string | null; owner: number | null },
  x: number,
  y: number,
  tileSize: number
): void {
  const scale = tileSize / TILE_BASE
  const dx = x * tileSize
  const dy = y * tileSize

  const terrainKey = tile.terrain || 'plain'
  const terrainData = TERRAIN_SPRITES[terrainKey] ?? TERRAIN_SPRITES.plain
  drawSprite(ctx, terrainData.grid, terrainData.pal, dx, dy, scale)

  if (tile.property) {
    const propData = PROPERTY_SPRITES[tile.property]
    if (propData) {
      drawSprite(ctx, propData.grid, propData.pal, dx, dy, scale)
    }
  }

  if (tile.owner) {
    const team = getTeamColors(tile.owner)
    ctx.strokeStyle = team.primary
    ctx.lineWidth = 2
    ctx.strokeRect(dx + 1, dy + 1, tileSize - 2, tileSize - 2)
  }
}
