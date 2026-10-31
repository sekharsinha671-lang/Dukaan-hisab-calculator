import React, { useState } from 'react';
import { UnitCategory, UnitDefinition } from '../types/units';
import { STANDARD_UNITS, convertQuantity, formatValue } from '../utils/unitConverter';
import { useTranslation } from '../i18n/LanguageContext';
import { Plus, Trash2, ArrowRightLeft, Layers } from 'lucide-react';
import { playTactileClick } from '../utils/feedback';

interface CustomUnitsViewProps {
  customUnits: UnitDefinition[];
  onOpenAddModal: () => void;
  onDeleteCustomUnit: (id: string) => void;
}

export const CustomUnitsView: React.FC<CustomUnitsViewProps> = ({
  customUnits,
  onOpenAddModal,
  onDeleteCustomUnit,
}) => {
  const { t, language, formatUnitName } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory | 'all'>('all');

  // Interactive testing calculator
  const [testAmount, setTestAmount] = useState('1');
  const [fromUnitId, setFromUnitId] = useState('kg');
  const [toUnitId, setToUnitId] = useState('gram');

  const allUnits = [...STANDARD_UNITS, ...customUnits];
  const displayedUnits = allUnits.filter((u) =>
    selectedCategory === 'all' ? true : u.category === selectedCategory
  );

  const fromUnit = allUnits.find((u) => u.id === fromUnitId) || allUnits[0];
  const eligibleToUnits = allUnits.filter((u) => u.category === fromUnit.category);
  const toUnit = eligibleToUnits.find((u) => u.id === toUnitId) || eligibleToUnits[1] || eligibleToUnits[0];

  const testNum = parseFloat(testAmount) || 0;
  const converted = convertQuantity(testNum, fromUnit, toUnit);

  const categories: { id: UnitCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.allUnits },
    { id: 'weight', label: t.weightCategory },
    { id: 'length', label: t.lengthCategory },
    { id: 'volume', label: t.volumeCategory },
    { id: 'count', label: t.countingCategory },
    { id: 'custom', label: t.customCategory },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>{t.unitsTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.unitsSubtitle}</p>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onOpenAddModal();
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addCustomUnitBtn}</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playTactileClick();
                setSelectedCategory(cat.id as UnitCategory | 'all');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Unit Converter Quick Tester */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-200">
        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 mb-2">
          <ArrowRightLeft className="w-4 h-4 text-teal-700" />
          <span>{t.quickTesterTitle}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
          <div className="flex items-center bg-white rounded-xl border border-teal-300 p-1">
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="w-1/2 px-2 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden"
              placeholder="1"
            />
            <select
              value={fromUnit.id}
              onChange={(e) => {
                setFromUnitId(e.target.value);
                const nextFrom = allUnits.find((u) => u.id === e.target.value);
                if (nextFrom) {
                  const eligible = allUnits.filter((u) => u.category === nextFrom.category);
                  if (eligible.length > 1) {
                    setToUnitId(eligible[1].id);
                  }
                }
              }}
              className="w-1/2 py-1 text-xs font-medium bg-slate-50 border-l border-slate-200 text-slate-800"
            >
              {allUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.symbol} ({formatUnitName(u)})
                </option>
              ))}
            </select>
          </div>

          <div className="text-center font-bold text-teal-700 text-xs sm:text-sm">
            {t.equalsText}
          </div>

          <div className="flex items-center bg-white rounded-xl border border-teal-300 p-1">
            <div className="w-1/2 px-2 py-1.5 text-xs font-bold text-teal-800 font-tabular truncate">
              {formatValue(converted, 3)}
            </div>
            <select
              value={toUnit.id}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-1/2 py-1 text-xs font-medium bg-slate-50 border-l border-slate-200 text-slate-800"
            >
              {eligibleToUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.symbol} ({formatUnitName(u)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedUnits.map((unit) => (
          <div
            key={unit.id}
            className={`bg-white rounded-2xl p-4 border transition-all ${
              unit.isCustom
                ? 'border-amber-200 bg-amber-50/20 shadow-2xs'
                : 'border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-slate-100 font-tabular font-bold text-xs flex items-center justify-center text-slate-700">
                  {unit.symbol}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{formatUnitName(unit)}</h4>
                  <p className="text-xs text-slate-500 font-tabular">{unit.symbol}</p>
                </div>
              </div>

              {unit.isCustom && (
                <button
                  onClick={() => {
                    playTactileClick();
                    onDeleteCustomUnit(unit.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete custom unit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="capitalize font-medium text-slate-600">{unit.category}</span>
              <span className="font-tabular text-slate-400">{unit.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
