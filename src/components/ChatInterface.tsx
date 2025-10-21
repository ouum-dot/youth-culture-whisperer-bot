
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useChatInteractions } from '@/hooks/useChatInteractions';
import { useAuth } from '@/contexts/AuthContext';

const ChatInterface = () => {
  const { saveChatInteraction } = useChatInteractions();
  const { user } = useAuth();

  // Fonction pour sauvegarder les interactions dans Supabase
  const saveInteraction = (userMessage: string) => {
    if (user) {
      saveChatInteraction(userMessage, 'general', 'neutral');
    }
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
      script1.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
      script1.async = true;
      
      script1.onload = () => {
        // Charger le deuxième script de configuration
        const script2 = document.createElement('script');
        script2.src = 'https://files.bpcontent.cloud/2025/07/22/21/20250722211159-UDHPRGOB.js';
        script2.async = true;
        
        script2.onload = () => {
          // Attendre que Botpress soit prêt puis initialiser
          const initBotpress = () => {
            if (window.botpress) {
              // Capturer les messages en surveillant les changements dans le DOM
              let lastMessageCount = 0;
              const checkForNewMessages = () => {
                const messageElements = document.querySelectorAll('#webchat [class*="message"], #webchat [class*="Message"]');
                const currentMessageCount = messageElements.length;
                
                if (currentMessageCount > lastMessageCount) {
                  // Nouveau message détecté, essayer de capturer le dernier message utilisateur
                  const userMessages = Array.from(messageElements).filter(el => {
                    return el.textContent && !el.classList.contains('bot-message') && 
                           !el.innerHTML.includes('typing') && el.textContent.trim().length > 0;
                  });
                  
                  if (userMessages.length > 0) {
                    const lastUserMessage = userMessages[userMessages.length - 1];
                    const messageText = lastUserMessage.textContent?.trim();
                    if (messageText) {
                      console.log('Message utilisateur capturé:', messageText);
                      saveInteraction(messageText);
                    }
                  }
                  lastMessageCount = currentMessageCount;
                }
              };

              // Utiliser MutationObserver pour détecter les nouveaux messages
              const observer = new MutationObserver(() => {
                setTimeout(checkForNewMessages, 500);
              });

              // Observer les changements dans la zone de chat
              setTimeout(() => {
                const chatContainer = document.querySelector('#webchat');
                if (chatContainer) {
                  observer.observe(chatContainer, {
                    childList: true,
                    subtree: true
                  });
                  console.log('Observer des messages configuré');
                }
              }, 2000);

              window.botpress.on("webchat:ready", () => {
                window.botpress.open();
                console.log('Webchat prêt');
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

    // Charger le chatbot seulement si l'utilisateur est connecté
    if (user) {
      loadBotpressChat();
    }

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
  }, [user, saveInteraction]);

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col bg-white rounded-lg shadow-lg">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Veuillez vous connecter pour utiliser le chatbot.</p>
        </div>
      </div>
    );
  }

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
