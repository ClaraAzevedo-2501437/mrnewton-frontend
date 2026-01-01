import React from 'react';
import { AttemptResult } from '../../domain/models/Quiz';
import { QuizEvaluator } from '../../domain/evaluators/quizEvaluator';

interface ResultsViewProps {
  attempts: AttemptResult[];
  isApproved: boolean;
  approvalThreshold: number;
  canRetry: boolean;
  showAnswers: boolean;
  onRetry: () => void;
  onComplete: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  attempts,
  isApproved,
  approvalThreshold,
  canRetry,
  showAnswers,
  onRetry,
  onComplete
}) => {
  const bestAttempt = QuizEvaluator.getBestAttempt(attempts);
  const lastAttempt = attempts[attempts.length - 1];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Quiz Results</h2>

      {/* Last Attempt Result */}
      <div style={{
        ...styles.resultCard,
        ...(isApproved ? styles.approvedCard : styles.notApprovedCard)
      }}>
        <h3>Attempt {lastAttempt.attempt_index} Result</h3>
        <div style={styles.score}>
          <span style={styles.scoreValue}>{lastAttempt.result.toFixed(1)}%</span>
        </div>
        <div style={styles.status}>
          {isApproved ? (
            <span style={styles.approved}>✓ APPROVED</span>
          ) : (
            <span style={styles.notApproved}>✗ Not Approved (Threshold: {approvalThreshold}%)</span>
          )}
        </div>
      </div>

      {/* Best Attempt */}
      {attempts.length > 1 && bestAttempt && (
        <div style={styles.bestAttempt}>
          <p><strong>Best Attempt:</strong> Attempt {bestAttempt.attempt_index} with {bestAttempt.result.toFixed(1)}%</p>
        </div>
      )}

      {/* Attempt History */}
      <div style={styles.history}>
        <h4>Attempt History:</h4>
        {attempts.map((attempt, index) => (
          <div key={index} style={styles.historyItem}>
            <span><strong>Attempt {attempt.attempt_index}:</strong></span>
            <span>{attempt.result.toFixed(1)}%</span>
            <span style={styles.timestamp}>
              {new Date(attempt.submitted_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {canRetry && !isApproved && (
          <button onClick={onRetry} style={styles.retryButton}>
            Try Again
          </button>
        )}
        <button onClick={onComplete} style={styles.completeButton}>
          {isApproved ? 'Finish Quiz' : 'End Quiz'}
        </button>
      </div>

      {!showAnswers && (
        <p style={styles.info}>
          Note: Correct answers are hidden according to quiz settings.
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  title: {
    textAlign: 'center' as const,
    color: '#333',
    marginBottom: '30px'
  },
  resultCard: {
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center' as const
  },
  approvedCard: {
    backgroundColor: '#e8f5e9',
    border: '2px solid #4CAF50'
  },
  notApprovedCard: {
    backgroundColor: '#ffebee',
    border: '2px solid #f44336'
  },
  score: {
    margin: '20px 0'
  },
  scoreValue: {
    fontSize: '48px',
    fontWeight: 'bold' as const,
    color: '#333'
  },
  status: {
    fontSize: '20px',
    marginTop: '10px'
  },
  approved: {
    color: '#4CAF50',
    fontWeight: 'bold' as const
  },
  notApproved: {
    color: '#f44336',
    fontWeight: 'bold' as const
  },
  bestAttempt: {
    padding: '15px',
    backgroundColor: '#fff3e0',
    borderLeft: '4px solid #ff9800',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  history: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ddd'
  },
  timestamp: {
    fontSize: '12px',
    color: '#666'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '30px'
  },
  retryButton: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const
  },
  completeButton: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const
  },
  info: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '14px',
    marginTop: '20px',
    fontStyle: 'italic' as const
  }
};
