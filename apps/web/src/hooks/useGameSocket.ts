import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import type { GameState } from 'game-engine'

interface UseGameSocketOptions {
  roomCode: string | null
  onState: (state: GameState) => void
  onJoined?: (playerId: 1 | 2) => void
  onPlayersReady?: () => void
}

export function useGameSocket({
  roomCode,
  onState,
  onJoined,
  onPlayersReady,
}: UseGameSocketOptions) {
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  const sendAction = useCallback(
    (action: { type: string; [key: string]: unknown }) => {
      socketRef.current?.emit('game_action', action)
    },
    []
  )

  useEffect(() => {
    if (!roomCode || roomCode === 'local') return

    const socket = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    socket.on('game_state', (state: GameState) => {
      onState(state)
    })

    socket.on('room_joined', ({ playerId }: { playerId: 1 | 2 }) => {
      onJoined?.(playerId)
    })

    socket.on('game_started', ({ state }: { state: GameState }) => {
      onState(state)
      onPlayersReady?.()
    })

    socket.emit('join_room', roomCode)

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [roomCode, onState, onJoined, onPlayersReady])

  return { sendAction }
}
