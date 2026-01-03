// Cases Page - Full Implementation

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Clock,
    AlertTriangle,
    CheckCircle,
    User,
    MoreVertical,
    Tag,
    Calendar,
    ArrowRight,
    MessageSquare,
    FileText,
    ChevronDown,
    ChevronUp,
    XCircle,
    Zap,
    X
} from 'lucide-react';
import { mockCases, mockUsers, mockAgents, mockConversations } from '../../services/mockData';
import { Priority, CaseStatus, Intent, Case } from '../../types';
import './CasesPage.css';

const getPriorityConfig = (priority: Priority) => {
    const configs: Record<Priority, { color: string; label: string; bgColor: string }> = {
        [Priority.CRITICAL]: { color: 'var(--color-priority-critical)', label: 'Kritik', bgColor: 'rgba(220, 38, 38, 0.15)' },
        [Priority.HIGH]: { color: 'var(--color-priority-high)', label: 'Yüksek', bgColor: 'rgba(234, 88, 12, 0.15)' },
        [Priority.MEDIUM]: { color: 'var(--color-priority-medium)', label: 'Orta', bgColor: 'rgba(202, 138, 4, 0.15)' },
        [Priority.LOW]: { color: 'var(--color-priority-low)', label: 'Düşük', bgColor: 'rgba(22, 163, 74, 0.15)' }
    };
    return configs[priority];
};

const getStatusConfig = (status: CaseStatus) => {
    const configs: Record<CaseStatus, { color: string; label: string; icon: React.ReactNode }> = {
        [CaseStatus.OPEN]: { color: 'info', label: 'Açık', icon: <Zap size={14} /> },
        [CaseStatus.IN_PROGRESS]: { color: 'warning', label: 'İşlemde', icon: <Clock size={14} /> },
        [CaseStatus.PENDING_CUSTOMER]: { color: 'neutral', label: 'Müşteri Bekliyor', icon: <User size={14} /> },
        [CaseStatus.ESCALATED]: { color: 'danger', label: 'Eskalasyon', icon: <AlertTriangle size={14} /> },
        [CaseStatus.RESOLVED]: { color: 'success', label: 'Çözüldü', icon: <CheckCircle size={14} /> },
        [CaseStatus.CLOSED]: { color: 'neutral', label: 'Kapatıldı', icon: <XCircle size={14} /> }
    };
    return configs[status];
};

const getIntentLabel = (intent: Intent) => {
    const labels: Record<Intent, string> = {
        [Intent.FATURA_ITIRAZ]: 'Fatura İtiraz',
        [Intent.PAKET_DEGISIM]: 'Paket Değişim',
        [Intent.TEKNIK_ARIZA]: 'Teknik Arıza',
        [Intent.IPTAL]: 'İptal',
        [Intent.BILGI_TALEBI]: 'Bilgi Talebi',
        [Intent.SIKAYET]: 'Şikayet',
        [Intent.ODEME]: 'Ödeme',
        [Intent.AKTIVASYON]: 'Aktivasyon'
    };
    return labels[intent];
};

