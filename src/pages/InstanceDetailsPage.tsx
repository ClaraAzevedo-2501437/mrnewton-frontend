import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface InstanceDetails {
  instance_id: string;
  activity_id: string;
  config_schema?: any;
  created_at?: string;
  [key: string]: any;
}

export const InstanceDetailsPage: React.FC = () => {
  const [instanceId, setInstanceId] = useState('');
  const [details, setDetails] = useState<InstanceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!instanceId.trim()) {
      setError('Please enter an instance ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/activity-api/deploy/${instanceId}`);
      setDetails(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch instance details');
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Menu</Link>
        <h1 style={styles.title}>Get Instance Details</h1>
        <p style={styles.subtitle}>View details of a specific quiz instance</p>
      </div>

      <div style={styles.content}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Instance ID</label>
          <input
            type="text"
            value={instanceId}
            onChange={(e) => setInstanceId(e.target.value)}
            placeholder="Enter instance ID"
            style={styles.input}
          />
        </div>

        <button
          onClick={handleFetch}
          disabled={loading || !instanceId.trim()}
          style={styles.button}
        >
          {loading ? 'Loading...' : '🔍 Get Details'}
        </button>

        {error && (
          <div style={styles.errorBanner}>{error}</div>
        )}

        {details && (
          <div style={styles.detailsCard}>
            <h2 style={styles.cardTitle}>Instance Details</h2>
            <div style={styles.detailsGrid}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Instance ID:</span>
                <span style={styles.detailValue}>{details.instance_id}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Activity ID:</span>
                <span style={styles.detailValue}>{details.activity_id}</span>
              </div>
              {details.created_at && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Created At:</span>
                  <span style={styles.detailValue}>{new Date(details.created_at).toLocaleString()}</span>
                </div>
              )}
              {details.expires_at && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Expires At:</span>
                  <span style={styles.detailValue}>{new Date(details.expires_at).toLocaleString()}</span>
                </div>
              )}
              {details.config_schema && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Config Schema:</span>
                  <pre style={styles.jsonPre}>{JSON.stringify(details.config_schema, null, 2)}</pre>
                </div>
              )}
              {Object.entries(details).map(([key, value]) => {
                if (['instance_id', 'activity_id', 'created_at', 'expires_at', 'config_schema'].includes(key)) {
                  return null;
                }
                return (
                  <div key={key} style={styles.detailRow}>
                    <span style={styles.detailLabel}>{key}:</span>
                    <span style={styles.detailValue}>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center' as const
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '15px',
    color: '#5a9fd4',
    textDecoration: 'none',
    fontSize: '14px'
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
  content: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px'
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
    fontWeight: 'bold' as const,
    marginBottom: '20px'
  },
  errorBanner: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '6px',
    marginTop: '20px',
    border: '1px solid #f5c6cb'
  },
  detailsCard: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  },
  cardTitle: {
    fontSize: '20px',
    color: '#2c3e50',
    marginBottom: '20px',
    borderBottom: '2px solid #5a9fd4',
    paddingBottom: '10px'
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px'
  },
  detailLabel: {
    fontWeight: 'bold' as const,
    color: '#495057',
    fontSize: '14px'
  },
  detailValue: {
    color: '#212529',
    fontSize: '14px',
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #dee2e6'
  },
  jsonPre: {
    color: '#212529',
    fontSize: '13px',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
    overflow: 'auto',
    fontFamily: 'monospace'
  }
};
