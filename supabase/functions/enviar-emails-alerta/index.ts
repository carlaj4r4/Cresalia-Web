// Supabase Edge Function para enviar emails de alertas
// Deploy: supabase functions deploy enviar-emails-alerta

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { alerta_id } = await req.json()

    if (!alerta_id) {
      throw new Error('alerta_id es requerido')
    }

    console.log(`📧 Procesando alerta ID: ${alerta_id}`)

    // Crear cliente Supabase con service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Obtener datos de la alerta
    const { data: alerta, error: errorAlerta } = await supabase
      .from('alertas_emergencia_comunidades')
      .select('*')
      .eq('id', alerta_id)
      .single()

    if (errorAlerta || !alerta) {
      throw new Error(`Alerta no encontrada: ${errorAlerta?.message}`)
    }

    // 2. Buscar usuarios a notificar
    const { data: usuarios, error: errorUsuarios } = await supabase
      .rpc('buscar_usuarios_en_radio_alerta', { p_alerta_id: alerta_id })

    if (errorUsuarios) {
      throw new Error(`Error buscando usuarios: ${errorUsuarios.message}`)
    }

    console.log(`📧 Usuarios a notificar: ${usuarios?.length || 0}`)

    if (!usuarios || usuarios.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          mensaje: 'No hay usuarios para notificar',
          usuarios_notificados: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Enviar emails usando Brevo
    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
    
    if (!BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY no configurada')
    }

    const template = generarTemplateEmail(alerta)
    const resultados = await enviarEmailsBrevo(usuarios, template, alerta, BREVO_API_KEY)

    // 4. Registrar envíos
    await registrarEnvios(supabase, alerta_id, resultados, alerta.alcance)

    // 5. Responder
    const exitosos = resultados.filter(r => r.exitoso).length
    const fallidos = resultados.length - exitosos

    return new Response(
      JSON.stringify({
        success: true,
        usuarios_notificados: exitosos,
        usuarios_fallidos: fallidos,
        total: usuarios.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generarTemplateEmail(alerta: any) {
  const iconos: Record<string, string> = {
    'inundacion': '🌊', 'incendio': '🔥', 'terremoto': '🏚️',
    'tormenta': '⛈️', 'tornado': '🌪️', 'tsunami': '🌊',
    'pandemia': '😷', 'corte_luz': '💡', 'corte_gas': '🔥',
    'corte_agua': '💧', 'accidente': '🚨', 'seguridad': '⚠️',
    'otro': '⚠️'
  }

  const colores: Record<string, string> = {
    'critica': '#dc2626', 'alta': '#f59e0b',
    'media': '#3b82f6', 'baja': '#10b981'
  }

  const icono = iconos[alerta.tipo] || '⚠️'
  const color = colores[alerta.severidad] || '#3b82f6'

  return {
    subject: `${icono} ALERTA ${alerta.severidad.toUpperCase()}: ${alerta.titulo}`,
    html: `Ver archivo anterior api/enviar-emails-alerta.js para el template completo`,
    text: `${icono} ALERTA: ${alerta.titulo}\n\n${alerta.descripcion}`
  }
}

async function enviarEmailsBrevo(usuarios: any[], template: any, alerta: any, apiKey: string) {
  const resultados = []
  const BATCH_SIZE = 50

  for (let i = 0; i < usuarios.length; i += BATCH_SIZE) {
    const batch = usuarios.slice(i, i + BATCH_SIZE)
    
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          sender: {
            name: 'Alertas Cresalia',
            email: Deno.env.get('BREVO_SENDER_EMAIL') || 'alertas@cresalia.com'
          },
          to: batch.map(u => ({ email: u.email })),
          subject: template.subject,
          textContent: template.text,
          tags: ['alerta', alerta.alcance, alerta.tipo, alerta.severidad]
        })
      })

      if (response.ok) {
        batch.forEach(u => {
          resultados.push({ email: u.email, exitoso: true, distancia_km: u.distancia_km })
        })
      } else {
        const error = await response.text()
        batch.forEach(u => {
          resultados.push({ email: u.email, exitoso: false, error, distancia_km: u.distancia_km })
        })
      }

    } catch (error) {
      batch.forEach(u => {
        resultados.push({ email: u.email, exitoso: false, error: error.message, distancia_km: u.distancia_km })
      })
    }

    // Pausa entre lotes
    if (i + BATCH_SIZE < usuarios.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return resultados
}

async function registrarEnvios(supabase: any, alerta_id: number, resultados: any[], tipo_alerta: string) {
  const registros = resultados.map(r => ({
    alerta_id,
    email: r.email,
    exitoso: r.exitoso,
    mensaje_error: r.error || null,
    distancia_km: r.distancia_km,
    tipo_alerta
  }))

  await supabase.from('alertas_emails_enviados').insert(registros)
}
