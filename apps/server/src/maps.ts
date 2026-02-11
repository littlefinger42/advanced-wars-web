import { readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parseTiledMap } from 'game-engine'
import type { TiledMap } from 'game-engine'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MAPS_DIR = join(__dirname, '..', 'maps')

function toTitleCase(id: string): string {
  return id
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

function getMapMeta(json: TiledMap): { width: number; height: number; name?: string } {
  const nameProp = json.properties?.find((p) => p.name === 'name')
  const name = nameProp?.value
  return {
    width: json.width,
    height: json.height,
    name: typeof name === 'string' ? name : undefined,
  }
}

export function listMaps(): { id: string; name: string; width: number; height: number }[] {
  const files = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.json'))
  const result: { id: string; name: string; width: number; height: number }[] = []

  for (const file of files) {
    const id = file.replace(/\.json$/, '')
    try {
      const raw = readFileSync(join(MAPS_DIR, file), 'utf-8')
      const json = JSON.parse(raw) as TiledMap
      const meta = getMapMeta(json)
      result.push({
        id,
        name: meta.name ?? toTitleCase(id),
        width: meta.width,
        height: meta.height,
      })
    } catch {
      // skip invalid maps
    }
  }

  return result
}

export function getMap(id: string): { map: import('game-engine').MapData; units: import('game-engine').Unit[] } | null {
  try {
    const raw = readFileSync(join(MAPS_DIR, `${id}.json`), 'utf-8')
    const json = JSON.parse(raw) as TiledMap
    return parseTiledMap(json)
  } catch {
    return null
  }
}
