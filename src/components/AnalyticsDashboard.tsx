
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

  useEffect(() => {
    const data = localStorage.getItem('chatAnalytics');
    if (data) {
      const parsedData = JSON.parse(data);
      setChatData(parsedData);
      generateInsights(parsedData);
    }
  }, []);

  const generateInsights = (data: ChatData[]) => {
    if (data.length === 0) return;

    // Category analysis
    const categoryCount = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPopularCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';

    // Sentiment analysis
    const sentimentCount = data.reduce((acc, item) => {
      acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantSentiment = Object.entries(sentimentCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

    // Time analysis
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

    return Object.entries(categoryCount).map(([category, count]) => ({
      name: category.replace('-', ' '),
      value: count
    }));
  };

  const getSentimentData = () => {
    const sentimentCount = chatData.reduce((acc, item) => {
      acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sentimentCount).map(([sentiment, count]) => ({
      name: sentiment,
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
      date: new Date(date).toLocaleDateString(),
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

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{insights.totalInteractions}</div>
            <p className="text-xs text-gray-500 mt-1">Citizen conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Most Popular Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-purple-600 capitalize">
              {insights.mostPopularCategory}
            </div>
            <p className="text-xs text-gray-500 mt-1">Top citizen interest</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Dominant Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getSentimentColor(insights.averageSentiment)}>
              {insights.averageSentiment}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">Overall mood</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-orange-600">
              {insights.peakHours}
            </div>
            <p className="text-xs text-gray-500 mt-1">Highest activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Request Categories</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Citizen Request Categories</CardTitle>
              <p className="text-sm text-gray-600">
                Distribution of citizen requests by category
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
              <CardTitle>Sentiment Analysis</CardTitle>
              <p className="text-sm text-gray-600">
                Citizen satisfaction and emotional response patterns
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
              <CardTitle>Interaction Timeline</CardTitle>
              <p className="text-sm text-gray-600">
                Daily citizen interaction patterns
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

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Cultural Behavior Patterns</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Youth show high interest in digital cultural programs</li>
                <li>• Event participation requests peak during weekends</li>
                <li>• Traditional cultural events need more promotion</li>
                <li>• Online workshops have higher engagement rates</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Recommendations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Increase digital cultural content offerings</li>
                <li>• Schedule more weekend cultural activities</li>
                <li>• Improve communication about traditional events</li>
                <li>• Expand online program capacity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
