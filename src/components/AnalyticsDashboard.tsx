
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ChatData {
  userMessage: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
}

const AnalyticsDashboard = () => {
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const [insights, setInsights] = useState({
    totalInteractions: 0,
    mostPopularCategory: '',
    averageSentiment: 'neutral',
    peakHours: '',
    trendingTopics: [] as string[]
  });

  // Fonction pour générer des données de démonstration
  const generateDemoData = (): ChatData[] => {
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

  useEffect(() => {
    let data = localStorage.getItem('chatAnalytics');
    let parsedData: ChatData[] = [];
    
    if (data) {
      try {
        parsedData = JSON.parse(data);
      } catch (error) {
        console.log('Erreur lors du parsing des données, utilisation des données de démonstration');
      }
    }
    
    // Si pas de données ou données vides, utiliser les données de démonstration
    if (!parsedData || parsedData.length === 0) {
      parsedData = generateDemoData();
      // Sauvegarder les données de démonstration dans le localStorage
      localStorage.setItem('chatAnalytics', JSON.stringify(parsedData));
    }
    
    setChatData(parsedData);
    generateInsights(parsedData);
  }, []);

  const generateInsights = (data: ChatData[]) => {
    if (data.length === 0) return;

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

    setInsights({
      totalInteractions: data.length,
      mostPopularCategory: mostPopularCategory.replace('-', ' '),
      averageSentiment: dominantSentiment,
      peakHours: `${peakHour}:00`,
      trendingTopics: Object.keys(categoryCount).slice(0, 3)
    });
  };

  const getCategoryData = () => {
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

  const getSentimentData = () => {
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

  const getTimelineData = () => {
    const today = new Date();
    const timelineData = [];
    
    // Générer les données pour les 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toDateString();
      
      // Compter les interactions pour cette date
      const interactionsForDate = chatData.filter(item => {
        const itemDate = new Date(item.timestamp).toDateString();
        return itemDate === dateString;
      }).length;
      
      timelineData.push({
        date: date.toLocaleDateString('fr-FR', { 
          month: 'short', 
          day: 'numeric' 
        }),
        interactions: interactionsForDate
      });
    }
    
    return timelineData;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'positif';
      case 'negative': return 'négatif';
      default: return 'neutre';
    }
  };

  return (
    <div className="space-y-6">
      {/* Métriques Clés */}
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

      {/* Graphiques */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Catégories de Demandes</TabsTrigger>
          <TabsTrigger value="sentiment">Analyse des Sentiments</TabsTrigger>
          <TabsTrigger value="timeline">Chronologie</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Catégories de Demandes Citoyennes</CardTitle>
              <p className="text-sm text-gray-600">
                Distribution des demandes citoyennes par catégorie : questions, plaintes, services et actualités
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCategoryData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Sentiments</CardTitle>
              <p className="text-sm text-gray-600">
                Modèles de satisfaction citoyenne et de réponse émotionnelle
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getSentimentData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getSentimentData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chronologie des Interactions</CardTitle>
              <p className="text-sm text-gray-600">
                Modèles d'interaction citoyenne quotidienne
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getTimelineData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="interactions" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Aperçus et Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçus IA et Recommandations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Modèles de Comportement Citoyen</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Les citoyens privilégient les services numériques pour leurs demandes</li>
                <li>• Les questions sur les actualités atteignent un pic pendant les heures ouvrables</li>
                <li>• Les demandes de service nécessitent plus de promotion et d'accessibilité</li>
                <li>• Les plaintes en ligne ont des taux de résolution plus élevés</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Recommandations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Améliorer l'interface des services en ligne</li>
                <li>• Programmer plus de communications d'actualités</li>
                <li>• Simplifier l'accès aux services administratifs</li>
                <li>• Élargir la capacité de traitement des demandes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
