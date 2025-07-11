import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ChatData {
  userMessage: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
}

interface UserRequest {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  natureRequete: 'plainte' | 'service';
  description: string;
  timestamp: string;
}

const AnalyticsDashboard = () => {
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [insights, setInsights] = useState({
    totalInteractions: 0,
    mostPopularCategory: '',
    averageSentiment: 'neutral',
    peakHours: '',
    trendingTopics: [] as string[]
  });

  useEffect(() => {
    const data = localStorage.getItem('chatAnalytics');
    if (data) {
      const parsedData = JSON.parse(data);
      setChatData(parsedData);
      generateInsights(parsedData);
    }

    const requests = localStorage.getItem('userRequests');
    if (requests) {
      const parsedRequests = JSON.parse(requests);
      setUserRequests(parsedRequests);
    }
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
      'information': 'information',
      'service': 'service',
      'plainte': 'plainte',
      'actualite': 'actualité'
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
    const dailyCount = chatData.reduce((acc, item) => {
      const date = new Date(item.timestamp).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyCount).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('fr-FR'),
      interactions: count
    }));
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRequestTypeColor = (type: string) => {
    return type === 'plainte' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      {/* Métriques Clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Demandes Détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userRequests.length}</div>
            <p className="text-xs text-gray-500 mt-1">Plaintes et services</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Catégories de Demandes</TabsTrigger>
          <TabsTrigger value="sentiment">Analyse des Sentiments</TabsTrigger>
          <TabsTrigger value="timeline">Chronologie</TabsTrigger>
          <TabsTrigger value="requests">Demandes Détaillées</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Catégories de Demandes Citoyennes</CardTitle>
              <p className="text-sm text-gray-600">
                Distribution des demandes citoyennes par catégorie : information, service, plainte et actualité
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

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demandes Détaillées des Citoyens</CardTitle>
              <p className="text-sm text-gray-600">
                Informations complètes des citoyens ayant déposé des plaintes ou demandé des services
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date/Heure</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                          Aucune demande détaillée disponible
                        </TableCell>
                      </TableRow>
                    ) : (
                      userRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.nom}</TableCell>
                          <TableCell>{request.email}</TableCell>
                          <TableCell>{request.telephone}</TableCell>
                          <TableCell>
                            <Badge className={getRequestTypeColor(request.natureRequete)}>
                              {request.natureRequete}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" title={request.description}>
                            {request.description}
                          </TableCell>
                          <TableCell>{formatDate(request.timestamp)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
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
