// Notification Center Component

import React, { useState, useRef, useEffect } from 'react';
import {
    Bell,
    X,
    Check,
    CheckCheck,
    Trash2,
    Ticket,
    MessageSquare,
    Users,
    Info,
    Wifi,
    WifiOff
} from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import './NotificationCenter.css';

export const NotificationCenter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const {
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        clearNotifications
    } = useSocket();

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'ticket':
                return <Ticket size={16} />;
            case 'message':
                return <MessageSquare size={16} />;
            case 'agent':
                return <Users size={16} />;
            default:
                return <Info size={16} />;
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Şimdi';
        if (minutes < 60) return `${minutes} dk önce`;
        if (hours < 24) return `${hours} saat önce`;
        return `${days} gün önce`;
    };

    return (
        <div className="notification-center" ref={panelRef}>
            {/* Trigger Button */}
            <button
                className={`notification-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Bildirimler"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
                <span className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? <Wifi size={8} /> : <WifiOff size={8} />}
                </span>
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="notification-panel">
                    {/* Header */}
                    <div className="panel-header">
                        <h3>Bildirimler</h3>
                        <div className="header-actions">
                            {notifications.length > 0 && (
                                <>
                                    <button
                                        className="header-action"
                                        onClick={markAllAsRead}
                                        title="Tümünü okundu işaretle"
                                    >
                                        <CheckCheck size={16} />
                                    </button>
                                    <button
                                        className="header-action"
                                        onClick={clearNotifications}
                                        title="Tümünü sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                            <button
                                className="header-action close-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Connection Status */}
                    <div className={`connection-status ${isConnected ? 'online' : 'offline'}`}>
                        {isConnected ? (
                            <>
                                <Wifi size={14} />
                                <span>Canlı bağlantı aktif</span>
                            </>
                        ) : (
                            <>
                                <WifiOff size={14} />
                                <span>Bağlantı kopuk</span>
                            </>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="empty-notifications">
                                <Bell size={32} />
                                <p>Henüz bildirim yok</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className={`notification-icon ${notification.type}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <h4>{notification.title}</h4>
                                        <p>{notification.message}</p>
                                        <span className="notification-time">
                                            {formatTime(notification.timestamp)}
                                        </span>
                                    </div>
                                    {!notification.read && (
                                        <div className="unread-dot"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
