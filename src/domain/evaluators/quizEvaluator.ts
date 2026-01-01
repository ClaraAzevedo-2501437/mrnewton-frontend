import { evaluate } from 'mathjs';
import { QuizConfig, StudentAnswer, AttemptResult, Exercise } from '../models/Quiz';

/**
 * Quiz Evaluator - Handles all quiz evaluation logic on the frontend
 * Implements scoring, tolerance checking, and approval logic
 */
export class QuizEvaluator {
  /**
   * Evaluate a single answer
   */
  static evaluateAnswer(
    exercise: Exercise,
    answer: StudentAnswer,
    config: QuizConfig
  ): boolean {
    const selectedOption = answer.selected_option;
    const correctOption = exercise.correct_options;

    // Check if selected option matches correct option
    if (selectedOption !== correctOption) {
      return false;
    }

    // For numeric answers, check tolerance if provided
    if (config.relative_tolerance_pct !== undefined || config.absolute_tolerance !== undefined) {
      return this.checkNumericTolerance(
        answer.selected_option,
        exercise.correct_answer,
        config.relative_tolerance_pct,
        config.absolute_tolerance
      );
    }

    return true;
  }

  /**
   * Check if a numeric answer is within tolerance
   */
  private static checkNumericTolerance(
    studentAnswer: string,
    correctAnswer: string,
    relativeTolerance?: number,
    absoluteTolerance?: number
  ): boolean {
    try {
      const studentValue = this.evaluateExpression(studentAnswer);
      const correctValue = this.evaluateExpression(correctAnswer);

      if (studentValue === null || correctValue === null) {
        return false;
      }

      const diff = Math.abs(studentValue - correctValue);

      // Check absolute tolerance
      if (absoluteTolerance !== undefined && diff <= absoluteTolerance) {
        return true;
      }

      // Check relative tolerance
      if (relativeTolerance !== undefined && correctValue !== 0) {
        const relativeDiff = (diff / Math.abs(correctValue)) * 100;
        return relativeDiff <= relativeTolerance;
      }

      // If no tolerance specified, must be exact match
      return diff === 0;
    } catch (error) {
      console.error('Error evaluating numeric tolerance:', error);
      return false;
    }
  }

  /**
   * Evaluate a mathematical expression
   */
  private static evaluateExpression(expression: string): number | null {
    try {
      const result = evaluate(expression);
      return typeof result === 'number' ? result : null;
    } catch {
      return null;
    }
  }

  /**
   * Calculate result for an attempt (percentage of correct answers)
   */
  static calculateAttemptResult(
    answers: Record<string, StudentAnswer>,
    exercises: Exercise[],
    config: QuizConfig
  ): number {
    let correctCount = 0;
    const totalQuestions = exercises.length;

    for (const exercise of exercises) {
      const answer = answers[exercise.id];
      if (answer && this.evaluateAnswer(exercise, answer, config)) {
        correctCount++;
      }
    }

    return (correctCount / totalQuestions) * 100;
  }

  /**
   * Apply scoring policy
   */
  static applyScoringPolicy(
    rawScore: number,
    policy: 'linear' | 'non-linear' = 'linear'
  ): number {
    if (policy === 'non-linear') {
      // Example non-linear scoring: exponential penalty for errors
      // This can be customized based on requirements
      return Math.pow(rawScore / 100, 1.5) * 100;
    }
    return rawScore;
  }

  /**
   * Check if student is approved
   */
  static isApproved(score: number, threshold: number = 50): boolean {
    return score >= threshold;
  }

  /**
   * Get best attempt result
   */
  static getBestAttempt(attempts: AttemptResult[]): AttemptResult | null {
    if (attempts.length === 0) return null;
    return attempts.reduce((best, current) =>
      current.result > best.result ? current : best
    );
  }

  /**
   * Check if student can retry
   */
  static canRetry(
    currentAttempt: number,
    maxRetries: number,
    isApproved: boolean
  ): boolean {
    if (isApproved) return false;
    return currentAttempt < maxRetries + 1; // +1 because first attempt is index 1
  }

  /**
   * Validate all answers are provided
   */
  static areAllAnswersProvided(
    answers: Record<string, StudentAnswer>,
    exercises: Exercise[]
  ): boolean {
    return exercises.every(exercise => {
      const answer = answers[exercise.id];
      return answer && answer.selected_option && answer.rationale;
    });
  }
}
