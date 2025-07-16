
import { ChatData, Insights, ChartData, TimelineData } from '@/types/analytics';

export const generateDemoData = (): ChatData[] => {
  const categories = ['evenements-culturels', 'programmes-jeunesse', 'documents', 'plaintes', 'informations', 'service', 'actualites', 'questions'];
  const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
  const demoData: ChatData[] = [];
  
  // Générer des données pour les 7 derniers jours
  for (let day = 6; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    
    // Générer 2-8 interactions par jour
    const interactionsPerDay = Math.floor(Math.random() * 7) + 2;
    
    for (let i = 0; i < interactionsPerDay; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      
      // Varier les heures dans la journée
      const hour = Math.floor(Math.random() * 16) + 8; // Entre 8h et 23h
      const minute = Math.floor(Math.random() * 60);
      
      date.setHours(hour, minute, 0, 0);
      
      demoData.push({
        userMessage: `Message de démonstration ${i + 1}`,
        category: randomCategory,
        sentiment: randomSentiment,
        timestamp: date.toISOString()
      });
    }
  }
  
  return demoData;
};

export const generateInsights = (data: ChatData[]): Insights => {
  if (data.length === 0) {
    return {
      totalInteractions: 0,
      mostPopularCategory: '',
      averageSentiment: 'neutral',
      peakHours: '',
      trendingTopics: []
    };
  }

  const categoryCount = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPopularCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';

  const sentimentCount = data.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantSentiment = Object.entries(sentimentCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

  const hourCount = data.reduce((acc, item) => {
    const hour = new Date(item.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const peakHour = Object.entries(hourCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || '12';

  return {
    totalInteractions: data.length,
    mostPopularCategory: mostPopularCategory.replace('-', ' '),
    averageSentiment: dominantSentiment,
    peakHours: `${peakHour}:00`,
    trendingTopics: Object.keys(categoryCount).slice(0, 3)
  };
};

export const getCategoryData = (chatData: ChatData[]): ChartData[] => {
  const categoryCount = chatData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels = {
    'evenements-culturels': 'événements culturels',
    'programmes-jeunesse': 'programmes jeunesse',
    'documents': 'documents',
    'plaintes': 'plaintes',
    'informations': 'informations',
    'service': 'service',
    'actualites': 'actualités',
    'questions': 'questions',
    'general': 'général'
  };

  return Object.entries(categoryCount).map(([category, count]) => ({
    name: categoryLabels[category as keyof typeof categoryLabels] || category,
    value: count
  }));
};

export const getSentimentData = (chatData: ChatData[]): ChartData[] => {
  const sentimentCount = chatData.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sentimentLabels = {
    'positive': 'positif',
    'negative': 'négatif',
    'neutral': 'neutre'
  };

  return Object.entries(sentimentCount).map(([sentiment, count]) => ({
    name: sentimentLabels[sentiment as keyof typeof sentimentLabels] || sentiment,
    value: count
  }));
};

export const getTimelineData = (chatData: ChatData[]): TimelineData[] => {
  console.log('Données brutes pour timeline:', chatData.map(item => ({
    timestamp: item.timestamp,
    date: new Date(item.timestamp).toLocaleDateString('fr-FR')
  })));

  // Grouper les interactions par date
  const datesMap = new Map<string, number>();
  
  chatData.forEach(item => {
    const date = new Date(item.timestamp);
    const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dateKey = normalizedDate.toISOString().split('T')[0];
    
    console.log(`Processing interaction: ${item.timestamp} -> ${dateKey}`);
    
    const count = datesMap.get(dateKey) || 0;
    datesMap.set(dateKey, count + 1);
  });

  console.log('Dates groupées:', Array.from(datesMap.entries()));

  // Créer une chronologie complète depuis le 1er juillet jusqu'à aujourd'hui
  const startDate = new Date('2025-07-01');
  const endDate = new Date();
  const timelineData: TimelineData[] = [];

  // Générer tous les jours depuis le 1er juillet
  for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const interactions = datesMap.get(dateKey) || 0;
    
    timelineData.push({
      date: currentDate.toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      interactions,
      fullDate: currentDate.toISOString()
    });
  }
  
  console.log('Données de chronologie finales:', timelineData);
  return timelineData;
};

export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive': return 'bg-green-100 text-green-800';
    case 'negative': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getSentimentLabel = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive': return 'positif';
    case 'negative': return 'négatif';
    default: return 'neutre';
  }
};
