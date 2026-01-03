// Decision Engine Page

import React, { useState } from 'react';
import {
    GitBranch,
    Zap,
    Users,
    Brain,
    ArrowRight,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Settings
} from 'lucide-react';
import { mockDecisionRules } from '../../services/mockData';
import { DecisionRule } from '../../types';
import './DecisionEngine.css';

export const DecisionEngine: React.FC = () => {
    const [rules, setRules] = useState<DecisionRule[]>(mockDecisionRules);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleToggleRule = (ruleId: string) => {
        setRules(rules.map(r =>
            r.id === ruleId ? { ...r, isActive: !r.isActive } : r
        ));
        const rule = rules.find(r => r.id === ruleId);
        showToast(`${rule?.name} ${rule?.isActive ? 'deaktif' : 'aktif'} edildi`);
    };

    const activeRulesCount = rules.filter(r => r.isActive).length;

    return (
        <div className="decision-engine-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>Decision Engine</h1>
                    <p>AI karar kuralları ve yönlendirme mantığı</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => showToast('Kural düzenleme modülü yakında aktif olacak')}
                >
                    <Settings size={16} /> Kuralları Düzenle
                </button>
            </div>

            {/* Stats */}
            <div className="decision-stats">
                <div className="decision-stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                        <Brain size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">68.5%</span>
                        <span className="stat-label">AI Çözüm Oranı</span>
                    </div>
                </div>

                <div className="decision-stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">31.5%</span>
                        <span className="stat-label">Agent Transfer</span>
                    </div>
                </div>

                <div className="decision-stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
                        <Zap size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">1.2s</span>
                        <span className="stat-label">Ort. Karar Süresi</span>
                    </div>
                </div>

                <div className="decision-stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-accent-primary)' }}>
                        <GitBranch size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{activeRulesCount}</span>
                        <span className="stat-label">Aktif Kural</span>
                    </div>
                </div>
            </div>

            {/* Decision Flow Visualization */}
            <div className="decision-flow-section">
                <h2>Karar Akışı</h2>

                <div className="decision-flow">
                    <div className="flow-node flow-start">
                        <div className="node-icon">
                            <Brain size={20} />
                        </div>
                        <span>AI Analizi</span>
                    </div>

                    <div className="flow-arrow">
                        <ArrowRight size={20} />
                    </div>

                    <div className="flow-decision">
                        <div className="decision-diamond">
                            <span>Karar</span>
                        </div>
                    </div>

                    <div className="flow-branches">
                        <div className="flow-branch">
                            <div className="branch-arrow up">
                                <ArrowRight size={16} />
                            </div>
                            <div className="flow-node flow-auto">
                                <div className="node-icon">
                                    <CheckCircle size={20} />
                                </div>
                                <span>Otomatik Çözüm</span>
                            </div>
                        </div>

                        <div className="flow-branch">
                            <div className="branch-arrow">
                                <ArrowRight size={16} />
                            </div>
                            <div className="flow-node flow-agent">
                                <div className="node-icon">
                                    <Users size={20} />
                                </div>
                                <span>Agent Yönlendir</span>
                            </div>
                        </div>

                        <div className="flow-branch">
                            <div className="branch-arrow down">
                                <ArrowRight size={16} />
                            </div>
                            <div className="flow-node flow-escalate">
                                <div className="node-icon">
                                    <AlertTriangle size={20} />
                                </div>
                                <span>Eskalasyon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rules List */}
            <div className="rules-section">
                <h2>Aktif Kurallar</h2>

                <div className="rules-list">
                    {rules.map((rule, index) => (
                        <div key={rule.id} className={`rule-card ${rule.isActive ? '' : 'rule-inactive'}`}>
                            <div className="rule-header">
                                <div className="rule-priority">
                                    <span className="priority-number">{rule.priority}</span>
                                </div>
                                <div className="rule-title">
                                    <h3>{rule.name}</h3>
                                    <span className={`rule-action ${rule.action}`}>
                                        {rule.action === 'auto_resolve' && <CheckCircle size={14} />}
                                        {rule.action === 'route_to_agent' && <Users size={14} />}
                                        {rule.action === 'escalate' && <AlertTriangle size={14} />}
                                        {rule.action === 'queue' && <GitBranch size={14} />}
                                        {rule.action.replace('_', ' ')}
                                    </span>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={rule.isActive}
                                        onChange={() => handleToggleRule(rule.id)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>

                            <div className="rule-conditions">
                                {rule.conditions.map((condition, i) => (
                                    <div key={i} className="condition-badge">
                                        <span className="condition-field">{condition.field}</span>
                                        <span className="condition-operator">{condition.operator}</span>
                                        <span className="condition-value">{String(condition.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
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

export default DecisionEngine;

