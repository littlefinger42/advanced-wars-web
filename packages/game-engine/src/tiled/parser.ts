import type { MapData, Tile, Unit, PropertyType, UnitType } from '../types.js'
import type { TiledMap, TiledLayer, TiledTileLayer, TiledObjectLayer } from './types.js'
import { getProperty } from './types.js'
import { getTerrainFromGid } from './gidToTerrain.js'
import { createTile, makeUnit } from '../maps/helpers.js'

const VALID_PROPERTIES: PropertyType[] = ['hq', 'city', 'base', 'airport', 'port']

function getTileLayer(layers: TiledLayer[], name: string): TiledTileLayer | null {
  const layer = layers.find((l) => l.type === 'tilelayer' && l.name === name)
  return (layer as TiledTileLayer) ?? null
}

function getObjectLayer(layers: TiledLayer[], name: string): TiledObjectLayer | null {
  const layer = layers.find((l) => l.type === 'objectgroup' && l.name === name)
  return (layer as TiledObjectLayer) ?? null
}

function tileCoordsFromPixels(
  x: number,
  y: number,
  tilewidth: number,
  tileheight: number
): { x: number; y: number } {
  return {
    x: Math.floor(x / tilewidth),
    y: Math.floor(y / tileheight),
  }
}

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function parseTiledMap(json: TiledMap): { map: MapData; units: Unit[] } {
  const { width, height, tilewidth, tileheight, layers, tilesets } = json

  const tiles: Tile[][] = []
  for (let y = 0; y < height; y++) {
    tiles[y] = []
    for (let x = 0; x < width; x++) {
      tiles[y][x] = createTile('plain')
    }
  }

  const terrainLayer = getTileLayer(layers, 'terrain')
  if (terrainLayer?.data) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x
        const gid = terrainLayer.data[idx] ?? 0
        const terrain = getTerrainFromGid(gid, tilesets)
        tiles[y][x] = createTile(terrain)
      }
    }
  }

  const propertiesLayer = getObjectLayer(layers, 'properties')
  if (propertiesLayer) {
    for (const obj of propertiesLayer.objects) {
      const { x: tileX, y: tileY } = tileCoordsFromPixels(
        obj.x,
        obj.y,
        tilewidth,
        tileheight
      )
      if (tileX < 0 || tileX >= width || tileY < 0 || tileY >= height) continue

      const type = getProperty(obj, 'type') as string | undefined
      const ownerVal = getProperty(obj, 'owner')
      const owner =
        ownerVal === 1 || ownerVal === 2
          ? (ownerVal as 1 | 2)
          : null

      if (type && VALID_PROPERTIES.includes(type as PropertyType)) {
        const existing = tiles[tileY][tileX]
        tiles[tileY][tileX] = createTile(
          existing.terrain,
          type as PropertyType,
          owner
        )
      }
    }
  }

  const units: Unit[] = []
  const unitsLayer = getObjectLayer(layers, 'units')
  if (unitsLayer) {
    for (const obj of unitsLayer.objects) {
      const { x: tileX, y: tileY } = tileCoordsFromPixels(
        obj.x,
        obj.y,
        tilewidth,
        tileheight
      )
      if (tileX < 0 || tileX >= width || tileY < 0 || tileY >= height) continue

      const unitType = (getProperty(obj, 'unitType') ?? getProperty(obj, 'type') ?? obj.type) as string | undefined
      const playerVal = getProperty(obj, 'player') ?? getProperty(obj, 'owner')
      const player = playerVal === 1 || playerVal === 2 ? (playerVal as 1 | 2) : 1

      if (unitType) {
        const id = obj.name || `unit-${obj.id}-${uuid().slice(0, 8)}`
        units.push(makeUnit(unitType as UnitType, player, tileX, tileY, id))
      }
    }
  }

  return {
    map: { width, height, tiles },
    units,
  }
}
