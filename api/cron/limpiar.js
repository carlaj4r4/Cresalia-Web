// ===== VERCEL CRON JOB: LIMPIAR DATOS ANTIGUOS =====
// Ejecuta limpieza semanal de celebraciones antiguas

import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    // Verificar autorización
    const authHeader = req.headers.get('authorization');
    
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Inicializar Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    );

    console.log('🧹 Ejecutando cron: limpieza');

    // Limpiar celebraciones antiguas
    const { data: eliminados, error } = await supabase
      .rpc('limpiar_celebraciones_antiguas');

    if (error) {
      console.error('❌ Error limpiando celebraciones:', error);
      throw error;
    }

    console.log(`✅ Registros eliminados: ${eliminados || 0}`);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        eliminados: eliminados || 0
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Error en cron de limpieza:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
