import { useRef, useEffect, useCallback } from "react";
import type { GameState, Unit } from "game-engine";
import { Flex } from "antd";
import { Application, Graphics, Container } from "pixi.js";

const TERRAIN_COLORS: Record<string, number> = {
  plain: 0x84cc16,
  mountain: 0x78716c,
  woods: 0x166534,
  river: 0x0369a1,
  road: 0x6b7280,
  sea: 0x075985,
  shoal: 0xfcd34d,
  reef: 0x64748b,
  pipe: 0x475569,
};

const TEAM_COLORS: Record<number, number> = {
  1: 0x3b82f6,
  2: 0xef4444,
};

interface GameMapProps {
  state: GameState;
  selectedUnit: Unit | null;
  reachable: Map<number, number>;
  attackable: { x: number; y: number }[];
  tileSize: number;
  onTapTile: (x: number, y: number) => void;
  onSelectUnit: (unit: Unit | null) => void;
}

export default function GameMap({
  state,
  selectedUnit,
  reachable,
  attackable,
  tileSize,
  onTapTile,
}: GameMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const onTapTileRef = useRef(onTapTile);
  onTapTileRef.current = onTapTile;

  const render = useCallback(() => {
    const app = appRef.current;
    if (!app) return;

    const { map, units } = state;
    const w = map.width * tileSize;
    const h = map.height * tileSize;

    app.renderer.resize(w, h);

    const tileLayer = app.stage.getChildByLabel("tileLayer") as Container;
    const overlayLayer = app.stage.getChildByLabel("overlayLayer") as Container;
    const unitLayer = app.stage.getChildByLabel("unitLayer") as Container;

    if (!tileLayer || !overlayLayer || !unitLayer) return;

    tileLayer.removeChildren();
    overlayLayer.removeChildren();
    unitLayer.removeChildren();

    const attackSet = new Set(attackable.map((t) => `${t.x},${t.y}`));
    const reachSet = new Set(reachable.keys());

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y][x];
        const color = TERRAIN_COLORS[tile.terrain] ?? TERRAIN_COLORS.plain;

        const tileGraphic = new Graphics().rect(x * tileSize, y * tileSize, tileSize, tileSize).fill(color);
        tileLayer.addChild(tileGraphic);

        const key = y * map.width + x;
        if (reachSet.has(key) && !attackSet.has(`${x},${y}`)) {
          const overlay = new Graphics()
            .rect(x * tileSize, y * tileSize, tileSize, tileSize)
            .fill({ color: 0x3b82f6, alpha: 0.4 });
          overlayLayer.addChild(overlay);
        }
        if (attackSet.has(`${x},${y}`)) {
          const overlay = new Graphics()
            .rect(x * tileSize, y * tileSize, tileSize, tileSize)
            .fill({ color: 0xef4444, alpha: 0.5 });
          overlayLayer.addChild(overlay);
        }
      }
    }

    for (const unit of units) {
      const teamColor = TEAM_COLORS[unit.player] ?? 0x888888;
      const cx = unit.x * tileSize + tileSize / 2;
      const cy = unit.y * tileSize + tileSize / 2;
      const radius = tileSize * 0.35;

      const unitGraphic = new Graphics()
        .circle(cx, cy, radius)
        .fill({ color: teamColor, alpha: unit.hasMoved ? 0.6 : 1 });
      if (selectedUnit?.id === unit.id) {
        unitGraphic.circle(cx, cy, radius + 2).stroke({ width: 2, color: 0xffffff });
      }
      unitLayer.addChild(unitGraphic);
    }
  }, [state, reachable, attackable, tileSize, selectedUnit]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const app = new Application();
    const w = state.map.width * tileSize;
    const h = state.map.height * tileSize;

    let initCompleted = false;
    let unmounted = false;

    const init = async () => {
      await app.init({
        width: w,
        height: h,
        backgroundColor: 0x0f172a,
        antialias: true,
      });

      initCompleted = true;

      if (unmounted) {
        const canvas = app.canvas;
        app.destroy(true, { children: true });
        if (canvas && container.contains(canvas)) container.removeChild(canvas);
        return;
      }

      const tileLayer = new Container({ label: "tileLayer" });
      app.stage.addChild(tileLayer);

      const overlayLayer = new Container({ label: "overlayLayer" });
      app.stage.addChild(overlayLayer);

      const unitLayer = new Container({ label: "unitLayer" });
      app.stage.addChild(unitLayer);

      app.stage.eventMode = "static";
      app.stage.hitArea = app.screen;
      app.stage.on("pointerdown", (e) => {
        const pos = e.global;
        const x = Math.floor(pos.x / tileSize);
        const y = Math.floor(pos.y / tileSize);
        if (x >= 0 && x < state.map.width && y >= 0 && y < state.map.height) {
          onTapTileRef.current(x, y);
        }
      });

      container.appendChild(app.canvas);
      appRef.current = app;
      render();
    };

    init();

    return () => {
      unmounted = true;

      if (initCompleted) {
        const canvas = app.canvas;
        app.destroy(true, { children: true });
        appRef.current = null;
        if (canvas && container.contains(canvas)) {
          container.removeChild(canvas);
        }
      }
    };
  }, []);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <Flex
      ref={containerRef}
      style={{
        touchAction: "manipulation",
        minWidth: "100%",
        minHeight: "100%",
        cursor: "pointer",
        borderRadius: 4,
        overflow: "hidden",
      }}
    />
  );
}
