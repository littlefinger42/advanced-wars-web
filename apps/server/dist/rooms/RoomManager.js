import { GameEngine } from 'game-engine';
import { createTestMapWithUnits } from 'game-engine';
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateRoomCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return code;
}
const rooms = new Map();
export function createRoom() {
    let code;
    do {
        code = generateRoomCode();
    } while (rooms.has(code));
    const { map, units } = createTestMapWithUnits();
    const game = new GameEngine(map, units);
    const room = {
        code,
        state: 'waiting',
        players: new Map(),
        game,
        createdAt: Date.now(),
    };
    rooms.set(code, room);
    return code;
}
export function getRoom(code) {
    return rooms.get(code.toUpperCase());
}
export function joinRoom(code, socketId) {
    const room = rooms.get(code.toUpperCase());
    if (!room)
        return { playerId: 1, success: false };
    if (room.state !== 'waiting')
        return { playerId: 1, success: false };
    const existing = Array.from(room.players.values());
    const p1 = existing.find((p) => p.playerId === 1);
    const p2 = existing.find((p) => p.playerId === 2);
    let playerId;
    if (!p1)
        playerId = 1;
    else if (!p2)
        playerId = 2;
    else
        return { playerId: 1, success: false };
    room.players.set(socketId, { socketId, playerId });
    return { playerId, success: true };
}
export function leaveRoom(code, socketId) {
    const room = rooms.get(code.toUpperCase());
    if (!room)
        return;
    room.players.delete(socketId);
    if (room.players.size === 0) {
        rooms.delete(code.toUpperCase());
    }
}
export function startGame(code) {
    const room = rooms.get(code.toUpperCase());
    if (!room)
        return false;
    if (room.state !== 'waiting')
        return false;
    if (room.players.size < 2)
        return false;
    room.state = 'in_game';
    return true;
}
export function getGameState(code) {
    const room = rooms.get(code.toUpperCase());
    if (!room?.game)
        return null;
    return room.game.getState();
}
export function processGameAction(code, playerId, action) {
    const room = rooms.get(code.toUpperCase());
    if (!room?.game)
        return { success: false, state: null };
    const state = room.game.getState();
    if (state.currentPlayer !== playerId)
        return { success: false, state: null };
    const err = room.game.processAction(action);
    if (err)
        return { success: false, state: null };
    const newState = room.game.getState();
    if (newState.winner)
        room.state = 'finished';
    return { success: true, state: newState };
}
