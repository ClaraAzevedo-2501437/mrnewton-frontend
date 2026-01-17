import React from 'react';
import { StudentMetrics } from '../../api/analytics';

interface StudentMetricsTableProps {
  students: StudentMetrics[];
  selectedMetrics?: string[];
  onStudentClick?: (studentId: string) => void;
}

export const StudentMetricsTable: React.FC<StudentMetricsTableProps> = ({ 
  students,
  selectedMetrics = [],
  onStudentClick 
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatScore = (score: number): string => {
    return `${(score * 100).toFixed(1)}%`;
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <span style={{
        ...styles.badge,
        backgroundColor: success ? '#d1fae5' : '#fee2e2',
        color: success ? '#065f46' : '#991b1b',
      }}>
        {success ? '✓ Passed' : '✗ Failed'}
      </span>
    );
  };

  // Define all possible columns with their IDs
  const allColumns = [
    { id: 'total_attempts', header: 'Attempts', render: (s: StudentMetrics) => s.metrics.total_attempts },
    { id: 'total_time', header: 'Total Time', render: (s: StudentMetrics) => formatTime(s.metrics.total_time_seconds) },
    { id: 'correct_answers', header: 'Correct Answers', render: (s: StudentMetrics) => s.metrics.number_of_correct_answers },
    { id: 'final_score', header: 'Final Score', render: (s: StudentMetrics) => formatScore(s.metrics.final_score) },
    { id: 'activity_success', header: 'Status', render: (s: StudentMetrics) => getStatusBadge(s.metrics.activity_success) },
  ];

  // Filter columns based on selection (show all if none selected)
  const columnsToShow = selectedMetrics.length > 0
    ? allColumns.filter(col => selectedMetrics.includes(col.id))
    : allColumns;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Student Performance</h2>
        <div style={styles.stats}>
          <span style={styles.statItem}>
            <strong>Total Students:</strong> {students.length}
          </span>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Student ID</th>
              {columnsToShow.map(col => (
                <th key={col.id} style={styles.th}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr 
                key={student.student_id}
                style={{
                  ...styles.row,
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white',
                }}
                onClick={() => onStudentClick?.(student.student_id)}
              >
                <td style={styles.td}>
                  <strong style={styles.studentId}>{student.student_id}</strong>
                </td>
                {columnsToShow.map(col => (
                  <td key={col.id} style={styles.td}>
                    {col.render(student)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div style={styles.emptyState}>
          <p>No student data available for this quiz instance.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  header: {
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
  } as React.CSSProperties,
  
  headerTitle: {
    margin: '0 0 12px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e293b',
  } as React.CSSProperties,
  
  stats: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  
  statItem: {
    fontSize: '14px',
    color: '#64748b',
  } as React.CSSProperties,
  
  tableContainer: {
    overflowX: 'auto',
  } as React.CSSProperties,
  
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  } as React.CSSProperties,
  
  headerRow: {
    backgroundColor: '#f1f5f9',
  } as React.CSSProperties,
  
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  
  row: {
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  } as React.CSSProperties,
  
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#334155',
    borderTop: '1px solid #e2e8f0',
  } as React.CSSProperties,
  
  studentId: {
    color: '#3b82f6',
    fontWeight: 600,
  } as React.CSSProperties,
  
  scoreCell: {
    fontWeight: 600,
    fontSize: '16px',
  } as React.CSSProperties,
  
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  } as React.CSSProperties,
  
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: '#94a3b8',
  } as React.CSSProperties,
};
