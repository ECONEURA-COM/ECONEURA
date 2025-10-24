/**
 * ECONEURA - Modal de Conexión de Agentes
 * Conecta agentes a Make, n8n, Power Automate, ChatGPT u Otro HTTP
 * Gestiona IA sobre tu stack. No sustituimos ERP/CRM.
 */

import React, { useState, useEffect } from 'react';
import { X, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface ConnectAgentModalProps {
  agentId: string;
  agentTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export function ConnectAgentModal({
  agentId,
  agentTitle,
  isOpen,
  onClose,
  onConnected
}: ConnectAgentModalProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadProviders();
    }
  }, [isOpen]);

  const loadProviders = async () => {
    try {
      const apiUrl = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('econeura.com') || window.location.hostname.includes('azurestaticapps.net')
        ? 'https://econeura-backend-v2.azurewebsites.net'
        : 'https://econeura-backend-v2.azurewebsites.net';

      const response = await fetch(`${apiUrl}/api/integration/providers`);
      const data = await response.json();
      setProviders(data.providers || []);
    } catch (err) {
      setError('No se pudo cargar proveedores');
    }
  };

  const handleTest = async () => {
    if (!url) {
      setError('Ingresa una URL primero');
      return;
    }

    setTesting(true);
    setTestResult(null);
    setError('');

    try {
      // Primero conectar temporalmente
      const apiUrl = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('econeura.com') || window.location.hostname.includes('azurestaticapps.net')
        ? window.location.origin
        : 'https://econeura-backend-v2.azurewebsites.net';

      await fetch(`${apiUrl}/api/integration/agents/${agentId}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          url,
          apiKey: selectedProvider === 'chatgpt' ? apiKey : undefined
        })
      });

      // Luego probar
      const response = await fetch(`${apiUrl}/api/integration/agents/${agentId}/test`, {
        method: 'POST'
      });

      const data = await response.json();

      setTestResult({
        success: data.success,
        message: data.success
          ? `✅ Conexión exitosa (${data.latency}ms)`
          : `❌ Error: ${data.message || 'Conexión fallida'}`
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `❌ Error: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedProvider || !url) {
      setError('Selecciona un proveedor e ingresa una URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('econeura.com') || window.location.hostname.includes('azurestaticapps.net')
        ? 'https://econeura-backend-v2.azurewebsites.net'
        : 'https://econeura-backend-v2.azurewebsites.net';

      const response = await fetch(`${apiUrl}/api/integration/agents/${agentId}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          url,
          apiKey: selectedProvider === 'chatgpt' ? apiKey : undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        onConnected();
        onClose();
      } else {
        setError(data.error || 'Error al conectar agente');
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const providerExamples = {
    make: 'https://hook.eu1.make.com/...',
    n8n: 'https://tu-instancia.n8n.cloud/webhook/...',
    powerautomate: 'https://prod-xx.eur-xx.logic.azure.com:443/workflows/...',
    chatgpt: 'API key de OpenAI (backend cifra)',
    other: 'https://tu-endpoint.com/webhook'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-emerald-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Conectar Agente</h2>
            <p className="text-sm text-slate-600">{agentTitle}</p>
          </div>
        </div>

        {/* Marca */}
        <p className="text-xs text-slate-500 mb-6 italic">
          Gestiona IA sobre tu stack. No sustituimos ERP/CRM.
        </p>

        {/* Selector de Proveedor */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Proveedor
          </label>
          <select
            value={selectedProvider}
            onChange={(e) => {
              setSelectedProvider(e.target.value);
              setUrl('');
              setApiKey('');
              setTestResult(null);
              setError('');
            }}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Selecciona un proveedor...</option>
            {providers.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.description}
              </option>
            ))}
          </select>
        </div>

        {/* Campo URL / API Key */}
        {selectedProvider && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {selectedProvider === 'chatgpt' ? 'API Key de OpenAI' : 'URL del Webhook'}
              </label>
              {selectedProvider === 'chatgpt' ? (
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={providerExamples[selectedProvider as keyof typeof providerExamples] || 'https://...'}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              )}
              <p className="text-xs text-slate-500 mt-1">
                Ejemplo: {providerExamples[selectedProvider as keyof typeof providerExamples]}
              </p>
            </div>

            {/* Botón Probar */}
            <button
              onClick={handleTest}
              disabled={testing || (!url && selectedProvider !== 'chatgpt') || (selectedProvider === 'chatgpt' && !apiKey)}
              className="w-full mb-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Probar Conexión
                </>
              )}
            </button>

            {/* Resultado del Test */}
            {testResult && (
              <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                testResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{testResult.message}</span>
              </div>
            )}
          </>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConnect}
            disabled={loading || !selectedProvider || (!url && selectedProvider !== 'chatgpt') || (selectedProvider === 'chatgpt' && !apiKey)}
            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Conectar
              </>
            )}
          </button>
        </div>

        {/* Info EU */}
        <p className="text-xs text-slate-400 mt-6 text-center">
          🇪🇺 EU-first · Sin PII · Dominios validados · Trazabilidad completa
        </p>
      </div>
    </div>
  );
}

