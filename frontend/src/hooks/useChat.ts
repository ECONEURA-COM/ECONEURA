import { useState, useCallback, useRef } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseChatOptions {
  neuraId: number;
  onError?: (error: Error) => void;
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  clear: () => void;
}

// SIEMPRE usar backend Azure en producción
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

const API_URL = isLocalhost 
  ? 'https://econeura-backend-v2.azurewebsites.net/api'
  : 'https://econeura-backend-v2.azurewebsites.net/api';

console.log('[useChat] Hostname:', hostname);
console.log('[useChat] API_URL:', API_URL);


// ============================================
// FUNCIONES DB PERSISTENCE
// ============================================

export async function saveChat(token: string, messages: ChatMessage[]) {
  if (!token) throw new Error('Token requerido');
  
  const response = await fetch(${API_URL}/chats, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Bearer 
    },
    body: JSON.stringify({
      title: messages[0]?.content.substring(0, 50) || 'Nuevo chat',
      messages
    })
  });
  
  if (!response.ok) throw new Error('Error guardando chat');
  return response.json();
}

export async function loadChats(token: string) {
  if (!token) throw new Error('Token requerido');
  
  const response = await fetch(${API_URL}/chats, {
    headers: {
      'Authorization': Bearer 
    }
  });
  
  if (!response.ok) throw new Error('Error cargando chats');
  return response.json();
}

export async function deleteChat(token: string, chatId: string) {
  if (!token) throw new Error('Token requerido');
  
  const response = await fetch(${API_URL}/chats/, {
    method: 'DELETE',
    headers: {
      'Authorization': Bearer 
    }
  });
  
  if (!response.ok) throw new Error('Error eliminando chat');
  return response.json();
}

export function useChat({ neuraId, onError }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Crear abort controller para cancelación
    abortControllerRef.current = new AbortController();

    try {
      // Mapear neuraId a agentId del backend
      const neuraToAgent: Record<number, string> = {
        0: 'a-ceo-01',   // CEO
        1: 'a-ia-01',    // IA
        2: 'a-cso-01',   // CSO
        3: 'a-cto-01',   // CTO
        4: 'a-ciso-01',  // CISO
        5: 'a-coo-01',   // COO
        6: 'a-chro-01',  // CHRO
        7: 'a-mkt-01',   // CMO
        8: 'a-cfo-01',   // CFO
        9: 'a-cdo-01'    // CDO
      };
      
      const agentId = neuraToAgent[neuraId] || 'a-ceo-01';
      
      const response = await fetch(`${API_URL}/invoke/${agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: content // Backend espera "input" no "message"
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      // Agregar respuesta del asistente (backend retorna "output" no "response")
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.output || data.response || 'Sin respuesta',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      // Ignorar errores de abort
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);

      if (onError) {
        onError(error);
      }

      // Agregar mensaje de error en el chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Error: ${error.message}. Por favor, intenta de nuevo.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [neuraId, onError]);

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);

    // Cancelar request en progreso si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clear
  };
}


