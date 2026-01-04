import axios, { AxiosInstance } from 'axios';
import { QuizConfig, FinalQuizResult } from '../domain/models/Quiz';

/**
 * Activity API Client
 * Communicates directly with Activity backend via Vite proxy
 */
class ActivityApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Fetch quiz definition by activity ID
   */
  async getQuiz(activityId: string): Promise<QuizConfig> {
    const response = await this.client.get(`/config/${activityId}`);
    return {
      activity_id: response.data.activity_id,
      title: response.data.title,
      grade: response.data.grade,
      modules: response.data.modules,
      number_of_exercises: response.data.number_of_exercises,
      total_time_minutes: response.data.total_time_minutes,
      number_of_retries: response.data.number_of_retries,
      relative_tolerance_pct: response.data.relative_tolerance_pct,
      absolute_tolerance: response.data.absolute_tolerance,
      show_answers_after_submission: response.data.show_answers_after_submission,
      scoring_policy: response.data.scoring_policy,
      approval_threshold: response.data.approval_threshold,
      exercises: response.data.exercises.map((ex: any, index: number) => ({
        id: `ex-${index + 1}`,
        question: ex.question,
        options: ex.options,
        correct_options: ex.correct_options,
        correct_answer: ex.correct_answer
      }))
    };
  }

  /**
   * Get deployment instance details
   */
  async getInstanceDetails(instanceId: string): Promise<{
    instance_id: string;
    activity_id: string;
    created_at: string;
    expires_at: string;
    session_params?: Record<string, any>;
  }> {
    const response = await this.client.get(`/deploy/${instanceId}`);
    return {
      instance_id: response.data.instance_id,
      activity_id: response.data.activity_id,
      created_at: response.data.created_at,
      expires_at: response.data.expires_at,
      session_params: response.data.session_params
    };
  }

  /**
   * Create a deployment instance
   */
  async createInstance(activityId: string, sessionParams?: Record<string, any>): Promise<{
    instance_id: string;
    deploy_url: string;
  }> {
    const response = await this.client.post('/deploy', {
      activity_id: activityId,
      session_params: sessionParams
    });
    return {
      instance_id: response.data.instance_id,
      deploy_url: response.data.deploy_url
    };
  }

  /**
   * Save final quiz results
   */
  async saveQuizResults(result: FinalQuizResult): Promise<void> {
    await this.client.post('/submissions', result);
  }

  /**
   * Get all available activities (for selection)
   */
  async getAvailableActivities(): Promise<Array<{
    activity_id: string;
    title: string;
    grade: number;
  }>> {
    const response = await this.client.get('/config');
    return response.data.activities.map((activity: any) => ({
      activity_id: activity.activity_id,
      title: activity.title,
      grade: activity.grade
    }));
  }
}

export const activityApi = new ActivityApiClient();
