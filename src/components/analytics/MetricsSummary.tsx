import React from 'react';
import { QuantitativeMetrics } from '../../api/analytics';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon = '📊',
  color = '#3b82f6',
  subtitle 
}) => {
  return (
    <div style={{
      ...styles.card,
      borderLeft: `4px solid ${color}`
    }}>
      <div style={styles.cardHeader}>
        <span style={styles.icon}>{icon}</span>
        <h3 style={styles.title}>{title}</h3>
      </div>
      <div style={styles.value}>{value}</div>
      {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
    </div>
  );
};

interface MetricsSummaryProps {
  metrics: QuantitativeMetrics;
  selectedMetrics?: string[];
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics, selectedMetrics = [] }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatScore = (score: number): string => {
    return `${(score * 100).toFixed(1)}%`;
  };

  // Define all available metrics with their IDs
  const allMetrics = [
    {
      id: 'total_attempts',
      component: (
        <MetricCard
          key="total_attempts"
          title="Total Attempts"
          value={metrics.total_attempts}
          icon="🔄"
          color="#8b5cf6"
        />
      )
    },
    {
      id: 'total_time',
      component: (
        <MetricCard
          key="total_time"
          title="Total Time"
          value={formatTime(metrics.total_time_seconds)}
          icon="⏱️"
          color="#06b6d4"
        />
      )
    },
    {
      id: 'average_time_per_attempt',
      component: (
        <MetricCard
          key="average_time_per_attempt"
          title="Average Time/Attempt"
          value={formatTime(Math.round(metrics.average_time_per_attempt))}
          icon="⏰"
          color="#0ea5e9"
        />
      )
    },
    {
      id: 'correct_answers',
      component: (
        <MetricCard
          key="correct_answers"
          title="Correct Answers"
          value={metrics.number_of_correct_answers}
          icon="✅"
          color="#10b981"
        />
      )
    },
    {
      id: 'final_score',
      component: (
        <MetricCard
          key="final_score"
          title="Final Score"
          value={formatScore(metrics.final_score)}
          icon="🎯"
          color="#f59e0b"
        />
      )
    },
    {
      id: 'activity_success',
      component: (
        <MetricCard
          key="activity_success"
          title="Status"
          value={metrics.activity_success ? 'Passed' : 'Failed'}
          icon={metrics.activity_success ? '✔️' : '✗'}
          color={metrics.activity_success ? '#10b981' : '#ef4444'}
        />
      )
    }
  ];

  // Filter metrics based on selection (show all if none selected)
  const metricsToShow = selectedMetrics.length > 0
    ? allMetrics.filter(m => selectedMetrics.includes(m.id))
    : allMetrics;

  return (
    <div style={styles.summaryGrid}>
      {metricsToShow.map(m => m.component)}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  } as React.CSSProperties,
  
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  } as React.CSSProperties,
  
  icon: {
    fontSize: '24px',
  } as React.CSSProperties,
  
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  
  value: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '4px',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '12px',
    color: '#94a3b8',
  } as React.CSSProperties,
  
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  } as React.CSSProperties,
};