export const CasesPage: React.FC = () => {
    const navigate = useNavigate();
    const [cases, setCases] = useState<Case[]>(mockCases);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
    const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
    const [showNewCaseModal, setShowNewCaseModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [activeNoteCase, setActiveNoteCase] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const filteredCases = cases.filter(caseItem => {
        const user = mockUsers.find(u => u.id === caseItem.userId);
        const matchesSearch = user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            caseItem.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || caseItem.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Stats
    const openCount = cases.filter(c => c.status === CaseStatus.OPEN).length;
    const inProgressCount = cases.filter(c => c.status === CaseStatus.IN_PROGRESS).length;
    const escalatedCount = cases.filter(c => c.status === CaseStatus.ESCALATED).length;
    const resolvedCount = cases.filter(c => c.status === CaseStatus.RESOLVED).length;

    const toggleExpand = (caseId: string) => {
        setExpandedCaseId(expandedCaseId === caseId ? null : caseId);
    };

    const handleMarkResolved = (caseId: string) => {
        setCases(cases.map(c =>
            c.id === caseId ? { ...c, status: CaseStatus.RESOLVED, updatedAt: new Date() } : c
        ));
        showToast('Vaka çözüldü olarak işaretlendi');
    };

    const handleAddNote = () => {
        if (!noteText.trim() || !activeNoteCase) return;
        setCases(cases.map(c =>
            c.id === activeNoteCase
                ? {
                    ...c,
                    notes: [...c.notes, {
                        id: `note-${Date.now()}`,
                        caseId: activeNoteCase,
                        agentId: 'agent-1',
                        content: noteText,
                        isInternal: true,
                        createdAt: new Date()
                    }],
                    updatedAt: new Date()
                }
                : c
        ));
        setNoteText('');
        setShowNoteModal(false);
        setActiveNoteCase(null);
        showToast('Not eklendi');
    };

    return (
        <div className="cases-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>Vaka Yönetimi</h1>
                    <p>Tüm açık ve kapalı vakaları takip edin</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => showToast('Yeni vaka özelliği yakında aktif olacak')}
                >
                    + Yeni Vaka
                </button>
            </div>

            {/* Stats */}
            <div className="cases-stats">
                <div className="stat-card">
                    <div className="stat-icon stat-icon-open">
                        <Zap size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{openCount}</span>
                        <span className="stat-label">Açık</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-progress">
                        <Clock size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{inProgressCount}</span>
                        <span className="stat-label">İşlemde</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-escalated">
                        <AlertTriangle size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{escalatedCount}</span>
                        <span className="stat-label">Eskalasyon</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-resolved">
                        <CheckCircle size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{resolvedCount}</span>
                        <span className="stat-label">Çözüldü</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="cases-filters">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Vaka ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as CaseStatus | 'all')}
                        className="filter-select"
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value={CaseStatus.OPEN}>Açık</option>
                        <option value={CaseStatus.IN_PROGRESS}>İşlemde</option>
                        <option value={CaseStatus.ESCALATED}>Eskalasyon</option>
                        <option value={CaseStatus.RESOLVED}>Çözüldü</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
                        className="filter-select"
                    >
                        <option value="all">Tüm Öncelikler</option>
                        <option value={Priority.CRITICAL}>Kritik</option>
                        <option value={Priority.HIGH}>Yüksek</option>
                        <option value={Priority.MEDIUM}>Orta</option>
                        <option value={Priority.LOW}>Düşük</option>
                    </select>
                </div>
            </div>

            {/* Case Cards */}
            <div className="cases-grid">
                {filteredCases.map((caseItem) => {
                    const user = mockUsers.find(u => u.id === caseItem.userId);
                    const agent = caseItem.assignedAgentId
                        ? mockAgents.find(a => a.id === caseItem.assignedAgentId)
                        : null;
                    const priorityConfig = getPriorityConfig(caseItem.priority);
                    const statusConfig = getStatusConfig(caseItem.status);
                    const isExpanded = expandedCaseId === caseItem.id;
                    const timeSinceCreated = Math.floor((Date.now() - new Date(caseItem.createdAt).getTime()) / 60000);

                    return (
                        <div
                            key={caseItem.id}
                            className={`case-card ${isExpanded ? 'expanded' : ''}`}
                            style={{ borderLeftColor: priorityConfig.color }}
                        >
                            <div className="case-card-header" onClick={() => toggleExpand(caseItem.id)}>
                                <div className="case-info">
                                    <div className="case-user">
                                        <div className="user-avatar-sm">
                                            {user?.name.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <span className="user-name">{user?.name || 'Anonim'}</span>
                                            <span className="case-id">#{caseItem.id.split('-')[1]}</span>
                                        </div>
                                    </div>

                                    <span
                                        className="priority-badge"
                                        style={{ background: priorityConfig.bgColor, color: priorityConfig.color }}
                                    >
                                        {priorityConfig.label}
                                    </span>
                                </div>

                                <div className="case-meta">
                                    <span className={`status-badge status-${statusConfig.color}`}>
                                        {statusConfig.icon}
                                        {statusConfig.label}
                                    </span>
                                    <span className="case-time">
                                        <Clock size={12} />
                                        {timeSinceCreated < 60
                                            ? `${timeSinceCreated}dk`
                                            : `${Math.floor(timeSinceCreated / 60)}sa`}
                                    </span>
                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                            </div>

                            <div className="case-body">
                                <div className="case-type">
                                    <Tag size={14} />
                                    {getIntentLabel(caseItem.problemType)}
                                </div>

                                {caseItem.aiInsight && (
                                    <p className="case-summary">
                                        {caseItem.aiInsight.summary.slice(0, 120)}...
                                    </p>
                                )}

                                <div className="case-tags">
                                    {caseItem.tags.map(tag => (
                                        <span key={tag} className="tag">#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {agent && (
                                <div className="case-agent">
                                    <div className="agent-avatar-sm">
                                        {agent.name.charAt(0)}
                                    </div>
                                    <span>{agent.name}</span>
                                </div>
                            )}

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="case-expanded">
                                    <div className="expanded-section">
                                        <h4>Zaman Çizelgesi</h4>
                                        <div className="timeline">
                                            <div className="timeline-item">
                                                <div className="timeline-dot" />
                                                <div className="timeline-content">
                                                    <span className="timeline-time">
                                                        {new Date(caseItem.createdAt).toLocaleString('tr-TR')}
                                                    </span>
                                                    <span className="timeline-event">Vaka oluşturuldu</span>
                                                </div>
                                            </div>
                                            {caseItem.assignedAgentId && (
                                                <div className="timeline-item">
                                                    <div className="timeline-dot" />
                                                    <div className="timeline-content">
                                                        <span className="timeline-time">
                                                            {new Date(caseItem.updatedAt).toLocaleString('tr-TR')}
                                                        </span>
                                                        <span className="timeline-event">
                                                            {agent?.name} atandı
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {caseItem.notes.map(note => (
                                                <div key={note.id} className="timeline-item">
                                                    <div className="timeline-dot" />
                                                    <div className="timeline-content">
                                                        <span className="timeline-time">
                                                            {new Date(note.createdAt).toLocaleString('tr-TR')}
                                                        </span>
                                                        <span className="timeline-event">{note.content}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {caseItem.aiInsight && (
                                        <div className="expanded-section">
                                            <h4>AI Önerileri</h4>
                                            <ul className="ai-suggestions">
                                                {caseItem.aiInsight.suggestedActions.map((action, idx) => (
                                                    <li key={idx}>
                                                        <ArrowRight size={14} />
                                                        {action}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="expanded-actions">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => {
                                                if (caseItem.conversationId) {
                                                    navigate('/conversations');
                                                }
                                            }}
                                        >
                                            <MessageSquare size={14} /> Konuşmayı Görüntüle
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => {
                                                setActiveNoteCase(caseItem.id);
                                                setShowNoteModal(true);
                                            }}
                                        >
                                            <FileText size={14} /> Not Ekle
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleMarkResolved(caseItem.id)}
                                        >
                                            <CheckCircle size={14} /> Çözüldü Olarak İşaretle
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredCases.length === 0 && (
                <div className="empty-state">
                    <FileText size={48} />
                    <h3>Vaka Bulunamadı</h3>
                    <p>Arama kriterlerinize uygun vaka bulunamadı.</p>
                </div>
            )}

            {/* Note Modal */}
            {showNoteModal && (
                <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Not Ekle</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowNoteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Not İçeriği</label>
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Not içeriğini yazın..."
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowNoteModal(false)}>
                                İptal
                            </button>
                            <button className="btn btn-primary" onClick={handleAddNote}>
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

export default CasesPage;

