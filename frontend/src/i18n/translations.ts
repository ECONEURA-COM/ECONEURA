export type Language = 'es' | 'en' | 'fr' | 'de';

export interface Translations {
  common: {
    search: string;
    cancel: string;
    save: string;
    delete: string;
    close: string;
    loading: string;
  };
  nav: {
    dashboard: string;
    agents: string;
    history: string;
    settings: string;
  };
  agents: {
    run: string;
    connect: string;
    test: string;
    executing: string;
    success: string;
    error: string;
  };
  analytics: {
    executions: string;
    avgTime: string;
    tokens: string;
    activeUsers: string;
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    common: {
      search: 'Buscar agentes...',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      close: 'Cerrar',
      loading: 'Cargando...'
    },
    nav: {
      dashboard: 'Panel',
      agents: 'Agentes',
      history: 'Historial',
      settings: 'Configuración'
    },
    agents: {
      run: 'Ejecutar',
      connect: 'Conectar',
      test: 'Probar',
      executing: 'Ejecutando...',
      success: 'Éxito',
      error: 'Error'
    },
    analytics: {
      executions: 'Ejecuciones',
      avgTime: 'Tiempo Promedio',
      tokens: 'Tokens',
      activeUsers: 'Usuarios Activos'
    }
  },
  en: {
    common: {
      search: 'Search agents...',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      close: 'Close',
      loading: 'Loading...'
    },
    nav: {
      dashboard: 'Dashboard',
      agents: 'Agents',
      history: 'History',
      settings: 'Settings'
    },
    agents: {
      run: 'Run',
      connect: 'Connect',
      test: 'Test',
      executing: 'Executing...',
      success: 'Success',
      error: 'Error'
    },
    analytics: {
      executions: 'Executions',
      avgTime: 'Avg Time',
      tokens: 'Tokens',
      activeUsers: 'Active Users'
    }
  },
  fr: {
    common: {
      search: 'Rechercher des agents...',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      close: 'Fermer',
      loading: 'Chargement...'
    },
    nav: {
      dashboard: 'Tableau de bord',
      agents: 'Agents',
      history: 'Historique',
      settings: 'Paramètres'
    },
    agents: {
      run: 'Exécuter',
      connect: 'Connecter',
      test: 'Tester',
      executing: 'Exécution...',
      success: 'Succès',
      error: 'Erreur'
    },
    analytics: {
      executions: 'Exécutions',
      avgTime: 'Temps Moyen',
      tokens: 'Jetons',
      activeUsers: 'Utilisateurs Actifs'
    }
  },
  de: {
    common: {
      search: 'Agenten suchen...',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      close: 'Schließen',
      loading: 'Laden...'
    },
    nav: {
      dashboard: 'Dashboard',
      agents: 'Agenten',
      history: 'Verlauf',
      settings: 'Einstellungen'
    },
    agents: {
      run: 'Ausführen',
      connect: 'Verbinden',
      test: 'Testen',
      executing: 'Wird ausgeführt...',
      success: 'Erfolg',
      error: 'Fehler'
    },
    analytics: {
      executions: 'Ausführungen',
      avgTime: 'Durchschn. Zeit',
      tokens: 'Token',
      activeUsers: 'Aktive Benutzer'
    }
  }
};

export function useTranslation(lang: Language = 'es'): Translations {
  return translations[lang] || translations.es;
}

