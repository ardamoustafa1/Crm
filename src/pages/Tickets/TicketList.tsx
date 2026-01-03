// Ticket List Page

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Clock,
    AlertTriangle,
    CheckCircle,
    User,
    ArrowUpRight,
    MoreVertical,
    X,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';
import { mockTickets, mockCases, mockAgents } from '../../services/mockData';
import { Priority, TicketStatus, Ticket } from '../../types';
import './TicketList.css';

const getStatusConfig = (status: TicketStatus) => {
    const configs: Record<TicketStatus, { color: string; label: string }> = {
        [TicketStatus.OPEN]: { color: 'info', label: 'Açık' },
        [TicketStatus.ASSIGNED]: { color: 'primary', label: 'Atandı' },
        [TicketStatus.IN_PROGRESS]: { color: 'warning', label: 'İşlemde' },
        [TicketStatus.ON_HOLD]: { color: 'neutral', label: 'Beklemede' },
        [TicketStatus.RESOLVED]: { color: 'success', label: 'Çözüldü' },
        [TicketStatus.CLOSED]: { color: 'neutral', label: 'Kapatıldı' }
    };
    return configs[status];
};

const getPriorityConfig = (priority: Priority) => {
    const configs: Record<Priority, { color: string; label: string }> = {
        [Priority.CRITICAL]: { color: 'danger', label: 'Kritik' },
        [Priority.HIGH]: { color: 'warning', label: 'Yüksek' },
        [Priority.MEDIUM]: { color: 'info', label: 'Orta' },
        [Priority.LOW]: { color: 'success', label: 'Düşük' }
    };
    return configs[priority];
};

const getSLAStatus = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 0) return { status: 'overdue', text: 'SLA Aşıldı', color: 'danger' };
    if (minutes < 30) return { status: 'critical', text: `${minutes}dk kaldı`, color: 'danger' };
    if (minutes < 60) return { status: 'warning', text: `${minutes}dk kaldı`, color: 'warning' };
    if (minutes < 1440) return { status: 'ok', text: `${Math.floor(minutes / 60)}sa kaldı`, color: 'success' };
    return { status: 'ok', text: `${Math.floor(minutes / 1440)} gün`, color: 'success' };
};

