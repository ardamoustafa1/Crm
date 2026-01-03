// Agent Workspace - Main Agent CRM Panel

import React, { useState } from 'react';
import {
    MessageSquare,
    User,
    Clock,
    Tag,
    Send,
    Phone,
    Video,
    MoreVertical,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    FileText,
    History
} from 'lucide-react';
import { useConversationStore } from '../../store/conversationStore';
import { AIInsightPanel } from '../../components/AgentPanel/AIInsightPanel';
import { Case, Conversation, Priority, CaseStatus } from '../../types';
import { mockCases, mockConversations, mockAIInsights, mockUsers } from '../../services/mockData';
import './AgentWorkspace.css';

const getPriorityColor = (priority: Priority): string => {
    const colors: Record<Priority, string> = {
        [Priority.CRITICAL]: 'var(--color-priority-critical)',
        [Priority.HIGH]: 'var(--color-priority-high)',
        [Priority.MEDIUM]: 'var(--color-priority-medium)',
        [Priority.LOW]: 'var(--color-priority-low)'
    };
    return colors[priority];
};

const getStatusBadge = (status: CaseStatus): { color: string; label: string } => {
    const badges: Record<CaseStatus, { color: string; label: string }> = {
        [CaseStatus.OPEN]: { color: 'info', label: 'Açık' },
        [CaseStatus.IN_PROGRESS]: { color: 'warning', label: 'İşlemde' },
        [CaseStatus.PENDING_CUSTOMER]: { color: 'neutral', label: 'Müşteri Bekliyor' },
        [CaseStatus.ESCALATED]: { color: 'danger', label: 'Eskalasyon' },
        [CaseStatus.RESOLVED]: { color: 'success', label: 'Çözüldü' },
        [CaseStatus.CLOSED]: { color: 'neutral', label: 'Kapatıldı' }
    };
    return badges[status];
};

