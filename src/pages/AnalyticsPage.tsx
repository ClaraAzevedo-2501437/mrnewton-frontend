import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';

interface QuizInstance {
  instance_id: string;
  activity_id: string;
  title?: string;
  created_at: string;
}

interface MetricDefinition {
  metric_id: string;
  name: string;
  description: string;
  data_type: string;
}

interface AnalyticsContract {
  qualitative: MetricDefinition[];
  quantitative: MetricDefinition[];
}

export const AnalyticsPage: React.FC = () => {
  const [step, setStep] = useState<'instances' | 'metrics' | 'dashboard'>('instances');
  const [instances, setInstances] = useState<QuizInstance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
  const [analyticsContract, setAnalyticsContract] = useState<AnalyticsContract | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    try {
      setLoading(true);
      setError(null);

      const activitiesResponse = await axios.get('/activity-api/config');
      const activities = activitiesResponse.data.activities || [];

      const allInstances: QuizInstance[] = [];
      
      for (const activity of activities) {
        try {
          const instancesResponse = await axios.get(`/activity-api/deploy/activity/${activity.activity_id}`);
          const activityInstances = instancesResponse.data.instances || [];
          
          activityInstances.forEach((inst: any) => {
            allInstances.push({
              instance_id: inst.instance_id,
              activity_id: inst.activity_id,
              title: activity.title,
              created_at: inst.created_at
            });
          });
        } catch (err) {
          // If no instances for this activity, continue
        }
      }

      setInstances(allInstances);
    } catch (err: any) {
      setError('Failed to load quiz instances');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsContract = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use Vite proxy to access analytics API
      const response = await axios.get('/analytics-api/contract');
      
      setAnalyticsContract({
        qualitative: response.data.qualAnalytics || [],
        quantitative: response.data.quantAnalytics || []
      });
      
      // Don't pre-select, let user choose
      setSelectedMetric(null);
      
      setStep('metrics');
    } catch (err: any) {
      console.error('Error loading analytics contract:', err);
      setError('Failed to load analytics contract. Make sure the Analytics API is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstanceSelect = (instanceId: string) => {
    setSelectedInstance(instanceId);
    setError(null);
    loadAnalyticsContract();
  };

  const handleMetricSelect = (metricId: string) => {
    setSelectedMetric(metricId);
    setError(null);
  };

  const handleViewDashboard = () => {
    if (!selectedMetric) {
      setError('Please select a metric');
      return;
    }
    setError(null);
    setStep('dashboard');
  };

  const handleReset = () => {
    setStep('instances');
    setSelectedInstance(null);
    setAnalyticsContract(null);
    setSelectedMetric(null);
    setError(null);
  };

  if (step === 'dashboard' && selectedInstance && selectedMetric) {
    return (
      <div style={styles.container}>
        <div style={styles.dashboardHeader}>
          <button onClick={handleReset} style={styles.backButton}>
            ← Back to Instance Selection
          </button>
          <div style={styles.instanceInfo}>
            Instance: <strong>{selectedInstance}</strong> | Metric: <strong>{selectedMetric}</strong>
          </div>
        </div>
        <AnalyticsDashboard 
          instanceId={selectedInstance}
          selectedMetrics={[selectedMetric]}
        />
      </div>
    );
  }

  if (step === 'metrics' && analyticsContract) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Link to="/" style={styles.backLink}>← Back to Menu</Link>
          <h1 style={styles.title}>Select Analytics Metrics</h1>
          <p style={styles.subtitle}>
            Instance: <strong>{selectedInstance}</strong>
          </p>
        </div>

        {error && (
          <div style={styles.errorBanner}>{error}</div>
        )}

        <div style={styles.content}>
          <div style={styles.metricsSection}>
            <h2 style={styles.sectionTitle}>Quantitative Metrics</h2>
            <div style={styles.metricsList}>
              {analyticsContract.quantitative.map(metric => (
                <label key={metric.metric_id} style={styles.metricItem}>
                  <input
                    type="radio"
                    name="metric"
                    checked={selectedMetric === metric.metric_id}
                    onChange={() => handleMetricSelect(metric.metric_id)}
                    style={styles.radio}
                  />
                  <div style={styles.metricInfo}>
                    <div style={styles.metricName}>{metric.name}</div>
                    <div style={styles.metricDescription}>{metric.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {analyticsContract.qualitative.length > 0 && (
            <div style={styles.metricsSection}>
              <h2 style={styles.sectionTitle}>Qualitative Metrics</h2>
              <div style={styles.metricsList}>
                {analyticsContract.qualitative.map(metric => (
                  <label key={metric.metric_id} style={styles.metricItem}>
                    <input
                      type="radio"
                      name="metric"
                      checked={selectedMetric === metric.metric_id}
                      onChange={() => handleMetricSelect(metric.metric_id)}
                      style={styles.radio}
                    />
                    <div style={styles.metricInfo}>
                      <div style={styles.metricName}>{metric.name}</div>
                      <div style={styles.metricDescription}>{metric.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <button onClick={handleReset} style={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleViewDashboard} style={styles.viewButton}>
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Instance Selection
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Menu</Link>
        <h1 style={styles.title}>Select Quiz Instance</h1>
        <p style={styles.subtitle}>Choose an instance to view analytics</p>
      </div>

      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}>⏳</div>
          <p>Loading instances...</p>
        </div>
      )}

      {error && !loading && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>❌ {error}</p>
        </div>
      )}

      {!loading && !error && instances.length === 0 && (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>📭 No quiz instances available</p>
        </div>
      )}

      {!loading && instances.length > 0 && (
        <div style={styles.instancesGrid}>
          {instances.map(instance => (
            <button
              key={instance.instance_id}
              onClick={() => handleInstanceSelect(instance.instance_id)}
              style={styles.instanceCard}
              className="instance-card-button"
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>
                  {instance.title || instance.activity_id}
                </h3>
                <span style={styles.badge}>📊 Analytics</span>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Instance ID:</span>
                  <span style={styles.infoValue}>{instance.instance_id}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Activity:</span>
                  <span style={styles.infoValue}>{instance.activity_id}</span>
                </div>
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.selectButton}>View Analytics →</span>
              </div>
            </button>
          ))}
        </div>
      )}
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
    marginBottom: '20px',
    fontWeight: '500' as const
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d'
  },
  loadingContainer: {
    maxWidth: '600px',
    margin: '60px auto',
    textAlign: 'center' as const,
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '8px'
  },
  spinner: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  errorContainer: {
    maxWidth: '600px',
    margin: '60px auto',
    textAlign: 'center' as const,
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '8px'
  },
  errorBanner: {
    maxWidth: '1200px',
    margin: '0 auto 20px',
    padding: '15px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '8px',
    textAlign: 'center' as const
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '16px'
  },
  emptyContainer: {
    maxWidth: '600px',
    margin: '60px auto',
    textAlign: 'center' as const,
    padding: '60px 40px',
    backgroundColor: '#ffffff',
    borderRadius: '8px'
  },
  emptyText: {
    fontSize: '20px',
    color: '#2c3e50'
  },
  instancesGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  },
  instanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    border: '2px solid #e0e0e0',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.2s ease',
    width: '100%'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #ecf0f1'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    margin: 0,
    flex: 1
  },
  badge: {
    padding: '4px 10px',
    backgroundColor: '#a2c4e8',
    color: '#2c3e50',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500' as const
  },
  cardBody: {
    marginBottom: '20px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '14px'
  },
  infoLabel: {
    color: '#7f8c8d',
    fontWeight: '500' as const
  },
  infoValue: {
    color: '#2c3e50',
    textAlign: 'right' as const,
    maxWidth: '60%',
    wordBreak: 'break-word' as const
  },
  cardFooter: {
    paddingTop: '15px',
    borderTop: '1px solid #ecf0f1'
  },
  selectButton: {
    color: '#5a9fd4',
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  metricsSection: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #e0e0e0'
  },
  metricsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  metricItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s ease'
  },
  checkbox: {
    marginTop: '4px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  radio: {
    marginTop: '4px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  metricInfo: {
    flex: 1
  },
  metricName: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    marginBottom: '4px'
  },
  metricDescription: {
    fontSize: '14px',
    color: '#7f8c8d',
    lineHeight: '1.5'
  },
  actions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '30px'
  },
  cancelButton: {
    padding: '14px 32px',
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  viewButton: {
    padding: '14px 32px',
    backgroundColor: '#5a9fd4',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  dashboardHeader: {
    maxWidth: '1400px',
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    color: '#5a9fd4',
    border: '2px solid #5a9fd4',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer'
  },
  instanceInfo: {
    fontSize: '16px',
    color: '#2c3e50'
  }
};

