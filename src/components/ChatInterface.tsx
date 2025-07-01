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
      text: 'Hello! I\'m your AI assistant for the Ministry of Communication and Culture - Youth Department. I can help you with cultural events, youth programs, document requests, and general information. What would you like to know?',
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
      'cultural-events': ['event', 'festival', 'concert', 'exhibition', 'culture', 'art', 'show', 'performance', 'music', 'dance', 'theater'],
      'youth-programs': ['youth', 'program', 'workshop', 'training', 'course', 'education', 'student', 'young', 'learning', 'skill'],
      'documents': ['document', 'certificate', 'permit', 'license', 'application', 'form', 'paper', 'registration', 'approval'],
      'complaints': ['complaint', 'problem', 'issue', 'dissatisfied', 'wrong', 'error', 'bad', 'disappointed', 'unhappy'],
      'information': ['information', 'about', 'what', 'how', 'when', 'where', 'who', 'tell me', 'explain', 'details']
    };

    const lowercaseText = text.toLowerCase();
    
    // Check for exact matches first
    for (const [category, words] of Object.entries(keywords)) {
      const matches = words.filter(word => lowercaseText.includes(word));
      if (matches.length > 0) {
        console.log(`Message categorized as: ${category}, matched words: ${matches.join(', ')}`);
        return category;
      }
    }
    
    console.log('Message categorized as: general (no keywords matched)');
    return 'general';
  };

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'helpful', 'thank', 'love', 'like', 'awesome', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'disappointed', 'angry', 'frustrated', 'problem', 'hate', 'dislike', 'horrible'];
    
    const lowercaseText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowercaseText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowercaseText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const generateResponse = (userMessage: string, category: string): string => {
    console.log(`Generating response for category: ${category}, message: ${userMessage}`);
    
    const responses = {
      'cultural-events': [
        'We have exciting cultural events throughout the year! Our upcoming events include the Youth Cultural Festival featuring local artists, traditional music concerts, and art exhibitions. Visit our events calendar for specific dates and registration details.',
        'Our cultural programs are designed to celebrate our heritage and promote artistic expression among youth. Current events include dance workshops, poetry competitions, and cultural exchange programs. Would you like information about a specific type of event?',
        'The Ministry regularly organizes cultural activities such as art exhibitions, music festivals, traditional craft workshops, and cultural heritage tours. These events are free for youth participants and often include certificates of participation.'
      ],
      'youth-programs': [
        'We offer comprehensive youth development programs including: Leadership Training (monthly workshops), Digital Skills Bootcamp (3-month program), Creative Arts Academy (ongoing), Cultural Ambassador Program, and Career Mentorship. All programs are free for participants aged 16-30.',
        'Our youth initiatives focus on skill development, cultural awareness, and leadership. Current programs include entrepreneurship workshops, public speaking training, cultural preservation projects, and international exchange opportunities. Which area interests you most?',
        'Youth programs available now: 1) Digital Media Training (starts monthly), 2) Traditional Arts Workshop, 3) Leadership Development Course, 4) Language Exchange Program, 5) Community Service Projects. Registration is open year-round.'
      ],
      'documents': [
        'For document services, please provide: Full name, contact information, and document type needed. Available documents include: Event participation certificates, Youth program completion certificates, Cultural program permits, and Official letters of recommendation. Processing time is 3-5 business days.',
        'Document requests can be submitted online or in-person at our office. Required documents vary by type: ID copy, application form, and relevant supporting materials. Fees apply for some services. What specific document do you need?',
        'We issue various certificates and permits: Youth program certificates, Cultural event permits, Volunteer service certificates, and Official ministry letters. Please specify which document you need and I\'ll guide you through the application process.'
      ],
      'complaints': [
        'I understand your concern and want to help resolve this issue. Please provide specific details about the problem, including: What happened, when it occurred, and what outcome you\'re seeking. We take all feedback seriously and will investigate promptly.',
        'Thank you for bringing this to our attention. To properly address your complaint: 1) Please describe the specific issue, 2) Provide relevant dates/times, 3) Include any reference numbers if applicable. We aim to resolve complaints within 7 business days.',
        'We apologize for any inconvenience experienced. Your feedback helps us improve our services. Please share more details about the situation so we can investigate and provide an appropriate resolution. A complaint reference number will be provided.'
      ],
      'information': [
        'I can provide information about: Cultural events and festivals, Youth development programs, Document services and applications, Ministry contact details, Office hours and locations, and General ministry services. What specific information would you like?',
        'The Ministry of Communication and Culture - Youth Department serves young people aged 16-30 with cultural programs, skill development opportunities, and support services. We operate Monday-Friday 8AM-5PM. What would you like to know more about?',
        'Our services include: Organizing cultural events, Providing youth development programs, Issuing certificates and permits, Supporting cultural preservation, and Facilitating community engagement. How can I assist you with any of these areas?'
      ],
      'general': [
        'Hello! I\'m here to help with questions about our cultural programs, youth services, document requests, or general ministry information. Our main focus is supporting young people through cultural engagement and skill development. What would you like to know?',
        'The Ministry of Communication and Culture - Youth Department promotes cultural heritage while supporting youth development. We offer programs, events, and services for young people aged 16-30. How can I assist you today?',
        'I can help you with information about cultural events, youth programs, document applications, or any other ministry-related questions. Please let me know what specific assistance you need.'
      ]
    };

    const categoryResponses = responses[category as keyof typeof responses] || responses.general;
    const selectedResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    console.log(`Selected response: ${selectedResponse}`);
    return selectedResponse;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }

    console.log(`User sent message: ${inputValue}`);

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

    // Simulate AI response delay
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
      
      // Store data for analytics
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
      
      console.log('Chat interaction saved to analytics');
      
      toast({
        title: "Response generated",
        description: `Your ${userMessage.category} inquiry has been processed.`,
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
      'cultural-events': 'bg-purple-100 text-purple-800',
      'youth-programs': 'bg-blue-100 text-blue-800',
      'documents': 'bg-yellow-100 text-yellow-800',
      'complaints': 'bg-red-100 text-red-800',
      'general': 'bg-gray-100 text-gray-800',
      'information': 'bg-teal-100 text-teal-800',
      'response': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          Ministry Youth Assistant
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ask about cultural events, youth programs, documents, or any ministry services
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
                        {message.isUser ? 'You' : 'Ministry Assistant'}
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
                <div className="bg-gray-50 border p-4 rounded-lg max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-sm font-medium">Ministry Assistant</span>
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
              placeholder="Ask about cultural events, youth programs, documents, or any questions..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              className="min-w-[80px]"
            >
              {isTyping ? 'Sending...' : 'Send'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • The assistant can help with ministry services and information
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
