import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Activity {
  activity_id: string;
  title: string;
}

export const DeployQuizPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleDeploy = async () => {
    if (!selectedActivity) {
      setError('Please select an activity');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.post(`/activity-api/deploy/activity/${selectedActivity}`);

      const instanceId = response.data.instance_id || 'N/A';
      setSuccess(`Quiz deployed successfully! Instance ID: ${instanceId}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to deploy quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Menu</Link>
        <h1 style={styles.title}>Deploy Quiz Instance</h1>
        <p style={styles.subtitle}>Create a new instance of an existing quiz</p>
      </div>

      {error && (
        <div style={styles.errorBanner}>{error}</div>
      )}

      {success && (
        <div style={styles.successBanner}>{success}</div>
      )}

      <div style={styles.content}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Quiz Activity</label>
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
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

        <button
          onClick={handleDeploy}
          disabled={loading || !selectedActivity}
          style={styles.button}
        >
          {loading ? 'Deploying...' : '🚀 Deploy Instance'}
        </button>
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
    maxWidth: '800px',
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
    maxWidth: '800px',
    margin: '0 auto 20px',
    padding: '15px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '8px',
    border: '1px solid #fcc'
  },
  successBanner: {
    maxWidth: '800px',
    margin: '0 auto 20px',
    padding: '15px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    border: '1px solid #a7f3d0'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '25px'
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
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px'
  },
  textarea: {
    width: '100%',
    minHeight: '150px',
    padding: '12px',
    fontSize: '14px',
    fontFamily: 'monospace',
    border: '1px solid #ddd',
    borderRadius: '6px',
    resize: 'vertical' as const
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#5a9fd4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const
  },
  hint: {
    fontSize: '13px',
    color: '#666',
    marginTop: '8px',
    fontStyle: 'italic' as const
  }
};
  