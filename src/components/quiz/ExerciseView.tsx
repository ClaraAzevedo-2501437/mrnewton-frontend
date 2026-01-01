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
  const [rationale, setRationale] = useState<string>(answer?.rationale || '');

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    onAnswerChange({
      exercise_id: exercise.id,
      selected_option: option,
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
          <strong>Correct Answer:</strong> {exercise.correct_options} - {exercise.correct_answer}
        </div>
      )}

      <div className="rationale" style={styles.rationaleContainer}>
        <label style={styles.label}>
          <strong>Explain your reasoning:</strong>
        </label>
        <textarea
          value={rationale}
          onChange={handleRationaleChange}
          placeholder="Explain why you chose this answer..."
          disabled={disabled}
          rows={3}
          style={styles.textarea}
        />
      </div>

      {answer?.is_correct !== undefined && (
        <div style={answer.is_correct ? styles.correct : styles.incorrect}>
          {answer.is_correct ? '✓ Correct' : '✗ Incorrect'}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#fff'
  },
  question: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#333'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBottom: '15px'
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#fafafa'
  },
  selectedOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9'
  },
  correctOption: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd'
  },
  disabledOption: {
    cursor: 'not-allowed',
    opacity: 0.7
  },
  radio: {
    marginRight: '10px',
    cursor: 'pointer'
  },
  rationaleContainer: {
    marginTop: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const
  },
  correctAnswer: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#e3f2fd',
    borderLeft: '4px solid #2196F3',
    borderRadius: '4px'
  },
  correct: {
    marginTop: '10px',
    padding: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '4px',
    fontWeight: 'bold' as const
  },
  incorrect: {
    marginTop: '10px',
    padding: '8px',
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: '4px',
    fontWeight: 'bold' as const
  }
};
