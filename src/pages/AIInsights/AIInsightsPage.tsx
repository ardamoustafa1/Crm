// AI Insights Page - Full Implementation

import React, { useState } from 'react';
import {
    Brain,
    TrendingUp,
    TrendingDown,
    MessageSquare,
    Users,
    Zap,
    Target,
    PieChart as PieChartIcon,
    BarChart3,
    Activity,
    CheckCircle,
    ArrowRight,
    Clock,
    AlertTriangle
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import {
    mockKPIData,
    mockIntentDistribution,
    mockSentimentDistribution,
    mockConversationTrend,
    mockResolutionTrend,
    mockAIInsights
} from '../../services/mockData';
import { Intent, Sentiment } from '../../types';
import './AIInsightsPage.css';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308'];
const SENTIMENT_COLORS = {
    happy: '#10b981',
    satisfied: '#22c55e',
    neutral: '#6b7280',
    frustrated: '#f97316',
    angry: '#ef4444'
};

const confidenceDistribution = [
    { range: '90-100%', count: 312, percentage: 45 },
    { range: '80-90%', count: 198, percentage: 28 },
    { range: '70-80%', count: 124, percentage: 18 },
    { range: '60-70%', count: 48, percentage: 7 },
    { range: '<60%', count: 15, percentage: 2 }
];

const aiPerformanceByIntent = [
    { intent: 'Bilgi Talebi', autoResolved: 89, humanHandoff: 11 },
    { intent: 'Paket Değişim', autoResolved: 72, humanHandoff: 28 },
    { intent: 'Fatura İtiraz', autoResolved: 45, humanHandoff: 55 },
    { intent: 'Teknik Arıza', autoResolved: 35, humanHandoff: 65 },
    { intent: 'İptal', autoResolved: 15, humanHandoff: 85 },
    { intent: 'Şikayet', autoResolved: 25, humanHandoff: 75 }
];

const recentDecisions = [
    { id: 1, time: '2 dk önce', intent: 'bilgi_talebi', decision: 'Otomatik Çözüm', confidence: 96, success: true },
    { id: 2, time: '5 dk önce', intent: 'teknik_ariza', decision: 'Agent Yönlendirme', confidence: 87, success: true },
    { id: 3, time: '8 dk önce', intent: 'fatura_itiraz', decision: 'Agent Yönlendirme', confidence: 72, success: true },
    { id: 4, time: '12 dk önce', intent: 'paket_degisim', decision: 'Otomatik Çözüm', confidence: 91, success: true },
    { id: 5, time: '15 dk önce', intent: 'iptal', decision: 'Eskalasyon', confidence: 94, success: true }
];

export const AIInsightsPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

    const avgConfidence = mockAIInsights.reduce((acc, i) => acc + i.confidence, 0) / mockAIInsights.length;
    const autoResolvedToday = Math.floor(mockKPIData.totalConversations * (mockKPIData.aiResolutionRate / 100) * 0.15);

    return (
        <div className="ai-insights-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>AI Insights</h1>
                    <p>Yapay zeka performansı ve analitikleri</p>
                </div>
                <div className="time-range-selector">
                    <button
                        className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
                        onClick={() => setTimeRange('7d')}
                    >
                        7 Gün
                    </button>
                    <button
                        className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
                        onClick={() => setTimeRange('30d')}
                    >
                        30 Gün
                    </button>
                    <button
                        className={`time-btn ${timeRange === '90d' ? 'active' : ''}`}
                        onClick={() => setTimeRange('90d')}
                    >
                        90 Gün
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="ai-kpi-grid">
                <div className="ai-kpi-card">
                    <div className="kpi-icon kpi-success">
                        <Brain size={24} />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-value">{mockKPIData.aiResolutionRate}%</span>
                        <span className="kpi-label">AI Çözüm Oranı</span>
                        <div className="kpi-trend trend-positive">
                            <TrendingUp size={14} />
                            +5.2% geçen haftaya göre
                        </div>
                    </div>
                </div>

                <div className="ai-kpi-card">
                    <div className="kpi-icon kpi-info">
                        <Target size={24} />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-value">{Math.round(avgConfidence * 100)}%</span>
                        <span className="kpi-label">Ortalama Güven Skoru</span>
                        <div className="kpi-trend trend-positive">
                            <TrendingUp size={14} />
                            +2.1% geçen haftaya göre
                        </div>
                    </div>
                </div>

                <div className="ai-kpi-card">
                    <div className="kpi-icon kpi-primary">
                        <CheckCircle size={24} />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-value">{autoResolvedToday}</span>
                        <span className="kpi-label">Bugün Otomatik Çözülen</span>
                        <div className="kpi-trend trend-neutral">
                            <Activity size={14} />
                            Ortalama: {Math.floor(autoResolvedToday * 0.9)}/gün
                        </div>
                    </div>
                </div>

                <div className="ai-kpi-card">
                    <div className="kpi-icon kpi-warning">
                        <Users size={24} />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-value">{mockKPIData.agentTransferRate}%</span>
                        <span className="kpi-label">Agent Transfer Oranı</span>
                        <div className="kpi-trend trend-positive">
                            <TrendingDown size={14} />
                            -3.4% geçen haftaya göre
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="charts-row">
                {/* Resolution Trend */}
                <div className="chart-card chart-large">
                    <div className="chart-header">
                        <h3>
                            <Activity size={18} />
                            AI Çözüm Trendi
                        </h3>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={mockResolutionTrend}>
                                <defs>
                                    <linearGradient id="colorResolution" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#71717a"
                                    fontSize={12}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                />
                                <YAxis stroke="#71717a" fontSize={12} unit="%" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a24',
                                        border: '1px solid #27272a',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => [`${value}%`, 'Çözüm Oranı']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fill="url(#colorResolution)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Intent Distribution */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>
                            <PieChartIcon size={18} />
                            Intent Dağılımı
                        </h3>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={mockIntentDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    dataKey="count"
                                    nameKey="intent"
                                >
                                    {mockIntentDistribution.map((entry, index) => (
                                        <Cell key={entry.intent} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a24',
                                        border: '1px solid #27272a',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="chart-legend">
                            {mockIntentDistribution.slice(0, 4).map((item, idx) => (
                                <div key={item.intent} className="legend-item">
                                    <span className="legend-dot" style={{ background: COLORS[idx] }} />
                                    <span className="legend-label">{item.intent.replace('_', ' ')}</span>
                                    <span className="legend-value">{item.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="charts-row">
                {/* Confidence Distribution */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>
                            <Target size={18} />
                            Güven Skoru Dağılımı
                        </h3>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={confidenceDistribution} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                <XAxis type="number" stroke="#71717a" fontSize={12} />
                                <YAxis type="category" dataKey="range" stroke="#71717a" fontSize={12} width={80} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a24',
                                        border: '1px solid #27272a',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Performance by Intent */}
                <div className="chart-card chart-large">
                    <div className="chart-header">
                        <h3>
                            <BarChart3 size={18} />
                            Intent Bazlı AI Performansı
                        </h3>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={aiPerformanceByIntent}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                <XAxis
                                    dataKey="intent"
                                    stroke="#71717a"
                                    fontSize={10}
                                    angle={-25}
                                    textAnchor="end"
                                    height={50}
                                    interval={0}
                                    tick={{ dy: 5 }}
                                />
                                <YAxis stroke="#71717a" fontSize={12} unit="%" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a24',
                                        border: '1px solid #27272a',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="autoResolved" name="Otomatik Çözüm" fill="#10b981" stackId="a" />
                                <Bar dataKey="humanHandoff" name="Agent Transfer" fill="#f59e0b" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="chart-legend horizontal">
                            <div className="legend-item">
                                <span className="legend-dot" style={{ background: '#10b981' }} />
                                <span className="legend-label">Otomatik Çözüm</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot" style={{ background: '#f59e0b' }} />
                                <span className="legend-label">Agent Transfer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sentiment Analysis & Recent Decisions */}
            <div className="charts-row">
                {/* Sentiment Analysis */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>
                            <MessageSquare size={18} />
                            Duygu Analizi
                        </h3>
                    </div>
                    <div className="chart-body">
                        <div className="sentiment-bars">
                            {mockSentimentDistribution.map((item) => (
                                <div key={item.sentiment} className="sentiment-bar-row">
                                    <span className="sentiment-label">{item.sentiment}</span>
                                    <div className="sentiment-bar-container">
                                        <div
                                            className="sentiment-bar-fill"
                                            style={{
                                                width: `${item.percentage}%`,
                                                background: SENTIMENT_COLORS[item.sentiment as keyof typeof SENTIMENT_COLORS]
                                            }}
                                        />
                                    </div>
                                    <span className="sentiment-value">{item.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent AI Decisions */}
                <div className="chart-card chart-large">
                    <div className="chart-header">
                        <h3>
                            <Zap size={18} />
                            Son AI Kararları
                        </h3>
                    </div>
                    <div className="chart-body decisions-list">
                        {recentDecisions.map((decision) => (
                            <div key={decision.id} className="decision-item">
                                <div className="decision-icon">
                                    {decision.decision === 'Otomatik Çözüm' ? (
                                        <CheckCircle size={16} className="icon-success" />
                                    ) : decision.decision === 'Eskalasyon' ? (
                                        <AlertTriangle size={16} className="icon-warning" />
                                    ) : (
                                        <ArrowRight size={16} className="icon-info" />
                                    )}
                                </div>
                                <div className="decision-content">
                                    <div className="decision-header">
                                        <span className="decision-intent">{decision.intent.replace('_', ' ')}</span>
                                        <span className="decision-time">
                                            <Clock size={12} /> {decision.time}
                                        </span>
                                    </div>
                                    <div className="decision-footer">
                                        <span className={`decision-action ${decision.decision === 'Otomatik Çözüm' ? 'action-success' : decision.decision === 'Eskalasyon' ? 'action-warning' : 'action-info'}`}>
                                            {decision.decision}
                                        </span>
                                        <span className="decision-confidence">
                                            Güven: {decision.confidence}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIInsightsPage;
