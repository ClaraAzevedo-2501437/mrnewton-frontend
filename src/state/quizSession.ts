import { create } from 'zustand';
import { QuizSession, StudentAnswer, AttemptResult, Exercise } from '../domain/models/Quiz';
import { QuizEvaluator } from '../domain/evaluators/quizEvaluator';
import { activityApi } from '../api/activityApi';

interface QuizStore extends QuizSession {
  loading: boolean;
  error: string | null;
  
  // Actions
  initializeQuiz: (activityId: string, studentId: string) => Promise<void>;
  setAnswer: (exerciseId: string, answer: StudentAnswer) => void;
  submitAttempt: () => void;
  retry: () => void;
  completeQuiz: () => Promise<void>;
  reset: () => void;
}

const initialState: Omit<QuizStore, keyof ReturnType<typeof createActions>> = {
  quiz: null as any,
  instance_id: '',
  student_id: '',
  current_attempt: 1,
  max_retries: 0,
  attempts: [],
  current_answers: {},
  is_approved: false,
  is_completed: false,
  loading: false,
  error: null
};

const createActions = (set: any, get: any) => ({
  /**
   * Initialize quiz session from backend
   */
  initializeQuiz: async (activityId: string, studentId: string) => {
    set({ loading: true, error: null });
    try {
      // Fetch quiz configuration
      const quiz = await activityApi.getQuiz(activityId);
      
      // Create deployment instance
      const instance = await activityApi.createInstance(activityId, {
        student_id: studentId
      });

      set({
        quiz,
        instance_id: instance.instance_id,
        student_id: studentId,
        current_attempt: 1,
        max_retries: quiz.number_of_retries,
        attempts: [],
        current_answers: {},
        is_approved: false,
        is_completed: false,
        start_time: Date.now(),
        loading: false
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to initialize quiz',
        loading: false 
      });
    }
  },

  /**
   * Set answer for an exercise
   */
  setAnswer: (exerciseId: string, answer: StudentAnswer) => {
    const { current_answers } = get();
    set({
      current_answers: {
        ...current_answers,
        [exerciseId]: answer
      }
    });
  },

  /**
   * Submit current attempt
   */
  submitAttempt: () => {
    const state = get();
    const { quiz, current_answers, current_attempt, attempts, start_time } = state;

    if (!quiz) return;

    // Validate all answers are provided
    if (!QuizEvaluator.areAllAnswersProvided(current_answers, quiz.exercises)) {
      set({ error: 'Please answer all questions before submitting.' });
      return;
    }

    // Evaluate answers
    const evaluatedAnswers: Record<string, StudentAnswer> = {};
    for (const [exerciseId, answer] of Object.entries(current_answers)) {
      const exercise = quiz.exercises.find((ex: Exercise) => ex.id === exerciseId);
      if (exercise && answer) {
        const typedAnswer = answer as StudentAnswer;
        evaluatedAnswers[exerciseId] = {
          ...typedAnswer,
          is_correct: QuizEvaluator.evaluateAnswer(exercise, typedAnswer, quiz)
        };
      }
    }

    // Calculate result
    const rawScore = QuizEvaluator.calculateAttemptResult(
      evaluatedAnswers,
      quiz.exercises,
      quiz
    );
    const finalScore = QuizEvaluator.applyScoringPolicy(
      rawScore,
      quiz.scoring_policy
    );

    // Create attempt result
    const attemptResult: AttemptResult = {
      attempt_index: current_attempt,
      answers: evaluatedAnswers,
      result: finalScore,
      submitted_at: new Date().toISOString(),
      time_spent_seconds: start_time ? Math.floor((Date.now() - start_time) / 1000) : undefined
    };

    // Check approval
    const isApproved = QuizEvaluator.isApproved(
      finalScore,
      quiz.approval_threshold
    );

    const newAttempts = [...attempts, attemptResult];

    set({
      attempts: newAttempts,
      is_approved: isApproved,
      current_answers: evaluatedAnswers,
      error: null
    });
  },

  /**
   * Start a new retry attempt
   */
  retry: () => {
    const { current_attempt, max_retries, is_approved } = get();

    if (!QuizEvaluator.canRetry(current_attempt, max_retries, is_approved)) {
      set({ error: 'No more retries available or already approved.' });
      return;
    }

    set({
      current_attempt: current_attempt + 1,
      current_answers: {},
      start_time: Date.now(),
      error: null
    });
  },

  /**
   * Complete quiz and send results to backend
   */
  completeQuiz: async () => {
    const { instance_id, student_id, attempts } = get();

    if (attempts.length === 0) {
      set({ error: 'No attempts to submit.' });
      return;
    }

    set({ loading: true, error: null });

    try {
      // Transform attempts to backend format
      const finalResult = {
        instance_id,
        student_id,
        attempts: attempts.map((attempt: AttemptResult) => ({
          attemptIndex: attempt.attempt_index,
          answers: Object.entries(attempt.answers).reduce((acc, [key, val]) => {
            const typedVal = val as StudentAnswer;
            acc[key] = {
              selectedOption: typedVal.selected_option || '',
              rationale: typedVal.rationale || ''
            };
            return acc;
          }, {} as Record<string, { selectedOption: string; rationale: string }>),
          result: attempt.result,
          submittedAt: attempt.submitted_at,
          timeSpentSeconds: attempt.time_spent_seconds
        }))
      };

      await activityApi.saveQuizResults(finalResult);

      set({
        is_completed: true,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to save quiz results',
        loading: false
      });
    }
  },

  /**
   * Reset quiz state
   */
  reset: () => {
    set(initialState);
  }
});

export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,
  ...createActions(set, get)
}));
