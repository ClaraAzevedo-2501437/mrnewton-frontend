import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface MetricDefinition {
  metric_id: string;
  name: string;
  type?: string;
  description: string;
  unit?: string;
}

interface AnalyticsContract {
  contract_id?: string;
  activity_provider_id?: string;
  qualAnalytics: MetricDefinition[];
  quantAnalytics: MetricDefinition[];
}

export const ContractPage: React.FC = () => {
  const [contract, setContract] = useState<AnalyticsContract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    loadContract();
  }, []);

  const loadContract = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/analytics-api/contract');
      setContract(response.data);
      setJsonInput(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load analytics contract');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedContract = JSON.parse(jsonInput);
      await axios.post('/analytics-api/contract', parsedContract);
      await loadContract();
      setMode('view');
      alert('Analytics contract updated successfully!');
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format');
      } else {
        setError(err.response?.data?.detail || 'Failed to update analytics contract');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Menu</Link>
        <h1 style={styles.title}>Analytics Contract</h1>
        <p style={styles.subtitle}>View and manage analytics contract</p>
      </div>

      {error && (
        <div style={styles.errorBanner}>{error}</div>
      )}

      <div style={styles.actions}>
        {mode === 'view' ? (
          <button onClick={() => setMode('edit')} style={styles.button}>
            Edit Contract
          </button>
        ) : (
          <>
            <button onClick={handleUpdate} style={styles.button} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => { setMode('view'); setJsonInput(JSON.stringify(contract, null, 2)); }} style={styles.cancelButton}>
              Cancel
            </button>
          </>
        )}
        <button onClick={loadContract} style={styles.refreshButton} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {loading && !contract ? (
        <div style={styles.loadingContainer}>Loading contract...</div>
      ) : contract ? (
        <div style={styles.content}>
          {mode === 'view' ? (
            <div>
              <div style={styles.metricsSection}>
                <h3 style={styles.sectionTitle}>Quantitative Analytics ({contract.quantAnalytics?.length || 0})</h3>
                <div style={styles.metricsGrid}>
                  {contract.quantAnalytics?.map((metric) => (
                    <div key={metric.metric_id} style={styles.metricCard}>
                      <div style={styles.metricHeader}>
                        <span style={styles.metricName}>{metric.name}</span>
                        <span style={styles.metricId}>{metric.metric_id}</span>
                      </div>
                      <p style={styles.metricDescription}>{metric.description}</p>
                      {metric.type && (
                        <div style={styles.metricUnit}>
                          <strong>Type:</strong> {metric.type}
                        </div>
                      )}
                      {metric.unit && (
                        <div style={styles.metricUnit}>
                          <strong>Unit:</strong> {metric.unit}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.metricsSection}>
                <h3 style={styles.sectionTitle}>Qualitative Analytics ({contract.qualAnalytics?.length || 0})</h3>
                <div style={styles.metricsGrid}>
                  {contract.qualAnalytics?.map((metric) => (
                    <div key={metric.metric_id} style={styles.metricCard}>
                      <div style={styles.metricHeader}>
                        <span style={styles.metricName}>{metric.name}</span>
                        <span style={styles.metricId}>{metric.metric_id}</span>
                      </div>
                      <p style={styles.metricDescription}>{metric.description}</p>
                      {metric.type && (
                        <div style={styles.metricUnit}>
                          <strong>Type:</strong> {metric.type}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              style={styles.textarea}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    padding: '40px 20px'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 40px',
    textAlign: 'center' as const
  },
  backLink: {
    display: 'inline-block',
    color: '#5a9fd4',
    textDecoration: 'none',
    fontSize: '14px',
    marginBottom: '15px'
  },
  title: {
    fontSize: '32px',
    color: '#2c3e50',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginTop: '5px'
  },
  actions: {
    maxWidth: '1200px',
    margin: '0 auto 20px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#5a9fd4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  refreshButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  errorBanner: {
    maxWidth: '1200px',
    margin: '0 auto 20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid #f5c6cb'
  },
  loadingContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center' as const,
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  textarea: {
    width: '100%',
    minHeight: '500px',
    padding: '15px',
    fontSize: '13px',
    fontFamily: 'monospace',
    border: '1px solid #ddd',
    borderRadius: '6px',
    resize: 'vertical' as const,
    lineHeight: '1.5'
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#2c3e50',
    marginBottom: '15px',
    marginTop: '30px',
    fontWeight: 'bold' as const,
    borderBottom: '2px solid #5a9fd4',
    paddingBottom: '10px'
  },
  metricsSection: {
    marginTop: '20px'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  metricCard: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '20px',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  metricName: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#2c3e50'
  },
  metricId: {
    fontSize: '12px',
    color: '#6c757d',
    backgroundColor: '#e9ecef',
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace'
  },
  metricDescription: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '1.5',
    marginBottom: '10px'
  },
  metricUnit: {
    fontSize: '13px',
    color: '#6c757d',
    marginTop: '8px'
  }
};
