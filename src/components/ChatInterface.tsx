
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

const ChatInterface = () => {
  useEffect(() => {
    // Fonction pour charger les scripts Botpress
    const loadBotpressScripts = () => {
      // Vérifier si les scripts sont déjà chargés
      if (document.querySelector('script[src*="botpress"]')) {
        return;
      }

      // Charger le premier script (inject.js)
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
      script1.async = true;
      document.head.appendChild(script1);

      // Charger le deuxième script (configuration spécifique)
      const script2 = document.createElement('script');
      script2.src = 'https://files.bpcontent.cloud/2025/07/02/10/20250702105916-MARQJ9EB.js';
      script2.async = true;
      document.head.appendChild(script2);

      console.log('Scripts Botpress chargés avec succès');
    };

    // Charger les scripts
    loadBotpressScripts();

    // Nettoyage lors du démontage du composant
    return () => {
      // Optionnel : supprimer les scripts si nécessaire
      const scripts = document.querySelectorAll('script[src*="botpress"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Assistant Jeunesse du Ministère</h2>
        </div>
        <p className="text-sm text-gray-600">
          Chatbot intelligent propulsé par Botpress - Posez vos questions sur les événements culturels, programmes jeunesse et services du ministère
        </p>
      </div>
      
      {/* Zone principale pour le chatbot Botpress */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Bot className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">
            Initialisation du chatbot...
          </h3>
          <p className="text-sm text-gray-500">
            Le chatbot Botpress se charge automatiquement et apparaîtra dans le coin de votre écran.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              💡 <strong>Astuce:</strong> Cherchez l'icône de chat dans le coin inférieur droit de votre écran pour commencer à discuter avec notre assistant intelligent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
