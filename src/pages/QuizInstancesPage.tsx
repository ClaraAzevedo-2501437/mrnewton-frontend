import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface QuizInstance {
  instance_id: string;
  activity_id: string;
  title?: string;
  created_at: string;
  expires_at: string;
}

export const QuizInstancesPage: React.FC = () => {
  const [instances, setInstances] = useState<QuizInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get all activities
      const activitiesResponse = await axios.get('/activity-api/config');
      const activities = activitiesResponse.data.activities || [];

      // Then, for each activity, get its instances
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
              created_at: inst.created_at,
              expires_at: inst.expires_at
            });
          });
        } catch (err) {
          // If no instances for this activity, continue
        }
      }

      setInstances(allInstances);
    } catch (err: any) {
      console.error('Error loading instances:', err);
      setError(err.response?.data?.message || 'Failed to load quiz instances');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Link to="/" style={styles.backLink}>← Back to Menu</Link>
          <h1 style={styles.title}>Available Quiz Instances</h1>
        </div>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}>⏳</div>
          <p>Loading quiz instances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Link to="/" style={styles.backLink}>← Back to Menu</Link>
          <h1 style={styles.title}>Available Quiz Instances</h1>
        </div>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>❌ {error}</p>
          <button onClick={loadInstances} style={styles.retryButton}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (instances.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Link to="/" style={styles.backLink}>← Back to Menu</Link>
          <h1 style={styles.title}>Available Quiz Instances</h1>
        </div>
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>📭 No quiz instances available</p>
          <p style={styles.emptySubtext}>
            Contact your teacher to deploy a quiz instance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Menu</Link>
        <h1 style={styles.title}>Available Quiz Instances</h1>
        <p style={styles.subtitle}>Select a quiz to participate</p>
      </div>

      <div style={styles.instancesGrid}>
        {instances.map((instance) => (
          <Link
            key={instance.instance_id}
            to={`/instances/${instance.instance_id}`}
            style={styles.instanceCard}
            className="instance-card"
          >
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                {instance.title || instance.activity_id}
              </h3>
              <span style={styles.badge}>📝 Active</span>
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
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Created:</span>
                <span style={styles.infoValue}>{formatDate(instance.created_at)}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Expires:</span>
                <span style={styles.infoValue}>{formatDate(instance.expires_at)}</span>
              </div>
            </div>

            <div style={styles.cardFooter}>
              <span style={styles.startButton}>Start Quiz →</span>
            </div>
          </Link>
        ))}
      </div>
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
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '16px',
    marginBottom: '20px'
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#5a9fd4',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500' as const
  },
  emptyContainer: {
    maxWidth: '600px',
    margin: '60px auto',
    textAlign: 'center' as const,
    padding: '60px 40px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  emptyText: {
    fontSize: '20px',
    color: '#2c3e50',
    marginBottom: '10px'
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#7f8c8d'
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    border: '2px solid transparent',
    transition: 'all 0.2s ease',
    display: 'block'
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
    backgroundColor: '#a8d5ba',
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
  startButton: {
    display: 'inline-block',
    color: '#5a9fd4',
    fontSize: '14px',
    fontWeight: 'bold' as const
  }
};
