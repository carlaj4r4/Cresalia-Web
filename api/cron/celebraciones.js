// ===== VERCEL CRON JOB: CELEBRACIONES =====
// Actualiza aniversarios y cumpleaños automáticamente

import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    // Verificar que sea una petición de cron autorizada
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

    console.log('🔄 Ejecutando cron: celebraciones');

    // Calcular aniversarios de tiendas
    const { data: tiendas, error: errorTiendas } = await supabase
      .rpc('calcular_aniversarios_tiendas_uuid');

    if (errorTiendas) {
      console.error('❌ Error calculando aniversarios de tiendas:', errorTiendas);
    } else {
      console.log(`✅ Aniversarios de tiendas calculados: ${tiendas || 0}`);
    }

    // Calcular aniversarios de servicios
    const { data: servicios, error: errorServicios } = await supabase
      .rpc('calcular_aniversarios_servicios');

    if (errorServicios) {
      console.error('❌ Error calculando aniversarios de servicios:', errorServicios);
    } else {
      console.log(`✅ Aniversarios de servicios calculados: ${servicios || 0}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        resultados: {
          tiendas: tiendas || 0,
          servicios: servicios || 0
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Error en cron de celebraciones:', error);
    
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
