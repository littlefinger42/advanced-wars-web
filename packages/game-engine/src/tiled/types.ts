/** Tiled JSON map format types - subset used for our parser */

export interface TiledProperty {
  name: string
  type?: string
  value: string | number | boolean
}

export interface TiledTile {
  id: number
  properties?: TiledProperty[]
}

export interface TiledTileset {
  firstgid: number
  name: string
  tilewidth: number
  tileheight: number
  columns?: number
  tilecount?: number
  tiles?: TiledTile[]
}

export interface TiledObject {
  id: number
  x: number
  y: number
  width?: number
  height?: number
  type?: string
  name?: string
  properties?: TiledProperty[]
}

export interface TiledTileLayer {
  type: 'tilelayer'
  id: number
  name: string
  width: number
  height: number
  data?: number[]
  x?: number
  y?: number
}

export interface TiledObjectLayer {
  type: 'objectgroup'
  id: number
  name: string
  objects: TiledObject[]
}

export type TiledLayer = TiledTileLayer | TiledObjectLayer

export interface TiledMap {
  width: number
  height: number
  tilewidth: number
  tileheight: number
  layers: TiledLayer[]
  tilesets: TiledTileset[]
  properties?: TiledProperty[]
}

export function getProperty(obj: { properties?: TiledProperty[] }, name: string): string | number | boolean | undefined {
  const prop = obj.properties?.find((p) => p.name === name)
  return prop?.value
}
