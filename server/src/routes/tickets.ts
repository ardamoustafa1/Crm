// Tickets Routes

import { Router } from 'express';
import { db } from '../models/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all tickets
router.get('/', authMiddleware, (req: AuthRequest, res) => {
    try {
        const tickets = db.prepare(`
            SELECT t.*, u.name as assigned_name
            FROM tickets t
            LEFT JOIN users u ON t.assigned_to = u.id
            ORDER BY t.created_at DESC
        `).all();

        res.json(tickets);
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create ticket
router.post('/', authMiddleware, (req: AuthRequest, res) => {
    try {
        const { title, description, priority } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title required' });
        }

        const ticketId = `ticket-${Date.now()}`;
        const slaDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        db.prepare(`
            INSERT INTO tickets (id, title, description, priority, created_by, sla_deadline)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(ticketId, title, description || '', priority || 'medium', req.user?.userId, slaDeadline);

        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
        res.status(201).json(ticket);
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update ticket
router.patch('/:id', authMiddleware, (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { status, priority, assigned_to } = req.body;

        const updates: string[] = [];
        const values: any[] = [];

        if (status) {
            updates.push('status = ?');
            values.push(status);
        }
        if (priority) {
            updates.push('priority = ?');
            values.push(priority);
        }
        if (assigned_to !== undefined) {
            updates.push('assigned_to = ?');
            values.push(assigned_to);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No updates provided' });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        db.prepare(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`).run(...values);

        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        res.json(ticket);
    } catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete ticket
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        db.prepare('DELETE FROM tickets WHERE id = ?').run(id);
        res.json({ message: 'Ticket deleted' });
    } catch (error) {
        console.error('Delete ticket error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
