import { lazy, Suspense } from 'react';

// Lazy load del chat para reducir bundle inicial
const ChatInterface = lazy(() => import('./ChatInterface'));

interface LazyChatProps {
  visible: boolean;
  darkMode: boolean;
  onClose: () => void;
  messages: any[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  streaming: boolean;
  listening: boolean;
  onVoice: () => void;
  onStopVoice: () => void;
  onSpeak: (text: string) => void;
}

export function LazyChat(props: LazyChatProps) {
  if (!props.visible) return null;
  
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-2xl">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Cargando chat...</p>
        </div>
      </div>
    }>
      <ChatInterface {...props} />
    </Suspense>
  );
}

