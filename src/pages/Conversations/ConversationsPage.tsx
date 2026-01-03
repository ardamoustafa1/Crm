// Conversations Page - Full Implementation

import React, { useState } from 'react';
import {
    Search,
    Filter,
    MessageSquare,
    Phone,
    Video,
    MoreVertical,
    Send,
    Smartphone,
    Globe,
    Bot,
    User,
    Clock,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Zap,
    X
} from 'lucide-react';
import { mockConversations, mockUsers, mockAIInsights } from '../../services/mockData';
import { ConversationChannel, ConversationStatus, Sentiment, Conversation, Message } from '../../types';
import './ConversationsPage.css';

const getChannelIcon = (channel: ConversationChannel) => {
    switch (channel) {
        case ConversationChannel.WEB:
            return <Globe size={14} />;
        case ConversationChannel.MOBILE:
            return <Smartphone size={14} />;
        case ConversationChannel.WHATSAPP:
            return <MessageSquare size={14} />;
        case ConversationChannel.TELEGRAM:
            return <Send size={14} />;
        default:
            return <MessageSquare size={14} />;
    }
};

const getStatusConfig = (status: ConversationStatus) => {
    const configs: Record<ConversationStatus, { color: string; label: string; icon: React.ReactNode }> = {
        [ConversationStatus.ACTIVE]: { color: 'success', label: 'Aktif', icon: <Zap size={12} /> },
        [ConversationStatus.AI_HANDLING]: { color: 'info', label: 'AI Yanıtlıyor', icon: <Bot size={12} /> },
        [ConversationStatus.AGENT_ASSIGNED]: { color: 'warning', label: 'Agent Atandı', icon: <User size={12} /> },
        [ConversationStatus.RESOLVED]: { color: 'success', label: 'Çözüldü', icon: <CheckCircle size={12} /> },
        [ConversationStatus.CLOSED]: { color: 'neutral', label: 'Kapatıldı', icon: <AlertCircle size={12} /> }
    };
    return configs[status];
};

const getSentimentColor = (sentiment: Sentiment) => {
    const colors: Record<Sentiment, string> = {
        [Sentiment.ANGRY]: 'var(--color-sentiment-angry)',
        [Sentiment.FRUSTRATED]: 'var(--color-sentiment-frustrated)',
        [Sentiment.NEUTRAL]: 'var(--color-sentiment-neutral)',
        [Sentiment.SATISFIED]: 'var(--color-sentiment-satisfied)',
        [Sentiment.HAPPY]: 'var(--color-sentiment-happy)'
    };
    return colors[sentiment];
};

