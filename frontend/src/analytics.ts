// Vercel Analytics - Real Integration
// Tracks pageviews and custom events

export function initAnalytics() {
  // Vercel Analytics auto-injects if enabled in dashboard
  // No SDK needed for basic analytics

  // Vercel Analytics initialized (silent)
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', { name: eventName, data: properties });
  }
}

// Custom events for ECONEURA
export const analytics = {
  chatSent: (neuraId: string, inputLength: number) => {
    trackEvent('chat_sent', { neura_id: neuraId, input_length: inputLength });
  },

  neuraSelected: (neuraId: string) => {
    trackEvent('neura_selected', { neura_id: neuraId });
  },

  errorOccurred: (errorType: string, message: string) => {
    trackEvent('error', { error_type: errorType, message });
  }
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    va?: (event: string, data: any) => void;
  }
}
