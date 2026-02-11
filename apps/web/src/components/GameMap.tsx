import { useRef, useEffect, useCallback } from 'react'
import type { GameState, Unit } from 'game-engine'
import { drawTerrain, drawUnit } from '../lib/pixelSprites'
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

        drawTerrain(
          ctx,
          {
            terrain: tile.terrain,
            property: tile.property,
            owner: tile.owner,
          },
          x,
          y,
          tileSize
        )

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
      const isImmobile = unit.hasMoved
      drawUnit(
        ctx,
        unit,
        unit.x,
        unit.y,
        tileSize,
        selectedUnit?.id === unit.id,
        isImmobile
      )
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
