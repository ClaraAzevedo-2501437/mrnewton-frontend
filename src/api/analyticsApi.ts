import axios, { AxiosInstance } from 'axios';
import { AnalyticsContract, MetricRequest, MetricResult } from '../domain/models/Analytics';

/**
 * Analytics API Client
 * Communicates with the Analytics backend for metrics and dashboards
 */
class AnalyticsApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api/analytics') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Fetch analytics contract (available metrics)
   */
  async getAnalyticsContract(): Promise<AnalyticsContract> {
    const response = await this.client.get('/get-analytics-contract');
    return response.data;
  }

  /**
   * Request calculated metrics
   */
  async getMetrics(requests: MetricRequest[]): Promise<MetricResult[]> {
    const response = await this.client.post('/get-metrics', {
      metrics: requests
    });
    return response.data.results;
  }

  /**
   * Get metrics for a specific activity
   */
  async getActivityMetrics(activityId: string, metricIds: string[]): Promise<MetricResult[]> {
    const requests: MetricRequest[] = metricIds.map(id => ({
      metric_id: id,
      activity_id: activityId
    }));
    return this.getMetrics(requests);
  }

  /**
   * Get metrics for a specific student
   */
  async getStudentMetrics(studentId: string, metricIds: string[]): Promise<MetricResult[]> {
    const requests: MetricRequest[] = metricIds.map(id => ({
      metric_id: id,
      student_id: studentId
    }));
    return this.getMetrics(requests);
  }
}

export const analyticsApi = new AnalyticsApiClient();
