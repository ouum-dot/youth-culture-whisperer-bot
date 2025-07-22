import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatData } from '@/types/analytics';

interface BotpressTable {
  id: string;
  name: string;
  records: any[];
}

interface BotpressData {
  tables: BotpressTable[];
  files: any[];
}

export const useBotpressData = () => {
  const [botpressData, setBotpressData] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBotpressData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data from Botpress edge function...');
      
      const { data, error } = await supabase.functions.invoke('fetch-botpress-data', {
        method: 'GET'
      });

      if (error) {
        console.error('Error from edge function:', error);
        setError('Failed to fetch Botpress data');
        return;
      }

      console.log('Raw Botpress data:', data);

      // Transform Botpress data into ChatData format
      const transformedData: ChatData[] = [];
      
      if (data?.tables) {
        data.tables.forEach((table: BotpressTable) => {
          if (table.records) {
            table.records.forEach((record: any) => {
              // Try to extract meaningful data from Botpress records
              // This is a flexible approach since we don't know the exact structure
              const message = record.message || record.text || record.content || 'Interaction Botpress';
              const category = record.category || record.type || 'service';
              const sentiment = record.sentiment || 'neutral';
              const timestamp = record.timestamp || record.createdAt || new Date().toISOString();

              transformedData.push({
                userMessage: message,
                category: category,
                sentiment: sentiment as 'positive' | 'neutral' | 'negative',
                timestamp: timestamp
              });
            });
          }
        });
      }

      console.log('Transformed Botpress data:', transformedData);
      setBotpressData(transformedData);
      
    } catch (err) {
      console.error('Error fetching Botpress data:', err);
      setError('Failed to connect to Botpress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBotpressData();
  }, []);

  return {
    botpressData,
    loading,
    error,
    refetch: fetchBotpressData
  };
};