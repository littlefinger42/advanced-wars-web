import { drawSprite } from './helpers/drawSprite.js'
import { TILE_BASE } from './helpers/spriteTypes.js'
import { getTeamColors } from './helpers/teamColors.js'
import { TERRAIN_SPRITES } from './sprites/terrainSprites.js'
import { PROPERTY_SPRITES } from './sprites/propertySprites.js'

function getPropertyPalette(basePalette: string[], owner: number | null): string[] {
  if (!owner) return basePalette

  const team = getTeamColors(owner)
  const tinted = [...basePalette]
  if (tinted.length > 1) tinted[1] = team.shadow
  if (tinted.length > 2) tinted[2] = team.primary
  if (tinted.length > 3) tinted[3] = team.highlight
  if (tinted.length > 4) tinted[4] = team.primary
  return tinted
}

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
      const palette = getPropertyPalette(propData.pal, tile.owner)
      drawSprite(ctx, propData.grid, palette, dx, dy, scale)
    }
  }
}