export const ConversationsPage: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations[0]?.id || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [channelFilter, setChannelFilter] = useState<ConversationChannel | 'all'>('all');
    const [replyText, setReplyText] = useState('');
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const filteredConversations = conversations.filter(conv => {
        const user = mockUsers.find(u => u.id === conv.userId);
        const matchesSearch = user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesChannel = channelFilter === 'all' || conv.channel === channelFilter;
        return matchesSearch && matchesChannel;
    });

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);
    const selectedUser = selectedConversation?.userId
        ? mockUsers.find(u => u.id === selectedConversation.userId)
        : null;
    const selectedInsight = mockAIInsights.find(i => i.conversationId === selectedConversationId);

    const handleSendReply = () => {
        if (!replyText.trim() || !selectedConversationId) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            conversationId: selectedConversationId,
            sender: 'agent',
            content: replyText,
            timestamp: new Date()
        };

        setConversations(conversations.map(conv =>
            conv.id === selectedConversationId
                ? { ...conv, messages: [...conv.messages, newMessage] }
                : conv
        ));
        setReplyText('');
        showToast('Mesaj gönderildi');
    };

    return (
        <div className="conversations-page">
            {/* Left Panel - Conversation List */}
            <div className="conversations-sidebar">
                <div className="sidebar-header">
                    <h2>Konuşmalar</h2>
                    <span className="conversation-count">{mockConversations.length}</span>
                </div>

                {/* Search */}
                <div className="search-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Konuşma ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Channel Filters */}
                <div className="channel-filters">
                    <button
                        className={`channel-filter ${channelFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setChannelFilter('all')}
                    >
                        Tümü
                    </button>
                    <button
                        className={`channel-filter ${channelFilter === ConversationChannel.WEB ? 'active' : ''}`}
                        onClick={() => setChannelFilter(ConversationChannel.WEB)}
                    >
                        <Globe size={14} /> Web
                    </button>
                    <button
                        className={`channel-filter ${channelFilter === ConversationChannel.MOBILE ? 'active' : ''}`}
                        onClick={() => setChannelFilter(ConversationChannel.MOBILE)}
                    >
                        <Smartphone size={14} /> Mobil
                    </button>
                    <button
                        className={`channel-filter ${channelFilter === ConversationChannel.WHATSAPP ? 'active' : ''}`}
                        onClick={() => setChannelFilter(ConversationChannel.WHATSAPP)}
                    >
                        <MessageSquare size={14} /> WA
                    </button>
                </div>

                {/* Conversation List */}
                <div className="conversation-list">
                    {filteredConversations.map((conv) => {
                        const user = mockUsers.find(u => u.id === conv.userId);
                        const insight = mockAIInsights.find(i => i.conversationId === conv.id);
                        const statusConfig = getStatusConfig(conv.status);
                        const lastMessage = conv.messages[conv.messages.length - 1];
                        const timeDiff = Math.floor((Date.now() - new Date(conv.startTime).getTime()) / 60000);

                        return (
                            <div
                                key={conv.id}
                                className={`conversation-card ${selectedConversationId === conv.id ? 'active' : ''}`}
                                onClick={() => setSelectedConversationId(conv.id)}
                            >
                                <div className="conv-card-header">
                                    <div className="conv-user">
                                        <div className="user-avatar">
                                            {user?.name.charAt(0) || 'U'}
                                            <span
                                                className="sentiment-indicator"
                                                style={{ background: insight ? getSentimentColor(insight.sentiment) : 'var(--color-text-muted)' }}
                                            />
                                        </div>
                                        <div className="user-info">
                                            <span className="user-name">{user?.name || 'Anonim'}</span>
                                            <span className="conv-time">{timeDiff}dk önce</span>
                                        </div>
                                    </div>
                                    <div className="conv-channel">
                                        {getChannelIcon(conv.channel)}
                                    </div>
                                </div>

                                <div className="conv-preview">
                                    {lastMessage?.content.slice(0, 60)}...
                                </div>

                                <div className="conv-footer">
                                    <span className={`status-badge status-${statusConfig.color}`}>
                                        {statusConfig.icon}
                                        {statusConfig.label}
                                    </span>
                                    {insight && (
                                        <span className="intent-tag">
                                            {insight.intent.replace('_', ' ')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Center Panel - Chat View */}
            <div className="conversations-main">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="chat-header">
                            <div className="chat-header-left">
                                <div className="chat-user-avatar">
                                    {selectedUser?.name.charAt(0) || 'U'}
                                </div>
                                <div className="chat-user-info">
                                    <h3>{selectedUser?.name || 'Anonim Kullanıcı'}</h3>
                                    <div className="chat-meta">
                                        <span className="meta-item">
                                            {getChannelIcon(selectedConversation.channel)}
                                            {selectedConversation.channel}
                                        </span>
                                        <span className="meta-item">
                                            <Clock size={14} />
                                            {Math.floor((Date.now() - new Date(selectedConversation.startTime).getTime()) / 60000)} dk
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="chat-header-actions">
                                <button className="btn btn-ghost btn-icon">
                                    <Phone size={18} />
                                </button>
                                <button className="btn btn-ghost btn-icon">
                                    <Video size={18} />
                                </button>
                                <button className="btn btn-ghost btn-icon">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {selectedConversation.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`chat-message ${message.sender === 'user' ? 'message-user' : message.sender === 'ai' ? 'message-ai' : 'message-agent'}`}
                                >
                                    <div className="message-avatar">
                                        {message.sender === 'user'
                                            ? selectedUser?.name.charAt(0) || 'U'
                                            : message.sender === 'ai'
                                                ? '🤖'
                                                : 'A'}
                                    </div>
                                    <div className="message-bubble">
                                        <div className="message-header">
                                            <span className="message-sender">
                                                {message.sender === 'user'
                                                    ? selectedUser?.name || 'Kullanıcı'
                                                    : message.sender === 'ai'
                                                        ? 'AI Assistant'
                                                        : 'Agent'}
                                            </span>
                                            <span className="message-time">
                                                {new Date(message.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="message-text">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Box */}
                        <div className="chat-reply">
                            <div className="reply-input-wrapper">
                                <textarea
                                    placeholder="Mesajınızı yazın..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="reply-textarea"
                                    rows={2}
                                />
                                <button
                                    className="btn btn-primary send-btn"
                                    onClick={handleSendReply}
                                    disabled={!replyText.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="no-conversation">
                        <MessageSquare size={48} />
                        <h3>Konuşma Seçin</h3>
                        <p>Sol panelden bir konuşma seçerek görüntüleyin</p>
                    </div>
                )}
            </div>

            {/* Right Panel - Details */}
            <div className="conversations-details">
                {selectedConversation && selectedUser && (
                    <>
                        {/* Customer Info */}
                        <div className="detail-section">
                            <h4>Müşteri Bilgileri</h4>
                            <div className="customer-card">
                                <div className="customer-avatar-lg">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div className="customer-info">
                                    <span className="customer-name">{selectedUser.name}</span>
                                    <span className="customer-email">{selectedUser.email}</span>
                                    <span className={`tier-badge tier-${selectedUser.tier}`}>
                                        {selectedUser.tier.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="customer-details">
                                <div className="detail-row">
                                    <span className="detail-label">Telefon</span>
                                    <span className="detail-value">{selectedUser.phone}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Üyelik</span>
                                    <span className="detail-value">
                                        {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* AI Insight */}
                        {selectedInsight && (
                            <div className="detail-section">
                                <h4>AI İç Görüsü</h4>
                                <div className="ai-insight-card">
                                    <div className="insight-header">
                                        <span className="insight-intent">
                                            {selectedInsight.intent.replace('_', ' ')}
                                        </span>
                                        <span className="insight-confidence">
                                            %{Math.round(selectedInsight.confidence * 100)}
                                        </span>
                                    </div>
                                    <div className="insight-sentiment">
                                        <span
                                            className="sentiment-dot"
                                            style={{ background: getSentimentColor(selectedInsight.sentiment) }}
                                        />
                                        {selectedInsight.sentiment}
                                    </div>
                                    <p className="insight-summary">{selectedInsight.summary}</p>
                                    <div className="suggested-actions">
                                        <h5>Önerilen Aksiyonlar</h5>
                                        <ul>
                                            {selectedInsight.suggestedActions.map((action, idx) => (
                                                <li key={idx}>
                                                    <ArrowRight size={12} />
                                                    {action}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="detail-section">
                            <h4>Hızlı Aksiyonlar</h4>
                            <div className="quick-actions">
                                <button
                                    className="quick-action-btn"
                                    onClick={() => {
                                        if (selectedConversationId) {
                                            setConversations(conversations.map(conv =>
                                                conv.id === selectedConversationId
                                                    ? { ...conv, status: ConversationStatus.RESOLVED }
                                                    : conv
                                            ));
                                            showToast('Konuşma çözüldü olarak işaretlendi');
                                        }
                                    }}
                                >
                                    <CheckCircle size={16} />
                                    Çözüldü Olarak İşaretle
                                </button>
                                <button
                                    className="quick-action-btn"
                                    onClick={() => {
                                        if (selectedConversationId) {
                                            setConversations(conversations.map(conv =>
                                                conv.id === selectedConversationId
                                                    ? { ...conv, status: ConversationStatus.AGENT_ASSIGNED }
                                                    : conv
                                            ));
                                            showToast('Konuşma yönlendirildi');
                                        }
                                    }}
                                >
                                    <ArrowRight size={16} />
                                    Yönlendir
                                </button>
                                <button
                                    className="quick-action-btn"
                                    onClick={() => {
                                        if (selectedConversationId) {
                                            setConversations(conversations.map(conv =>
                                                conv.id === selectedConversationId
                                                    ? { ...conv, assignedAgentId: 'agent-1', status: ConversationStatus.AGENT_ASSIGNED }
                                                    : conv
                                            ));
                                            showToast('Agent atandı');
                                        }
                                    }}
                                >
                                    <User size={16} />
                                    Agent Ata
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Toast */}
            {toastMessage && (
                <div className="toast">
                    <CheckCircle size={16} />
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default ConversationsPage;

