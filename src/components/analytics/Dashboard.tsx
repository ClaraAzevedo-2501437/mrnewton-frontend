import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../state/analyticsState';
import { MetricResult } from '../../domain/models/Analytics';

interface DashboardProps {
  activityId?: string;
  studentId?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ activityId, studentId }) => {
  const {
    contract,
    selectedMetrics,
    results,
    loading,
    error,
    loadContract,
    selectMetric,
    deselectMetric,
    fetchMetrics
  } = useAnalyticsStore();

  useEffect(() => {
    loadContract();
  }, []);

  const handleFetchMetrics = () => {
    fetchMetrics(activityId, studentId);
  };

  const renderMetricValue = (result: MetricResult) => {
    if (typeof result.value === 'number') {
      return <span style={styles.metricValue}>{result.value.toFixed(2)}</span>;
    }
    if (typeof result.value === 'string') {
      return <span style={styles.metricValue}>{result.value}</span>;
    }
    return <pre style={styles.jsonValue}>{JSON.stringify(result.value, null, 2)}</pre>;
  };

  if (loading && !contract) {
    return <div style={styles.loading}>Loading analytics...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!contract) {
    return <div style={styles.error}>No analytics contract available</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Analytics Dashboard</h1>

      {/* Metric Selection */}
      <div style={styles.section}>
        <h2>Available Metrics</h2>
        <div style={styles.metricsGrid}>
          {contract.available_metrics.map(metric => (
            <label key={metric.metric_id} style={styles.metricOption}>
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric.metric_id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    selectMetric(metric.metric_id);
                  } else {
                    deselectMetric(metric.metric_id);
                  }
                }}
                style={styles.checkbox}
              />
              <div>
                <div style={styles.metricName}>{metric.name}</div>
                <div style={styles.metricDescription}>{metric.description}</div>
                <span style={styles.metricType}>{metric.type}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Fetch Button */}
      <div style={styles.actionContainer}>
        <button
          onClick={handleFetchMetrics}
          disabled={selectedMetrics.length === 0 || loading}
          style={{
            ...styles.fetchButton,
            ...(selectedMetrics.length === 0 || loading ? styles.disabledButton : {})
          }}
        >
          {loading ? 'Loading...' : 'Fetch Selected Metrics'}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div style={styles.section}>
          <h2>Results</h2>
          <div style={styles.resultsGrid}>
            {results.map((result, index) => (
              <div key={index} style={styles.resultCard}>
                <h3 style={styles.resultTitle}>{result.metric_name}</h3>
                {renderMetricValue(result)}
                <div style={styles.timestamp}>
                  Calculated: {new Date(result.calculated_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  loading: {
    textAlign: 'center' as const,
    padding: '50px',
    fontSize: '16px',
    color: '#666666'
  },
  error: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    color: '#000000',
    textAlign: 'center' as const,
    fontSize: '14px'
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    color: '#000000',
    fontSize: '24px',
    fontWeight: 'normal' as const
  },
  section: {
    marginBottom: '40px'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '12px'
  },
  metricOption: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s'
  },
  checkbox: {
    marginTop: '5px',
    cursor: 'pointer'
  },
  metricName: {
    fontWeight: 'normal' as const,
    marginBottom: '5px',
    fontSize: '14px',
    color: '#000000'
  },
  metricDescription: {
    fontSize: '13px',
    color: '#666666',
    marginBottom: '5px'
  },
  metricType: {
    fontSize: '11px',
    padding: '2px 8px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    color: '#000000'
  },
  actionContainer: {
    textAlign: 'center' as const,
    marginBottom: '30px'
  },
  fetchButton: {
    padding: '12px 32px',
    fontSize: '16px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: 'normal' as const
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
    color: '#666666'
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '15px'
  },
  resultCard: {
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    backgroundColor: '#ffffff'
  },
  resultTitle: {
    marginBottom: '15px',
    color: '#000000',
    fontSize: '16px',
    fontWeight: 'normal' as const
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: 'normal' as const,
    color: '#000000',
    display: 'block',
    marginBottom: '10px'
  },
  jsonValue: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    fontSize: '12px',
    overflow: 'auto',
    fontFamily: 'monospace'
  },
  timestamp: {
    fontSize: '12px',
    color: '#666666',
    marginTop: '10px'
  }
};
