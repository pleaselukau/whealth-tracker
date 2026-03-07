import { apiRequest } from "./client";
import type { InsightsSummary, TimelineResponse } from "../types/insight";

type SummaryParams = {
  token: string;
  from_?: string;
  to?: string;
};

type TimelineParams = {
  token: string;
  category: string;
  from_?: string;
  to?: string;
};

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getInsightsSummary(params: SummaryParams): Promise<InsightsSummary> {
  const { token, from_, to } = params;
  return apiRequest<InsightsSummary>(
    `/insights/summary${buildQuery({ from_, to })}`,
    { token },
  );
}

export function getInsightsTimeline(params: TimelineParams): Promise<TimelineResponse> {
  const { token, category, from_, to } = params;
  return apiRequest<TimelineResponse>(
    `/insights/timeline${buildQuery({ category, from_, to })}`,
    { token },
  );
}