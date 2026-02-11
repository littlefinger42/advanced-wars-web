import { GameEngine } from 'game-engine'
import type { GameState } from 'game-engine'
import { getMap } from '../maps.js'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateRoomCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return code
}

export interface RoomPlayer {
  socketId: string
  playerId: 1 | 2
  name?: string
}

export interface Room {
  code: string
  state: 'waiting' | 'in_game' | 'finished'
  players: Map<string, RoomPlayer>
  game: GameEngine | null
  createdAt: number
}

const rooms = new Map<string, Room>()

export function createRoom(mapId?: string): string {
  let code: string
  do {
    code = generateRoomCode()
  } while (rooms.has(code))

  const data = mapId ? getMap(mapId) : getMap('smallSkirmish')
  if (!data) throw new Error('No map available')
  const { map, units } = data
  const game = new GameEngine(map, units)

  const room: Room = {
    code,
    state: 'waiting',
    players: new Map(),
    game,
    createdAt: Date.now(),
  }

  rooms.set(code, room)
  return code
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code.toUpperCase())
}

export function joinRoom(code: string, socketId: string): { playerId: 1 | 2; success: boolean } {
  const room = rooms.get(code.toUpperCase())
  if (!room) return { playerId: 1, success: false }
  if (room.state !== 'waiting') return { playerId: 1, success: false }

  const existing = Array.from(room.players.values())
  const p1 = existing.find((p) => p.playerId === 1)
  const p2 = existing.find((p) => p.playerId === 2)

  let playerId: 1 | 2
  if (!p1) playerId = 1
  else if (!p2) playerId = 2
  else return { playerId: 1, success: false }

  room.players.set(socketId, { socketId, playerId })
  return { playerId, success: true }
}

export function leaveRoom(code: string, socketId: string): void {
  const room = rooms.get(code.toUpperCase())
  if (!room) return
  room.players.delete(socketId)
  if (room.players.size === 0) {
    rooms.delete(code.toUpperCase())
  }
}

export function startGame(code: string): boolean {
  const room = rooms.get(code.toUpperCase())
  if (!room) return false
  if (room.state !== 'waiting') return false
  if (room.players.size < 2) return false

  room.state = 'in_game'
  return true
}

export function getGameState(code: string): GameState | null {
  const room = rooms.get(code.toUpperCase())
  if (!room?.game) return null
  return room.game.getState()
}

export function processGameAction(
  code: string,
  playerId: 1 | 2,
  action: { type: string; [key: string]: unknown }
): { success: boolean; state: GameState | null } {
  const room = rooms.get(code.toUpperCase())
  if (!room?.game) return { success: false, state: null }

  const state = room.game.getState()
  if (state.currentPlayer !== playerId) return { success: false, state: null }

  const err = room.game.processAction(action as never)
  if (err) return { success: false, state: null }

  const newState = room.game.getState()
  if (newState.winner) room.state = 'finished'

  return { success: true, state: newState }
}
