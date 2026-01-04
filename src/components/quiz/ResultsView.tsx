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
      <h2 style={styles.title}>Resultados do Questionário</h2>

      {/* Last Attempt Result */}
      <div style={{
        ...styles.resultCard,
        ...(isApproved ? styles.approvedCard : styles.notApprovedCard)
      }}>
        <h3>Resultado da Tentativa {lastAttempt.attempt_index}</h3>
        <div style={styles.score}>
          <span style={styles.scoreValue}>{lastAttempt.result.toFixed(1)}%</span>
        </div>
        <div style={styles.status}>
          {isApproved ? (
            <span style={styles.approved}>✓ APROVADO</span>
          ) : (
            <span style={styles.notApproved}>✗ Não Aprovado (Limite: {approvalThreshold}%)</span>
          )}
        </div>
      </div>

      {/* Best Attempt */}
      {attempts.length > 1 && bestAttempt && (
        <div style={styles.bestAttempt}>
          <p><strong>Melhor Tentativa:</strong> Tentativa {bestAttempt.attempt_index} com {bestAttempt.result.toFixed(1)}%</p>
        </div>
      )}

      {/* Attempt History */}
      <div style={styles.history}>
        <h4>Histórico de Tentativas:</h4>
        {attempts.map((attempt, index) => (
          <div key={index} style={styles.historyItem}>
            <span><strong>Tentativa {attempt.attempt_index}:</strong></span>
            <span>{attempt.result.toFixed(1)}%</span>
            <span style={styles.timestamp}>
              {new Date(attempt.submitted_at).toLocaleString('pt-PT')}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {canRetry && !isApproved && (
          <button onClick={onRetry} style={styles.retryButton}>
            Tentar Novamente
          </button>
        )}
        <button onClick={onComplete} style={styles.completeButton}>
          {isApproved ? 'Concluir Questionário' : 'Terminar Questionário'}
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
    color: '#000000',
    marginBottom: '30px',
    fontSize: '20px',
    fontWeight: 'normal' as const
  },
  resultCard: {
    padding: '30px',
    borderRadius: '2px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    border: '1px solid #cccccc',
    backgroundColor: '#ffffff'
  },
  approvedCard: {
    backgroundColor: '#f5f5f5',
    border: '1px solid #000000'
  },
  notApprovedCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #cccccc'
  },
  score: {
    margin: '20px 0'
  },
  scoreValue: {
    fontSize: '48px',
    fontWeight: 'normal' as const,
    color: '#000000'
  },
  status: {
    fontSize: '16px',
    marginTop: '10px'
  },
  approved: {
    color: '#000000'
  },
  notApproved: {
    color: '#666666'
  },
  bestAttempt: {
    padding: '15px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  history: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '2px'
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '14px'
  },
  timestamp: {
    fontSize: '12px',
    color: '#666666'
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
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: 'normal' as const
  },
  completeButton: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: 'normal' as const
  },
  info: {
    textAlign: 'center' as const,
    color: '#666666',
    fontSize: '13px',
    marginTop: '20px'
  }
};
