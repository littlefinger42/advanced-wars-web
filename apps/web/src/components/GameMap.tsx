import { useRef, useEffect, useCallback } from 'react'
import type { GameState, Unit } from 'game-engine'
import { getUnitDefinition } from 'game-engine'
import styles from './GameMap.module.css'

interface GameMapProps {
  state: GameState
  selectedUnit: Unit | null
  reachable: Map<number, number>
  attackable: { x: number; y: number }[]
  tileSize: number
  onTapTile: (x: number, y: number) => void
  onSelectUnit: (unit: Unit | null) => void
}

const TERRAIN_COLORS: Record<string, string> = {
  plain: '#a7c957',
  mountain: '#8b7355',
  woods: '#2d6a4f',
  river: '#48cae4',
  road: '#6c757d',
  sea: '#0284c7',
  shoal: '#7dd3fc',
  reef: '#0ea5e9',
  pipe: '#475569',
}

const PROPERTY_COLORS: Record<string, string> = {
  hq: '#dc2626',
  city: '#eab308',
  base: '#b45309',
  airport: '#0d9488',
  port: '#0369a1',
}

export default function GameMap({
  state,
  selectedUnit,
  reachable,
  attackable,
  tileSize,
  onTapTile,
}: GameMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { map, units } = state
    const w = map.width * tileSize
    const h = map.height * tileSize

    canvas.width = w
    canvas.height = h

    const attackSet = new Set(attackable.map((t) => `${t.x},${t.y}`))
    const reachSet = new Set(reachable.keys())

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y][x]
        const key = y * map.width + x

        let color = TERRAIN_COLORS[tile.terrain] ?? '#94a3b8'
        if (tile.property) {
          color = PROPERTY_COLORS[tile.property] ?? color
        }

        ctx.fillStyle = color
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)

        if (tile.owner) {
          ctx.strokeStyle = tile.owner === 1 ? '#e63946' : '#1d3557'
          ctx.lineWidth = 2
          ctx.strokeRect(x * tileSize + 1, y * tileSize + 1, tileSize - 2, tileSize - 2)
        }

        if (reachSet.has(key) && !attackSet.has(`${x},${y}`)) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.4)'
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
        }
        if (attackSet.has(`${x},${y}`)) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.5)'
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
        }
      }
    }

    for (const unit of units) {
      const def = getUnitDefinition(unit.type)
      const color = unit.player === 1 ? '#e63946' : '#1d3557'
      ctx.fillStyle = color
      ctx.fillRect(
        unit.x * tileSize + 4,
        unit.y * tileSize + 4,
        tileSize - 8,
        tileSize - 8
      )

      ctx.strokeStyle = selectedUnit?.id === unit.id ? '#fbbf24' : '#fff'
      ctx.lineWidth = selectedUnit?.id === unit.id ? 3 : 1
      ctx.strokeRect(
        unit.x * tileSize + 4,
        unit.y * tileSize + 4,
        tileSize - 8,
        tileSize - 8
      )

      ctx.fillStyle = '#fff'
      ctx.font = `bold ${tileSize / 2}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        unit.hp.toString(),
        unit.x * tileSize + tileSize / 2,
        unit.y * tileSize + tileSize / 2
      )

      if (def) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.font = `${tileSize / 4}px sans-serif`
        ctx.fillText(
          def.name.slice(0, 4),
          unit.x * tileSize + tileSize / 2,
          unit.y * tileSize + tileSize - 6
        )
      }
    }
  }, [state, reachable, attackable, tileSize, selectedUnit])

  useEffect(() => {
    draw()
  }, [draw])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = Math.floor(((e.clientX - rect.left) * scaleX) / tileSize)
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / tileSize)

    if (x >= 0 && x < state.map.width && y >= 0 && y < state.map.height) {
      onTapTile(x, y)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.changedTouches[0]
    if (!touch) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = Math.floor(((touch.clientX - rect.left) * scaleX) / tileSize)
    const y = Math.floor(((touch.clientY - rect.top) * scaleY) / tileSize)

    if (x >= 0 && x < state.map.width && y >= 0 && y < state.map.height) {
      onTapTile(x, y)
    }
  }

  return (
    <div
      ref={containerRef}
      className={styles.map}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'manipulation' }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}
