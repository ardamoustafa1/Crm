// KPI Card Component for Dashboard

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './Dashboard.css';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive?: boolean;
    };
    icon?: React.ReactNode;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    subtitle,
    trend,
    icon,
    color = 'primary',
    onClick
}) => {
    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend.value > 0) return <TrendingUp size={14} />;
        if (trend.value < 0) return <TrendingDown size={14} />;
        return <Minus size={14} />;
    };

    return (
        <div
            className={`kpi-card kpi-card-${color} ${onClick ? 'kpi-clickable' : ''}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <div className="kpi-header">
                <span className="kpi-title">{title}</span>
                {icon && <div className="kpi-icon">{icon}</div>}
            </div>

            <div className="kpi-body">
                <span className="kpi-value">{value}</span>
                {trend && (
                    <span className={`kpi-trend ${trend.value > 0 ? 'trend-up' : trend.value < 0 ? 'trend-down' : 'trend-neutral'}`}>
                        {getTrendIcon()}
                        {Math.abs(trend.value)}%
                    </span>
                )}
            </div>

            {subtitle && (
                <span className="kpi-subtitle">{subtitle}</span>
            )}
        </div>
    );
};

export default KPICard;

