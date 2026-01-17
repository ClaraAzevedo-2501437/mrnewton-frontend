import React, { useState, useEffect } from 'react';
import { getInstanceMetrics, StudentMetrics } from '../../api/analytics';
import { StudentMetricsTable } from './StudentMetricsTable';

interface AnalyticsDashboardProps {
  instanceId?: string;
  selectedMetrics?: string[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  instanceId: initialInstanceId,
  selectedMetrics = []
}) => {
  const [instanceId, setInstanceId] = useState(initialInstanceId || '');
  const [students, setStudents] = useState<StudentMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-load metrics if instanceId is provided
  useEffect(() => {
    if (initialInstanceId) {
      const metricId = selectedMetrics.length > 0 ? selectedMetrics[0] : undefined;
      loadMetrics(initialInstanceId, metricId);
    }
  }, [initialInstanceId, selectedMetrics]);

  const loadMetrics = async (id: string, metricId?: string) => {
    if (!id.trim()) {
      setError('Please enter an instance ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the first selected metric or a default one
      const metricToFetch = metricId || selectedMetrics[0] || 'final_score';
      const response = await getInstanceMetrics(id, metricToFetch, false);
      setStudents(response.students);
    } catch (err: any) {
      console.error('Error loading metrics:', err);
      setError(err.response?.data?.detail || 'Failed to load metrics. Please check the instance ID and try again.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metricId = selectedMetrics.length > 0 ? selectedMetrics[0] : undefined;
    loadMetrics(instanceId, metricId);
  };

  const handleRefresh = () => {
    if (instanceId) {
      const metricId = selectedMetrics.length > 0 ? selectedMetrics[0] : undefined;
      loadMetrics(instanceId, metricId);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Analytics Dashboard</h1>
          <p style={styles.subtitle}>View comprehensive metrics for quiz instances</p>
        </div>
      </div>

      <div style={styles.searchSection}>
        <form onSubmit={handleSubmit} style={styles.searchForm}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Quiz Instance ID</label>
            <input
              type="text"
              value={instanceId}
              onChange={(e) => setInstanceId(e.target.value)}
              placeholder="Enter instance ID (e.g., inst_abc123)"
              style={styles.input}
            />
          </div>
          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              style={styles.primaryButton}
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : '🔍 Load Metrics'}
            </button>
            {students.length > 0 && (
              <button 
                type="button" 
                onClick={handleRefresh}
                style={styles.secondaryButton}
                disabled={loading}
              >
                🔄 Refresh
              </button>
            )}
          </div>
        </form>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p>Loading analytics data...</p>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📊 Individual Student Metrics</h2>
          <StudentMetricsTable students={students} selectedMetrics={selectedMetrics} />
        </div>
      )}

      {!loading && !error && students.length === 0 && instanceId && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>No Data Available</h3>
          <p style={styles.emptyText}>
            No student submissions found for this instance.
            <br />
            Please verify the instance ID or check if students have completed the quiz.
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
  } as React.CSSProperties,
  
  header: {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  } as React.CSSProperties,
  
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0,
  } as React.CSSProperties,
  
  searchSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '32px',
  } as React.CSSProperties,
  
  searchForm: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  
  inputGroup: {
    flex: '1',
    minWidth: '300px',
  } as React.CSSProperties,
  
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '8px',
  } as React.CSSProperties,
  
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as React.CSSProperties,
  
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  } as React.CSSProperties,
  
  primaryButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 600,
    color: 'white',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  
  secondaryButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#3b82f6',
    backgroundColor: 'white',
    border: '2px solid #3b82f6',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  
  errorBox: {
    backgroundColor: '#fee2e2',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    color: '#991b1b',
  } as React.CSSProperties,
  
  loadingBox: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  } as React.CSSProperties,
  
  section: {
    marginBottom: '32px',
  } as React.CSSProperties,
  
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  
  sectionSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 20px 0',
  } as React.CSSProperties,
  
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  } as React.CSSProperties,
  
  emptyTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#475569',
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  
  emptyText: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.6',
  } as React.CSSProperties,
};
