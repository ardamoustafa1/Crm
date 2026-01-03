// Agent Routing Page - Full Implementation

import React, { useState } from 'react';
import {
    Users,
    Grid,
    List,
    Settings,
    Zap,
    Clock,
    CheckCircle,
    GitBranch,
    AlertTriangle,
    BarChart3,
    User,
    Phone,
    Star,
    Filter
} from 'lucide-react';
import { mockAgents, mockDecisionRules } from '../../services/mockData';
import { AgentStatus, AgentSkill } from '../../types';
import './AgentRoutingPage.css';

const getStatusConfig = (status: AgentStatus) => {
    const configs: Record<AgentStatus, { color: string; label: string }> = {
        [AgentStatus.ONLINE]: { color: 'success', label: 'Çevrimiçi' },
        [AgentStatus.BUSY]: { color: 'warning', label: 'Meşgul' },
        [AgentStatus.AWAY]: { color: 'neutral', label: 'Uzakta' },
        [AgentStatus.OFFLINE]: { color: 'danger', label: 'Çevrimdışı' }
    };
    return configs[status];
};

const getSkillLabel = (skill: AgentSkill) => {
    const labels: Record<AgentSkill, string> = {
        [AgentSkill.TECHNICAL]: 'Teknik',
        [AgentSkill.BILLING]: 'Fatura',
        [AgentSkill.SALES]: 'Satış',
        [AgentSkill.CANCELLATION]: 'İptal',
        [AgentSkill.FIBER]: 'Fiber',
        [AgentSkill.MOBILE]: 'Mobil',
        [AgentSkill.GENERAL]: 'Genel'
    };
    return labels[skill];
};

const allSkills = Object.values(AgentSkill);

const queueData = [
    { name: 'Teknik Destek', waiting: 5, avgWait: '2.3 dk', agents: 3 },
    { name: 'Fatura', waiting: 2, avgWait: '1.1 dk', agents: 2 },
    { name: 'Satış', waiting: 8, avgWait: '4.5 dk', agents: 2 },
    { name: 'İptal/Retention', waiting: 3, avgWait: '1.8 dk', agents: 1 }
];

