import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Activity {
  activity_id: string;
  title: string;
}

interface Instance {
  instance_id: string;
  activity_id: string;
  created_at: string;
}

export const InstancesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await axios.get('/activity-api/config');
      setActivities(response.data.activities || []);
    } catch (err) {
      setError('Failed to load activities');
    }
  };

  const loadInstances = async (activityId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/activity-api/deploy/activity/${activityId}`);
      setInstances(response.data.instances || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load instances');
      setInstances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityChange = (activityId: string) => {
    setSelectedActivity(activityId);
    if (activityId) {
      loadInstances(activityId);
    } else {
      setInstances([]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Menu</Link>
        <h1 style={styles.title}>Quiz Instances</h1>
        <p style={styles.subtitle}>View all instances of an activity</p>
      </div>

      {error && (
        <div style={styles.errorBanner}>{error}</div>
      )}

      <div style={styles.content}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Activity</label>
          <select
            value={selectedActivity}
            onChange={(e) => handleActivityChange(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select an activity --</option>
            {activities.map(activity => (
              <option key={activity.activity_id} value={activity.activity_id}>
                {activity.title || activity.activity_id}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div style={styles.loadingContainer}>Loading instances...</div>
        )}

        {!loading && selectedActivity && instances.length === 0 && (
          <div style={styles.emptyState}>
            <p>No instances found for this activity.</p>
          </div>
        )}

        {!loading && instances.length > 0 && (
          <div style={styles.instancesGrid}>
            <h3 style={styles.sectionTitle}>Instances ({instances.length})</h3>
            {instances.map(instance => (
              <div key={instance.instance_id} style={styles.instanceCard}>
                <div style={styles.cardHeader}>
                  <strong>Instance ID:</strong> {instance.instance_id}
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Activity:</span>
                    <span>{instance.activity_id}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Created:</span>
                    <span>{new Date(instance.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    marginBottom: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666'
  },
  errorBanner: {
    maxWidth: '1200px',
    margin: '0 auto 20px',
    padding: '15px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '8px',
    border: '1px solid #fcc'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  formGroup: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    marginBottom: '8px'
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white'
  },
  loadingContainer: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#666'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '8px',
    color: '#666'
  },
  instancesGrid: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #e0e0e0'
  },
  instanceCard: {
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    marginBottom: '15px',
    backgroundColor: '#fafafa'
  },
  cardHeader: {
    fontSize: '16px',
    color: '#2c3e50',
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e0e0e0'
  },
  cardBody: {
    fontSize: '14px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    color: '#666'
  },
  infoLabel: {
    fontWeight: 'bold' as const,
    color: '#2c3e50'
  }
};
