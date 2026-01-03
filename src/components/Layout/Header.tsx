// Header Component

import React from 'react';
import {
    Search,
    Settings,
    ChevronDown,
    Moon,
    Sun,
    HelpCircle
} from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useTheme } from '../../contexts/ThemeContext';
import { NotificationCenter } from '../NotificationCenter/NotificationCenter';
import './Header.css';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    const agents = useAgentStore((state) => state.agents);
    const currentAgentId = useAgentStore((state) => state.currentAgentId);
    const currentAgent = agents.find(a => a.id === currentAgentId);
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <div className="header-left">
                {title && <h1 className="header-title">{title}</h1>}

                <div className="header-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search conversations, cases, tickets..."
                        className="search-input"
                    />
                    <kbd className="search-shortcut">⌘K</kbd>
                </div>
            </div>

            <div className="header-right">
                {/* Quick Stats */}
                <div className="header-stats">
                    <div className="header-stat">
                        <span className="stat-dot stat-dot-success" />
                        <span className="stat-text">5 Online Agents</span>
                    </div>
                    <div className="header-stat">
                        <span className="stat-dot stat-dot-warning" />
                        <span className="stat-text">3 Pending</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="header-actions">
                    {/* Theme Toggle */}
                    <button
                        className="header-action-btn theme-toggle"
                        aria-label="Toggle Theme"
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button className="header-action-btn" aria-label="Help">
                        <HelpCircle size={20} />
                    </button>

                    <NotificationCenter />

                    <button className="header-action-btn" aria-label="Settings">
                        <Settings size={20} />
                    </button>
                </div>

                {/* User Menu */}
                <div className="header-user">
                    <div className="user-avatar">
                        {currentAgent?.name.charAt(0) || 'A'}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{currentAgent?.name || 'Agent'}</span>
                        <span className="user-role">{currentAgent?.teams[0] || 'Support'}</span>
                    </div>
                    <ChevronDown size={16} className="user-chevron" />
                </div>
            </div>
        </header>
    );
};

export default Header;

