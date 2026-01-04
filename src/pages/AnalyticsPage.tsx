import React, { useState } from 'react';
import { Dashboard } from '../components/analytics/Dashboard';

export const AnalyticsPage: React.FC = () => {
  const [activityId, setActivityId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [filterType, setFilterType] = useState<'activity' | 'student' | 'all'>('all');

  const getFilterParams = () => {
    switch (filterType) {
      case 'activity':
        return { activityId, studentId: undefined };
      case 'student':
        return { activityId: undefined, studentId };
      case 'all':
      default:
        return {};
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterSection}>
        <h2 style={styles.filterTitle}>Filter Analytics</h2>
        
        <div style={styles.filterOptions}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="all"
              checked={filterType === 'all'}
              onChange={() => setFilterType('all')}
            />
            <span>All Data</span>
          </label>
          
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="activity"
              checked={filterType === 'activity'}
              onChange={() => setFilterType('activity')}
            />
            <span>By Activity</span>
          </label>
          
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="student"
              checked={filterType === 'student'}
              onChange={() => setFilterType('student')}
            />
            <span>By Student</span>
          </label>
        </div>

        {filterType === 'activity' && (
          <input
            type="text"
            placeholder="Activity ID"
            value={activityId}
            onChange={(e) => setActivityId(e.target.value)}
            style={styles.input}
          />
        )}

        {filterType === 'student' && (
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={styles.input}
          />
        )}
      </div>

      <Dashboard {...getFilterParams()} />
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    padding: '20px'
  },
  filterSection: {
    maxWidth: '1200px',
    margin: '0 auto 30px',
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '2px'
  },
  filterTitle: {
    marginBottom: '15px',
    color: '#000000',
    fontSize: '18px',
    fontWeight: 'normal' as const
  },
  filterOptions: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    backgroundColor: '#ffffff'
  }
};
