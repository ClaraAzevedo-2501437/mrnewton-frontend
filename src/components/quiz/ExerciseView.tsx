import React, { useState } from 'react';
import { Exercise, StudentAnswer } from '../../domain/models/Quiz';

interface ExerciseViewProps {
  exercise: Exercise;
  answer: StudentAnswer | undefined;
  onAnswerChange: (answer: StudentAnswer) => void;
  showCorrectAnswer?: boolean;
  disabled?: boolean;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  exercise,
  answer,
  onAnswerChange,
  showCorrectAnswer = false,
  disabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(answer?.selected_option || '');
  const [studentAnswer, setStudentAnswer] = useState<string>(answer?.student_answer || '');
  const [rationale, setRationale] = useState<string>(answer?.rationale || '');

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    onAnswerChange({
      exercise_id: exercise.id,
      selected_option: option,
      student_answer: studentAnswer,
      rationale,
      is_correct: answer?.is_correct
    });
  };

  const handleStudentAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = e.target.value;
    setStudentAnswer(newAnswer);
    onAnswerChange({
      exercise_id: exercise.id,
      selected_option: selectedOption,
      student_answer: newAnswer,
      rationale,
      is_correct: answer?.is_correct
    });
  };

  const handleRationaleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newRationale = e.target.value;
    setRationale(newRationale);
    onAnswerChange({
      exercise_id: exercise.id,
      selected_option: selectedOption,
      student_answer: studentAnswer,
      rationale: newRationale,
      is_correct: answer?.is_correct
    });
  };

  const getOptionLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  return (
    <div className="exercise-container" style={styles.container}>
      <h3 style={styles.question}>{exercise.question}</h3>
      
      <div className="options" style={styles.optionsContainer}>
        {exercise.options.map((option, index) => {
          const optionLabel = getOptionLabel(index);
          const isSelected = selectedOption === optionLabel;
          const isCorrect = showCorrectAnswer && optionLabel === exercise.correct_options;
          
          return (
            <label 
              key={optionLabel}
              style={{
                ...styles.option,
                ...(isSelected ? styles.selectedOption : {}),
                ...(isCorrect ? styles.correctOption : {}),
                ...(disabled ? styles.disabledOption : {})
              }}
            >
              <input
                type="radio"
                name={`exercise-${exercise.id}`}
                value={optionLabel}
                checked={isSelected}
                onChange={() => handleOptionChange(optionLabel)}
                disabled={disabled}
                style={styles.radio}
              />
              <span><strong>{optionLabel}:</strong> {option}</span>
            </label>
          );
        })}
      </div>

      {showCorrectAnswer && (
        <div style={styles.correctAnswer}>
          <strong>Resposta Correta:</strong> {exercise.correct_options} - {exercise.correct_answer}
        </div>
      )}

      <div className="answer-input" style={styles.answerContainer}>
        <label style={styles.label}>
          <strong>Resposta:</strong>
        </label>
        <input
          type="text"
          value={studentAnswer}
          onChange={handleStudentAnswerChange}
          placeholder="Insira a sua resposta numérica..."
          disabled={disabled}
          style={styles.input}
        />
      </div>

      <div className="rationale" style={styles.rationaleContainer}>
        <label style={styles.label}>
          <strong>Justificação:</strong>
        </label>
        <textarea
          value={rationale}
          onChange={handleRationaleChange}
          placeholder="Explique o seu raciocínio e como chegou a esta resposta..."
          disabled={disabled}
          rows={4}
          style={styles.textarea}
        />
      </div>

      {answer?.is_correct !== undefined && (
        <div style={answer.is_correct ? styles.correct : styles.incorrect}>
          {answer.is_correct ? '✓ Correto' : '✗ Incorreto'}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: '#ffffff'
  },
  question: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#000000',
    fontWeight: 'normal' as const,
    lineHeight: '1.5'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '20px'
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s'
  },
  selectedOption: {
    borderColor: '#000000',
    backgroundColor: '#f5f5f5'
  },
  correctOption: {
    borderColor: '#000000',
    backgroundColor: '#f9f9f9'
  },
  disabledOption: {
    cursor: 'not-allowed',
    opacity: 0.6
  },
  radio: {
    marginRight: '10px',
    cursor: 'pointer'
  },
  answerContainer: {
    marginBottom: '15px'
  },
  rationaleContainer: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#000000',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    fontSize: '14px',
    boxSizing: 'border-box' as const
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    backgroundColor: '#ffffff',
    lineHeight: '1.5'
  },
  correctAnswer: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    fontSize: '14px'
  },
  correct: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '2px',
    fontSize: '13px'
  },
  incorrect: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#666666',
    color: '#ffffff',
    borderRadius: '2px',
    fontSize: '13px'
  }
};
