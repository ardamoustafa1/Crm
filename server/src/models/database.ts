// Database Configuration with SQLite

import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(__dirname, '../../data/crm.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
const initDatabase = () => {
    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT DEFAULT 'agent',
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tickets table
    db.exec(`
        CREATE TABLE IF NOT EXISTS tickets (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'open',
            assigned_to TEXT,
            created_by TEXT,
            sla_deadline DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_to) REFERENCES users(id),
            FOREIGN KEY (created_by) REFERENCES users(id)
        )
    `);

    // Cases table
    db.exec(`
        CREATE TABLE IF NOT EXISTS cases (
            id TEXT PRIMARY KEY,
            conversation_id TEXT,
            user_id TEXT,
            problem_type TEXT,
            priority TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'open',
            assigned_agent_id TEXT,
            tags TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Conversations table
    db.exec(`
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            channel TEXT DEFAULT 'web',
            status TEXT DEFAULT 'active',
            assigned_agent_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Messages table
    db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            sender TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id)
        )
    `);

    // Create default admin user if not exists
    const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@crm.com');
    if (!adminExists) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.prepare(`
            INSERT INTO users (id, email, password, name, role)
            VALUES (?, ?, ?, ?, ?)
        `).run('admin-1', 'admin@crm.com', hashedPassword, 'Admin User', 'admin');

        // Create demo agent
        const agentPassword = bcrypt.hashSync('agent123', 10);
        db.prepare(`
            INSERT INTO users (id, email, password, name, role)
            VALUES (?, ?, ?, ?, ?)
        `).run('agent-1', 'agent@crm.com', agentPassword, 'Ahmet Yılmaz', 'agent');
    }

    console.log('✅ Database initialized');
};

export { db, initDatabase };
