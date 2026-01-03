// Main Express Server with Socket.io

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';

import { initDatabase } from './models/database';
import authRoutes from './routes/auth';
import ticketsRoutes from './routes/tickets';

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Create data directory if not exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Join room for authenticated users
    socket.on('authenticate', (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
    });

    // Handle new ticket notification
    socket.on('ticket:created', (ticket: any) => {
        io.emit('ticket:new', ticket);
    });

    // Handle ticket update
    socket.on('ticket:updated', (ticket: any) => {
        io.emit('ticket:changed', ticket);
    });

    // Handle new message
    socket.on('message:send', (data: { conversationId: string; message: any }) => {
        io.emit(`conversation:${data.conversationId}`, data.message);
    });

    // Handle agent status change
    socket.on('agent:status', (data: { agentId: string; status: string }) => {
        io.emit('agent:statusChanged', data);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

// Export io for use in routes
export { io };

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`
🚀 CRM Server running on port ${PORT}
📡 WebSocket ready
🗄️  SQLite database initialized
    `);
});
