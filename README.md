# Advance Wars 2 Web Clone

A web-based multiplayer clone of Advance Wars 2: Black Hole Rising. Play turn-based tactical warfare with touch-friendly controls on phone or tablet.

## Features

- **Core gameplay**: Map, units, movement, combat, capture, production
- **Multiplayer**: Create or join rooms via 6-character code; play on different devices
- **Local play**: Single device hotseat mode
- **Touch controls**: Tap to select, move, attack; optimized for mobile

## Quick Start

```bash
npm install
npm run dev:server   # Terminal 1: Backend on port 3001
npm run dev:web     # Terminal 2: Frontend on port 5173
```

Open http://localhost:5173

### Create a multiplayer game

1. Click "Create Game"
2. Share the 6-character room code
3. Second player enters the code and clicks "Join Game"
4. Game starts when both players are in

### Local play (single device)

Click "Local Play (Single Device)" to alternate turns on one screen.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Zustand
- **Backend**: Node.js, Express, Socket.io
- **Game logic**: Shared `game-engine` package

## Project Structure

```
advanced-wars-web/
├── apps/
│   ├── web/          # React frontend
│   └── server/       # Node backend
├── packages/
│   └── game-engine/  # Shared game logic
└── package.json
```

## Units

- **Ground**: Infantry, Mech, Recon, APC, Tank, Md.Tank, Neotank, Anti-Air, Artillery, Rockets, Missiles
- **Sea**: Battleship, Sub, Cruiser, Lander
- **Air**: Fighter, Bomber, B-Copter, T-Copter

## Controls

- **Tap unit** → Select; shows movement (blue) and attack (red) range
- **Tap tile** → Move, attack, or capture
- **Tap empty properties** → Produce new units
- **End Turn** → Pass to opponent
