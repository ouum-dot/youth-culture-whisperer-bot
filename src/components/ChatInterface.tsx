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
      text: 'Hello! I\'m your AI assistant for the Ministry of Communication and Culture - Youth Department. How can I help you today?',
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
      'cultural-events': ['event', 'festival', 'concert', 'exhibition', 'culture', 'art'],
      'youth-programs': ['youth', 'program', 'workshop', 'training', 'course', 'education'],
      'documents': ['document', 'certificate', 'permit', 'license', 'application'],
      'complaints': ['complaint', 'problem', 'issue', 'dissatisfied', 'wrong'],
      'information': ['information', 'about', 'what', 'how', 'when', 'where']
    };

    const lowercaseText = text.toLowerCase();
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowercaseText.includes(word))) {
        return category;
      }
    }
    return 'general';
  };

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'helpful', 'thank'];
    const negativeWords = ['bad', 'terrible', 'awful', 'disappointed', 'angry', 'frustrated', 'problem'];
    
    const lowercaseText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowercaseText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowercaseText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const generateResponse = (userMessage: string, category: string): string => {
    const responses = {
      'cultural-events': [
        'We have several exciting cultural events coming up! Our youth cultural festival is next month featuring local artists and musicians.',
        'For information about cultural events, please visit our events calendar. We regularly organize art exhibitions, music concerts, and cultural workshops.',
        'Our upcoming cultural programs include traditional dance workshops, art exhibitions, and music festivals specifically designed for young people.'
      ],
      'youth-programs': [
        'We offer various youth programs including leadership training, digital skills workshops, and cultural exchange programs.',
        'Our youth development programs focus on creativity, leadership, and cultural awareness. Would you like more details about any specific program?',
        'Current youth programs include: Creative Arts Workshop, Leadership Development, Digital Media Training, and Cultural Heritage Program.'
      ],
      'documents': [
        'For document requests, please provide your full name, contact information, and specify which document you need. Processing typically takes 3-5 business days.',
        'You can apply for permits and certificates through our online portal or visit our office. What specific document do you need assistance with?',
        'Document services include: Event permits, Cultural program certificates, Youth program enrollment, and Official correspondence.'
      ],
      'complaints': [
        'I understand your concern. Please provide more details about the issue so we can address it properly. Your feedback helps us improve our services.',
        'Thank you for bringing this to our attention. We take all feedback seriously. Can you please elaborate on the specific issue?',
        'We apologize for any inconvenience. Please share more details about your concern so we can resolve it promptly.'
      ],
      'general': [
        'I\'m here to help with any questions about our cultural programs, youth services, or ministry information. What would you like to know?',
        'Our ministry focuses on promoting cultural heritage and supporting youth development. How can I assist you today?',
        'Feel free to ask about our services, programs, events, or any other ministry-related topics.'
      ]
    };

    const categoryResponses = responses[category as keyof typeof responses] || responses.general;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      category: categorizeMessage(inputValue),
      sentiment: analyzeSentiment(inputValue)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue, userMessage.category || 'general'),
        isUser: false,
        timestamp: new Date(),
        category: 'response',
        sentiment: 'positive'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // Store data for analytics
      const chatData = {
        userMessage: userMessage.text,
        category: userMessage.category,
        sentiment: userMessage.sentiment,
        timestamp: new Date().toISOString()
      };
      
      const existingData = localStorage.getItem('chatAnalytics');
      const analytics = existingData ? JSON.parse(existingData) : [];
      analytics.push(chatData);
      localStorage.setItem('chatAnalytics', JSON.stringify(analytics));
      
      toast({
        title: "Message processed",
        description: "Your request has been categorized and logged for analysis.",
      });
    }, 1500);
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
      'cultural-events': 'bg-purple-100 text-purple-800',
      'youth-programs': 'bg-blue-100 text-blue-800',
      'documents': 'bg-yellow-100 text-yellow-800',
      'complaints': 'bg-red-100 text-red-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          Smart Assistant Chat
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ask questions about cultural events, youth programs, documents, or general information
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
                <div className={`max-w-[80%] space-y-2`}>
                  <div
                    className={`p-4 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {message.isUser ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {message.isUser ? 'You' : 'Assistant'}
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
                          {message.sentiment}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-sm font-medium">Assistant</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
              placeholder="Type your message about cultural events, youth programs, or any questions..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
