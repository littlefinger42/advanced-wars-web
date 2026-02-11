import { drawSprite } from './helpers/drawSprite.js'
import { UNIT_BASE } from './helpers/spriteTypes.js'
import { getTeamColors, NEUTRAL_UNIT_COLORS } from './helpers/teamColors.js'
import { UNIT_SPRITES } from './sprites/unitSprites32.js'

export function drawUnit(
  ctx: CanvasRenderingContext2D,
  unit: { type: string; player: number; hp: number },
  x: number,
  y: number,
  tileSize: number,
  isSelected: boolean,
  isImmobile: boolean
): void {
  const team = getTeamColors(unit.player)
  const pal = [
    '',
    team.primary,
    team.shadow,
    team.highlight,
    NEUTRAL_UNIT_COLORS.metalDark,
    NEUTRAL_UNIT_COLORS.metalLight,
    NEUTRAL_UNIT_COLORS.skin,
    NEUTRAL_UNIT_COLORS.tracks,
    NEUTRAL_UNIT_COLORS.glass,
    NEUTRAL_UNIT_COLORS.accent,
  ]

  const grid = UNIT_SPRITES[unit.type] ?? UNIT_SPRITES.infantry
  const scale = (tileSize * 0.9) / UNIT_BASE
  const offset = (tileSize - UNIT_BASE * scale) / 2
  const dx = x * tileSize + offset
  const dy = y * tileSize + offset
  const spriteWidth = UNIT_BASE * scale
  const spriteHeight = UNIT_BASE * scale

  drawSprite(ctx, grid, pal, dx, dy, scale)

  if (isImmobile) {
    ctx.save()
    // Subtle dark tint to indicate spent/immobile status.
    ctx.fillStyle = 'rgba(31, 41, 55, 0.30)'
    ctx.fillRect(dx, dy, spriteWidth, spriteHeight)

    // Light diagonal hatch to make the state readable at a glance.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
    ctx.lineWidth = Math.max(1, scale * 0.6)
    const hatchGap = Math.max(4, Math.round(scale * 5))
    for (let sx = -spriteHeight; sx < spriteWidth + spriteHeight; sx += hatchGap) {
      ctx.beginPath()
      ctx.moveTo(dx + sx, dy + spriteHeight)
      ctx.lineTo(dx + sx + spriteHeight, dy)
      ctx.stroke()
    }
    ctx.restore()
  }

  if (isSelected) {
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 3
    ctx.strokeRect(dx - 2, dy - 2, spriteWidth + 4, spriteHeight + 4)
  }

  const badgeY = y * tileSize + tileSize - 6
  const badgeX = x * tileSize + tileSize / 2
  ctx.fillStyle = '#1f2937'
  ctx.fillRect(badgeX - 8, badgeY - 8, 16, 14)
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${Math.max(10, tileSize / 3)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(unit.hp.toString(), badgeX, badgeY)
}
