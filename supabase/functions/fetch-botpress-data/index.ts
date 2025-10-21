import { Client } from 'https://esm.sh/@botpress/client@0.5.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BotpressData {
  tables: any[];
  files: any[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const botpressToken = Deno.env.get('BOTPRESS_PAT');
    
    if (!botpressToken) {
      console.error('BOTPRESS_PAT not configured');
      return new Response(
        JSON.stringify({ error: 'Botpress token not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const client = new Client({
      token: botpressToken,
      botId: '9a7d2243-e9d3-4593-b969-4928dec272f5',
      workspaceId: 'wkspace_01K0SZMYNQTNQBCXN6YD45SPCZ'
    });

    console.log('Fetching data from Botpress...');

    // Fetch tables and files from Botpress
    const [tablesResponse, filesResponse] = await Promise.all([
      client.listTables({}),
      client.listFiles({})
    ]);

    const data: BotpressData = {
      tables: tablesResponse.tables || [],
      files: filesResponse.files || []
    };

    console.log(`Retrieved ${data.tables.length} tables and ${data.files.length} files from Botpress`);

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error fetching Botpress data:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch data from Botpress',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});