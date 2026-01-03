// Socket.io Context for Real-time Updates

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Notification {
    id: string;
    type: 'ticket' | 'message' | 'system' | 'agent';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = 'http://localhost:3001';

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user, token } = useAuth();

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(SOCKET_URL, {
            autoConnect: true,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('🔌 Socket connected');
            setIsConnected(true);

            // Authenticate if user is logged in
            if (user) {
                newSocket.emit('authenticate', user.id);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
            setIsConnected(false);
        });

        // Listen for new tickets
        newSocket.on('ticket:new', (ticket: any) => {
            addNotification({
                type: 'ticket',
                title: 'Yeni Ticket',
                message: `${ticket.title} - ${ticket.priority} öncelik`
            });
            playNotificationSound();
        });

        // Listen for ticket updates
        newSocket.on('ticket:changed', (ticket: any) => {
            addNotification({
                type: 'ticket',
                title: 'Ticket Güncellendi',
                message: `${ticket.title} durumu: ${ticket.status}`
            });
        });

        // Listen for new messages
        newSocket.on('message:new', (data: any) => {
            addNotification({
                type: 'message',
                title: 'Yeni Mesaj',
                message: data.content?.substring(0, 50) + '...'
            });
            playNotificationSound();
        });

        // Listen for agent status changes
        newSocket.on('agent:statusChanged', (data: any) => {
            addNotification({
                type: 'agent',
                title: 'Agent Durumu',
                message: `${data.agentName || 'Bir agent'} ${data.status} durumuna geçti`
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // Re-authenticate when user changes
    useEffect(() => {
        if (socket && user) {
            socket.emit('authenticate', user.id);
        }
    }, [user, socket]);

    const addNotification = (data: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const notification: Notification = {
            ...data,
            id: `notif-${Date.now()}`,
            timestamp: new Date(),
            read: false
        };
        setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
    };

    const playNotificationSound = () => {
        try {
            // Create a simple beep sound
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (e) {
            // Audio not supported or blocked
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                clearNotifications
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export default SocketContext;
