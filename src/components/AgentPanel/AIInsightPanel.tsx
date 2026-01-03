// AI Insight Panel Component

import React from 'react';
import {
    Brain,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Lightbulb,
    MessageSquare
} from 'lucide-react';
import { AIInsight, Intent, Sentiment } from '../../types';
import './AIInsightPanel.css';

interface AIInsightPanelProps {
    insight: AIInsight | null;
}

const getSentimentColor = (sentiment: Sentiment): string => {
    const colors: Record<Sentiment, string> = {
        [Sentiment.ANGRY]: 'var(--color-sentiment-angry)',
        [Sentiment.FRUSTRATED]: 'var(--color-sentiment-frustrated)',
        [Sentiment.NEUTRAL]: 'var(--color-sentiment-neutral)',
        [Sentiment.SATISFIED]: 'var(--color-sentiment-satisfied)',
        [Sentiment.HAPPY]: 'var(--color-sentiment-happy)'
    };
    return colors[sentiment];
};

const getSentimentIcon = (sentiment: Sentiment): string => {
    const icons: Record<Sentiment, string> = {
        [Sentiment.ANGRY]: '😠',
        [Sentiment.FRUSTRATED]: '😤',
        [Sentiment.NEUTRAL]: '😐',
        [Sentiment.SATISFIED]: '😊',
        [Sentiment.HAPPY]: '😄'
    };
    return icons[sentiment];
};

const getIntentLabel = (intent: Intent): string => {
    const labels: Record<Intent, string> = {
        [Intent.FATURA_ITIRAZ]: 'Fatura İtirazı',
        [Intent.PAKET_DEGISIM]: 'Paket Değişikliği',
        [Intent.TEKNIK_ARIZA]: 'Teknik Arıza',
        [Intent.IPTAL]: 'İptal Talebi',
        [Intent.BILGI_TALEBI]: 'Bilgi Talebi',
        [Intent.SIKAYET]: 'Şikayet',
        [Intent.ODEME]: 'Ödeme',
        [Intent.AKTIVASYON]: 'Aktivasyon'
    };
    return labels[intent];
};

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight }) => {
    if (!insight) {
        return (
            <div className="ai-insight-panel ai-insight-empty">
                <Brain size={32} />
                <p>Vaka seçildiğinde AI analizi burada görünecek</p>
            </div>
        );
    }

    return (
        <div className="ai-insight-panel">
            {/* Header */}
            <div className="ai-panel-header">
                <div className="ai-header-icon">
                    <Brain size={20} />
                </div>
                <div className="ai-header-text">
                    <h3>AI Analizi</h3>
                    <span className="ai-timestamp">
                        {new Date(insight.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="ai-metrics-grid">
                {/* Intent */}
                <div className="ai-metric-card">
                    <span className="metric-label">Intent</span>
                    <span className="metric-value intent-badge">
                        {getIntentLabel(insight.intent)}
                    </span>
                </div>

                {/* Sentiment */}
                <div className="ai-metric-card">
                    <span className="metric-label">Duygu Durumu</span>
                    <span
                        className="metric-value sentiment-badge"
                        style={{ color: getSentimentColor(insight.sentiment) }}
                    >
                        {getSentimentIcon(insight.sentiment)} {insight.sentiment}
                    </span>
                </div>

                {/* Confidence */}
                <div className="ai-metric-card">
                    <span className="metric-label">Güven Skoru</span>
                    <div className="confidence-container">
                        <div className="confidence-bar">
                            <div
                                className="confidence-fill"
                                style={{
                                    width: `${insight.confidence * 100}%`,
                                    background: insight.confidence > 0.8
                                        ? 'var(--color-success)'
                                        : insight.confidence > 0.6
                                            ? 'var(--color-warning)'
                                            : 'var(--color-error)'
                                }}
                            />
                        </div>
                        <span className="confidence-value">{(insight.confidence * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* Auto Resolution */}
                <div className="ai-metric-card">
                    <span className="metric-label">Otomatik Çözüm</span>
                    <span className={`metric-value ${insight.autoResolved ? 'text-success' : 'text-warning'}`}>
                        {insight.autoResolved ? (
                            <><CheckCircle size={16} /> Uygulandı</>
                        ) : (
                            <><AlertCircle size={16} /> Agent Gerekli</>
                        )}
                    </span>
                </div>
            </div>

            {/* Summary */}
            <div className="ai-summary">
                <div className="summary-header">
                    <MessageSquare size={16} />
                    <span>AI Özeti</span>
                </div>
                <p className="summary-text">{insight.summary}</p>
            </div>

            {/* Entities */}
            {Object.keys(insight.entities).length > 0 && (
                <div className="ai-entities">
                    <div className="entities-header">
                        <span>Tespit Edilen Bilgiler</span>
                    </div>
                    <div className="entities-list">
                        {Object.entries(insight.entities).map(([key, value]) => (
                            <div key={key} className="entity-item">
                                <span className="entity-key">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className="entity-value">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Actions */}
            {insight.suggestedActions.length > 0 && (
                <div className="ai-suggestions">
                    <div className="suggestions-header">
                        <Lightbulb size={16} />
                        <span>Önerilen Aksiyonlar</span>
                    </div>
                    <ul className="suggestions-list">
                        {insight.suggestedActions.map((action, index) => (
                            <li key={index} className="suggestion-item">
                                <span className="suggestion-number">{index + 1}</span>
                                <span className="suggestion-text">{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AIInsightPanel;
