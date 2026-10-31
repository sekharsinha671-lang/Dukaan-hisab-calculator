import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { Languages, Check, ArrowRight } from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/feedback';

interface LanguageOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageOnboardingModal: React.FC<LanguageOnboardingModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t, completeOnboarding } = useTranslation();

  if (!isOpen) return null;

  const handleSelect = (lang: Language) => {
    playTactileClick();
    setLanguage(lang);
  };

  const handleContinue = () => {
    playSuccessChime();
    completeOnboarding();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto mb-4">
          <Languages className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'दुकान हिसाब में आपका स्वागत है' : 'Welcome to Dukaan Hisab'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
          {language === 'hi'
            ? 'भारतीय खुदरा और थोक व्यापारियों के लिए भाव व वजन कैलकुलेटर। अपनी भाषा चुनें:'
            : 'Smart retail and wholesale calculator. Please select your preferred language:'}
        </p>

        {/* Language Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* English Option */}
          <button
            type="button"
            onClick={() => handleSelect('en')}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              language === 'en'
                ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600 shadow-sm'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            {language === 'en' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
            <span className="text-sm font-extrabold text-slate-900 block">English</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Default</span>
            <span className="text-[11px] text-teal-700 font-semibold mt-2 block">All menus in English</span>
          </button>

          {/* Hindi Option */}
          <button
            type="button"
            onClick={() => handleSelect('hi')}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              language === 'hi'
                ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600 shadow-sm'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            {language === 'hi' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
            <span className="text-sm font-extrabold text-slate-900 block">हिंदी</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Hindi</span>
            <span className="text-[11px] text-teal-700 font-semibold mt-2 block">सभी मेनू हिंदी में</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3.5 px-4 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
