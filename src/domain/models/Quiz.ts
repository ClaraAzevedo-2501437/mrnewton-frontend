/**
 * Exercise - Single quiz question with options and correct answer
 */
export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correct_options: string;  // e.g., "A", "B", etc.
  correct_answer: string;   // The actual numeric/formula answer
}

/**
 * Quiz Configuration - Complete quiz definition from backend
 */
export interface QuizConfig {
  activity_id: string;
  title: string;
  grade: number;
  modules: string;
  number_of_exercises: number;
  total_time_minutes: number;
  number_of_retries: number;
  relative_tolerance_pct?: number;
  absolute_tolerance?: number;
  show_answers_after_submission?: boolean;
  scoring_policy?: 'linear' | 'non-linear';
  approval_threshold?: number;  // e.g., 50 for 50%
  exercises: Exercise[];
}

/**
 * Student Answer - Answer for a single exercise
 */
export interface StudentAnswer {
  exercise_id: string;
  selected_option: string;
  rationale: string;
  is_correct?: boolean;  // Calculated locally
}

/**
 * Attempt Result - Result of a single attempt
 */
export interface AttemptResult {
  attempt_index: number;
  answers: Record<string, StudentAnswer>;  // exercise_id -> answer
  result: number;  // Percentage of correct answers (0-100)
  submitted_at: string;
  time_spent_seconds?: number;
}

/**
 * Quiz Session State - Current state of quiz execution
 */
export interface QuizSession {
  quiz: QuizConfig;
  instance_id: string;
  student_id: string;
  current_attempt: number;
  max_retries: number;
  attempts: AttemptResult[];
  current_answers: Record<string, StudentAnswer>;
  is_approved: boolean;
  is_completed: boolean;
  start_time?: number;
}

/**
 * Final Quiz Result - Data sent to backend
 */
export interface FinalQuizResult {
  instance_id: string;
  student_id: string;
  attempts: Array<{
    attemptIndex: number;
    answers: Record<string, { selectedOption: string; rationale: string }>;
    result: number;
    submittedAt: string;
    timeSpentSeconds?: number;
  }>;
}
