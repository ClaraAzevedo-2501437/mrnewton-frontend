import React from 'react';
import { useQuizStore } from '../../state/quizSession';
import { ExerciseView } from './ExerciseView';
import { ResultsView } from './ResultsView';
import { QuizEvaluator } from '../../domain/evaluators/quizEvaluator';

export const QuizView: React.FC = () => {
  const {
    quiz,
    current_answers,
    attempts,
    is_approved,
    is_completed,
    current_attempt,
    max_retries,
    setAnswer,
    submitAttempt,
    retry,
    completeQuiz,
    error
  } = useQuizStore();

  if (!quiz) {
    return <div style={styles.loading}>Carregando questionário...</div>;
  }

  if (is_completed) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Questionário Concluído!</h2>
        <p style={styles.successMessage}>
          Os seus resultados foram guardados com sucesso.
        </p>
        <p>Pode agora fechar esta janela.</p>
      </div>
    );
  }

  // Show results only if we have attempts AND the current attempt has been submitted
  const currentAttemptSubmitted = attempts.some(a => a.attempt_index === current_attempt);
  const showResults = attempts.length > 0 && currentAttemptSubmitted;
  const showAnswers = quiz.show_answers_after_submission && showResults;
  const canRetry = QuizEvaluator.canRetry(current_attempt, max_retries, is_approved);

  return (
    <div style={styles.container}>
      {/* Quiz Header */}
      <div style={styles.header}>
        <h1>{quiz.title}</h1>
        <div style={styles.meta}>
          <span>Grade: {quiz.grade}</span>
          <span>|</span>
          <span>Module: {quiz.modules}</span>
          <span>|</span>
          <span>Time: {quiz.total_time_minutes} minutes</span>
          <span>|</span>
          <span>Attempt: {current_attempt} / {max_retries + 1}</span>
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Show Results or Quiz */}
      {showResults ? (
        <>
          <ResultsView
            attempts={attempts}
            isApproved={is_approved}
            approvalThreshold={quiz.approval_threshold || 50}
            canRetry={canRetry}
            showAnswers={showAnswers ?? false}
            onRetry={retry}
            onComplete={completeQuiz}
          />

          {/* Show exercises with correct answers if allowed */}
          {showAnswers && (
            <div style={styles.reviewSection}>
              <h3>Review Your Answers:</h3>
              {quiz.exercises.map(exercise => (
                <ExerciseView
                  key={exercise.id}
                  exercise={exercise}
                  answer={current_answers[exercise.id]}
                  onAnswerChange={() => {}}
                  showCorrectAnswer={true}
                  disabled={true}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Quiz Exercises */}
          <div style={styles.exercisesContainer}>
            {quiz.exercises.map((exercise, index) => (
              <div key={exercise.id}>
                <h3 style={styles.exerciseNumber}>Pergunta {index + 1}</h3>
                <ExerciseView
                  exercise={exercise}
                  answer={current_answers[exercise.id]}
                  onAnswerChange={(answer) => setAnswer(exercise.id, answer)}
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div style={styles.submitContainer}>
            <button onClick={submitAttempt} style={styles.submitButton}>
              Submeter Tentativa {current_attempt}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: '#ffffff'
  },
  loading: {
    textAlign: 'center' as const,
    padding: '50px',
    fontSize: '16px',
    color: '#666666'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0'
  },
  title: {
    marginBottom: '10px',
    color: '#000000',
    fontSize: '24px',
    fontWeight: 'normal' as const
  },
  meta: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    color: '#666666',
    fontSize: '13px',
    flexWrap: 'wrap' as const
  },
  error: {
    padding: '12px',
    marginBottom: '20px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    color: '#000000',
    fontSize: '14px'
  },
  exercisesContainer: {
    marginBottom: '30px'
  },
  exerciseNumber: {
    marginTop: '30px',
    marginBottom: '10px',
    color: '#000000',
    fontSize: '16px',
    fontWeight: 'normal' as const,
    borderTop: '1px solid #e0e0e0',
    paddingTop: '30px'
  },
  submitContainer: {
    textAlign: 'center' as const,
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #e0e0e0'
  },
  submitButton: {
    padding: '12px 32px',
    fontSize: '16px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: 'normal' as const
  },
  reviewSection: {
    marginTop: '40px',
    paddingTop: '30px',
    borderTop: '1px solid #e0e0e0'
  },
  successMessage: {
    color: '#666666',
    marginBottom: '20px',
    fontSize: '14px'
  }
};
