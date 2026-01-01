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
    return <div style={styles.loading}>Loading quiz...</div>;
  }

  if (is_completed) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Quiz Completed!</h2>
        <p style={styles.successMessage}>
          Your results have been saved successfully.
        </p>
        <p>You can now close this window.</p>
      </div>
    );
  }

  const showResults = attempts.length > 0;
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
                <h3 style={styles.exerciseNumber}>Question {index + 1}</h3>
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
              Submit Attempt {current_attempt}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px'
  },
  loading: {
    textAlign: 'center' as const,
    padding: '50px',
    fontSize: '18px'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  title: {
    marginBottom: '10px',
    color: '#333'
  },
  meta: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    color: '#666',
    fontSize: '14px'
  },
  error: {
    padding: '15px',
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: '4px',
    marginBottom: '20px',
    color: '#c62828'
  },
  exercisesContainer: {
    marginBottom: '30px'
  },
  exerciseNumber: {
    marginTop: '20px',
    marginBottom: '10px',
    color: '#555'
  },
  submitContainer: {
    textAlign: 'center' as const,
    marginTop: '30px'
  },
  submitButton: {
    padding: '15px 40px',
    fontSize: '18px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold' as const
  },
  reviewSection: {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '2px solid #ddd'
  },
  successMessage: {
    fontSize: '18px',
    color: '#4CAF50',
    marginBottom: '20px'
  }
};
