const express = require("express");
const router = express.Router();
const { invokeOpenAIAgent } = require("../services/openaiService");

// Feature flag para Make.com (default: deshabilitado)
const MAKE_ENABLED = process.env.FEATURE_MAKE_ENABLED === 'true';

let makeService = null;
if (MAKE_ENABLED) {
  try {
    makeService = require("../services/makeService.js");
    // Make.com integration enabled (silent)
  } catch (err) {
    // Make.com service not available (silent, not critical)
    makeService = null;
  }
} else {
  // Make.com integration disabled (silent)
}

// Mounted at /api/invoke in server/tests
router.post("/:agentId", async (req, res) => {
  const { agentId } = req.params;
  const idempotencyKey = req.header("Idempotency-Key") || req.header("idempotency-key") || undefined;
  const correlationId = req.headers["x-correlation-id"] || "";
  const input = req.body?.input ?? "";

  const isMakeAgent = /^a-/.test(agentId);

  // Solo intentar Make.com si está habilitado Y es un agente Make
  if (MAKE_ENABLED && isMakeAgent && makeService?.invokeMakeAgent) {
    try {
      const result = await makeService.invokeMakeAgent(agentId, { input, correlationId, idempotencyKey });
      return res.status(200).json({
        result: result?.result,
        idempotencyKey,
        attempts: result?._meta?.attempts ?? 1,
        breakerState: result?._meta?.breakerState || "closed",
        toolDiagnostics: result?._meta?.diagnostics || [],
      });
    } catch (e) {
      // Fallback a OpenAI si Make falla (silent, expected behavior)
    }
  }

  // Default to OpenAI (también fallback de Make)
  try {
    const out = await invokeOpenAIAgent({ text: input, correlationId, stream: false });
    return res.status(200).json(out);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

module.exports = router;
