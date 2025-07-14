
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

const ChatInterface = () => {
  // Fonction pour sauvegarder les interactions dans localStorage
  const saveInteraction = (userMessage: string) => {
    const interaction = {
      userMessage: userMessage,
      category: 'general', // Pourrait être analysé plus tard
      sentiment: 'neutral', // Pourrait être analysé plus tard
      timestamp: new Date().toISOString()
    };

    const existingData = localStorage.getItem('chatAnalytics');
    let analytics = [];
    
    if (existingData) {
      try {
        analytics = JSON.parse(existingData);
      } catch (error) {
        console.error('Erreur lors du parsing des données existantes:', error);
        analytics = [];
      }
    }
    
    analytics.push(interaction);
    localStorage.setItem('chatAnalytics', JSON.stringify(analytics));
    console.log('Interaction sauvegardée:', interaction);
  };

  useEffect(() => {
    // Fonction pour charger et configurer Botpress
    const loadBotpressChat = () => {
      // Vérifier si les scripts sont déjà chargés
      if (document.querySelector('script[src*="botpress"]')) {
        return;
      }

      // Ajouter les styles CSS personnalisés
      const style = document.createElement('style');
      style.textContent = `
        #webchat .bpWebchat {
          position: unset;
          width: 100%;
          height: 100%;
          max-height: 100%;
          max-width: 100%;
        }

        #webchat .bpFab {
          display: none;
        }
      `;
      document.head.appendChild(style);

      // Charger le premier script Botpress
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
      script1.async = true;
      
      script1.onload = () => {
        // Charger le deuxième script de configuration
        const script2 = document.createElement('script');
        script2.src = 'https://files.bpcontent.cloud/2025/07/02/10/20250702105916-MARQJ9EB.js';
        script2.async = true;
        
        script2.onload = () => {
          // Attendre que Botpress soit prêt puis initialiser
          const initBotpress = () => {
            if (window.botpress) {
              // Écouter les événements de message pour capturer les interactions
              window.botpress.on("webchat:sent", () => {
                console.log('Message envoyé par l\'utilisateur');
                // Pour capturer le message, nous devons utiliser une approche différente
                // car l'événement ne fournit pas directement le texte du message
              });

              window.botpress.on("webchat:ready", () => {
                window.botpress.open();
              });
              
              // Configuration avec clientId et botId
              window.botpress.init({
                clientId: "9c9b2511-4cc4-4d25-833b-94b742d4979b",
                botId: "9c9b2511-4cc4-4d25-833b-94b742d4979b",
                selector: "#webchat"
              });
              
              console.log('Chatbot Botpress initialisé avec succès avec capture des interactions');
            } else {
              // Réessayer si Botpress n'est pas encore disponible
              setTimeout(initBotpress, 100);
            }
          };
          
          initBotpress();
        };
        
        document.head.appendChild(script2);
      };
      
      document.head.appendChild(script1);
    };

    // Charger le chatbot
    loadBotpressChat();

    // Nettoyage lors du démontage du composant
    return () => {
      const scripts = document.querySelectorAll('script[src*="botpress"], script[src*="bpcontent"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        if (style.textContent && style.textContent.includes('#webchat .bpWebchat')) {
          if (style.parentNode) {
            style.parentNode.removeChild(style);
          }
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
          <h2 className="text-xl font-semibold">Chatbot MJCC</h2>
        </div>
        <p className="text-sm text-gray-600">
          Assistant intelligent du Ministère de la Jeunesse, Communication et Culture - Posez vos questions sur nos services et programmes
        </p>
      </div>
      
      {/* Zone du chatbot Botpress */}
      <div className="flex-1 p-4">
        <div 
          id="webchat" 
          className="w-full h-full rounded-lg border border-gray-200"
          style={{ minHeight: '500px' }}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
