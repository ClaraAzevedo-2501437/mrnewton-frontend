import { create } from 'zustand';
import { AnalyticsContract, MetricRequest, MetricResult } from '../domain/models/Analytics';
import { analyticsApi } from '../api/analyticsApi';

interface AnalyticsStore {
  contract: AnalyticsContract | null;
  selectedMetrics: string[];
  results: MetricResult[];
  loading: boolean;
  error: string | null;

  // Actions
  loadContract: () => Promise<void>;
  selectMetric: (metricId: string) => void;
  deselectMetric: (metricId: string) => void;
  fetchMetrics: (activityId?: string, studentId?: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  contract: null,
  selectedMetrics: [],
  results: [],
  loading: false,
  error: null
};

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  ...initialState,

  /**
   * Load analytics contract from backend
   */
  loadContract: async () => {
    set({ loading: true, error: null });
    try {
      const contract = await analyticsApi.getAnalyticsContract();
      set({ contract, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load analytics contract',
        loading: false
      });
    }
  },

  /**
   * Select a metric
   */
  selectMetric: (metricId: string) => {
    const { selectedMetrics } = get();
    if (!selectedMetrics.includes(metricId)) {
      set({ selectedMetrics: [...selectedMetrics, metricId] });
    }
  },

  /**
   * Deselect a metric
   */
  deselectMetric: (metricId: string) => {
    const { selectedMetrics } = get();
    set({
      selectedMetrics: selectedMetrics.filter(id => id !== metricId)
    });
  },

  /**
   * Fetch selected metrics
   */
  fetchMetrics: async (activityId?: string, studentId?: string) => {
    const { selectedMetrics } = get();

    if (selectedMetrics.length === 0) {
      set({ error: 'Please select at least one metric.' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const requests: MetricRequest[] = selectedMetrics.map(metricId => ({
        metric_id: metricId,
        activity_id: activityId,
        student_id: studentId
      }));

      const results = await analyticsApi.getMetrics(requests);
      set({ results, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch metrics',
        loading: false
      });
    }
  },

  /**
   * Reset analytics state
   */
  reset: () => {
    set(initialState);
  }
}));
