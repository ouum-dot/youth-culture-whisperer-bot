
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Bot, MessageCircle, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  category?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant IA pour le Ministère de la Communication et de la Culture - Département de la Jeunesse. Je peux vous aider avec les événements culturels, les programmes jeunesse, les demandes de documents et les informations générales. Que souhaitez-vous savoir ?',
      isUser: false,
      timestamp: new Date(),
      category: 'greeting',
      sentiment: 'positive'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const categorizeMessage = (text: string): string => {
    const keywords = {
      'evenements-culturels': ['événement', 'festival', 'concert', 'exposition', 'culture', 'art', 'spectacle', 'performance', 'musique', 'danse', 'théâtre'],
      'programmes-jeunesse': ['jeunesse', 'programme', 'atelier', 'formation', 'cours', 'éducation', 'étudiant', 'jeune', 'apprentissage', 'compétence'],
      'documents': ['document', 'certificat', 'permis', 'licence', 'demande', 'formulaire', 'papier', 'inscription', 'approbation'],
      'plaintes': ['plainte', 'problème', 'question', 'insatisfait', 'incorrect', 'erreur', 'mauvais', 'déçu', 'mécontent'],
      'informations': ['information', 'à propos', 'quoi', 'comment', 'quand', 'où', 'qui', 'dites-moi', 'expliquer', 'détails']
    };

    const lowercaseText = text.toLowerCase();
    
    for (const [category, words] of Object.entries(keywords)) {
      const matches = words.filter(word => lowercaseText.includes(word));
      if (matches.length > 0) {
        console.log(`Message catégorisé comme: ${category}, mots correspondants: ${matches.join(', ')}`);
        return category;
      }
    }
    
    console.log('Message catégorisé comme: général (aucun mot-clé correspondant)');
    return 'general';
  };

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['bon', 'excellent', 'génial', 'merveilleux', 'utile', 'merci', 'aime', 'fantastique'];
    const negativeWords = ['mauvais', 'terrible', 'affreux', 'déçu', 'en colère', 'frustré', 'problème', 'déteste', 'horrible'];
    
    const lowercaseText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowercaseText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowercaseText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const generateResponse = (userMessage: string, category: string): string => {
    console.log(`Génération de réponse pour la catégorie: ${category}, message: ${userMessage}`);
    
    const responses = {
      'evenements-culturels': [
        'Nous avons des événements culturels passionnants tout au long de l\'année ! Nos prochains événements incluent le Festival Culturel de la Jeunesse avec des artistes locaux, des concerts de musique traditionnelle et des expositions d\'art. Consultez notre calendrier d\'événements pour les dates et détails d\'inscription.',
        'Nos programmes culturels sont conçus pour célébrer notre patrimoine et promouvoir l\'expression artistique chez les jeunes. Les événements actuels incluent des ateliers de danse, des concours de poésie et des programmes d\'échange culturel. Souhaitez-vous des informations sur un type d\'événement spécifique ?',
        'Le Ministère organise régulièrement des activités culturelles telles que des expositions d\'art, des festivals de musique, des ateliers d\'artisanat traditionnel et des visites du patrimoine culturel. Ces événements sont gratuits pour les participants jeunes et incluent souvent des certificats de participation.'
      ],
      'programmes-jeunesse': [
        'Nous offrons des programmes complets de développement de la jeunesse incluant : Formation en Leadership (ateliers mensuels), Bootcamp de Compétences Numériques (programme de 3 mois), Académie des Arts Créatifs (en continu), Programme d\'Ambassadeur Culturel et Mentorat de Carrière. Tous les programmes sont gratuits pour les participants âgés de 16 à 30 ans.',
        'Nos initiatives jeunesse se concentrent sur le développement des compétences, la sensibilisation culturelle et le leadership. Les programmes actuels incluent des ateliers d\'entrepreneuriat, de formation en prise de parole en public, des projets de préservation culturelle et des opportunités d\'échange international. Quel domaine vous intéresse le plus ?',
        'Programmes jeunesse disponibles maintenant : 1) Formation Médias Numériques (débute mensuellement), 2) Atelier Arts Traditionnels, 3) Cours de Développement du Leadership, 4) Programme d\'Échange Linguistique, 5) Projets de Service Communautaire. L\'inscription est ouverte toute l\'année.'
      ],
      'documents': [
        'Pour les services de documents, veuillez fournir : nom complet, informations de contact et type de document nécessaire. Documents disponibles : certificats de participation aux événements, certificats d\'achèvement des programmes jeunesse, permis de programmes culturels et lettres de recommandation officielles. Le délai de traitement est de 3 à 5 jours ouvrables.',
        'Les demandes de documents peuvent être soumises en ligne ou en personne à notre bureau. Les documents requis varient selon le type : copie de pièce d\'identité, formulaire de demande et documents de soutien pertinents. Des frais s\'appliquent pour certains services. Quel document spécifique vous faut-il ?',
        'Nous délivrons divers certificats et permis : certificats de programmes jeunesse, permis d\'événements culturels, certificats de service bénévole et lettres officielles du ministère. Veuillez préciser quel document vous avez besoin et je vous guiderai dans le processus de demande.'
      ],
      'plaintes': [
        'Je comprends votre préoccupation et veux aider à résoudre ce problème. Veuillez fournir des détails spécifiques sur le problème, incluant : ce qui s\'est passé, quand cela s\'est produit et quel résultat vous recherchez. Nous prenons tous les commentaires au sérieux et enquêterons rapidement.',
        'Merci de porter cela à notre attention. Pour traiter correctement votre plainte : 1) Veuillez décrire le problème spécifique, 2) Fournir les dates/heures pertinentes, 3) Inclure tous numéros de référence si applicable. Nous visons à résoudre les plaintes dans les 7 jours ouvrables.',
        'Nous nous excusons pour tout inconvénient rencontré. Vos commentaires nous aident à améliorer nos services. Veuillez partager plus de détails sur la situation afin que nous puissions enquêter et fournir une résolution appropriée. Un numéro de référence de plainte sera fourni.'
      ],
      'informations': [
        'Je peux fournir des informations sur : les événements et festivals culturels, les programmes de développement jeunesse, les services et demandes de documents, les coordonnées du ministère, les heures et lieux de bureau, et les services généraux du ministère. Quelle information spécifique souhaitez-vous ?',
        'Le Ministère de la Communication et de la Culture - Département de la Jeunesse sert les jeunes âgés de 16 à 30 ans avec des programmes culturels, des opportunités de développement des compétences et des services de soutien. Nous opérons du lundi au vendredi de 8h à 17h. Que souhaitez-vous savoir de plus ?',
        'Nos services incluent : organiser des événements culturels, fournir des programmes de développement jeunesse, délivrer des certificats et permis, soutenir la préservation culturelle et faciliter l\'engagement communautaire. Comment puis-je vous aider dans l\'un de ces domaines ?'
      ],
      'general': [
        'Bonjour ! Je suis là pour aider avec les questions sur nos programmes culturels, services jeunesse, demandes de documents ou informations générales du ministère. Notre objectif principal est de soutenir les jeunes à travers l\'engagement culturel et le développement des compétences. Que souhaitez-vous savoir ?',
        'Le Ministère de la Communication et de la Culture - Département de la Jeunesse promeut le patrimoine culturel tout en soutenant le développement des jeunes. Nous offrons des programmes, événements et services pour les jeunes âgés de 16 à 30 ans. Comment puis-je vous aider aujourd\'hui ?',
        'Je peux vous aider avec des informations sur les événements culturels, programmes jeunesse, demandes de documents ou toute autre question liée au ministère. Veuillez me faire savoir quelle assistance spécifique vous avez besoin.'
      ]
    };

    const categoryResponses = responses[category as keyof typeof responses] || responses.general;
    const selectedResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    console.log(`Réponse sélectionnée: ${selectedResponse}`);
    return selectedResponse;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Message vide",
        description: "Veuillez saisir un message avant d'envoyer.",
        variant: "destructive"
      });
      return;
    }

    console.log(`L'utilisateur a envoyé le message: ${inputValue}`);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      category: categorizeMessage(inputValue),
      sentiment: analyzeSentiment(inputValue)
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(currentInput, userMessage.category || 'general'),
        isUser: false,
        timestamp: new Date(),
        category: 'response',
        sentiment: 'positive'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      const chatData = {
        userMessage: userMessage.text,
        category: userMessage.category,
        sentiment: userMessage.sentiment,
        timestamp: new Date().toISOString(),
        response: botResponse.text
      };
      
      const existingData = localStorage.getItem('chatAnalytics');
      const analytics = existingData ? JSON.parse(existingData) : [];
      analytics.push(chatData);
      localStorage.setItem('chatAnalytics', JSON.stringify(analytics));
      
      console.log('Interaction de chat sauvegardée dans les analyses');
      
      toast({
        title: "Réponse générée",
        description: `Votre demande ${userMessage.category} a été traitée.`,
      });
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'evenements-culturels': 'bg-purple-100 text-purple-800',
      'programmes-jeunesse': 'bg-blue-100 text-blue-800',
      'documents': 'bg-yellow-100 text-yellow-800',
      'plaintes': 'bg-red-100 text-red-800',
      'general': 'bg-gray-100 text-gray-800',
      'informations': 'bg-teal-100 text-teal-800',
      'response': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          Assistant Jeunesse du Ministère
        </CardTitle>
        <p className="text-sm text-gray-600">
          Posez des questions sur les événements culturels, programmes jeunesse, documents ou services du ministère
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-4 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-900 border'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {message.isUser ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {message.isUser ? 'Vous' : 'Assistant du Ministère'}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  
                  {message.category && (
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline" className={getCategoryColor(message.category)}>
                        {message.category.replace('-', ' ')}
                      </Badge>
                      {message.sentiment && (
                        <Badge variant="outline" className={getSentimentColor(message.sentiment)}>
                          {message.sentiment === 'positive' ? 'positif' : message.sentiment === 'negative' ? 'négatif' : 'neutre'}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border p-4 rounded-lg max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-sm font-medium">Assistant du Ministère</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="p-6">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez des questions sur les événements culturels, programmes jeunesse, documents ou toute question..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              className="min-w-[80px]"
            >
              {isTyping ? 'Envoi...' : 'Envoyer'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Appuyez sur Entrée pour envoyer • L'assistant peut aider avec les services et informations du ministère
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
