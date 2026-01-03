// Sidebar Component - Main Navigation

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Ticket,
    Settings,
    ChevronLeft,
    ChevronRight,
    Bot,
    GitBranch,
    Shield,
    BarChart3,
    Headphones
} from 'lucide-react';
import './Sidebar.css';

interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/agent-panel', label: 'Agent Panel', icon: <Headphones size={20} />, badge: 3 },
    { path: '/conversations', label: 'Conversations', icon: <MessageSquare size={20} />, badge: 12 },
    { path: '/cases', label: 'Cases', icon: <Users size={20} />, badge: 5 },
    { path: '/tickets', label: 'Tickets', icon: <Ticket size={20} />, badge: 2 },
    { path: '/ai-insights', label: 'AI Insights', icon: <Bot size={20} /> },
    { path: '/decision-engine', label: 'Decision Engine', icon: <GitBranch size={20} /> },
    { path: '/agents', label: 'Agent Routing', icon: <BarChart3 size={20} /> },
    { path: '/security', label: 'Security', icon: <Shield size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <Bot size={24} />
                    </div>
                    {!isCollapsed && (
                        <div className="logo-text">
                            <span className="logo-title">CRM</span>
                            <span className="logo-subtitle">Enterprise</span>
                        </div>
                    )}
                </div>
                <button
                    className="sidebar-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item) => (
                        <li key={item.path} className="nav-item">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                                }
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {!isCollapsed && (
                                    <>
                                        <span className="nav-label">{item.label}</span>
                                        {item.badge && (
                                            <span className="nav-badge">{item.badge}</span>
                                        )}
                                    </>
                                )}
                                {isCollapsed && item.badge && (
                                    <span className="nav-badge-dot" />
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                {!isCollapsed && (
                    <div className="sidebar-stats">
                        <div className="stat-item">
                            <span className="stat-value">68.5%</span>
                            <span className="stat-label">AI Resolution</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">43</span>
                            <span className="stat-label">Active Cases</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