export const TicketList: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [tickets, setTickets] = useState(mockTickets);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [newTicketData, setNewTicketData] = useState({
        title: '',
        description: '',
        priority: Priority.MEDIUM
    });

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCreateTicket = () => {
        if (!newTicketData.title.trim()) return;

        const newTicket: Ticket = {
            id: `ticket-${Date.now()}`,
            caseId: `case-${Date.now()}`,
            title: newTicketData.title,
            description: newTicketData.description,
            priority: newTicketData.priority,
            status: TicketStatus.OPEN,
            createdAt: new Date(),
            updatedAt: new Date(),
            slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
            escalationLevel: 0
        };

        setTickets([newTicket, ...tickets]);
        setShowNewTicketModal(false);
        setNewTicketData({ title: '', description: '', priority: Priority.MEDIUM });
    };

    const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
        setTickets(tickets.map(t =>
            t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date() } : t
        ));
        setActiveDropdown(null);
    };

    const handleDeleteTicket = (ticketId: string) => {
        setTickets(tickets.filter(t => t.id !== ticketId));
        setActiveDropdown(null);
    };

    return (
        <div className="ticket-list-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>Ticket Yönetimi</h1>
                    <p>SLA takibi ve ticket durumları</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowNewTicketModal(true)}>
                    + Yeni Ticket
                </button>
            </div>

            {/* Filters */}
            <div className="ticket-filters">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Ticket ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        Tümü
                    </button>
                    <button
                        className={`filter-tab ${filterStatus === TicketStatus.OPEN ? 'active' : ''}`}
                        onClick={() => setFilterStatus(TicketStatus.OPEN)}
                    >
                        Açık
                    </button>
                    <button
                        className={`filter-tab ${filterStatus === TicketStatus.IN_PROGRESS ? 'active' : ''}`}
                        onClick={() => setFilterStatus(TicketStatus.IN_PROGRESS)}
                    >
                        İşlemde
                    </button>
                    <button
                        className={`filter-tab ${filterStatus === TicketStatus.RESOLVED ? 'active' : ''}`}
                        onClick={() => setFilterStatus(TicketStatus.RESOLVED)}
                    >
                        Çözüldü
                    </button>
                </div>
            </div>

            {/* SLA Warning Cards */}
            <div className="sla-warnings">
                {tickets
                    .filter(t => getSLAStatus(t.slaDeadline).status === 'critical' || getSLAStatus(t.slaDeadline).status === 'overdue')
                    .slice(0, 3)
                    .map(ticket => (
                        <div key={ticket.id} className="sla-warning-card">
                            <AlertTriangle size={18} />
                            <div className="warning-content">
                                <span className="warning-title">{ticket.title}</span>
                                <span className="warning-time">{getSLAStatus(ticket.slaDeadline).text}</span>
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleStatusChange(ticket.id, TicketStatus.IN_PROGRESS)}
                            >
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    ))}
            </div>

            {/* Ticket Table */}
            <div className="ticket-table-container">
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Ticket</th>
                            <th>Öncelik</th>
                            <th>Durum</th>
                            <th>SLA</th>
                            <th>Atanan</th>
                            <th>Oluşturulma</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map(ticket => {
                            const statusConfig = getStatusConfig(ticket.status);
                            const priorityConfig = getPriorityConfig(ticket.priority);
                            const slaStatus = getSLAStatus(ticket.slaDeadline);
                            const assignedAgent = ticket.assignedAgentId
                                ? mockAgents.find(a => a.id === ticket.assignedAgentId)
                                : null;

                            return (
                                <tr key={ticket.id}>
                                    <td>
                                        <div className="ticket-info">
                                            <span className="ticket-id">#{ticket.id.split('-')[1]}</span>
                                            <span className="ticket-title">{ticket.title}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-priority-${ticket.priority}`}>
                                            {priorityConfig.label}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${statusConfig.color}`}>
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={`sla-badge sla-${slaStatus.color}`}>
                                            <Clock size={14} />
                                            {slaStatus.text}
                                        </div>
                                    </td>
                                    <td>
                                        {assignedAgent ? (
                                            <div className="agent-cell">
                                                <div className="agent-avatar-sm">
                                                    {assignedAgent.name.charAt(0)}
                                                </div>
                                                <span>{assignedAgent.name}</span>
                                            </div>
                                        ) : (
                                            <span className="unassigned">Atanmadı</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="date-text">
                                            {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-dropdown">
                                            <button
                                                className="btn btn-ghost btn-icon btn-sm"
                                                onClick={() => setActiveDropdown(activeDropdown === ticket.id ? null : ticket.id)}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                            {activeDropdown === ticket.id && (
                                                <div className="dropdown-menu">
                                                    <button onClick={() => handleStatusChange(ticket.id, TicketStatus.IN_PROGRESS)}>
                                                        <Edit size={14} /> İşleme Al
                                                    </button>
                                                    <button onClick={() => handleStatusChange(ticket.id, TicketStatus.RESOLVED)}>
                                                        <CheckCircle size={14} /> Çözüldü
                                                    </button>
                                                    <button className="danger" onClick={() => handleDeleteTicket(ticket.id)}>
                                                        <Trash2 size={14} /> Sil
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* New Ticket Modal */}
            {showNewTicketModal && (
                <div className="modal-overlay" onClick={() => setShowNewTicketModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Yeni Ticket Oluştur</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowNewTicketModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Başlık</label>
                                <input
                                    type="text"
                                    value={newTicketData.title}
                                    onChange={(e) => setNewTicketData({ ...newTicketData, title: e.target.value })}
                                    placeholder="Ticket başlığı..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Açıklama</label>
                                <textarea
                                    value={newTicketData.description}
                                    onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
                                    placeholder="Detaylı açıklama..."
                                    rows={4}
                                />
                            </div>
                            <div className="form-group">
                                <label>Öncelik</label>
                                <select
                                    value={newTicketData.priority}
                                    onChange={(e) => setNewTicketData({ ...newTicketData, priority: e.target.value as Priority })}
                                >
                                    <option value={Priority.LOW}>Düşük</option>
                                    <option value={Priority.MEDIUM}>Orta</option>
                                    <option value={Priority.HIGH}>Yüksek</option>
                                    <option value={Priority.CRITICAL}>Kritik</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowNewTicketModal(false)}>
                                İptal
                            </button>
                            <button className="btn btn-primary" onClick={handleCreateTicket}>
                                Oluştur
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketList;

