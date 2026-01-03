// Supervisor Dashboard Page

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bot,
    Users,
    Ticket,
    Clock,
    TrendingUp,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    ArrowUpRight
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
    Cell
} from 'recharts';
import { KPICard } from '../../components/Dashboard/KPICard';
import {
    mockKPIData,
    mockConversationTrend,
    mockIntentDistribution,
    mockSentimentDistribution,
    mockAgentPerformance
} from '../../services/mockData';
import '../../components/Dashboard/Dashboard.css';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
const SENTIMENT_COLORS = {
    happy: '#10b981',
    satisfied: '#22c55e',
    neutral: '#6b7280',
    frustrated: '#f97316',
    angry: '#ef4444'
};

export const SupervisorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [chartRange, setChartRange] = useState<'7d' | '30d'>('7d');

    // Filter data based on selected range
    const filteredTrendData = chartRange === '7d'
        ? mockConversationTrend.slice(-7)
        : mockConversationTrend;

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">Supervisor Dashboard</h1>
                <p className="dashboard-subtitle">
                    Real-time analytics and performance metrics • Last updated: {new Date().toLocaleTimeString('tr-TR')}
                </p>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <KPICard
                    title="AI Resolution Rate"
                    value={`${mockKPIData.aiResolutionRate}%`}
                    trend={{ value: 5.2, isPositive: true }}
                    icon={<Bot size={20} />}
                    color="success"
                    onClick={() => navigate('/ai-insights')}
                />
                <KPICard
                    title="Active Cases"
                    value={mockKPIData.activeCases}
                    subtitle="12 high priority"
                    trend={{ value: -8, isPositive: true }}
                    icon={<Users size={20} />}
                    color="primary"
                    onClick={() => navigate('/cases')}
                />
                <KPICard
                    title="Pending Tickets"
                    value={mockKPIData.pendingTickets}
                    subtitle="3 SLA at risk"
                    trend={{ value: 12, isPositive: false }}
                    icon={<Ticket size={20} />}
                    color="warning"
                    onClick={() => navigate('/tickets')}
                />
                <KPICard
                    title="Avg. Handle Time"
                    value={`${mockKPIData.avgHandleTime}m`}
                    subtitle="Target: 10m"
                    trend={{ value: -15, isPositive: true }}
                    icon={<Clock size={20} />}
                    color="info"
                    onClick={() => navigate('/agent-workspace')}
                />
            </div>

            {/* Charts Row */}
            <div className="charts-grid">
                {/* Conversation Trend */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Conversation Trend</h3>
                        <div className="chart-actions">
                            <button
                                className={`btn btn-ghost btn-sm ${chartRange === '7d' ? 'active' : ''}`}
                                onClick={() => setChartRange('7d')}
                            >
                                7 Days
                            </button>
                            <button
                                className={`btn btn-ghost btn-sm ${chartRange === '30d' ? 'active' : ''}`}
                                onClick={() => setChartRange('30d')}
                            >
                                30 Days
                            </button>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={filteredTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#71717a"
                                    fontSize={12}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                />
                                <YAxis stroke="#71717a" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a24',
                                        border: '1px solid #27272a',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    dot={{ fill: '#6366f1', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#8b5cf6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Intent Distribution */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Top Intents</h3>
                    </div>
                    <div className="intent-list">
                        {mockIntentDistribution.slice(0, 5).map((item, index) => (
                            <div key={item.intent} className="intent-item">
                                <span className="intent-label">
                                    {item.intent.replace('_', ' ').charAt(0).toUpperCase() + item.intent.replace('_', ' ').slice(1)}
                                </span>
                                <div className="intent-bar">
                                    <div
                                        className="intent-bar-fill"
                                        style={{
                                            width: `${item.percentage}%`,
                                            background: COLORS[index % COLORS.length]
                                        }}
                                    />
                                </div>
                                <span className="intent-value">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Second Row */}
            <div className="charts-grid">
                {/* Agent Performance */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Agent Performance</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/agents')}>
                            View All <ArrowUpRight size={14} />
                        </button>
                    </div>
                    <table className="performance-table">
                        <thead>
                            <tr>
                                <th>Agent</th>
                                <th>Cases</th>
                                <th>Avg. Time</th>
                                <th>Satisfaction</th>
                                <th>Resolution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockAgentPerformance.map((agent) => (
                                <tr key={agent.agentId}>
                                    <td>
                                        <div className="agent-cell">
                                            <div className="agent-avatar">
                                                {agent.agentName.charAt(0)}
                                            </div>
                                            <span>{agent.agentName}</span>
                                        </div>
                                    </td>
                                    <td>{agent.casesHandled}</td>
                                    <td>{agent.avgHandleTime}m</td>
                                    <td>
                                        <span className={`score-badge ${agent.satisfactionScore >= 4.5 ? 'score-high' : agent.satisfactionScore >= 4 ? 'score-medium' : 'score-low'}`}>
                                            ⭐ {agent.satisfactionScore}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`score-badge ${agent.resolutionRate >= 90 ? 'score-high' : agent.resolutionRate >= 80 ? 'score-medium' : 'score-low'}`}>
                                            {agent.resolutionRate}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sentiment Distribution */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Sentiment Analysis</h3>
                    </div>
                    <div className="chart-container" style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockSentimentDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    dataKey="count"
                                    nameKey="sentiment"
                                    label={({ sentiment, percentage }) => `${percentage}%`}
                                    labelLine={false}
                                >
                                    {mockSentimentDistribution.map((entry) => (
                                        <Cell
                                            key={entry.sentiment}
                                            fill={SENTIMENT_COLORS[entry.sentiment as keyof typeof SENTIMENT_COLORS]}
                                        />
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
                    </div>
                    <div className="intent-list" style={{ marginTop: 'var(--spacing-md)' }}>
                        {mockSentimentDistribution.map((item) => (
                            <div key={item.sentiment} className="intent-item">
                                <span
                                    className="intent-label"
                                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                                >
                                    <span
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: SENTIMENT_COLORS[item.sentiment as keyof typeof SENTIMENT_COLORS]
                                        }}
                                    />
                                    {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                                </span>
                                <span className="intent-value">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Real-time Monitor */}
            <div className="realtime-grid">
                <div className="realtime-card">
                    <div className="realtime-header">
                        <span className="realtime-dot" style={{ background: 'var(--color-success)' }} />
                        <span className="realtime-title">Active Conversations</span>
                    </div>
                    <div className="realtime-value">23</div>
                    <div className="realtime-label">Currently being handled</div>
                </div>

                <div className="realtime-card">
                    <div className="realtime-header">
                        <span className="realtime-dot" style={{ background: 'var(--color-warning)' }} />
                        <span className="realtime-title">Queue Wait Time</span>
                    </div>
                    <div className="realtime-value">2.4m</div>
                    <div className="realtime-label">Average wait time</div>
                </div>

                <div className="realtime-card">
                    <div className="realtime-header">
                        <span className="realtime-dot" style={{ background: 'var(--color-info)' }} />
                        <span className="realtime-title">Online Agents</span>
                    </div>
                    <div className="realtime-value">5/8</div>
                    <div className="realtime-label">Available capacity: 62.5%</div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;
