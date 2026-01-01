/**
 * Analytics Metric Definition
 */
export interface MetricDefinition {
  metric_id: string;
  name: string;
  description: string;
  type: 'quantitative' | 'qualitative';
  parameters?: Record<string, any>;
}

/**
 * Analytics Contract - Available metrics from backend
 */
export interface AnalyticsContract {
  available_metrics: MetricDefinition[];
  filters: string[];
}

/**
 * Metric Request - Request parameters for analytics
 */
export interface MetricRequest {
  metric_id: string;
  activity_id?: string;
  student_id?: string;
  filters?: Record<string, any>;
}

/**
 * Metric Result - Calculated metric from backend
 */
export interface MetricResult {
  metric_id: string;
  metric_name: string;
  value: number | string | Record<string, any>;
  calculated_at: string;
}

/**
 * Analytics Dashboard State
 */
export interface AnalyticsDashboard {
  contract: AnalyticsContract | null;
  selected_metrics: string[];
  results: MetricResult[];
  loading: boolean;
  error: string | null;
}
