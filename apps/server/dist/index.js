import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { setupSocket } from './socket.js';
import { createRoom, getRoom } from './rooms/RoomManager.js';
const app = express();
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);
setupSocket(httpServer);
app.post('/api/rooms', (_req, res) => {
    const roomCode = createRoom();
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
