import React, { useState, useId } from 'react';
import { UnitDefinition, CalculationRecord, AppSettings } from '../types/units';
import { calculateQuantityToPrice, formatValue, getUnitById } from '../utils/unitConverter';
import { UnitSelectorModal } from './UnitSelectorModal';
import { useTranslation } from '../i18n/LanguageContext';
import { Share2, BookmarkCheck, RotateCcw, ChevronRight, Sparkles, Scale } from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/feedback';

interface QtyToPriceCalculatorProps {
  settings: AppSettings;
  customUnits: UnitDefinition[];
  onSaveRecord: (record: CalculationRecord) => void;
  onOpenReceipt: (record: CalculationRecord) => void;
  onOpenAddCustomUnit: () => void;
  initialValues?: {
    itemName?: string;
    rate?: number;
    rateUnitId?: string;
    inputQuantity?: number;
    inputUnitId?: string;
  };
}

export const QtyToPriceCalculator: React.FC<QtyToPriceCalculatorProps> = ({
  settings,
  customUnits,
  onSaveRecord,
  onOpenReceipt,
  onOpenAddCustomUnit,
  initialValues,
}) => {
  const { t, language, formatUnitName } = useTranslation();
  const rateInputId = useId();
  const qtyInputId = useId();
  const itemInputId = useId();
  const customerInputId = useId();

  // Selected Units
  const defaultRateUnit = getUnitById(initialValues?.rateUnitId || 'kg', customUnits) || getUnitById('kg')!;
  const defaultInputUnit = getUnitById(initialValues?.inputUnitId || 'gram', customUnits) || getUnitById('gram')!;

  const [rateUnit, setRateUnit] = useState<UnitDefinition>(defaultRateUnit);
  const [inputUnit, setInputUnit] = useState<UnitDefinition>(defaultInputUnit);

  // Input Values
  const [rate, setRate] = useState<string>(initialValues?.rate ? String(initialValues.rate) : '60');
  const [quantity, setQuantity] = useState<string>(
    initialValues?.inputQuantity ? String(initialValues.inputQuantity) : '250'
  );
  const [itemName, setItemName] = useState<string>(initialValues?.itemName || '');
  const [customerName, setCustomerName] = useState<string>('');

  // Modals state
  const [isPickingRateUnit, setIsPickingRateUnit] = useState(false);
  const [isPickingInputUnit, setIsPickingInputUnit] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Parsing
  const numRate = parseFloat(rate) || 0;
  const numQty = parseFloat(quantity) || 0;

  // Calculation
  const { price } = calculateQuantityToPrice(
    numQty,
    numRate,
    rateUnit,
    inputUnit
  );

  const formattedPrice = formatValue(price, settings.decimalPlaces, settings.roundingMode);

  // Quick portion setter
  const handleSetPortion = (qtyVal: number, unitId?: string) => {
    playTactileClick();
    setQuantity(String(qtyVal));
    if (unitId) {
      const u = getUnitById(unitId, customUnits);
      if (u) setInputUnit(u);
    }
  };

  const handleClear = () => {
    playTactileClick();
    setRate('');
    setQuantity('');
    setItemName('');
    setCustomerName('');
    setJustSaved(false);
  };

  const createCurrentRecord = (): CalculationRecord => {
    return {
      id: 'rec_' + Date.now(),
      timestamp: Date.now(),
      mode: 'qty_to_price',
      itemName: itemName.trim() || (language === 'hi' ? 'सामान' : 'Retail Item'),
      rate: numRate,
      rateUnitId: rateUnit.id,
      rateUnitSymbol: rateUnit.symbol,
      inputQuantity: numQty,
      inputUnitId: inputUnit.id,
      inputUnitSymbol: inputUnit.symbol,
      resultPrice: parseFloat(formattedPrice.replace(/,/g, '')) || price,
      customerName: customerName.trim() || undefined,
    };
  };

  const handleSave = () => {
    if (numRate <= 0 || numQty <= 0) return;
    playSuccessChime();
    const record = createCurrentRecord();
    onSaveRecord(record);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  const handleShareReceipt = () => {
    if (numRate <= 0 || numQty <= 0) return;
    playTactileClick();
    const record = createCurrentRecord();
    onOpenReceipt(record);
  };

  // Category specific quick buttons (translated)
  const renderQuickPortions = () => {
    if (rateUnit.category === 'weight') {
      const portions = language === 'hi'
        ? [
            { label: '50 ग्राम', val: 50, u: 'gram' },
            { label: '100 ग्राम', val: 100, u: 'gram' },
            { label: '250 ग्राम (पाव)', val: 250, u: 'gram' },
            { label: '500 ग्राम (आधा किलो)', val: 500, u: 'gram' },
            { label: '750 ग्राम (तीन पाव)', val: 750, u: 'gram' },
            { label: '1 किग्रा', val: 1, u: 'kg' },
            { label: '2 किग्रा', val: 2, u: 'kg' },
            { label: '5 किग्रा', val: 5, u: 'kg' },
          ]
        : [
            { label: '50g', val: 50, u: 'gram' },
            { label: '100g', val: 100, u: 'gram' },
            { label: '250g (Quarter kg)', val: 250, u: 'gram' },
            { label: '500g (Half kg)', val: 500, u: 'gram' },
            { label: '750g (3/4 kg)', val: 750, u: 'gram' },
            { label: '1 kg', val: 1, u: 'kg' },
            { label: '2 kg', val: 2, u: 'kg' },
            { label: '5 kg', val: 5, u: 'kg' },
          ];

      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">{t.quickPortionsLabel}</span>
          {portions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSetPortion(item.val, item.u)}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                numQty === item.val && inputUnit.id === item.u
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      );
    }

    if (rateUnit.category === 'count') {
      const countPortions = language === 'hi'
        ? [
            { label: '1 पीस', val: 1, u: 'piece' },
            { label: '6 पीस (1/2 दर्जन)', val: 6, u: 'piece' },
            { label: '1 दर्जन (12)', val: 1, u: 'dozen' },
            { label: '2 दर्जन (24)', val: 2, u: 'dozen' },
            { label: '10 पीस', val: 10, u: 'piece' },
          ]
        : [
            { label: '1 pc', val: 1, u: 'piece' },
            { label: '6 pcs (Half doz)', val: 6, u: 'piece' },
            { label: '1 Dozen (12)', val: 1, u: 'dozen' },
            { label: '2 Dozen (24)', val: 2, u: 'dozen' },
            { label: '10 pcs', val: 10, u: 'piece' },
          ];

      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">{t.quickPortionsLabel}</span>
          {countPortions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSetPortion(item.val, item.u)}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                numQty === item.val && inputUnit.id === item.u
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      );
    }

    if (rateUnit.category === 'length') {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">{t.quickLengthsLabel}</span>
          {[
            { label: '0.5 m', val: 0.5, u: 'meter' },
            { label: '1 m', val: 1, u: 'meter' },
            { label: '2.25 m', val: 2.25, u: 'meter' },
            { label: '5.5 m', val: 5.5, u: 'meter' },
            { label: '10 m', val: 10, u: 'meter' },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSetPortion(item.val, item.u)}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                numQty === item.val && inputUnit.id === item.u
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      );
    }

    if (rateUnit.category === 'volume') {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">{t.quickVolumeLabel}</span>
          {[
            { label: '100 ml', val: 100, u: 'ml' },
            { label: '250 ml', val: 250, u: 'ml' },
            { label: '500 ml', val: 500, u: 'ml' },
            { label: '1 Liter', val: 1, u: 'liter' },
            { label: '2 Liter', val: 2, u: 'liter' },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSetPortion(item.val, item.u)}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                numQty === item.val && inputUnit.id === item.u
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Main Calculation Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{t.qtyToPriceTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.qtyToPriceSubtitle}</p>
          </div>
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Reset fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetBtn}</span>
          </button>
        </div>

        {/* Input Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rate per Unit */}
          <div>
            <label htmlFor={rateInputId} className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.productRateLabel}
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all overflow-hidden">
              <span className="pl-3.5 pr-1.5 text-base font-bold text-slate-500 select-none">
                {settings.currencySymbol}
              </span>
              <input
                id={rateInputId}
                type="number"
                step="any"
                min="0"
                placeholder={t.ratePlaceholder}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full py-2.5 px-2 bg-transparent text-base font-bold font-tabular text-slate-900 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setIsPickingRateUnit(true);
                }}
                className="px-3 py-2 mr-1 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
              >
                <span>/ {rateUnit.symbol}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Rate for 1 {formatUnitName(rateUnit)}
            </p>
          </div>

          {/* Customer Quantity */}
          <div>
            <label htmlFor={qtyInputId} className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.customerWantsQtyLabel}
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all overflow-hidden">
              <span className="pl-3.5 pr-1.5 text-slate-400 select-none">
                <Scale className="w-4 h-4" />
              </span>
              <input
                id={qtyInputId}
                type="number"
                step="any"
                min="0"
                placeholder={t.qtyPlaceholder}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full py-2.5 px-2 bg-transparent text-base font-bold font-tabular text-slate-900 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setIsPickingInputUnit(true);
                }}
                className="px-3 py-2 mr-1 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
              >
                <span>{inputUnit.symbol}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Unit: {formatUnitName(inputUnit)}
            </p>
          </div>
        </div>

        {/* Quick Portions Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {renderQuickPortions()}
        </div>

        {/* Optional Item & Customer name for Parchi/Receipt */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-dashed border-slate-200">
          <div>
            <label htmlFor={itemInputId} className="block text-[11px] font-medium text-slate-500 mb-1">
              {t.itemNameLabel}
            </label>
            <input
              id={itemInputId}
              type="text"
              placeholder={t.itemPlaceholder}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-800"
            />
          </div>
          <div>
            <label htmlFor={customerInputId} className="block text-[11px] font-medium text-slate-500 mb-1">
              {t.customerNameLabel}
            </label>
            <input
              id={customerInputId}
              type="text"
              placeholder={t.customerPlaceholder}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Result Card - Prominent Teal Calculation Results */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-teal-950/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs text-teal-200/90 font-medium pb-2 border-b border-teal-700/50">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              {t.totalAmountToCollect}
            </span>
            <span className="text-[11px] font-tabular bg-teal-800/80 px-2 py-0.5 rounded text-teal-100">
              @ {settings.currencySymbol}
              {numRate} / {rateUnit.symbol}
            </span>
          </div>

          <div className="my-4 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-tabular flex items-baseline">
                <span className="text-3xl sm:text-4xl mr-1 text-teal-300">
                  {settings.currencySymbol}
                </span>
                <span>{numRate > 0 && numQty > 0 ? formattedPrice : '0.00'}</span>
              </div>
              <p className="text-xs text-teal-200/80 mt-1 font-medium">
                For {numQty} {inputUnit.symbol} ({formatUnitName(inputUnit)})
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-teal-300/80 block">Equation:</span>
              <span className="text-xs font-semibold text-teal-100 font-tabular">
                {numQty} {inputUnit.symbol} &times; ₹{numRate}/{rateUnit.symbol}
              </span>
            </div>
          </div>

          {/* Explanation */}
          {numRate > 0 && numQty > 0 ? (
            <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-700/60 text-xs text-teal-100 leading-relaxed">
              {t.q2pExplanation(numQty, inputUnit.symbol, formattedPrice)}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-800/40 text-xs text-teal-300/70">
              {t.q2pEmptyPrompt}
            </div>
          )}

          {/* Action Buttons: Coral primary CTA */}
          <div className="mt-5 flex items-center gap-3 pt-3 border-t border-teal-800/50 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleSave}
              disabled={numRate <= 0 || numQty <= 0}
              className={`w-full sm:w-auto flex-1 min-h-[48px] px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
                justSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-rose-950/20'
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{justSaved ? t.savedToParchiSuccess : t.saveToParchiBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleShareReceipt}
              disabled={numRate <= 0 || numQty <= 0}
              className="w-full sm:w-auto min-h-[48px] px-4 py-3 bg-teal-800 hover:bg-teal-700 active:bg-teal-900 text-white font-semibold text-xs rounded-xl border border-teal-600/50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.shareSlipBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unit Pickers Modals */}
      <UnitSelectorModal
        isOpen={isPickingRateUnit}
        onClose={() => setIsPickingRateUnit(false)}
        selectedUnitId={rateUnit.id}
        onSelectUnit={(unit) => {
          setRateUnit(unit);
          if (unit.category !== inputUnit.category) {
            if (unit.category === 'weight') setInputUnit(getUnitById('gram', customUnits)!);
            else if (unit.category === 'length') setInputUnit(getUnitById('meter', customUnits)!);
            else if (unit.category === 'volume') setInputUnit(getUnitById('ml', customUnits)!);
            else if (unit.category === 'count') setInputUnit(getUnitById('piece', customUnits)!);
          }
        }}
        title={language === 'hi' ? 'भाव की इकाई चुनें' : 'Select Rate Unit'}
        customUnits={customUnits}
        onOpenAddCustomUnit={onOpenAddCustomUnit}
      />

      <UnitSelectorModal
        isOpen={isPickingInputUnit}
        onClose={() => setIsPickingInputUnit(false)}
        selectedUnitId={inputUnit.id}
        onSelectUnit={(unit) => setInputUnit(unit)}
        allowedCategory={rateUnit.category}
        title={language === 'hi' ? 'मात्रा इकाई चुनें' : `Select Quantity Unit (${rateUnit.category})`}
        customUnits={customUnits}
        onOpenAddCustomUnit={onOpenAddCustomUnit}
      />
    </div>
  );
};
