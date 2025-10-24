import { describe, it, expect } from 'vitest';
import { translations, useTranslation } from '../translations';

describe('translations', () => {
  it('has all required languages', () => {
    expect(translations.es).toBeDefined();
    expect(translations.en).toBeDefined();
    expect(translations.fr).toBeDefined();
    expect(translations.de).toBeDefined();
  });

  it('has consistent structure across languages', () => {
    const languages = ['es', 'en', 'fr', 'de'] as const;
    
    languages.forEach(lang => {
      expect(translations[lang].common).toBeDefined();
      expect(translations[lang].nav).toBeDefined();
      expect(translations[lang].agents).toBeDefined();
      expect(translations[lang].analytics).toBeDefined();
    });
  });

  it('has all common keys', () => {
    const requiredKeys = ['search', 'cancel', 'save', 'delete', 'close', 'loading'];
    
    Object.values(translations).forEach(t => {
      requiredKeys.forEach(key => {
        expect(t.common[key as keyof typeof t.common]).toBeDefined();
      });
    });
  });

  it('useTranslation returns correct language', () => {
    const es = useTranslation('es');
    expect(es.common.search).toBe('Buscar agentes...');

    const en = useTranslation('en');
    expect(en.common.search).toBe('Search agents...');
  });

  it('useTranslation defaults to Spanish', () => {
    const t = useTranslation();
    expect(t.common.search).toBe('Buscar agentes...');
  });

  it('has no missing translations', () => {
    const esKeys = JSON.stringify(translations.es);
    
    Object.entries(translations).forEach(([lang, t]) => {
      const langKeys = JSON.stringify(t);
      
      // All languages should have same structure
      expect(langKeys.split(':').length).toBe(esKeys.split(':').length);
    });
  });
});

