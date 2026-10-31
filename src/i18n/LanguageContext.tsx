import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDictionary, translations } from './translations';
import { UnitDefinition } from '../types/units';

const LANGUAGE_STORAGE_KEY = 'dukaan_language_v1';
const HAS_SELECTED_INITIAL_LANG_KEY = 'dukaan_has_selected_lang_v1';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  formatUnitName: (unit: UnitDefinition) => string;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // English is the mandatory default
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'hi' || stored === 'en') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HAS_SELECTED_INITIAL_LANG_KEY) === 'true';
    } catch {
      return true;
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      localStorage.setItem(HAS_SELECTED_INITIAL_LANG_KEY, 'true');
    } catch (e) {
      console.error('Failed to save language preference:', e);
    }
  };

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    try {
      localStorage.setItem(HAS_SELECTED_INITIAL_LANG_KEY, 'true');
    } catch {
      // ignore
    }
  };

  // Pure English vs Pure Hindi unit formatting (prevents random mixing)
  const formatUnitName = (unit: UnitDefinition): string => {
    if (language === 'hi') {
      return unit.hindiName || unit.name;
    }
    return unit.name;
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatUnitName,
        hasSeenOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}