export const AgentWorkspace: React.FC = () => {
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(mockCases[0]?.id || null);
    const [replyText, setReplyText] = useState('');

    const selectedCase = mockCases.find(c => c.id === selectedCaseId);
    const selectedConversation = selectedCase
        ? mockConversations.find(conv => conv.id === selectedCase.conversationId)
        : null;
    const selectedInsight = selectedCase?.aiInsight || null;
    const selectedUser = selectedCase?.userId
        ? mockUsers.find(u => u.id === selectedCase.userId)
        : null;

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        // In a real app, this would send the message
        console.log('Sending reply:', replyText);
        setReplyText('');
    };

    return (
        <div className="agent-workspace">
            {/* Left Panel - Case List */}
            <div className="workspace-sidebar">
                <div className="sidebar-header">
                    <h2>Aktif Vakalar</h2>
                    <span className="case-count">{mockCases.length}</span>
                </div>

                <div className="case-list">
                    {mockCases.map((caseItem) => {
                        const conversation = mockConversations.find(c => c.id === caseItem.conversationId);
                        const user = caseItem.userId ? mockUsers.find(u => u.id === caseItem.userId) : null;
                        const statusBadge = getStatusBadge(caseItem.status);

                        return (
                            <div
                                key={caseItem.id}
                                className={`case-card ${selectedCaseId === caseItem.id ? 'case-card-active' : ''}`}
                                onClick={() => setSelectedCaseId(caseItem.id)}
                            >
                                <div className="case-card-header">
                                    <div className="case-user">
                                        <div className="user-avatar-sm">
                                            {user?.name.charAt(0) || 'U'}
                                        </div>
                                        <div className="user-info">
                                            <span className="user-name">{user?.name || 'Anonim'}</span>
                                            <span className="case-time">
                                                {new Date(caseItem.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="priority-dot"
                                        style={{ background: getPriorityColor(caseItem.priority) }}
                                        title={caseItem.priority}
                                    />
                                </div>

                                <div className="case-preview">
                                    {caseItem.aiInsight?.summary.slice(0, 80)}...
                                </div>

                                <div className="case-footer">
                                    <span className={`badge badge-${statusBadge.color}`}>
                                        {statusBadge.label}
                                    </span>
                                    {caseItem.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="case-tag">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Center Panel - Conversation */}
            <div className="workspace-main">
                {selectedCase && selectedConversation ? (
                    <>
                        {/* Conversation Header */}
                        <div className="conversation-header">
                            <div className="conv-header-left">
                                <div className="conv-user-avatar">
                                    {selectedUser?.name.charAt(0) || 'U'}
                                </div>
                                <div className="conv-user-info">
                                    <h3>{selectedUser?.name || 'Anonim Kullanıcı'}</h3>
                                    <div className="conv-meta">
                                        <span className="meta-item">
                                            <Clock size={14} />
                                            {Math.floor((Date.now() - new Date(selectedConversation.startTime).getTime()) / 60000)} dk
                                        </span>
                                        <span className="meta-item">
                                            <Tag size={14} />
                                            {selectedUser?.tier || 'standart'}
                                        </span>
                                        <span className="meta-item">
                                            <MessageSquare size={14} />
                                            {selectedConversation.channel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="conv-header-actions">
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
                        <div className="conversation-messages">
                            {selectedConversation.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.sender === 'user' ? 'message-user' : message.sender === 'ai' ? 'message-ai' : 'message-agent'}`}
                                >
                                    <div className="message-avatar">
                                        {message.sender === 'user'
                                            ? selectedUser?.name.charAt(0) || 'U'
                                            : message.sender === 'ai'
                                                ? '🤖'
                                                : 'A'}
                                    </div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-sender">
                                                {message.sender === 'user'
                                                    ? selectedUser?.name || 'Kullanıcı'
                                                    : message.sender === 'ai'
                                                        ? 'AI Assistant'
                                                        : 'Siz'}
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
                        <div className="conversation-reply">
                            <div className="reply-actions">
                                <button className="btn btn-ghost btn-sm">
                                    <FileText size={16} /> Şablon
                                </button>
                                <button className="btn btn-ghost btn-sm">
                                    <History size={16} /> Geçmiş
                                </button>
                            </div>
                            <div className="reply-input-container">
                                <textarea
                                    placeholder="Yanıtınızı yazın..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="reply-input"
                                    rows={3}
                                />
                                <div className="reply-footer">
                                    <div className="reply-hints">
                                        <span>AI önerisi: Modem reset prosedürü uygulayın</span>
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSendReply}
                                        disabled={!replyText.trim()}
                                    >
                                        <Send size={16} /> Gönder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="no-case-selected">
                        <MessageSquare size={48} />
                        <h3>Vaka Seçin</h3>
                        <p>Sol panelden bir vaka seçerek detayları görüntüleyin</p>
                    </div>
                )}
            </div>

            {/* Right Panel - AI Insights & Details */}
            <div className="workspace-details">
                <AIInsightPanel insight={selectedInsight} />

                {/* Quick Actions */}
                {selectedCase && (
                    <div className="quick-actions-panel">
                        <h4>Hızlı Aksiyonlar</h4>
                        <div className="quick-actions-grid">
                            <button className="quick-action-btn">
                                <CheckCircle size={16} />
                                Çözüldü Olarak İşaretle
                            </button>
                            <button className="quick-action-btn">
                                <ArrowRight size={16} />
                                Yönlendir
                            </button>
                            <button className="quick-action-btn warning">
                                <AlertTriangle size={16} />
                                Eskalasyon
                            </button>
                        </div>
                    </div>
                )}

                {/* Customer History */}
                {selectedUser && (
                    <div className="customer-history-panel">
                        <h4>Müşteri Geçmişi</h4>
                        <div className="history-stats">
                            <div className="history-stat">
                                <span className="stat-number">12</span>
                                <span className="stat-label">Toplam Görüşme</span>
                            </div>
                            <div className="history-stat">
                                <span className="stat-number">2</span>
                                <span className="stat-label">Açık Vaka</span>
                            </div>
                            <div className="history-stat">
                                <span className="stat-number">4.5</span>
                                <span className="stat-label">Memnuniyet</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentWorkspace;
