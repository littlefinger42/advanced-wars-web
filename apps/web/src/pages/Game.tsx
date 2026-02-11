import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GameEngine, createTestMapWithUnits } from 'game-engine'
import type { GameState, Unit } from 'game-engine'
import GameMap from '../components/GameMap'
import UnitPanel from '../components/UnitPanel'
import ProductionPanel from '../components/ProductionPanel'
import { useGameSocket } from '../hooks/useGameSocket'
import styles from './Game.module.css'

const TILE_SIZE = 48

export default function Game() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const navigate = useNavigate()
  const engineRef = useRef<GameEngine | null>(null)
  const [state, setState] = useState<GameState | null>(null)
  const [playerId, setPlayerId] = useState<1 | 2 | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<{
    x: number
    y: number
    type: string
  } | null>(null)
  const [reachable, setReachable] = useState<Map<number, number>>(new Map())
  const [attackable, setAttackable] = useState<{ x: number; y: number }[]>([])

  const initGame = useCallback(() => {
    const { map, units } = createTestMapWithUnits()
    const engine = new GameEngine(map, units)
    engineRef.current = engine
    setState(engine.getState())
    setSelectedUnit(null)
    setReachable(new Map())
    setAttackable([])
  }, [])

  const handleRemoteState = useCallback((newState: GameState) => {
    setState(newState)
    const { map, units } = newState
    engineRef.current = new GameEngine(map, units)
  }, [])

  const { sendAction } = useGameSocket({
    roomCode: roomCode ?? null,
    onState: handleRemoteState,
    onJoined: setPlayerId,
    onPlayersReady: () => setGameStarted(true),
  })

  useEffect(() => {
    if (roomCode === 'local') {
      initGame()
    }
  }, [roomCode, initGame])

  if (roomCode && roomCode !== 'local' && !state) {
    return (
      <div className={styles.game}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            ← Back
          </button>
          <span>Room: {roomCode}</span>
        </header>
        <div className={styles.loading}>
          {gameStarted ? 'Loading...' : `Waiting for opponent... (You are P${playerId ?? '?'})`}
        </div>
      </div>
    )
  }

  const refreshState = useCallback(() => {
    if (engineRef.current) {
      setState(engineRef.current.getState())
    }
  }, [])

  const handleSelectUnit = useCallback((unit: Unit | null) => {
    if (!engineRef.current) return
    setSelectedUnit(unit)
    if (unit) {
      const reach = engineRef.current.getReachableTiles(unit)
      const attack = engineRef.current.getAttackableTiles(unit)
      setReachable(reach)
      setAttackable(attack)
    } else {
      setReachable(new Map())
      setAttackable([])
    }
  }, [])

  const isLocal = roomCode === 'local'

  const handleTapTile = useCallback(
    (x: number, y: number) => {
      const engine = engineRef.current
      if (!engine || !state) return

      const unit = engine.getUnitAt(x, y)
      const gs = engine.getState()

      if (unit) {
        setSelectedProperty(null)
        if (unit.player === gs.currentPlayer) {
          if (isLocal || gs.currentPlayer === playerId) {
            handleSelectUnit(unit)
          }
          return
        }
        if (selectedUnit && attackable.some((t) => t.x === x && t.y === y)) {
          if (isLocal) {
            const err = engine.attack(selectedUnit.id, unit.id)
            if (!err) {
              refreshState()
              handleSelectUnit(null)
            }
          } else {
            sendAction({ type: 'attack', attackerId: selectedUnit.id, defenderId: unit.id })
            handleSelectUnit(null)
          }
          return
        }
      }

      if (!selectedUnit) {
        const tile = state.map.tiles[y]?.[x]
        if (
          tile?.property &&
          tile.property !== 'hq' &&
          tile.owner === gs.currentPlayer &&
          (isLocal || gs.currentPlayer === playerId)
        ) {
          const existing = engine.getUnitAt(x, y)
          if (!existing) {
            setSelectedProperty({ x, y, type: tile.property })
            return
          }
        }
      }

      if (selectedUnit) {
        setSelectedProperty(null)
        const key = y * state.map.width + x
        if (reachable.has(key)) {
          if (isLocal) {
            const err = engine.move(selectedUnit.id, x, y)
            if (!err) {
              refreshState()
              handleSelectUnit(null)
            }
          } else {
            sendAction({ type: 'move', unitId: selectedUnit.id, x, y })
            handleSelectUnit(null)
          }
          return
        }

        const tile = state.map.tiles[y]?.[x]
        if (
          tile?.property &&
          tile.property !== 'hq' &&
          tile.owner !== gs.currentPlayer &&
          selectedUnit.player === gs.currentPlayer
        ) {
          const def = engine.getReachableTiles(selectedUnit)
          if (def.has(key)) {
            if (isLocal) {
              const err = engine.capture(selectedUnit.id)
              if (!err) {
                refreshState()
                handleSelectUnit(null)
              }
            } else {
              sendAction({ type: 'capture', unitId: selectedUnit.id })
              handleSelectUnit(null)
            }
          }
        }
      }

      setSelectedProperty(null)
      handleSelectUnit(null)
    },
    [state, selectedUnit, reachable, attackable, refreshState, handleSelectUnit, isLocal, sendAction, playerId]
  )

  const handleEndTurn = useCallback(() => {
    if (isLocal) {
      engineRef.current?.endTurn()
      refreshState()
    } else {
      sendAction({ type: 'end_turn' })
    }
    setSelectedProperty(null)
    handleSelectUnit(null)
  }, [refreshState, handleSelectUnit, isLocal, sendAction])

  const handleProduce = useCallback(
    (unitType: string) => {
      if (!selectedProperty) return
      if (isLocal) {
        const err = engineRef.current?.produce(
          selectedProperty.x,
          selectedProperty.y,
          unitType
        )
        if (!err) {
          refreshState()
          setSelectedProperty(null)
        }
      } else {
        sendAction({
          type: 'produce',
          propertyX: selectedProperty.x,
          propertyY: selectedProperty.y,
          unitType,
        })
        setSelectedProperty(null)
      }
    },
    [selectedProperty, isLocal, refreshState, sendAction]
  )

  const handleBack = () => navigate('/')

  if (!state) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          ← Back
        </button>
        <div className={styles.turnInfo}>
          <span>Turn {state.turn}</span>
          <span className={state.currentPlayer === 1 ? styles.p1 : styles.p2}>
            P{state.currentPlayer}
          </span>
          <span>${state.funds[state.currentPlayer] ?? 0}</span>
        </div>
        <button
          className={styles.endTurn}
          onClick={handleEndTurn}
          disabled={
            !!state.winner ||
            (!isLocal && state.currentPlayer !== playerId)
          }
        >
          End Turn
        </button>
      </header>

      {state.winner && (
        <div className={styles.victory}>
          Player {state.winner} Wins!
          <button onClick={initGame}>Play Again</button>
          <button onClick={handleBack}>Main Menu</button>
        </div>
      )}

      <div className={styles.mapContainer}>
        <GameMap
          state={state}
          selectedUnit={selectedUnit}
          reachable={reachable}
          attackable={attackable}
          tileSize={TILE_SIZE}
          onTapTile={handleTapTile}
          onSelectUnit={handleSelectUnit}
        />
      </div>

      {selectedProperty && (
        <ProductionPanel
          propertyType={selectedProperty.type}
          x={selectedProperty.x}
          y={selectedProperty.y}
          funds={state.funds[state.currentPlayer] ?? 0}
          onProduce={handleProduce}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      <UnitPanel
        unit={selectedUnit}
        funds={state.funds[state.currentPlayer] ?? 0}
        canCapture={
          !!selectedUnit &&
          (() => {
            const tile = state.map.tiles[selectedUnit.y]?.[selectedUnit.x]
            return !!(
              tile?.property &&
              tile.property !== 'hq' &&
              tile.owner !== state.currentPlayer
            )
          })()
        }
        onClose={() => handleSelectUnit(null)}
        onCapture={
          selectedUnit
            ? () => {
                if (isLocal) {
                  const err = engineRef.current?.capture(selectedUnit.id)
                  if (!err) {
                    refreshState()
                    handleSelectUnit(null)
                  }
                } else {
                  sendAction({ type: 'capture', unitId: selectedUnit.id })
                  handleSelectUnit(null)
                }
              }
            : undefined
        }
      />
    </div>
  )
}
