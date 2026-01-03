// Security & Audit Logs Page - Full Implementation

import React, { useState } from 'react';
import {
    Shield,
    FileText,
    Clock,
    User,
    Activity,
    Lock,
    Key,
    Eye,
    Download,
    Filter,
    Search,
    CheckCircle,
    AlertTriangle,
    XCircle,
    RefreshCw,
    Calendar,
    Server,
    Database
} from 'lucide-react';
import { mockAuditLogs, mockAgents } from '../../services/mockData';
import './SecurityPage.css';

const getActionConfig = (action: string) => {
    const configs: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
        'CASE_ASSIGNED': { color: 'info', icon: <User size={14} />, label: 'Vaka Atama' },
        'CASE_STATUS_CHANGED': { color: 'warning', icon: <RefreshCw size={14} />, label: 'Durum Değişikliği' },
        'CASE_ESCALATED': { color: 'danger', icon: <AlertTriangle size={14} />, label: 'Eskalasyon' },
        'TICKET_CREATED': { color: 'success', icon: <FileText size={14} />, label: 'Ticket Oluşturma' },
        'LOGIN': { color: 'primary', icon: <Key size={14} />, label: 'Giriş' },
        'LOGOUT': { color: 'neutral', icon: <Lock size={14} />, label: 'Çıkış' },
        'SETTING_CHANGED': { color: 'warning', icon: <Activity size={14} />, label: 'Ayar Değişikliği' },
        'DATA_EXPORT': { color: 'info', icon: <Download size={14} />, label: 'Veri Export' }
    };
    return configs[action] || { color: 'neutral', icon: <Activity size={14} />, label: action };
};

const complianceItems = [
    { name: 'KVKK Uyumluluğu', status: 'compliant', lastCheck: '2024-12-15', description: 'Tüm gereksinimler karşılanıyor' },
    { name: 'Veri Şifreleme', status: 'compliant', lastCheck: '2024-12-15', description: 'AES-256 şifreleme aktif' },
    { name: 'Erişim Kontrolleri', status: 'compliant', lastCheck: '2024-12-14', description: 'RBAC uygulanmış' },
    { name: 'Yedekleme Politikası', status: 'warning', lastCheck: '2024-12-10', description: 'Son tam yedekleme 5 gün önce' },
    { name: 'Güvenlik Taraması', status: 'compliant', lastCheck: '2024-12-13', description: 'Güvenlik açığı bulunamadı' }
];

const securityStats = [
    { label: 'Aktif Oturum', value: '23', icon: <User size={20} />, color: 'primary' },
    { label: 'Bugün Giriş', value: '156', icon: <Key size={20} />, color: 'success' },
    { label: 'Başarısız Giriş', value: '3', icon: <XCircle size={20} />, color: 'danger' },
    { label: 'Son 24 Saat Log', value: '1,247', icon: <FileText size={20} />, color: 'info' }
];

// Generate more audit logs for display
const extendedAuditLogs = [
    ...mockAuditLogs,
    {
        id: 'log-5',
        action: 'LOGIN',
        userId: 'agent-1',
        targetType: 'agent' as const,
        targetId: 'agent-1',
        changes: {},
        timestamp: new Date(Date.now() - 7200000),
        ipAddress: '192.168.1.101'
    },
    {
        id: 'log-6',
        action: 'SETTING_CHANGED',
        userId: 'admin-1',
        targetType: 'setting' as const,
        targetId: 'sla-config',
        changes: { maxResponseTime: { old: 15, new: 10 } },
        timestamp: new Date(Date.now() - 10800000),
        ipAddress: '192.168.1.50'
    },
    {
        id: 'log-7',
        action: 'DATA_EXPORT',
        userId: 'agent-2',
        targetType: 'case' as const,
        targetId: 'case-batch',
        changes: { exportType: { old: null, new: 'CSV' } },
        timestamp: new Date(Date.now() - 14400000),
        ipAddress: '192.168.1.102'
    }
];

