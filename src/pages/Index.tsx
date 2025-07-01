
import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Ministry of Communication and Culture
            </h1>
            <p className="text-xl text-gray-600 mb-2">Youth Department - Smart Assistant</p>
            <p className="text-gray-500">
              Your AI-powered assistant for cultural programs, youth services, and citizen support
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="chat" className="text-lg py-3">
                Chat Assistant
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-lg py-3">
                Analytics Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <ChatInterface />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
