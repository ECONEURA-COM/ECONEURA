import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Mic, MicOff, Send, Volume2, X } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  visible: boolean;
  darkMode: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  streaming: boolean;
  listening: boolean;
  onVoice: () => void;
  onStopVoice: () => void;
  onSpeak: (text: string) => void;
}

/**
 * Chat Interface Component (Lazy Loaded)
 * Renderiza el chat premium con soporte para markdown, voz, y streaming
 */
export default function ChatInterface({
  visible,
  darkMode,
  onClose,
  messages,
  input,
  onInputChange,
  onSend,
  streaming,
  listening,
  onVoice,
  onStopVoice,
  onSpeak
}: ChatInterfaceProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 md:inset-4 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-2 md:p-4">
      <div className={`w-full h-full md:max-w-4xl md:max-h-[85vh] rounded-none md:rounded-3xl shadow-2xl flex flex-col overflow-hidden ${
        darkMode ? 'bg-[#0d1117]' : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
      }`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-4 md:p-6 border-b ${
          darkMode ? 'border-slate-800 bg-[#161b22]' : 'border-slate-200/60 bg-white/80'
        }`}>
          <h3 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            💬 Chat con NEURA
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
            aria-label="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((m: ChatMessage) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                m.role === 'user'
                  ? darkMode
                    ? 'bg-emerald-900/30 text-emerald-100'
                    : 'bg-emerald-500/10 text-emerald-900'
                  : darkMode
                    ? 'bg-slate-800/50 text-slate-200'
                    : 'bg-slate-100 text-slate-800'
              }`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => onSpeak(m.text)}
                    className="mt-2 text-xs opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" /> Escuchar
                  </button>
                )}
              </div>
            </div>
          ))}
          {streaming && (
            <div className="flex justify-start">
              <div className={`px-4 py-3 rounded-2xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`p-4 md:p-6 border-t ${darkMode ? 'border-slate-800 bg-[#161b22]' : 'border-slate-200/60 bg-white/80'}`}>
          <div className="flex gap-2">
            <button
              onClick={listening ? onStopVoice : onVoice}
              className={`p-3 rounded-xl transition-all ${
                listening
                  ? 'bg-red-500 text-white animate-pulse'
                  : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              aria-label={listening ? 'Detener grabación' : 'Grabar voz'}
            >
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
              placeholder="Escribe tu mensaje..."
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            <button
              onClick={onSend}
              disabled={!input.trim() || streaming}
              className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
