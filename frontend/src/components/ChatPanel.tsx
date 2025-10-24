import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Mic, MicOff, Send, X, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { cx } from '../utils/classnames';
import { toast } from 'sonner';

interface ChatPanelProps {
  neuraId: number;
  department: string;
  darkMode: boolean;
  visible: boolean;
  onClose: () => void;
}

/**
 * Chat Panel Component con AI Gateway 2025
 * Usa el hook useChat para comunicación con backend serverless
 */
export function ChatPanel({ neuraId, department, darkMode, visible, onClose }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | null>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const { messages, isLoading, error, sendMessage, clear } = useChat({
    neuraId,
    onError: (err) => {
      if (import.meta.env.DEV) {
        console.error('Chat error:', err);
      }
    }
  });

  // Auto-scroll al final del chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice input (Web Speech API)
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input no disponible en este navegador');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    }
  };

  const handleFeedback = (messageIndex: number, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [messageIndex]: prev[messageIndex] === type ? null : type
    }));
    
    toast.success(
      type === 'up' 
        ? '¡Gracias por tu feedback positivo!' 
        : 'Gracias, trabajaremos para mejorar'
    );
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 md:inset-4 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-2 md:p-4">
      <div className={cx(
        "w-full h-full md:max-w-4xl md:max-h-[85vh] rounded-none md:rounded-3xl shadow-2xl flex flex-col overflow-hidden",
        darkMode ? 'bg-[#0d1117]' : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
      )}>
        {/* Header */}
        <div className={cx(
          "flex justify-between items-center p-4 md:p-6 border-b",
          darkMode ? 'border-slate-800 bg-[#161b22]' : 'border-slate-200/60 bg-white/80'
        )}>
          <div className="flex items-center gap-3">
            <div className={cx(
              "p-2 rounded-xl",
              darkMode ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
            )}>
              <Sparkles className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className={cx(
                "text-lg md:text-xl font-bold",
                darkMode ? 'text-slate-100' : 'text-slate-900'
              )}>
                Chat con NEURA
              </h3>
              <p className={cx(
                "text-xs md:text-sm",
                darkMode ? 'text-slate-400' : 'text-slate-600'
              )}>
                {department}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={cx(
              "p-2 rounded-lg transition-colors",
              darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            )}
            aria-label="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className={cx(
          "flex-1 overflow-y-auto p-4 md:p-6 space-y-4",
          darkMode ? 'bg-[#0d1117]' : 'bg-slate-50/50'
        )}>
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className={cx(
                "w-16 h-16 mx-auto mb-4",
                darkMode ? 'text-slate-700' : 'text-slate-300'
              )} />
              <p className={cx(
                "text-lg font-medium mb-2",
                darkMode ? 'text-slate-400' : 'text-slate-600'
              )}>
                ¡Hola! Soy la NEURA de {department}
              </p>
              <p className={cx(
                "text-sm",
                darkMode ? 'text-slate-500' : 'text-slate-500'
              )}>
                ¿En qué puedo ayudarte hoy?
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx}>
              <div
                className={cx(
                  "flex",
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div className={cx(
                  "max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                  msg.role === 'user'
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : darkMode
                      ? 'bg-[#161b22] text-slate-100 border border-slate-800'
                      : 'bg-white text-slate-900 border border-slate-200'
                )}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm max-w-none dark:prose-invert"
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Feedback buttons solo para mensajes del assistant */}
              {msg.role === 'assistant' && (
                <div className="flex justify-start mt-1 ml-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleFeedback(idx, 'up')}
                      className={cx(
                        "p-1.5 rounded-lg transition-all hover:scale-110",
                        feedback[idx] === 'up'
                          ? 'bg-green-100 text-green-600'
                          : darkMode
                            ? 'text-slate-500 hover:bg-slate-800 hover:text-green-400'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-green-600'
                      )}
                      aria-label="Útil"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(idx, 'down')}
                      className={cx(
                        "p-1.5 rounded-lg transition-all hover:scale-110",
                        feedback[idx] === 'down'
                          ? 'bg-red-100 text-red-600'
                          : darkMode
                            ? 'text-slate-500 hover:bg-slate-800 hover:text-red-400'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-red-600'
                      )}
                      aria-label="No útil"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className={cx(
                "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                darkMode
                  ? 'bg-[#161b22] border border-slate-800'
                  : 'bg-white border border-slate-200'
              )}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className={cx(
                      "w-2 h-2 rounded-full animate-bounce",
                      darkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                    )} style={{ animationDelay: '0ms' }} />
                    <div className={cx(
                      "w-2 h-2 rounded-full animate-bounce",
                      darkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                    )} style={{ animationDelay: '150ms' }} />
                    <div className={cx(
                      "w-2 h-2 rounded-full animate-bounce",
                      darkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                    )} style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className={cx(
                    "text-sm",
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  )}>
                    Pensando...
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error.message}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={cx(
          "border-t p-4",
          darkMode ? 'border-slate-800 bg-[#161b22]' : 'border-slate-200 bg-white'
        )}>
          <div className={cx(
            "flex items-end gap-2 rounded-2xl transition-all duration-300 p-1",
            darkMode
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-slate-50 border border-slate-200'
          )}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className={cx(
                "flex-1 bg-transparent border-none outline-none resize-none px-4 py-3 text-[15px] font-normal min-h-[44px] max-h-[120px]",
                darkMode
                  ? 'text-slate-100 placeholder-slate-500'
                  : 'text-slate-900 placeholder-slate-400'
              )}
              placeholder="Escribe tu mensaje..."
              rows={1}
            />

            {/* Voice button */}
            <button
              onClick={toggleVoiceInput}
              className={cx(
                "p-3 rounded-xl transition-all duration-300",
                listening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : darkMode
                    ? 'hover:bg-slate-700 text-slate-400'
                    : 'hover:bg-slate-200 text-slate-600'
              )}
              aria-label={listening ? "Detener voz" : "Activar voz"}
            >
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cx(
                "p-3 rounded-xl transition-all duration-300 shadow-lg active:scale-95",
                input.trim() && !isLoading
                  ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
                  : darkMode
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
              aria-label="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Info */}
          <div className={cx(
            "flex items-center justify-between mt-2 px-2 text-xs",
            darkMode ? 'text-slate-500' : 'text-slate-500'
          )}>
            <span>
              Modelo: {/* Se mostrará dinámicamente desde /api/models */}
            </span>
            <span>
              Enter para enviar, Shift+Enter para nueva línea
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

