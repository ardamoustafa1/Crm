// Authentication Routes

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../models/database';
import { generateToken } from '../utils/jwt';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Login
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register
router.post('/register', (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const userId = `user-${Date.now()}`;

        db.prepare(`
            INSERT INTO users (id, email, password, name, role)
            VALUES (?, ?, ?, ?, ?)
        `).run(userId, email, hashedPassword, name, 'agent');

        const token = generateToken({
            userId,
            email,
            role: 'agent'
        });

        res.status(201).json({
            token,
            user: {
                id: userId,
                email,
                name,
                role: 'agent'
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
    try {
        const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?')
            .get(req.user?.userId) as any;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
