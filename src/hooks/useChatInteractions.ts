
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatData } from '@/types/analytics';
import { useAuth } from '@/contexts/AuthContext';

export const useChatInteractions = () => {
  const [interactions, setInteractions] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const saveChatInteraction = async (userMessage: string, category = 'general', sentiment: 'positive' | 'neutral' | 'negative' = 'neutral') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_interactions')
        .insert({
          user_id: user.id,
          user_message: userMessage,
          category,
          sentiment,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde de l\'interaction:', error);
      } else {
        console.log('Interaction sauvegardée avec succès');
        // Refresh interactions after saving
        await fetchChatInteractions();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const fetchChatInteractions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des interactions:', error);
      } else {
        const formattedData: ChatData[] = (data || []).map(item => ({
          userMessage: item.user_message,
          category: item.category,
          sentiment: item.sentiment as 'positive' | 'neutral' | 'negative',
          timestamp: item.timestamp
        }));
        setInteractions(formattedData);
        console.log('Interactions récupérées:', formattedData.length);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChatInteractions();
    } else {
      setInteractions([]);
    }
  }, [user]);

  return {
    interactions,
    loading,
    saveChatInteraction,
    refreshInteractions: fetchChatInteractions
  };
};
