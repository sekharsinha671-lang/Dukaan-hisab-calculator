import React, { useState } from 'react';
import { UnitCategory, UnitDefinition } from '../types/units';
import { getAllUnits } from '../utils/unitConverter';
import { useTranslation } from '../i18n/LanguageContext';
import { X, Search, Check, Plus } from 'lucide-react';
import { playTactileClick } from '../utils/feedback';

interface UnitSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUnitId: string;
  onSelectUnit: (unit: UnitDefinition) => void;
  title?: string;
  allowedCategory?: UnitCategory;
  customUnits?: UnitDefinition[];
  onOpenAddCustomUnit?: () => void;
}

export const UnitSelectorModal: React.FC<UnitSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedUnitId,
  onSelectUnit,
  title,
  allowedCategory,
  customUnits = [],
  onOpenAddCustomUnit,
}) => {
  const { t, language, formatUnitName } = useTranslation();
  const [activeTab, setActiveTab] = useState<UnitCategory | 'all'>(allowedCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const allUnits = getAllUnits(customUnits);

  const filteredUnits = allUnits.filter((u) => {
    if (allowedCategory && u.category !== allowedCategory) return false;
    if (!allowedCategory && activeTab !== 'all' && u.category !== activeTab) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.symbol.toLowerCase().includes(q) ||
      (u.hindiName && u.hindiName.toLowerCase().includes(q)) ||
      (u.description && u.description.toLowerCase().includes(q))
    );
  });

  const categories: { id: UnitCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.allUnits },
    { id: 'weight', label: t.weightCategory },
    { id: 'length', label: t.lengthCategory },
    { id: 'volume', label: t.volumeCategory },
    { id: 'count', label: t.countingCategory },
    { id: 'custom', label: t.customCategory },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title || t.unitsTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi' ? 'गणना के लिए इकाई चुनें' : 'Choose unit for calculation'}
            </p>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'खोजें: किग्रा, ग्राम, मीटर, पीस...' : 'Search kg, gram, meter, piece...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          {!allowedCategory && (
            <div className="flex items-center gap-1.5 overflow-x-auto mt-2.5 pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playTactileClick();
                    setActiveTab(cat.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                    activeTab === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Units List */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-1 min-h-[220px]">
          {filteredUnits.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">
                {language === 'hi' ? `कोई इकाई नहीं मिली "${searchQuery}"` : `No units found matching "${searchQuery}"`}
              </p>
              {onOpenAddCustomUnit && (
                <button
                  onClick={() => {
                    playTactileClick();
                    onClose();
                    onOpenAddCustomUnit();
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-3.5 py-2 rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t.addCustomUnitBtn}
                </button>
              )}
            </div>
          ) : (
            filteredUnits.map((u) => {
              const isSelected = u.id === selectedUnitId;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    playTactileClick();
                    onSelectUnit(u);
                    onClose();
                  }}
                  className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-tabular shrink-0 ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.symbol}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {formatUnitName(u)}
                        </span>
                        {u.isCustom && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Custom
                          </span>
                        )}
                      </div>
                      {u.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{u.description}</p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer with Add Custom Unit trigger */}
        {onOpenAddCustomUnit && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {language === 'hi' ? 'विशेष वजन या पैकेजिंग चाहिए?' : 'Need a special pack or weight?'}
            </span>
            <button
              onClick={() => {
                playTactileClick();
                onClose();
                onOpenAddCustomUnit();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-white border border-teal-300 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addCustomUnitBtn}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
