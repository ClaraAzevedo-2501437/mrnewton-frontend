import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Submission {
  studentId: string;
  activityId: string;
  instanceId: string;
  attempts: any[];
  submittedAt: string;
}

export const SubmissionsPage: React.FC = () => {
  const [instanceId, setInstanceId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'all' | 'student'>('all');

  const loadAllSubmissions = async () => {
    if (!instanceId.trim()) {
      setError('Please enter an instance ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/activity-api/submissions/instance/${instanceId}`);
      setSubmissions(response.data.submissions || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentSubmission = async () => {
    if (!instanceId.trim() || !studentId.trim()) {
      setError('Please enter both instance ID and student ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/activity-api/submissions/instance/${instanceId}/student/${studentId}`);
      setSubmissions([response.data]);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load submission');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (mode === 'all') {
      loadAllSubmissions();
    } else {
      loadStudentSubmission();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Menu</Link>
        <h1 style={styles.title}>View Submissions</h1>
        <p style={styles.subtitle}>View quiz submissions by instance or student</p>
      </div>

      {error && (
        <div style={styles.errorBanner}>{error}</div>
      )}

      <div style={styles.content}>
        <div style={styles.modeSelector}>
          <button 
            onClick={() => setMode('all')} 
            style={mode === 'all' ? styles.activeTab : styles.tab}
          >
            All Submissions
          </button>
          <button 
            onClick={() => setMode('student')} 
            style={mode === 'student' ? styles.activeTab : styles.tab}
          >
            Student Submission
          </button>
        </div>

        <div style={styles.searchForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Instance ID</label>
            <input
              type="text"
              value={instanceId}
              onChange={(e) => setInstanceId(e.target.value)}
              placeholder="e.g., inst_abc123"
              style={styles.input}
            />
          </div>

          {mode === 'student' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g., student-001"
                style={styles.input}
              />
            </div>
          )}

          <button onClick={handleSearch} disabled={loading} style={styles.button}>
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
        </div>

        {submissions.length > 0 && (
          <div style={styles.results}>
            <h3 style={styles.sectionTitle}>
              {submissions.length} Submission{submissions.length !== 1 ? 's' : ''} Found
            </h3>
            {submissions.map((submission, index) => (
              <div key={index} style={styles.submissionCard}>
                <div style={styles.cardHeader}>
                  <strong>Student:</strong> {submission.studentId}
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Instance ID:</span>
                    <span>{submission.instanceId}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Activity ID:</span>
                    <span>{submission.activityId}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Attempts:</span>
                    <span>{submission.attempts?.length || 0}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Submitted At:</span>
                    <span>{new Date(submission.submittedAt).toLocaleString()}</span>
                  </div>
                </div>
                <details style={styles.details}>
                  <summary style={styles.summary}>View Full Data</summary>
                  <pre style={styles.codeBlock}>
                    {JSON.stringify(submission, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}

        {!loading && submissions.length === 0 && instanceId && (
          <div style={styles.emptyState}>
            <p>No submissions found.</p>
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
  modeSelector: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: '8px 8px 0 0',
    borderBottom: '2px solid #e0e0e0',
    overflow: 'hidden'
  },
  tab: {
    flex: 1,
    padding: '15px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666'
  },
  activeTab: {
    flex: 1,
    padding: '15px',
    backgroundColor: 'white',
    border: 'none',
    borderBottom: '3px solid #5a9fd4',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#5a9fd4',
    fontWeight: 'bold' as const
  },
  searchForm: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    marginBottom: '8px'
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
    padding: '12px',
    backgroundColor: '#5a9fd4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    marginTop: '10px'
  },
  results: {
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
  submissionCard: {
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
    fontSize: '14px',
    marginBottom: '10px'
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
  },
  details: {
    marginTop: '10px'
  },
  summary: {
    cursor: 'pointer',
    color: '#5a9fd4',
    fontSize: '14px',
    padding: '5px 0'
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '12px',
    fontFamily: 'monospace',
    marginTop: '10px',
    maxHeight: '400px'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '8px',
    color: '#666'
  }
};