export const SecurityPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d'>('today');

    const filteredLogs = extendedAuditLogs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.userId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAction = actionFilter === 'all' || log.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    return (
        <div className="security-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>Security & Compliance</h1>
                    <p>KVKK uyumluluğu, güvenlik ayarları ve audit logları</p>
                </div>
                <button className="btn btn-primary">
                    <Download size={16} /> Rapor İndir
                </button>
            </div>

            {/* Stats */}
            <div className="security-stats">
                {securityStats.map((stat, idx) => (
                    <div key={idx} className="security-stat-card">
                        <div className={`stat-icon stat-${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="security-content">
                {/* Compliance Section */}
                <div className="compliance-section">
                    <div className="section-card">
                        <div className="card-header">
                            <h2>
                                <Shield size={20} />
                                Uyumluluk Durumu
                            </h2>
                            <span className="compliance-badge compliant">
                                <CheckCircle size={14} />
                                Uyumlu
                            </span>
                        </div>
                        <div className="compliance-list">
                            {complianceItems.map((item, idx) => (
                                <div key={idx} className="compliance-item">
                                    <div className="compliance-status">
                                        {item.status === 'compliant' ? (
                                            <CheckCircle size={18} className="status-success" />
                                        ) : item.status === 'warning' ? (
                                            <AlertTriangle size={18} className="status-warning" />
                                        ) : (
                                            <XCircle size={18} className="status-danger" />
                                        )}
                                    </div>
                                    <div className="compliance-info">
                                        <span className="compliance-name">{item.name}</span>
                                        <span className="compliance-desc">{item.description}</span>
                                    </div>
                                    <span className="compliance-date">
                                        <Clock size={12} />
                                        {new Date(item.lastCheck).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="section-card">
                        <div className="card-header">
                            <h2>
                                <Lock size={20} />
                                Güvenlik Ayarları
                            </h2>
                        </div>
                        <div className="settings-list">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-name">Oturum Zaman Aşımı</span>
                                    <span className="setting-desc">İnaktif oturumlar için süre</span>
                                </div>
                                <span className="setting-value">30 dakika</span>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-name">İki Faktörlü Doğrulama</span>
                                    <span className="setting-desc">Admin kullanıcılar için zorunlu</span>
                                </div>
                                <span className="setting-badge active">Aktif</span>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-name">Şifre Politikası</span>
                                    <span className="setting-desc">Min. 12 karakter, özel karakter gerekli</span>
                                </div>
                                <span className="setting-badge active">Güçlü</span>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-name">IP Kısıtlaması</span>
                                    <span className="setting-desc">Sadece beyaz listedeki IP'ler</span>
                                </div>
                                <span className="setting-badge inactive">Kapalı</span>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-name">API Erişim Token</span>
                                    <span className="setting-desc">Son yenileme: 5 gün önce</span>
                                </div>
                                <button className="btn btn-secondary btn-sm">
                                    <RefreshCw size={14} /> Yenile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Logs */}
                <div className="audit-section">
                    <div className="section-card">
                        <div className="card-header">
                            <h2>
                                <FileText size={20} />
                                Audit Logları
                            </h2>
                            <div className="log-filters">
                                <div className="search-box">
                                    <Search size={16} />
                                    <input
                                        type="text"
                                        placeholder="Log ara..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <select
                                    value={actionFilter}
                                    onChange={(e) => setActionFilter(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">Tüm Aksiyonlar</option>
                                    <option value="CASE_ASSIGNED">Vaka Atama</option>
                                    <option value="CASE_STATUS_CHANGED">Durum Değişikliği</option>
                                    <option value="CASE_ESCALATED">Eskalasyon</option>
                                    <option value="LOGIN">Giriş</option>
                                    <option value="SETTING_CHANGED">Ayar Değişikliği</option>
                                </select>
                                <div className="date-filters">
                                    <button
                                        className={`date-btn ${dateFilter === 'today' ? 'active' : ''}`}
                                        onClick={() => setDateFilter('today')}
                                    >
                                        Bugün
                                    </button>
                                    <button
                                        className={`date-btn ${dateFilter === '7d' ? 'active' : ''}`}
                                        onClick={() => setDateFilter('7d')}
                                    >
                                        7 Gün
                                    </button>
                                    <button
                                        className={`date-btn ${dateFilter === '30d' ? 'active' : ''}`}
                                        onClick={() => setDateFilter('30d')}
                                    >
                                        30 Gün
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="audit-table-container">
                            <table className="audit-table">
                                <thead>
                                    <tr>
                                        <th>Zaman</th>
                                        <th>Aksiyon</th>
                                        <th>Kullanıcı</th>
                                        <th>Hedef</th>
                                        <th>Değişiklikler</th>
                                        <th>IP Adresi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log) => {
                                        const actionConfig = getActionConfig(log.action);
                                        const agent = mockAgents.find(a => a.id === log.userId);

                                        return (
                                            <tr key={log.id}>
                                                <td>
                                                    <div className="time-cell">
                                                        <span className="time-date">
                                                            {new Date(log.timestamp).toLocaleDateString('tr-TR')}
                                                        </span>
                                                        <span className="time-hour">
                                                            {new Date(log.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`action-badge action-${actionConfig.color}`}>
                                                        {actionConfig.icon}
                                                        {actionConfig.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar-xs">
                                                            {agent?.name.charAt(0) || log.userId.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span>{agent?.name || log.userId}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="target-cell">
                                                        {log.targetType}: {log.targetId}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="changes-cell">
                                                        {Object.entries(log.changes).map(([key, value]) => (
                                                            <span key={key} className="change-item">
                                                                {key}: {String(value.old)} → {String(value.new)}
                                                            </span>
                                                        ))}
                                                        {Object.keys(log.changes).length === 0 && '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="ip-cell">
                                                        {log.ipAddress || '-'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-footer">
                            <span className="log-count">{filteredLogs.length} kayıt gösteriliyor</span>
                            <button className="btn btn-secondary btn-sm">
                                <Download size={14} /> CSV İndir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;
