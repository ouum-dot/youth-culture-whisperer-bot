
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Insights } from '@/types/analytics';
import { getSentimentColor, getSentimentLabel } from '@/utils/analyticsUtils';

interface MetricsCardsProps {
  insights: Insights;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ insights }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total des Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{insights.totalInteractions}</div>
          <p className="text-xs text-gray-500 mt-1">Conversations citoyennes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Catégorie la Plus Populaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-purple-600 capitalize">
            {insights.mostPopularCategory}
          </div>
          <p className="text-xs text-gray-500 mt-1">Principal intérêt citoyen</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Sentiment Dominant</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className={getSentimentColor(insights.averageSentiment)}>
            {getSentimentLabel(insights.averageSentiment)}
          </Badge>
          <p className="text-xs text-gray-500 mt-1">Humeur générale</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Heures de Pointe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-orange-600">
            {insights.peakHours}
          </div>
          <p className="text-xs text-gray-500 mt-1">Activité la plus élevée</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
