import { Server as SocketServer } from 'socket.io'
import type { Server as HttpServer } from 'http'
import {
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  startGame,
  getGameState,
  processGameAction,
} from './rooms/RoomManager.js'

export function setupSocket(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: { origin: '*' },
    path: '/socket.io',
  })

  io.on('connection', (socket) => {
    let roomCode: string | null = null
    let playerId: 1 | 2 | null = null

    socket.on('create_room', () => {
      const code = createRoom()
      roomCode = code
      socket.join(`room:${code}`)
      socket.emit('room_created', { roomCode: code })
    })

    socket.on('join_room', (code: string) => {
      const result = joinRoom(code, socket.id)
      if (!result.success) {
        socket.emit('join_failed', { reason: 'Could not join room' })
        return
      }

      roomCode = code
      playerId = result.playerId
      socket.join(`room:${code}`)
      socket.emit('room_joined', { roomCode: code, playerId })

      const room = getRoom(code)
      if (room && room.players.size === 2) {
        const started = startGame(code)
        if (started) {
          const state = getGameState(code)
          io.to(`room:${code}`).emit('game_started', { state })
        }
      }
    })

    socket.on('start_game', () => {
      if (!roomCode) return
      const started = startGame(roomCode)
      if (started) {
        const state = getGameState(roomCode)
        io.to(`room:${roomCode}`).emit('game_started', { state })
      }
    })

    socket.on('game_action', (action: { type: string; [key: string]: unknown }) => {
      if (!roomCode || playerId === null) return

      const result = processGameAction(roomCode, playerId, action)
      if (result.success && result.state) {
        io.to(`room:${roomCode}`).emit('game_state', result.state)
      }
    })

    socket.on('get_state', () => {
      if (!roomCode) return
      const state = getGameState(roomCode)
      if (state) socket.emit('game_state', state)
    })

    socket.on('disconnect', () => {
      if (roomCode) {
        leaveRoom(roomCode, socket.id)
        socket.leave(`room:${roomCode}`)
        io.to(`room:${roomCode}`).emit('player_left', { socketId: socket.id })
      }
    })
  })

  return io
}
