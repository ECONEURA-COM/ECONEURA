/**
 * Vercel AI Gateway Service - MODELOS 2025
 * Reemplaza OpenAI directo con AI Gateway unificado
 */

const AI_GATEWAY_TOKEN = process.env.VERCEL_AI_GATEWAY_TOKEN || process.env.VERCEL_TOKEN;
const AI_GATEWAY_URL = 'https://api.vercel.com/v1/ai/chat/completions';

/**
 * Modelos asignados a cada NEURA (Nov 2025)
 */
const NEURA_MODELS = {
  'presidencia': 'anthropic/claude-sonnet-4.5',    // Mejor estrategia
  'ia': 'openai/gpt-5',                            // Más potente
  'marketing': 'anthropic/claude-sonnet-4.5',      // Mejor escritura
  'finanzas': 'anthropic/claude-opus-4',           // Más preciso
  'rrhh': 'openai/gpt-5-mini',                     // Rápido + económico
  'legal': 'mistral/mistral-large',                // GDPR europeo
  'retail': 'openai/gpt-5-nano',                   // Ultra económico
  'cybersec': 'anthropic/claude-sonnet-4.5',       // Seguro
  'supply': 'google/gemini-2.5-flash-lite',        // Ultra rápido
  'ma': 'anthropic/claude-opus-4'                  // Análisis profundo
};

/**
 * Obtener modelo para un departamento
 */
function getModelForDepartment(deptId) {
  return NEURA_MODELS[deptId] || 'openai/gpt-5-mini'; // Fallback económico
}

/**
 * Chat con AI Gateway (streaming)
 */
async function chatWithAIGateway(messages, deptId = 'ia', stream = false) {
  const model = getModelForDepartment(deptId);

  const response = await fetch(AI_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AI_GATEWAY_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`AI Gateway error: ${error.message || response.statusText}`);
  }

  if (stream) {
    return response.body; // Return readable stream
  }

  const data = await response.json();
  return {
    message: data.choices[0].message.content,
    model: data.model,
    usage: data.usage
  };
}

/**
 * Chat simple (sin streaming)
 */
async function chat(userMessage, deptId = 'ia', systemPrompt = null) {
  const messages = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  messages.push({ role: 'user', content: userMessage });

  return await chatWithAIGateway(messages, deptId, false);
}

/**
 * Chat con historial
 */
async function chatWithHistory(messages, deptId = 'ia') {
  return await chatWithAIGateway(messages, deptId, false);
}

/**
 * Chat streaming (para UI en tiempo real)
 */
async function chatStream(messages, deptId = 'ia') {
  return await chatWithAIGateway(messages, deptId, true);
}

/**
 * Verificar disponibilidad de AI Gateway
 */
async function healthCheck() {
  try {
    const result = await chat('ping', 'ia');
    return { ok: true, model: result.model };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

module.exports = {
  chat,
  chatWithHistory,
  chatStream,
  healthCheck,
  getModelForDepartment,
  NEURA_MODELS
};

