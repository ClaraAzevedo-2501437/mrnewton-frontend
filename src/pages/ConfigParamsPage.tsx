import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface ConfigParams {
  activities: any[];
}

export const ConfigParamsPage: React.FC = () => {
  const [config, setConfig] = useState<ConfigParams | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/activity-api/config');
      setConfig(response.data);
      setJsonInput(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      setError('Failed to load configuration parameters');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedConfig = JSON.parse(jsonInput);
      await axios.post('/activity-api/config', parsedConfig);
      await loadConfig();
      setMode('view');
      alert('Configuration updated successfully!');
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format');
      } else {
        setError('Failed to update configuration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Menu</Link>
        <h1 style={styles.title}>Configuration Parameters</h1>
        <p style={styles.subtitle}>View and manage system configuration</p>
      </div>

      {error && (
        <div style={styles.errorBanner}>{error}</div>
      )}

      <div style={styles.actions}>
        {mode === 'view' ? (
          <button onClick={() => setMode('edit')} style={styles.button}>
            Edit Configuration
          </button>
        ) : (
          <>
            <button onClick={handleUpdate} style={styles.button} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => { setMode('view'); setJsonInput(JSON.stringify(config, null, 2)); }} style={styles.cancelButton}>
              Cancel
            </button>
          </>
        )}
        <button onClick={loadConfig} style={styles.refreshButton} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {loading && !config ? (
        <div style={styles.loadingContainer}>Loading configuration...</div>
      ) : (
        <div style={styles.content}>
          {mode === 'view' ? (
            <pre style={styles.codeBlock}>{jsonInput}</pre>
          ) : (
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              style={styles.textarea}
            />
          )}
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
  actions: {
    maxWidth: '1200px',
    margin: '0 auto 20px',
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#5a9fd4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  loadingContainer: {
    maxWidth: '1200px',
    margin: '40px auto',
    textAlign: 'center' as const,
    color: '#666'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '14px',
    fontFamily: 'monospace',
    lineHeight: '1.5'
  },
  textarea: {
    width: '100%',
    minHeight: '400px',
    padding: '15px',
    fontSize: '14px',
    fontFamily: 'monospace',
    border: '1px solid #ddd',
    borderRadius: '6px',
    resize: 'vertical' as const
  }
};
