import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { GameEngine } from "game-engine";
import type { GameState, Unit } from "game-engine";
import { Flex, Spin, Modal, Typography, Button } from "antd";
import GameMap from "../components/GameMap";
import UnitPanel from "../components/UnitPanel";
import ProductionPanel from "../components/ProductionPanel";
import GameHeader from "../components/layout/GameHeader";
import { useGameSocket } from "../hooks/useGameSocket";
import styles from "./Game.module.css";

const TILE_SIZE = 48;

export default function Game() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const engineRef = useRef<GameEngine | null>(null);
  const mapIdRef = useRef<string>("smallSkirmish");
  const [state, setState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<1 | 2 | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<{
    x: number;
    y: number;
    type: string;
  } | null>(null);
  const [reachable, setReachable] = useState<Map<number, number>>(new Map());
  const [attackable, setAttackable] = useState<{ x: number; y: number }[]>([]);

  const initGame = useCallback(
    (mapData: { map: import("game-engine").MapData; units: Unit[] }) => {
      const { map, units } = mapData;
      const engine = new GameEngine(map, units);
      engineRef.current = engine;
      setState(engine.getState());
      setSelectedUnit(null);
      setReachable(new Map());
      setAttackable([]);
    },
    [],
  );

  const handleRemoteState = useCallback((newState: GameState) => {
    setState(newState);
    const { map, units } = newState;
    engineRef.current = new GameEngine(map, units);
  }, []);

  const { sendAction } = useGameSocket({
    roomCode: roomCode ?? null,
    onState: handleRemoteState,
    onJoined: setPlayerId,
    onPlayersReady: () => setGameStarted(true),
  });

  const loadMap = useCallback(
    (mapId: string) => {
      mapIdRef.current = mapId;
      fetch(`/api/maps/${mapId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Map not found");
          return res.json();
        })
        .then((data: { map: import("game-engine").MapData; units: Unit[] }) =>
          initGame(data),
        )
        .catch(() => {
          fetch("/api/maps/smallSkirmish")
            .then((r) => r.json())
            .then((data: { map: import("game-engine").MapData; units: Unit[] }) => {
              mapIdRef.current = "smallSkirmish";
              initGame(data);
            })
            .catch(() => {});
        });
    },
    [initGame],
  );

  useEffect(() => {
    if (roomCode !== "local") return;

    const mapId = (location.state as { mapId?: string } | null)?.mapId ?? "smallSkirmish";
    loadMap(mapId);
  }, [roomCode, loadMap, location.state]);

  if (roomCode && roomCode !== "local" && !state) {
    return (
      <Flex vertical style={{ height: "100vh", background: "#0f172a" }}>
        <GameHeader roomCode={roomCode} onBack={() => navigate("/")} />
        <Flex flex={1} align="center" justify="center" vertical gap={16}>
          <Spin size="large" />
          <Typography.Text style={{ color: "rgba(255,255,255,0.65)" }}>
            {gameStarted
              ? "Loading..."
              : `Waiting for opponent... (You are P${playerId ?? "?"})`}
          </Typography.Text>
        </Flex>
      </Flex>
    );
  }

  const refreshState = useCallback(() => {
    if (engineRef.current) {
      setState(engineRef.current.getState());
    }
  }, []);

  const handleSelectUnit = useCallback((unit: Unit | null) => {
    if (!engineRef.current) return;
    setSelectedUnit(unit);
    if (unit) {
      const reach = engineRef.current.getReachableTiles(unit);
      const attack = engineRef.current.getAttackableTiles(unit);
      setReachable(reach);
      setAttackable(attack);
    } else {
      setReachable(new Map());
      setAttackable([]);
    }
  }, []);

  const isLocal = roomCode === "local";

  const handleTapTile = useCallback(
    (x: number, y: number) => {
      const engine = engineRef.current;
      if (!engine || !state) return;

      const unit = engine.getUnitAt(x, y);
      const gs = engine.getState();

      if (unit) {
        setSelectedProperty(null);
        if (unit.player === gs.currentPlayer) {
          if (isLocal || gs.currentPlayer === playerId) {
            handleSelectUnit(unit);
          }
          return;
        }
        if (selectedUnit && attackable.some((t) => t.x === x && t.y === y)) {
          if (isLocal) {
            const err = engine.attack(selectedUnit.id, unit.id);
            if (!err) {
              refreshState();
              handleSelectUnit(null);
            }
          } else {
            sendAction({
              type: "attack",
              attackerId: selectedUnit.id,
              defenderId: unit.id,
            });
            handleSelectUnit(null);
          }
          return;
        }
      }

      if (!selectedUnit) {
        const tile = state.map.tiles[y]?.[x];
        if (
          tile?.property &&
          tile.property !== "hq" &&
          tile.owner === gs.currentPlayer &&
          (isLocal || gs.currentPlayer === playerId)
        ) {
          const existing = engine.getUnitAt(x, y);
          if (!existing) {
            setSelectedProperty({ x, y, type: tile.property });
            return;
          }
        }
      }

      if (selectedUnit) {
        setSelectedProperty(null);
        const key = y * state.map.width + x;
        if (reachable.has(key)) {
          if (isLocal) {
            const err = engine.move(selectedUnit.id, x, y);
            if (!err) {
              refreshState();
              handleSelectUnit(null);
            }
          } else {
            sendAction({ type: "move", unitId: selectedUnit.id, x, y });
            handleSelectUnit(null);
          }
          return;
        }

        const tile = state.map.tiles[y]?.[x];
        if (
          tile?.property &&
          tile.property !== "hq" &&
          tile.owner !== gs.currentPlayer &&
          selectedUnit.player === gs.currentPlayer
        ) {
          const def = engine.getReachableTiles(selectedUnit);
          if (def.has(key)) {
            if (isLocal) {
              const err = engine.capture(selectedUnit.id);
              if (!err) {
                refreshState();
                handleSelectUnit(null);
              }
            } else {
              sendAction({ type: "capture", unitId: selectedUnit.id });
              handleSelectUnit(null);
            }
          }
        }
      }

      setSelectedProperty(null);
      handleSelectUnit(null);
    },
    [
      state,
      selectedUnit,
      reachable,
      attackable,
      refreshState,
      handleSelectUnit,
      isLocal,
      sendAction,
      playerId,
    ],
  );

  const handleEndTurn = useCallback(() => {
    if (isLocal) {
      engineRef.current?.endTurn();
      refreshState();
    } else {
      sendAction({ type: "end_turn" });
    }
    setSelectedProperty(null);
    handleSelectUnit(null);
  }, [refreshState, handleSelectUnit, isLocal, sendAction]);

  const handleProduce = useCallback(
    (unitType: string) => {
      if (!selectedProperty) return;
      if (isLocal) {
        const err = engineRef.current?.produce(
          selectedProperty.x,
          selectedProperty.y,
          unitType,
        );
        if (!err) {
          refreshState();
          setSelectedProperty(null);
        }
      } else {
        sendAction({
          type: "produce",
          propertyX: selectedProperty.x,
          propertyY: selectedProperty.y,
          unitType,
        });
        setSelectedProperty(null);
      }
    },
    [selectedProperty, isLocal, refreshState, sendAction],
  );

  const handleBack = () => navigate("/");

  if (!state) {
    return (
      <Flex
        vertical
        align="center"
        justify="center"
        style={{ height: "100vh", background: "#0f172a" }}
      >
        <Spin size="large" />
        <Typography.Text
          style={{ color: "rgba(255,255,255,0.65)", marginTop: 16 }}
        >
          Loading...
        </Typography.Text>
      </Flex>
    );
  }

  return (
    <Flex
      vertical
      style={{ height: "100vh", overflow: "hidden", background: "#0f172a" }}
    >
      <GameHeader
        roomCode={roomCode !== "local" ? roomCode : undefined}
        onBack={handleBack}
        turn={state.turn}
        currentPlayer={state.currentPlayer}
        funds={state.funds[state.currentPlayer] ?? 0}
        onEndTurn={handleEndTurn}
        endTurnDisabled={
          !!state.winner || (!isLocal && state.currentPlayer !== playerId)
        }
      />

      {state.winner && (
        <Modal
          title="Victory!"
          open
          footer={[
            <Button key="again" type="primary" onClick={() => loadMap(mapIdRef.current)}>
              Play Again
            </Button>,
            <Button key="menu" onClick={handleBack}>
              Main Menu
            </Button>,
          ]}
          closable={false}
          centered
        >
          <Typography.Text style={{ fontSize: 18 }}>
            Player {state.winner} Wins!
          </Typography.Text>
        </Modal>
      )}

      <Flex align="flex-start" gap={16} className={styles.contentContainer}>
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

        {selectedUnit && (
          <UnitPanel
            unit={selectedUnit}
            funds={state.funds[state.currentPlayer] ?? 0}
            canCapture={
              !!selectedUnit &&
              (() => {
                const tile = state.map.tiles[selectedUnit.y]?.[selectedUnit.x];
                return !!(
                  tile?.property &&
                  tile.property !== "hq" &&
                  tile.owner !== state.currentPlayer
                );
              })()
            }
            onClose={() => handleSelectUnit(null)}
            onCapture={
              selectedUnit
                ? () => {
                    if (isLocal) {
                      const err = engineRef.current?.capture(selectedUnit.id);
                      if (!err) {
                        refreshState();
                        handleSelectUnit(null);
                      }
                    } else {
                      sendAction({ type: "capture", unitId: selectedUnit.id });
                      handleSelectUnit(null);
                    }
                  }
                : undefined
            }
          />
        )}

        {selectedProperty && (
          <ProductionPanel
            propertyType={selectedProperty.type}
            x={selectedProperty.x}
            y={selectedProperty.y}
            funds={state.funds[state.currentPlayer] ?? 0}
            onProduce={handleProduce}
          />
        )}
      </Flex>
    </Flex>
  );
}
