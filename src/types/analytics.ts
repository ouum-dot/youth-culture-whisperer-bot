
export interface ChatData {
  userMessage: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
}

export interface Insights {
  totalInteractions: number;
  mostPopularCategory: string;
  averageSentiment: string;
  peakHours: string;
  trendingTopics: string[];
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimelineData {
  date: string;
  interactions: number;
  fullDate: string;
}
