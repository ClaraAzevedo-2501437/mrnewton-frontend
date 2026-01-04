import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../state/quizSession';
import { QuizView } from '../components/quiz/QuizView';
import { activityApi } from '../api/activityApi';

export const TakeQuizPage: React.FC = () => {
  const { activityId, instanceId } = useParams<{ activityId?: string; instanceId?: string }>();
  const navigate = useNavigate();
  const { initializeQuiz, loading, error, reset } = useQuizStore();
  const [studentId, setStudentId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [resolvedActivityId, setResolvedActivityId] = useState<string | null>(null);
  const [instanceLoading, setInstanceLoading] = useState(false);
  const [instanceError, setInstanceError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    const fetchInstanceDetails = async () => {
      if (instanceId) {
        try {
          setInstanceLoading(true);
          setInstanceError(null);
          const instanceDetails = await activityApi.getInstanceDetails(instanceId);
          setResolvedActivityId(instanceDetails.activity_id);
        } catch (err: any) {
          setInstanceError(err.response?.data?.message || 'Failed to load quiz instance');
        } finally {
          setInstanceLoading(false);
        }
      } else if (activityId) {
        setResolvedActivityId(activityId);
      }
    };

    fetchInstanceDetails();
  }, [instanceId, activityId]);

  const handleStart = async () => {
    if (!resolvedActivityId || !studentId) {
      alert('Por favor, insira o seu número de aluno');
      return;
    }

    await initializeQuiz(resolvedActivityId, studentId);
    setIsInitialized(true);
  };

  if (instanceLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Carregando questionário...</div>
      </div>
    );
  }

  if (instanceError) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{instanceError}</div>
        <button onClick={() => navigate('/')} style={styles.backButton}>Voltar</button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div style={styles.container}>
        <div style={styles.startCard}>
          <h1 style={styles.title}>Iniciar Questionário</h1>
          <p style={styles.instruction}>Por favor, insira o seu número de aluno para começar</p>
          
          <input
            type="text"
            placeholder="Número de Aluno"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          />

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.actions}>
            <button onClick={handleStart} disabled={loading} style={styles.startButton}>
              {loading ? 'Carregando...' : 'Iniciar Questionário'}
            </button>
            <button onClick={() => navigate('/')} style={styles.backButton}>
              Voltar
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
    backgroundColor: '#ffffff',
    padding: '20px'
  },
  startCard: {
    maxWidth: '500px',
    width: '100%',
    padding: '40px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px'
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '10px',
    color: '#000000',
    fontSize: '24px',
    fontWeight: 'normal' as const
  },
  instruction: {
    textAlign: 'center' as const,
    color: '#666666',
    marginBottom: '30px',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    marginBottom: '20px',
    boxSizing: 'border-box' as const,
    backgroundColor: '#ffffff'
  },
  error: {
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    color: '#000000',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  },
  startButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: 'normal' as const
  },
  backButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: 'normal' as const
  }
};
