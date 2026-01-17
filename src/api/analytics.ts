import axios from 'axios';

// Use Vite proxy for analytics API
const ANALYTICS_API_BASE_URL = '/analytics-api';

export interface QuantitativeMetrics {
  total_attempts: number;
  total_time_seconds: number;
  average_time_per_attempt: number;
  number_of_correct_answers: number;
  final_score: number;
  activity_success: boolean;
}

export interface QualitativeMetrics {
  answer_rationale: string[];
}

export interface StudentMetrics {
  student_id: string;
  metrics: QuantitativeMetrics;
  qualitative: QualitativeMetrics;
  calculated_at: string;
}

export interface InstanceMetricsResponse {
  instance_id: string;
  count: number;
  students: StudentMetrics[];
}

export interface MetricDefinition {
  name: string;
  type: string;
  description?: string;
}

export interface AnalyticsContract {
  qualAnalytics: MetricDefinition[];
  quantAnalytics: MetricDefinition[];
}

/**
 * Fetch analytics contract (available metrics)
 */
export const getAnalyticsContract = async (): Promise<AnalyticsContract> => {
  const response = await axios.get(`${ANALYTICS_API_BASE_URL}/contract`);
  return response.data;
};

/**
 * Get metrics for all students in an instance for a specific metric
 */
export const getInstanceMetrics = async (
  instanceId: string,
  metricId: string,
  forceRecalculate: boolean = false
): Promise<InstanceMetricsResponse> => {
  const response = await axios.get(
    `${ANALYTICS_API_BASE_URL}/instances/${instanceId}/metrics`,
    {
      params: { 
        metric_id: metricId,
        force_recalculate: forceRecalculate 
      }
    }
  );
  return response.data;
};

/**
 * Get metrics for a specific student
 */
export const getStudentMetrics = async (
  instanceId: string,
  studentId: string,
  forceRecalculate: boolean = false
): Promise<{ 
  instance_id: string;
  student_id: string;
  metrics: QuantitativeMetrics;
  qualitative: QualitativeMetrics;
  calculated_at: string;
}> => {
  const response = await axios.get(
    `${ANALYTICS_API_BASE_URL}/instances/${instanceId}/students/${studentId}/metrics`,
    {
      params: { force_recalculate: forceRecalculate }
    }
  );
  return response.data;
};
