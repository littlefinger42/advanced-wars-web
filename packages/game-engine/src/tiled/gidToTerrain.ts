import type { TerrainType } from '../types.js'
import type { TiledTileset } from './types.js'
import { getProperty } from './types.js'

const VALID_TERRAINS: TerrainType[] = [
  'plain',
  'mountain',
  'woods',
  'river',
  'road',
  'sea',
  'shoal',
  'reef',
  'pipe',
]

export function getTerrainFromGid(
  gid: number,
  tilesets: TiledTileset[]
): TerrainType {
  if (gid === 0) return 'plain'

  const masked = gid & 0x0fffffff
  if (masked === 0) return 'plain'

  for (let i = tilesets.length - 1; i >= 0; i--) {
    const ts = tilesets[i]
    if (masked >= ts.firstgid) {
      const localId = masked - ts.firstgid
      const tile = ts.tiles?.find((t) => t.id === localId)
      if (tile) {
        const terrain = getProperty(tile, 'terrain') as string | undefined
        if (terrain && VALID_TERRAINS.includes(terrain as TerrainType)) {
          return terrain as TerrainType
        }
      }
      break
    }
  }

  return 'plain'
}
