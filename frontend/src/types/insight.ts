export type CategoryAverage = {
  category: string;
  average_severity: number;
};

export type InsightsSummary = {
  total_entries: number;
  days_tracked: number;
  average_severity_per_category: CategoryAverage[];
};

export type TimelinePoint = {
  date: string;
  average_severity: number;
};

export type TimelineResponse = {
  category: string;
  points: TimelinePoint[];
};