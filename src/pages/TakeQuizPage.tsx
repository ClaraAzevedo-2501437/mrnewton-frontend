import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../state/quizSession';
import { QuizView } from '../components/quiz/QuizView';

export const TakeQuizPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { initializeQuiz, loading, error, reset } = useQuizStore();
  const [studentId, setStudentId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const handleStart = async () => {
    if (!activityId || !studentId) {
      alert('Please enter your student ID');
      return;
    }

    await initializeQuiz(activityId, studentId);
    setIsInitialized(true);
  };

  if (!isInitialized) {
    return (
      <div style={styles.container}>
        <div style={styles.startCard}>
          <h1 style={styles.title}>Start Quiz</h1>
          <p style={styles.instruction}>Please enter your student ID to begin</p>
          
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          />

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.actions}>
            <button onClick={handleStart} disabled={loading} style={styles.startButton}>
              {loading ? 'Loading...' : 'Start Quiz'}
            </button>
            <button onClick={() => navigate('/')} style={styles.backButton}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <QuizView />;
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  startCard: {
    maxWidth: '500px',
    width: '100%',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '10px',
    color: '#333'
  },
  instruction: {
    textAlign: 'center' as const,
    color: '#666',
    marginBottom: '30px'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '20px',
    boxSizing: 'border-box' as const
  },
  error: {
    padding: '10px',
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: '4px',
    color: '#c62828',
    marginBottom: '20px',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  startButton: {
    padding: '15px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const
  },
  backButton: {
    padding: '12px',
    fontSize: '14px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
