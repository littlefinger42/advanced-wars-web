import { getMovementCost } from './terrain.js'
import type { MapData, Unit } from './types.js'
import { getUnitDefinition } from './units.js'

export function getReachableTiles(
  map: MapData,
  unit: Unit,
  units: Unit[],
  weather: 'clear' | 'rain' | 'snow' = 'clear'
): Map<number, number> {
  const def = getUnitDefinition(unit.type)
  if (!def) return new Map()

  const blocked = new Set(units.filter((u) => u.id !== unit.id).map((u) => u.y * map.width + u.x))
  const costs = new Map<number, number>()
  costs.set(unit.y * map.width + unit.x, 0)

  const queue: { x: number; y: number; cost: number }[] = [{ x: unit.x, y: unit.y, cost: 0 }]

  while (queue.length > 0) {
    const { x, y, cost } = queue.shift()!

    for (const [dx, dy] of [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || nx >= map.width || ny < 0 || ny >= map.height) continue

      const nkey = ny * map.width + nx
      if (blocked.has(nkey)) continue

      const tile = map.tiles[ny]?.[nx]
      if (!tile) continue

      const terrain = tile.property ?? tile.terrain
      const moveCost = getMovementCost(terrain, def.movementType, weather)
      if (moveCost < 0) continue

      const newCost = cost + moveCost
      if (newCost > def.movement) continue

      const prev = costs.get(nkey)
      if (prev !== undefined && newCost >= prev) continue

      costs.set(nkey, newCost)
      queue.push({ x: nx, y: ny, cost: newCost })
    }
  }

  return costs
}

export function getPath(
  map: MapData,
  unit: Unit,
  units: Unit[],
  destX: number,
  destY: number,
  weather: 'clear' | 'rain' | 'snow' = 'clear'
): { x: number; y: number }[] {
  const def = getUnitDefinition(unit.type)
  if (!def) return []

  const destKey = destY * map.width + destX
  const costs = new Map<number, number>()
  const parent = new Map<number, number>()
  costs.set(unit.y * map.width + unit.x, 0)

  const blocked = new Set(units.filter((u) => u.id !== unit.id).map((u) => u.y * map.width + u.x))
  const queue: { x: number; y: number; cost: number }[] = [{ x: unit.x, y: unit.y, cost: 0 }]

  while (queue.length > 0) {
    const { x, y, cost } = queue.shift()!

    for (const [dx, dy] of [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || nx >= map.width || ny < 0 || ny >= map.height) continue

      const nkey = ny * map.width + nx
      if (blocked.has(nkey)) continue

      const tile = map.tiles[ny]?.[nx]
      if (!tile) continue

      const terrain = tile.property ?? tile.terrain
      const moveCost = getMovementCost(terrain, def.movementType, weather)
      if (moveCost < 0) continue

      const newCost = cost + moveCost
      if (newCost > def.movement) continue

      const prev = costs.get(nkey)
      if (prev !== undefined && newCost >= prev) continue

      costs.set(nkey, newCost)
      parent.set(nkey, y * map.width + x)
      queue.push({ x: nx, y: ny, cost: newCost })
    }
  }

  if (!costs.has(destKey)) return []

  const path: { x: number; y: number }[] = []
  let key: number | undefined = destKey
  while (key !== undefined) {
    const ky = Math.floor(key / map.width)
    const kx = key % map.width
    path.unshift({ x: kx, y: ky })
    key = parent.get(key)
  }
  return path
}

export function getAttackableTilesFromPosition(
  map: MapData,
  unit: Unit,
  fromX: number,
  fromY: number,
  units: Unit[]
): { x: number; y: number }[] {
  const virtualUnit = { ...unit, x: fromX, y: fromY }
  return getAttackableTiles(map, virtualUnit, units)
}

export function getAttackRange(
  unit: Unit,
  map: MapData
): { x: number; y: number }[] {
  const def = getUnitDefinition(unit.type)
  if (!def) return []

  const [minRange, maxRange] = def.range
  const tiles: { x: number; y: number }[] = []

  for (let dy = -maxRange; dy <= maxRange; dy++) {
    for (let dx = -maxRange; dx <= maxRange; dx++) {
      const dist = Math.abs(dx) + Math.abs(dy)
      if (dist < minRange || dist > maxRange) continue

      const x = unit.x + dx
      const y = unit.y + dy
      if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
        tiles.push({ x, y })
      }
    }
  }

  return tiles
}

export function getAttackableTiles(
  map: MapData,
  unit: Unit,
  units: Unit[]
): { x: number; y: number }[] {
  const def = getUnitDefinition(unit.type)
  if (!def) return []

  const enemies = units.filter((u) => u.player !== unit.player)
  const enemyPos = new Set(enemies.map((u) => `${u.x},${u.y}`))

  const rangeTiles = getAttackRange(unit, map)
  return rangeTiles.filter((t) => enemyPos.has(`${t.x},${t.y}`))
}
