import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { listMaps, getMap } from './maps.js';
import { setupSocket } from './socket.js';
import { createRoom, getRoom } from './rooms/RoomManager.js';
const app = express();
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);
setupSocket(httpServer);
app.get('/api/maps', (_req, res) => {
    res.json(listMaps());
});
app.get('/api/maps/:id', (req, res) => {
    const data = getMap(req.params.id);
    if (!data)
        return res.status(404).json({ error: 'Map not found' });
    res.json(data);
});
app.post('/api/rooms', (req, res) => {
    const mapId = req.body?.mapId;
    const roomCode = createRoom(mapId);
    res.json({ roomCode });
});
app.get('/api/rooms/:code', (req, res) => {
    const room = getRoom(req.params.code);
    if (!room)
        return res.status(404).json({ error: 'Room not found' });
    res.json({
        code: room.code,
        state: room.state,
        playerCount: room.players.size,
    });
});
const PORT = process.env.PORT ?? 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
