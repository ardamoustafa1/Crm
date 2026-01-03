// Settings Page - Full Implementation

import React, { useState } from 'react';
import {
    Settings,
    User,
    Bell,
    Clock,
    Link,
    Palette,
    Globe,
    Mail,
    MessageSquare,
    Smartphone,
    Save,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Sun,
    Moon,
    Zap
} from 'lucide-react';
import { mockSLAConfigs } from '../../services/mockData';
import { Intent } from '../../types';
import './SettingsPage.css';

type TabType = 'general' | 'notifications' | 'sla' | 'integrations' | 'appearance';

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

const integrations = [
    { name: 'WhatsApp Business', icon: <MessageSquare size={20} />, status: 'connected', lastSync: '5 dk önce' },
    { name: 'Telegram Bot', icon: <Smartphone size={20} />, status: 'connected', lastSync: '2 dk önce' },
    { name: 'E-posta (SMTP)', icon: <Mail size={20} />, status: 'connected', lastSync: '1 dk önce' },
    { name: 'Web Widget', icon: <Globe size={20} />, status: 'connected', lastSync: 'Anlık' },
    { name: 'Mobil SDK', icon: <Smartphone size={20} />, status: 'warning', lastSync: 'Güncelleme gerekli' }
];

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showSaveToast, setShowSaveToast] = useState(false);

    // Form states
    const [generalSettings, setGeneralSettings] = useState({
        companyName: 'TelcoMax',
        timezone: 'Europe/Istanbul',
        language: 'tr',
        dateFormat: 'DD/MM/YYYY',
        businessHoursStart: '09:00',
        businessHoursEnd: '18:00'
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        inAppNotifications: true,
        escalationAlerts: true,
        dailyDigest: false,
        slaWarnings: true,
        newCaseAlerts: true
    });

    const handleSave = () => {
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000);
    };

    const tabs = [
        { id: 'general', label: 'Genel', icon: <Settings size={18} /> },
        { id: 'notifications', label: 'Bildirimler', icon: <Bell size={18} /> },
        { id: 'sla', label: 'SLA Ayarları', icon: <Clock size={18} /> },
        { id: 'integrations', label: 'Entegrasyonlar', icon: <Link size={18} /> },
        { id: 'appearance', label: 'Görünüm', icon: <Palette size={18} /> }
    ];

    return (
        <div className="settings-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>Ayarlar</h1>
                    <p>Sistem ayarları ve konfigürasyon</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={16} /> Kaydet
                </button>
            </div>

            <div className="settings-content">
                {/* Tabs */}
                <div className="settings-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id as TabType)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="settings-panel">
                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div className="settings-section">
                            <h2>Genel Ayarlar</h2>
                            <p className="section-description">Temel sistem konfigürasyonu</p>

                            <div className="settings-form">
                                <div className="form-group">
                                    <label>Şirket Adı</label>
                                    <input
                                        type="text"
                                        value={generalSettings.companyName}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Saat Dilimi</label>
                                        <select
                                            value={generalSettings.timezone}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                                        >
                                            <option value="Europe/Istanbul">Europe/Istanbul (GMT+3)</option>
                                            <option value="Europe/London">Europe/London (GMT+0)</option>
                                            <option value="America/New_York">America/New_York (GMT-5)</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Dil</label>
                                        <select
                                            value={generalSettings.language}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                                        >
                                            <option value="tr">Türkçe</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Tarih Formatı</label>
                                    <select
                                        value={generalSettings.dateFormat}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Çalışma Saatleri</label>
                                    <div className="time-range">
                                        <input
                                            type="time"
                                            value={generalSettings.businessHoursStart}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, businessHoursStart: e.target.value })}
                                        />
                                        <span>-</span>
                                        <input
                                            type="time"
                                            value={generalSettings.businessHoursEnd}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, businessHoursEnd: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h2>Bildirim Ayarları</h2>
                            <p className="section-description">E-posta ve uygulama içi bildirimler</p>

                            <div className="toggle-list">
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <span className="toggle-label">E-posta Bildirimleri</span>
                                        <span className="toggle-desc">Önemli güncellemeler için e-posta al</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.emailNotifications}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <span className="toggle-label">Uygulama İçi Bildirimler</span>
                                        <span className="toggle-desc">Anlık bildirimler göster</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.inAppNotifications}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, inAppNotifications: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <span className="toggle-label">Eskalasyon Uyarıları</span>
                                        <span className="toggle-desc">Eskalasyon durumlarında bildirim al</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.escalationAlerts}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, escalationAlerts: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <span className="toggle-label">SLA Uyarıları</span>
                                        <span className="toggle-desc">SLA riskli olduğunda uyar</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.slaWarnings}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, slaWarnings: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <span className="toggle-label">Yeni Vaka Bildirimleri</span>
                                        <span className="toggle-desc">Yeni vaka oluşturulduğunda bildir</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.newCaseAlerts}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, newCaseAlerts: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <span className="toggle-label">Günlük Özet</span>
                                        <span className="toggle-desc">Her gün performans özeti al</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.dailyDigest}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, dailyDigest: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SLA Tab */}
                    {activeTab === 'sla' && (
                        <div className="settings-section">
                            <h2>SLA Konfigürasyonu</h2>
                            <p className="section-description">Problem tipi bazında SLA süreleri</p>

                            <div className="sla-table-container">
                                <table className="sla-table">
                                    <thead>
                                        <tr>
                                            <th>Problem Tipi</th>
                                            <th>İlk Yanıt (dk)</th>
                                            <th>Çözüm (dk)</th>
                                            <th>Eskalasyon Seviyeleri</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockSLAConfigs.map((sla, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <span className="sla-intent">{getIntentLabel(sla.problemType)}</span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        defaultValue={sla.maxResponseTime}
                                                        className="sla-input"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        defaultValue={sla.maxResolutionTime}
                                                        className="sla-input"
                                                    />
                                                </td>
                                                <td>
                                                    <div className="escalation-levels">
                                                        {sla.escalationLevels.map((level, i) => (
                                                            <span key={i} className="escalation-badge">
                                                                L{level.level}: {level.afterMinutes}dk
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="sla-note">
                                <AlertTriangle size={16} />
                                <span>SLA değişiklikleri mevcut vakaları etkilemez, yalnızca yeni vakalar için geçerlidir.</span>
                            </div>
                        </div>
                    )}

                    {/* Integrations Tab */}
                    {activeTab === 'integrations' && (
                        <div className="settings-section">
                            <h2>Entegrasyonlar</h2>
                            <p className="section-description">Harici servis bağlantıları</p>

                            <div className="integrations-grid">
                                {integrations.map((integration, idx) => (
                                    <div key={idx} className="integration-card">
                                        <div className="integration-icon">
                                            {integration.icon}
                                        </div>
                                        <div className="integration-info">
                                            <span className="integration-name">{integration.name}</span>
                                            <span className={`integration-status status-${integration.status}`}>
                                                {integration.status === 'connected' ? (
                                                    <><CheckCircle size={12} /> Bağlı</>
                                                ) : (
                                                    <><AlertTriangle size={12} /> {integration.lastSync}</>
                                                )}
                                            </span>
                                        </div>
                                        <div className="integration-actions">
                                            <span className="sync-time">{integration.status === 'connected' ? integration.lastSync : ''}</span>
                                            <button className="btn btn-ghost btn-sm">
                                                <RefreshCw size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="api-section">
                                <h3>API Ayarları</h3>
                                <div className="api-key-display">
                                    <label>API Key</label>
                                    <div className="api-key-row">
                                        <input
                                            type="password"
                                            value="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                                            readOnly
                                        />
                                        <button className="btn btn-secondary btn-sm">Göster</button>
                                        <button className="btn btn-secondary btn-sm">
                                            <RefreshCw size={14} /> Yenile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="settings-section">
                            <h2>Görünüm</h2>
                            <p className="section-description">Tema ve arayüz tercihleri</p>

                            <div className="appearance-options">
                                <div className="theme-selector">
                                    <h3>Tema</h3>
                                    <div className="theme-options">
                                        <button
                                            className={`theme-option ${isDarkMode ? 'active' : ''}`}
                                            onClick={() => setIsDarkMode(true)}
                                        >
                                            <Moon size={24} />
                                            <span>Koyu</span>
                                        </button>
                                        <button
                                            className={`theme-option ${!isDarkMode ? 'active' : ''}`}
                                            onClick={() => setIsDarkMode(false)}
                                        >
                                            <Sun size={24} />
                                            <span>Açık</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="accent-color-selector">
                                    <h3>Vurgu Rengi</h3>
                                    <div className="color-options">
                                        <button className="color-option active" style={{ background: '#6366f1' }} />
                                        <button className="color-option" style={{ background: '#8b5cf6' }} />
                                        <button className="color-option" style={{ background: '#ec4899' }} />
                                        <button className="color-option" style={{ background: '#10b981' }} />
                                        <button className="color-option" style={{ background: '#f59e0b' }} />
                                        <button className="color-option" style={{ background: '#3b82f6' }} />
                                    </div>
                                </div>

                                <div className="widget-preview">
                                    <h3>Chat Widget Önizleme</h3>
                                    <div className="widget-demo">
                                        <div className="demo-widget">
                                            <div className="demo-header">
                                                <Zap size={16} />
                                                <span>Yardım</span>
                                            </div>
                                            <div className="demo-body">
                                                <div className="demo-message">
                                                    Merhaba! Size nasıl yardımcı olabilirim?
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Toast */}
            {showSaveToast && (
                <div className="save-toast">
                    <CheckCircle size={18} />
                    Ayarlar kaydedildi
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
