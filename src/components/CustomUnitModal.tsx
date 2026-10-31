import React, { useState } from 'react';
import { UnitCategory, UnitDefinition } from '../types/units';
import { useTranslation } from '../i18n/LanguageContext';
import { X, Check, Sparkles } from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/feedback';

interface CustomUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomUnit: (unit: UnitDefinition) => void;
}

export const CustomUnitModal: React.FC<CustomUnitModalProps> = ({
  isOpen,
  onClose,
  onAddCustomUnit,
}) => {
  const { t, language } = useTranslation();
  const isHindi = language === 'hi';

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [category, setCategory] = useState<UnitCategory>('weight');
  const [baseMultiplier, setBaseMultiplier] = useState<string>('50');
  const [referenceUnit, setReferenceUnit] = useState<string>('kg');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = isHindi
    ? [
        { name: 'बोरी (50 किग्रा)', symbol: 'बोरी', cat: 'weight', mult: '50', ref: 'kg' },
        { name: 'कट्टा (25 किग्रा)', symbol: 'कट्टा', cat: 'weight', mult: '25', ref: 'kg' },
        { name: 'डिब्बा (500 ग्राम)', symbol: 'डिब्बा', cat: 'weight', mult: '0.5', ref: 'kg' },
        { name: 'पेटी (24 नग)', symbol: 'पेटी', cat: 'count', mult: '24', ref: 'pc' },
        { name: 'पेटी (12 नग)', symbol: 'पेटी12', cat: 'count', mult: '12', ref: 'pc' },
        { name: 'थान (20 मीटर कपड़ा)', symbol: 'थान', cat: 'length', mult: '20', ref: 'm' },
        { name: 'केन (5 लीटर)', symbol: 'केन', cat: 'volume', mult: '5', ref: 'L' },
      ]
    : [
        { name: 'Bag (50 kg)', symbol: 'bag', cat: 'weight', mult: '50', ref: 'kg' },
        { name: 'Sack (25 kg)', symbol: 'sack', cat: 'weight', mult: '25', ref: 'kg' },
        { name: 'Box (500g)', symbol: 'box', cat: 'weight', mult: '0.5', ref: 'kg' },
        { name: 'Carton (24 pcs)', symbol: 'carton', cat: 'count', mult: '24', ref: 'pc' },
        { name: 'Pack (12 pcs)', symbol: 'pack12', cat: 'count', mult: '12', ref: 'pc' },
        { name: 'Roll (20m Cloth)', symbol: 'roll', cat: 'length', mult: '20', ref: 'm' },
        { name: 'Can (5 Liters)', symbol: 'can', cat: 'volume', mult: '5', ref: 'L' },
      ];

  const applyPreset = (p: typeof presets[0]) => {
    playTactileClick();
    setName(p.name);
    setSymbol(p.symbol);
    setCategory(p.cat as UnitCategory);
    setBaseMultiplier(p.mult);
    setReferenceUnit(p.ref);
    setError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(isHindi ? 'कृपया इकाई का नाम दर्ज करें' : 'Please enter unit name (e.g. Bag, Box, Carton)');
      return;
    }
    const multNum = parseFloat(baseMultiplier);
    if (isNaN(multNum) || multNum <= 0) {
      setError(isHindi ? 'कृपया सकारात्मक संख्या दर्ज करें' : 'Please enter a valid positive multiplier');
      return;
    }

    let factor = multNum;
    if (category === 'weight') {
      if (referenceUnit === 'g') factor = multNum * 0.001;
      else if (referenceUnit === 'qtl') factor = multNum * 100;
      else factor = multNum; // kg
    } else if (category === 'length') {
      if (referenceUnit === 'cm') factor = multNum * 0.01;
      else if (referenceUnit === 'ft') factor = multNum * 0.3048;
      else factor = multNum; // meter
    } else if (category === 'volume') {
      if (referenceUnit === 'ml') factor = multNum * 0.001;
      else factor = multNum; // liter
    } else {
      if (referenceUnit === 'doz') factor = multNum * 12;
      else factor = multNum; // piece
    }

    const cleanSymbol = symbol.trim() || name.trim().slice(0, 4).toLowerCase();
    const newUnit: UnitDefinition = {
      id: 'custom_' + Date.now(),
      name: name.trim(),
      hindiName: name.trim(),
      symbol: cleanSymbol,
      category,
      baseFactor: factor,
      isCustom: true,
      description: `1 ${cleanSymbol} = ${multNum} ${referenceUnit}`,
    };

    playSuccessChime();
    onAddCustomUnit(newUnit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.addCustomUnitBtn}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHindi ? 'अपनी दुकान के विशेष पैकेट, बोरी या डिब्बा परिभाषित करें' : 'Define your own shop pack, bag, or container'}
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHindi ? 'त्वरित प्रिसेट:' : 'Quick Shop Presets:'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'श्रेणी' : 'Category'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: 'weight', label: t.weightCategory, ref: 'kg' },
                  { id: 'count', label: t.countingCategory, ref: 'pc' },
                  { id: 'length', label: t.lengthCategory, ref: 'm' },
                  { id: 'volume', label: t.volumeCategory, ref: 'L' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setCategory(cat.id);
                    setReferenceUnit(cat.ref);
                  }}
                  className={`py-2 px-2 text-center rounded-xl border text-xs font-semibold transition-all ${
                    category === cat.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Unit Name & Short Symbol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.unitNameLabel} *
              </label>
              <input
                type="text"
                required
                placeholder={isHindi ? 'उदा. बोरी, पेटी' : 'e.g. Bag, Box, Carton'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.shortSymbolLabel}
              </label>
              <input
                type="text"
                placeholder="e.g. bag, box"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 text-slate-900 font-tabular"
              />
            </div>
          </div>

          {/* Conversion Equation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.equalsEquationLabel(symbol || name || (isHindi ? 'इकाई' : 'Unit'))}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                min="0.0001"
                required
                placeholder="50"
                value={baseMultiplier}
                onChange={(e) => setBaseMultiplier(e.target.value)}
                className="w-1/2 px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 text-slate-900 font-tabular font-bold"
              />
              <select
                value={referenceUnit}
                onChange={(e) => setReferenceUnit(e.target.value)}
                className="w-1/2 px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 text-slate-900"
              >
                {category === 'weight' && (
                  <>
                    <option value="kg">{isHindi ? 'किलोग्राम (किग्रा)' : 'Kilograms (kg)'}</option>
                    <option value="g">{isHindi ? 'ग्राम (ग्रा)' : 'Grams (g)'}</option>
                    <option value="qtl">{isHindi ? 'क्विंटल' : 'Quintal'}</option>
                  </>
                )}
                {category === 'count' && (
                  <>
                    <option value="pc">{isHindi ? 'पीस / नग' : 'Pieces (pc)'}</option>
                    <option value="doz">{isHindi ? 'दर्जन' : 'Dozen (12)'}</option>
                  </>
                )}
                {category === 'length' && (
                  <>
                    <option value="m">{isHindi ? 'मीटर' : 'Meters (m)'}</option>
                    <option value="cm">{isHindi ? 'सेंटीमीटर' : 'Centimeters (cm)'}</option>
                    <option value="ft">{isHindi ? 'फीट' : 'Feet (ft)'}</option>
                  </>
                )}
                {category === 'volume' && (
                  <>
                    <option value="L">{isHindi ? 'लीटर' : 'Liters (L)'}</option>
                    <option value="ml">{isHindi ? 'मिलीलीटर' : 'Milliliters (ml)'}</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                playTactileClick();
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors min-h-[44px] flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveUnitBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