export const AgentRoutingPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');
    const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all');

    const filteredAgents = mockAgents.filter(agent =>
        statusFilter === 'all' || agent.status === statusFilter
    );

    const onlineCount = mockAgents.filter(a => a.status === AgentStatus.ONLINE).length;
    const busyCount = mockAgents.filter(a => a.status === AgentStatus.BUSY).length;
    const totalCapacity = mockAgents.reduce((acc, a) => acc + a.maxLoad, 0);
    const currentLoad = mockAgents.reduce((acc, a) => acc + a.currentLoad, 0);

    return (
        <div className="agent-routing-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>Agent Routing</h1>
                    <p>Agent yetkinlikleri ve yönlendirme algoritmaları</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'matrix' ? 'active' : ''}`}
                            onClick={() => setViewMode('matrix')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button className="btn btn-primary">
                        <Settings size={16} /> Kuralları Düzenle
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="routing-stats">
                <div className="routing-stat">
                    <div className="stat-icon stat-online">
                        <User size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{onlineCount}</span>
                        <span className="stat-label">Çevrimiçi Agent</span>
                    </div>
                </div>
                <div className="routing-stat">
                    <div className="stat-icon stat-busy">
                        <Phone size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{busyCount}</span>
                        <span className="stat-label">Meşgul</span>
                    </div>
                </div>
                <div className="routing-stat">
                    <div className="stat-icon stat-capacity">
                        <BarChart3 size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{currentLoad}/{totalCapacity}</span>
                        <span className="stat-label">Kapasite Kullanımı</span>
                    </div>
                    <div className="capacity-bar">
                        <div
                            className="capacity-fill"
                            style={{ width: `${(currentLoad / totalCapacity) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="routing-stat">
                    <div className="stat-icon stat-rules">
                        <GitBranch size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{mockDecisionRules.filter(r => r.isActive).length}</span>
                        <span className="stat-label">Aktif Kural</span>
                    </div>
                </div>
            </div>

            <div className="routing-content">
                {/* Left: Agents */}
                <div className="agents-section">
                    <div className="section-header">
                        <h2>Agentlar</h2>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as AgentStatus | 'all')}
                            className="filter-select"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value={AgentStatus.ONLINE}>Çevrimiçi</option>
                            <option value={AgentStatus.BUSY}>Meşgul</option>
                            <option value={AgentStatus.AWAY}>Uzakta</option>
                            <option value={AgentStatus.OFFLINE}>Çevrimdışı</option>
                        </select>
                    </div>

                    {viewMode === 'grid' ? (
                        <div className="agents-grid">
                            {filteredAgents.map((agent) => {
                                const statusConfig = getStatusConfig(agent.status);
                                const loadPercentage = (agent.currentLoad / agent.maxLoad) * 100;

                                return (
                                    <div key={agent.id} className="agent-card">
                                        <div className="agent-header">
                                            <div className="agent-avatar">
                                                {agent.name.charAt(0)}
                                                <span className={`status-dot status-${statusConfig.color}`} />
                                            </div>
                                            <div className="agent-info">
                                                <span className="agent-name">{agent.name}</span>
                                                <span className="agent-status">{statusConfig.label}</span>
                                            </div>
                                            <div className="agent-score">
                                                <Star size={14} />
                                                {agent.performanceScore}
                                            </div>
                                        </div>

                                        <div className="agent-skills">
                                            {agent.skills.map(skill => (
                                                <span key={skill} className="skill-badge">
                                                    {getSkillLabel(skill)}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="agent-load">
                                            <div className="load-header">
                                                <span>Yük</span>
                                                <span>{agent.currentLoad}/{agent.maxLoad}</span>
                                            </div>
                                            <div className="load-bar">
                                                <div
                                                    className={`load-fill ${loadPercentage >= 80 ? 'load-high' : loadPercentage >= 50 ? 'load-medium' : 'load-low'}`}
                                                    style={{ width: `${loadPercentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="agent-teams">
                                            {agent.teams.map(team => (
                                                <span key={team} className="team-tag">{team}</span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="agents-matrix">
                            <table className="skill-matrix-table">
                                <thead>
                                    <tr>
                                        <th>Agent</th>
                                        <th>Durum</th>
                                        {allSkills.map(skill => (
                                            <th key={skill}>{getSkillLabel(skill)}</th>
                                        ))}
                                        <th>Yük</th>
                                        <th>Skor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAgents.map((agent) => {
                                        const statusConfig = getStatusConfig(agent.status);
                                        return (
                                            <tr key={agent.id}>
                                                <td>
                                                    <div className="matrix-agent">
                                                        <div className="mini-avatar">
                                                            {agent.name.charAt(0)}
                                                        </div>
                                                        {agent.name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge status-${statusConfig.color}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </td>
                                                {allSkills.map(skill => (
                                                    <td key={skill} className="skill-cell">
                                                        {agent.skills.includes(skill) ? (
                                                            <CheckCircle size={16} className="skill-yes" />
                                                        ) : (
                                                            <span className="skill-no">-</span>
                                                        )}
                                                    </td>
                                                ))}
                                                <td>{agent.currentLoad}/{agent.maxLoad}</td>
                                                <td>
                                                    <span className="score-badge">
                                                        <Star size={12} /> {agent.performanceScore}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Right: Queues & Rules */}
                <div className="routing-sidebar">
                    {/* Queue Status */}
                    <div className="sidebar-card">
                        <h3>Kuyruk Durumu</h3>
                        <div className="queue-list">
                            {queueData.map((queue, idx) => (
                                <div key={idx} className="queue-item">
                                    <div className="queue-header">
                                        <span className="queue-name">{queue.name}</span>
                                        <span className={`queue-waiting ${queue.waiting > 5 ? 'warning' : ''}`}>
                                            {queue.waiting} bekliyor
                                        </span>
                                    </div>
                                    <div className="queue-meta">
                                        <span>
                                            <Clock size={12} /> Ort. {queue.avgWait}
                                        </span>
                                        <span>
                                            <Users size={12} /> {queue.agents} agent
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Rules */}
                    <div className="sidebar-card">
                        <h3>Yönlendirme Kuralları</h3>
                        <div className="rules-list">
                            {mockDecisionRules.filter(r => r.isActive).map((rule) => (
                                <div key={rule.id} className="rule-item">
                                    <div className="rule-header">
                                        <span className="rule-priority">#{rule.priority}</span>
                                        <span className="rule-name">{rule.name}</span>
                                    </div>
                                    <div className="rule-action">
                                        {rule.action === 'auto_resolve' && (
                                            <span className="action-tag action-auto">
                                                <Zap size={12} /> Otomatik Çözüm
                                            </span>
                                        )}
                                        {rule.action === 'route_to_agent' && (
                                            <span className="action-tag action-route">
                                                <User size={12} /> Agent Yönlendir
                                            </span>
                                        )}
                                        {rule.action === 'escalate' && (
                                            <span className="action-tag action-escalate">
                                                <AlertTriangle size={12} /> Eskalasyon
                                            </span>
                                        )}
                                        {rule.action === 'queue' && (
                                            <span className="action-tag action-queue">
                                                <Clock size={12} /> Kuyruğa Al
                                            </span>
                                        )}
                                    </div>
                                    <div className="rule-conditions">
                                        {rule.conditions.map((cond, idx) => (
                                            <span key={idx} className="condition-chip">
                                                {cond.field} {cond.operator} {String(cond.value)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentRoutingPage;
