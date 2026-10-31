import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Calculator,
  TrendingUp,
  History,
  Layers,
  Settings,
  Smartphone,
  Monitor,
  Languages,
  Sparkles,
} from 'lucide-react';
import { playTactileClick } from '../utils/feedback';
import { PWAInstallButton } from './PWAInstallButton';
import { ShopProfile } from '../types/units';

interface TopBarProps {
  activeTab: 'calc' | 'profit' | 'history' | 'units' | 'settings';
  setActiveTab: (tab: 'calc' | 'profit' | 'history' | 'units' | 'settings') => void;
  shopProfile: ShopProfile;
  isPhoneFrameView: boolean;
  setIsPhoneFrameView: (val: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  shopProfile,
  isPhoneFrameView,
  setIsPhoneFrameView,
}) => {
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    playTactileClick();
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand & Shop info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-black text-lg shadow-xs">
            ₹
          </div>
          <div className="leading-tight">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 block">
              {t.appTitle}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <span className="truncate max-w-[140px] sm:max-w-[220px]">
                {shopProfile.shopName || t.appSubtitle}
              </span>
              <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-1 rounded text-[9px] font-bold">
                100% Free
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              playTactileClick();
              setActiveTab('calc');
            }}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'calc'
                ? 'text-slate-900 border-teal-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>{t.calcTab}</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setActiveTab('profit');
            }}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'profit'
                ? 'text-slate-900 border-teal-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>{t.profitTab}</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setActiveTab('history');
            }}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'history'
                ? 'text-slate-900 border-teal-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-teal-600" />
            <span>{t.historyTab}</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setActiveTab('units');
            }}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'units'
                ? 'text-slate-900 border-teal-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-600" />
            <span>{t.unitsTab}</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setActiveTab('settings');
            }}
            className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'settings'
                ? 'text-slate-900 border-teal-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-teal-600" />
            <span>{t.settingsTab}</span>
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* In-App APK / PWA Install Button */}
          <PWAInstallButton />

          {/* Quick Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors"
            title="Toggle English / Hindi"
          >
            <Languages className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Desktop Preview Frame Mode Switch */}
          <button
            type="button"
            onClick={() => {
              playTactileClick();
              setIsPhoneFrameView(!isPhoneFrameView);
            }}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Toggle between Responsive Dashboard and Mobile Screen Preview"
          >
            {isPhoneFrameView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden xl:inline">{t.wideDashboard}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden xl:inline">{t.phoneView}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
