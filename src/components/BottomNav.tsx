import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { Calculator, TrendingUp, History, Layers, Settings } from 'lucide-react';
import { playTactileClick } from '../utils/feedback';

interface BottomNavProps {
  activeTab: 'calc' | 'profit' | 'history' | 'units' | 'settings';
  setActiveTab: (tab: 'calc' | 'profit' | 'history' | 'units' | 'settings') => void;
  historyCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'calc' as const,
      label: t.calcTab,
      icon: Calculator,
    },
    {
      id: 'profit' as const,
      label: t.profitTab,
      icon: TrendingUp,
    },
    {
      id: 'history' as const,
      label: t.historyTab,
      icon: History,
      badge: historyCount > 0 ? historyCount : undefined,
    },
    {
      id: 'units' as const,
      label: t.unitsTab,
      icon: Layers,
    },
    {
      id: 'settings' as const,
      label: t.settingsTab,
      icon: Settings,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg shadow-slate-900/5"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playTactileClick();
                setActiveTab(tab.id);
              }}
              className="relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-all select-none group"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 group-active:scale-90 ${
                    isActive ? 'text-teal-600 stroke-[2.4]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-teal-600 text-white text-[9px] font-bold rounded-full min-w-[14px] text-center">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-1 transition-colors whitespace-nowrap ${
                  isActive ? 'font-bold text-slate-900' : 'font-medium text-slate-400 group-hover:text-slate-600'
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <span className="w-5 h-0.5 bg-teal-600 rounded-full mt-0.5 animate-in fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
