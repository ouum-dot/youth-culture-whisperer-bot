
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, MessageSquare, TrendingUp, Clock, User, Mail, Phone, FileText, Calendar } from "lucide-react";

const AnalyticsDashboard = () => {
  // Données simulées pour les graphiques
  const monthlyData = [
    { month: 'Jan', interactions: 120, services: 45 },
    { month: 'Fév', interactions: 190, services: 67 },
    { month: 'Mar', interactions: 280, services: 89 },
    { month: 'Avr', interactions: 220, services: 76 },
    { month: 'Mai', interactions: 350, services: 112 },
    { month: 'Jun', interactions: 290, services: 95 }
  ];

  const serviceCategories = [
    { name: 'Services Culturels', value: 35, color: '#3B82F6' },
    { name: 'Programmes Jeunesse', value: 28, color: '#8B5CF6' },
    { name: 'Support Citoyen', value: 22, color: '#10B981' },
    { name: 'Information Générale', value: 15, color: '#F59E0B' }
  ];

  const dailyActivity = [
    { time: '08:00', requests: 12 },
    { time: '10:00', requests: 25 },
    { time: '12:00', requests: 45 },
    { time: '14:00', requests: 38 },
    { time: '16:00', requests: 52 },
    { time: '18:00', requests: 28 },
    { time: '20:00', requests: 15 }
  ];

  // Données simulées pour les demandes détaillées
  const detailedRequests = [
    {
      id: 1,
      name: "Marie Dupont",
      email: "marie.dupont@email.com",
      phone: "01.23.45.67.89",
      requestType: "Services Culturels",
      description: "Demande d'information sur les ateliers artistiques pour jeunes",
      timestamp: "2024-01-15 14:30"
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@email.com",
      phone: "01.98.76.54.32",
      requestType: "Programmes Jeunesse",
      description: "Inscription au programme d'accompagnement professionnel",
      timestamp: "2024-01-15 13:45"
    },
    {
      id: 3,
      name: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      phone: "01.11.22.33.44",
      requestType: "Support Citoyen",
      description: "Assistance pour démarches administratives en ligne",
      timestamp: "2024-01-15 12:20"
    },
    {
      id: 4,
      name: "Pierre Moreau",
      email: "pierre.moreau@email.com",
      phone: "01.55.66.77.88",
      requestType: "Information Générale",
      description: "Horaires d'ouverture des services municipaux",
      timestamp: "2024-01-15 11:15"
    }
  ];

  const stats = [
    { title: "Interactions Totales", value: "1,456", icon: MessageSquare, change: "+12%" },
    { title: "Utilisateurs Actifs", value: "892", icon: Users, change: "+8%" },
    { title: "Taux de Satisfaction", value: "94%", icon: TrendingUp, change: "+3%" },
    { title: "Temps de Réponse Moyen", value: "2.3s", icon: Clock, change: "-15%" }
  ];

  return (
    <div className="space-y-6">
      {/* Titre du tableau de bord */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Analytique</h2>
        <p className="text-gray-600">Aperçu des performances et des interactions du système</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique mensuel */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle>Évolution Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="interactions" fill="#3B82F6" />
                <Bar dataKey="services" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par catégories */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle>Répartition des Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activité quotidienne */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle>Activité Quotidienne</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="requests" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Section des demandes détaillées */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Demandes Utilisateurs Détaillées
          </CardTitle>
          <p className="text-sm text-gray-600">Informations complètes sur les dernières demandes</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {detailedRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{request.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{request.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{request.phone}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Type de demande:</span>
                      <div className="inline-block ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {request.requestType}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{request.timestamp}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Description:</span>
                    <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
