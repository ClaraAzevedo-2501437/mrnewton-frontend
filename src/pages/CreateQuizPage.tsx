import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Exercise {
  exercise_id: string;
  question: string;
  type: string;
  options?: string[];
  correct_answer?: string;
}

interface QuizForm {
  activity_id: string;
  title: string;
  description: string;
  exercises: Exercise[];
}

export const CreateQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [quizForm, setQuizForm] = useState<QuizForm>({
    activity_id: '',
    title: '',
    description: '',
    exercises: []
  });

  const addExercise = () => {
    setQuizForm({
      ...quizForm,
      exercises: [
        ...quizForm.exercises,
        {
          exercise_id: `exercise_${quizForm.exercises.length + 1}`,
          question: '',
          type: 'multiple_choice',
          options: ['', '', '', ''],
          correct_answer: ''
        }
      ]
    });
  };

  const removeExercise = (index: number) => {
    setQuizForm({
      ...quizForm,
      exercises: quizForm.exercises.filter((_, i) => i !== index)
    });
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const updatedExercises = [...quizForm.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setQuizForm({ ...quizForm, exercises: updatedExercises });
  };

  const updateExerciseOption = (exerciseIndex: number, optionIndex: number, value: string) => {
    const updatedExercises = [...quizForm.exercises];
    const options = [...(updatedExercises[exerciseIndex].options || [])];
    options[optionIndex] = value;
    updatedExercises[exerciseIndex].options = options;
    setQuizForm({ ...quizForm, exercises: updatedExercises });
  };

  const handleSubmit = async () => {
    if (!quizForm.activity_id || !quizForm.title || quizForm.exercises.length === 0) {
      setError('Please fill in all required fields and add at least one exercise');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get existing config and add new activity
      const configResponse = await axios.get('/activity-api/config');
      const existingActivities = configResponse.data.activities || [];
      
      await axios.post('/activity-api/config', {
        activities: [...existingActivities, quizForm]
      });
      
      alert('Quiz created successfully!');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Menu</Link>
        <h1 style={styles.title}>Create Quiz</h1>
        <p style={styles.subtitle}>Define a new quiz activity configuration</p>
      </div>

      {error && (
        <div style={styles.errorBanner}>{error}</div>
      )}

      <div style={styles.content}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quiz Information</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Activity ID *</label>
            <input
              type="text"
              value={quizForm.activity_id}
              onChange={(e) => setQuizForm({ ...quizForm, activity_id: e.target.value })}
              placeholder="e.g., quiz_001"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              value={quizForm.title}
              onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
              placeholder="e.g., Math Quiz - Week 1"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={quizForm.description}
              onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
              placeholder="Brief description of the quiz"
              style={styles.textareaSmall}
            />
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Exercises</h3>
            <button onClick={addExercise} style={styles.addButton}>
              + Add Exercise
            </button>
          </div>

          {quizForm.exercises.length === 0 && (
            <p style={styles.hint}>No exercises yet. Click "Add Exercise" to get started.</p>
          )}

          {quizForm.exercises.map((exercise, index) => (
            <div key={index} style={styles.exerciseCard}>
              <div style={styles.exerciseHeader}>
                <h4 style={styles.exerciseTitle}>Exercise {index + 1}</h4>
                <button
                  onClick={() => removeExercise(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Exercise ID</label>
                <input
                  type="text"
                  value={exercise.exercise_id}
                  onChange={(e) => updateExercise(index, 'exercise_id', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Question *</label>
                <textarea
                  value={exercise.question}
                  onChange={(e) => updateExercise(index, 'question', e.target.value)}
                  placeholder="Enter the question"
                  style={styles.textareaSmall}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Type</label>
                <select
                  value={exercise.type}
                  onChange={(e) => updateExercise(index, 'type', e.target.value)}
                  style={styles.select}
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>

              {exercise.type === 'multiple_choice' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Options</label>
                    {exercise.options?.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        type="text"
                        value={option}
                        onChange={(e) => updateExerciseOption(index, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        style={{ ...styles.input, marginBottom: '8px' }}
                      />
                    ))}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Correct Answer</label>
                    <select
                      value={exercise.correct_answer}
                      onChange={(e) => updateExercise(index, 'correct_answer', e.target.value)}
                      style={styles.select}
                    >
                      <option value="">-- Select correct answer --</option>
                      {exercise.options?.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option || `Option ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => navigate('/')}
            style={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? 'Creating...' : '✓ Create Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    padding: '40px 20px'
  },
  header: {
    maxWidth: '1000px',
    margin: '0 auto 40px',
    textAlign: 'center' as const
  },
  backLink: {
    display: 'inline-block',
    color: '#5a9fd4',
    textDecoration: 'none',
    fontSize: '14px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666'
  },
  errorBanner: {
    maxWidth: '1000px',
    margin: '0 auto 20px',
    padding: '15px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '8px',
    border: '1px solid #fcc'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    margin: 0
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box' as const
  },
  textareaSmall: {
    width: '100%',
    minHeight: '100px',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    boxSizing: 'border-box' as const
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  exerciseCard: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px'
  },
  exerciseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #e0e0e0'
  },
  exerciseTitle: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    margin: 0
  },
  removeButton: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  hint: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center' as const,
    padding: '20px'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    marginTop: '30px'
  },
  cancelButton: {
    padding: '12px 30px',
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  submitButton: {
    padding: '12px 30px',
    backgroundColor: '#5a9fd4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const
  }
};
