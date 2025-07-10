
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

const ChatInterface = () => {
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

      // Charger le script Botpress
      const script = document.createElement('script');
      script.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
      script.async = true;
      
      script.onload = () => {
        // Attendre que Botpress soit prêt puis initialiser
        const initBotpress = () => {
          if (window.botpress) {
            window.botpress.on("webchat:ready", () => {
              window.botpress.open();
            });
            
            window.botpress.init({
              "botId": "9c9b2511-4cc4-4d25-833b-94b742d4979b",
              "configuration": {
                "version": "v1",
                "botName": "Chatbot MJCC",
                "website": {},
                "email": {},
                "phone": {},
                "termsOfService": {},
                "privacyPolicy": {},
                "color": "#5490f7",
                "variant": "solid",
                "headerVariant": "solid",
                "themeMode": "light",
                "fontFamily": "inter",
                "radius": 4,
                "feedbackEnabled": false,
                "footer": "[⚡ by Botpress](https://botpress.com/?from=webchat)"
              },
              "clientId": "f30d11dd-6377-467f-9ac5-1e2722246153",
              "selector": "#webchat"
            });
            
            console.log('Chatbot Botpress initialisé avec succès');
          } else {
            // Réessayer si Botpress n'est pas encore disponible
            setTimeout(initBotpress, 100);
          }
        };
        
        initBotpress();
      };
      
      document.head.appendChild(script);
    };

    // Charger le chatbot
    loadBotpressChat();

    // Nettoyage lors du démontage du composant
    return () => {
      const scripts = document.querySelectorAll('script[src*="botpress"]');
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
