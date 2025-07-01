
import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, BarChart3, Sparkles, Shield } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Motifs de fond décoratifs */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.03"%3E%3Cpath d="M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-indigo-400/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      </div>

      <Header />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Hero améliorée */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex items-center justify-center mb-6">
                <Shield className="text-blue-600 mr-3" size={32} />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
                  Assistant Ministériel Intelligent
                </h1>
                <Sparkles className="text-yellow-500 ml-3 animate-pulse" size={32} />
              </div>
              
              <p className="text-2xl text-gray-700 mb-3 font-medium">
                Département de la Jeunesse - Service d'Excellence Citoyenne
              </p>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Votre assistant IA de nouvelle génération pour les programmes culturels, services jeunesse 
                et support citoyen. Interface sécurisée et certifiée par l'État.
              </p>
              
              {/* Indicateurs de confiance */}
              <div className="flex items-center justify-center space-x-8 mt-6">
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Service Certifié</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Shield size={16} />
                  <span className="font-medium">Données Sécurisées</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-600">
                  <Sparkles size={16} />
                  <span className="font-medium">IA Avancée</span>
                </div>
              </div>
            </div>
          </div>

          {/* Onglets avec design amélioré */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-xl border border-white/50">
              <TabsTrigger 
                value="chat" 
                className="text-lg py-4 px-6 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105"
              >
                <MessageCircle className="mr-2" size={20} />
                Assistant de Discussion
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="text-lg py-4 px-6 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105"
              >
                <BarChart3 className="mr-2" size={20} />
                Tableau de Bord Analytique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                <ChatInterface />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden p-6">
                <AnalyticsDashboard />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
