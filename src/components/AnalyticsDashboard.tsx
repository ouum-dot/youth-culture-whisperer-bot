
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatData, Insights } from '@/types/analytics';
import { generateDemoData, generateInsights, getCategoryData, getSentimentData, getTimelineData } from '@/utils/analyticsUtils';
import { useChatInteractions } from '@/hooks/useChatInteractions';
import { useAuth } from '@/contexts/AuthContext';
import MetricsCards from './analytics/MetricsCards';
import CategoryChart from './analytics/CategoryChart';
import SentimentChart from './analytics/SentimentChart';
import TimelineChart from './analytics/TimelineChart';
import InsightsSection from './analytics/InsightsSection';
import DebugInfo from './analytics/DebugInfo';

const AnalyticsDashboard = () => {
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const [insights, setInsights] = useState<Insights>({
    totalInteractions: 0,
    mostPopularCategory: '',
    averageSentiment: 'neutral',
    peakHours: '',
    trendingTopics: []
  });

  const { interactions, loading } = useChatInteractions();
  const { user } = useAuth();

  useEffect(() => {
    if (user && interactions.length > 0) {
      console.log('Utilisation des données réelles depuis Supabase:', interactions);
      setChatData(interactions);
      setInsights(generateInsights(interactions));
    } else if (user && interactions.length === 0 && !loading) {
      console.log('Aucune donnée réelle trouvée, utilisation des données de démonstration');
      const demoData = generateDemoData();
      setChatData(demoData);
      setInsights(generateInsights(demoData));
    } else if (!user) {
      console.log('Utilisateur non connecté, utilisation des données de démonstration');
      const demoData = generateDemoData();
      setChatData(demoData);
      setInsights(generateInsights(demoData));
    }
  }, [user, interactions, loading]);

  const categoryData = getCategoryData(chatData);
  const sentimentData = getSentimentData(chatData);
  const timelineData = getTimelineData(chatData);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données analytiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DebugInfo chatData={chatData} timelineDataLength={timelineData.length} />

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            💡 <strong>Mode démonstration :</strong> Connectez-vous pour voir vos vraies données d'analytics basées sur vos interactions avec le chatbot.
          </p>
        </div>
      )}

      <MetricsCards insights={insights} />

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Catégories de Demandes</TabsTrigger>
          <TabsTrigger value="sentiment">Analyse des Sentiments</TabsTrigger>
          <TabsTrigger value="timeline">Chronologie</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <CategoryChart data={categoryData} />
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <SentimentChart data={sentimentData} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <TimelineChart data={timelineData} totalInteractions={chatData.length} />
        </TabsContent>
      </Tabs>

      <InsightsSection />
    </div>
  );
};

export default AnalyticsDashboard;
