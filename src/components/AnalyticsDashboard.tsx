
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatData, Insights } from '@/types/analytics';
import { generateDemoData, generateInsights, getCategoryData, getSentimentData, getTimelineData } from '@/utils/analyticsUtils';
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

  useEffect(() => {
    let data = localStorage.getItem('chatAnalytics');
    let parsedData: ChatData[] = [];
    
    if (data) {
      try {
        parsedData = JSON.parse(data);
        console.log('Données analytics chargées:', parsedData);
      } catch (error) {
        console.log('Erreur lors du parsing des données, utilisation des données de démonstration');
      }
    }
    
    // Si pas de données réelles, utiliser les données de démonstration
    if (!parsedData || parsedData.length === 0) {
      console.log('Aucune donnée réelle trouvée, utilisation des données de démonstration');
      parsedData = generateDemoData();
      // Ne pas sauvegarder les données de démo pour ne pas écraser les vraies données
    } else {
      console.log(`${parsedData.length} interactions réelles trouvées`);
    }
    
    setChatData(parsedData);
    setInsights(generateInsights(parsedData));

    // Écouter les changements dans localStorage pour les mises à jour en temps réel
    const handleStorageChange = () => {
      const updatedData = localStorage.getItem('chatAnalytics');
      if (updatedData) {
        try {
          const newParsedData = JSON.parse(updatedData);
          console.log('Données mises à jour détectées:', newParsedData);
          setChatData(newParsedData);
          setInsights(generateInsights(newParsedData));
        } catch (error) {
          console.error('Erreur lors de la mise à jour des données:', error);
        }
      }
    };

    // Écouter les changements du localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement les nouvelles données (pour les changements dans la même fenêtre)
    const interval = setInterval(() => {
      const currentData = localStorage.getItem('chatAnalytics');
      if (currentData && currentData !== data) {
        handleStorageChange();
        data = currentData;
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const categoryData = getCategoryData(chatData);
  const sentimentData = getSentimentData(chatData);
  const timelineData = getTimelineData(chatData);

  return (
    <div className="space-y-6">
      <DebugInfo chatData={chatData} timelineDataLength={timelineData.length} />

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
