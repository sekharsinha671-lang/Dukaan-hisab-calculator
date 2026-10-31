import React, { useState, useId } from 'react';
import { UnitDefinition, CalculationRecord, AppSettings } from '../types/units';
import { calculatePriceToQuantity, formatValue, getUnitById } from '../utils/unitConverter';
import { UnitSelectorModal } from './UnitSelectorModal';
import { useTranslation } from '../i18n/LanguageContext';
import { ArrowUpDown, Share2, BookmarkCheck, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/feedback';

interface PriceToQtyCalculatorProps {
  settings: AppSettings;
  customUnits: UnitDefinition[];
  onSaveRecord: (record: CalculationRecord) => void;
  onOpenReceipt: (record: CalculationRecord) => void;
  onOpenAddCustomUnit: () => void;
  initialValues?: {
    itemName?: string;
    rate?: number;
    rateUnitId?: string;
    customerAmount?: number;
    targetUnitId?: string;
  };
}

export const PriceToQtyCalculator: React.FC<PriceToQtyCalculatorProps> = ({
  settings,
  customUnits,
  onSaveRecord,
  onOpenReceipt,
  onOpenAddCustomUnit,
  initialValues,
}) => {
  const { t, language, formatUnitName } = useTranslation();
  const rateInputId = useId();
  const amountInputId = useId();
  const itemInputId = useId();
  const customerInputId = useId();

  // Selected Units
  const defaultRateUnit = getUnitById(initialValues?.rateUnitId || 'kg', customUnits) || getUnitById('kg')!;
  const defaultTargetUnit = getUnitById(initialValues?.targetUnitId || 'gram', customUnits) || getUnitById('gram')!;

  const [rateUnit, setRateUnit] = useState<UnitDefinition>(defaultRateUnit);
  const [targetUnit, setTargetUnit] = useState<UnitDefinition>(defaultTargetUnit);

  // Input Values
  const [rate, setRate] = useState<string>(initialValues?.rate ? String(initialValues.rate) : '60');
  const [customerAmount, setCustomerAmount] = useState<string>(
    initialValues?.customerAmount ? String(initialValues.customerAmount) : '40'
  );
  const [itemName, setItemName] = useState<string>(initialValues?.itemName || '');
  const [customerName, setCustomerName] = useState<string>('');

  // Modals state
  const [isPickingRateUnit, setIsPickingRateUnit] = useState(false);
  const [isPickingTargetUnit, setIsPickingTargetUnit] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Numbers parsing
  const numRate = parseFloat(rate) || 0;
  const numAmount = parseFloat(customerAmount) || 0;

  // Calculation
  const { quantity } = calculatePriceToQuantity(
    numAmount,
    numRate,
    rateUnit,
    targetUnit
  );

  const formattedResult = formatValue(quantity, settings.decimalPlaces, settings.roundingMode);

  // Quick Amount Addition helpers
  const handleAddAmount = (add: number) => {
    playTactileClick();
    const curr = parseFloat(customerAmount) || 0;
    setCustomerAmount(String(curr + add));
  };

  const handleSetAmount = (val: number) => {
    playTactileClick();
    setCustomerAmount(String(val));
  };

  const handleClear = () => {
    playTactileClick();
    setRate('');
    setCustomerAmount('');
    setItemName('');
    setCustomerName('');
    setJustSaved(false);
  };

  // Build Record for saving or sharing
  const createCurrentRecord = (): CalculationRecord => {
    return {
      id: 'rec_' + Date.now(),
      timestamp: Date.now(),
      mode: 'price_to_qty',
      itemName: itemName.trim() || (language === 'hi' ? 'सामान' : 'Retail Item'),
      rate: numRate,
      rateUnitId: rateUnit.id,
      rateUnitSymbol: rateUnit.symbol,
      customerAmount: numAmount,
      resultQuantity: parseFloat(formattedResult.replace(/,/g, '')) || quantity,
      targetUnitId: targetUnit.id,
      targetUnitSymbol: targetUnit.symbol,
      customerName: customerName.trim() || undefined,
    };
  };

  const handleSave = () => {
    if (numRate <= 0 || numAmount <= 0) return;
    playSuccessChime();
    const record = createCurrentRecord();
    onSaveRecord(record);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  const handleShareReceipt = () => {
    if (numRate <= 0 || numAmount <= 0) return;
    playTactileClick();
    const record = createCurrentRecord();
    onOpenReceipt(record);
  };

  // Quick alternative representations without language mixing
  let altEquivText = '';
  if (rateUnit.category === 'weight') {
    if (targetUnit.id === 'gram') {
      const inKg = quantity / 1000;
      altEquivText = `≈ ${formatValue(inKg, 3)} kg`;
    } else if (targetUnit.id === 'kg') {
      const inGrams = quantity * 1000;
      altEquivText = `≈ ${formatValue(inGrams, 1)} g`;
    }
  } else if (rateUnit.category === 'length') {
    if (targetUnit.id === 'meter') {
      altEquivText = `≈ ${formatValue(quantity * 3.28084, 2)} ft`;
    } else if (targetUnit.id === 'feet') {
      altEquivText = `≈ ${formatValue(quantity * 0.3048, 2)} m`;
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Calculation Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{t.priceToQtyTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.priceToQtySubtitle}</p>
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

          {/* Customer Amount (₹) */}
          <div>
            <label htmlFor={amountInputId} className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.customerAmountLabel}
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all overflow-hidden">
              <span className="pl-3.5 pr-1.5 text-base font-bold text-slate-500 select-none">
                {settings.currencySymbol}
              </span>
              <input
                id={amountInputId}
                type="number"
                step="any"
                min="0"
                placeholder={t.amountPlaceholder}
                value={customerAmount}
                onChange={(e) => setCustomerAmount(e.target.value)}
                className="w-full py-2.5 px-2 bg-transparent text-base font-bold font-tabular text-slate-900 focus:outline-hidden"
              />
              <span className="pr-3 text-xs font-bold text-slate-400 select-none">INR</span>
            </div>
            {/* Quick Denominations */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">{t.quickAddLabel}</span>
              {[10, 20, 50, 100, 200, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAddAmount(val)}
                  className="px-2 py-0.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Result Unit Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">{t.calculateInLabel}</span>
            <button
              type="button"
              onClick={() => {
                playTactileClick();
                setIsPickingTargetUnit(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              <span>
                {formatUnitName(targetUnit)} ({targetUnit.symbol})
              </span>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Quick preset portion buttons */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[11px] text-slate-400">{t.presetsLabel}</span>
            {[20, 40, 50, 100].map((presetAmt) => (
              <button
                key={presetAmt}
                type="button"
                onClick={() => handleSetAmount(presetAmt)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  customerAmount === String(presetAmt)
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ₹{presetAmt}
              </button>
            ))}
          </div>
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
              {t.exactQtyToGive}
            </span>
            <span className="text-[11px] font-tabular bg-teal-800/80 px-2 py-0.5 rounded text-teal-100">
              @ {settings.currencySymbol}
              {numRate} / {rateUnit.symbol}
            </span>
          </div>

          <div className="my-4 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-tabular">
                {numRate > 0 && numAmount > 0 ? formattedResult : '0.00'}
                <span className="ml-2 text-2xl sm:text-3xl font-bold text-teal-300 font-sans">
                  {targetUnit.symbol}
                </span>
              </div>
              <p className="text-xs text-teal-200/80 mt-1 font-medium">
                {formatUnitName(targetUnit)}
              </p>
            </div>

            {altEquivText && numRate > 0 && numAmount > 0 && (
              <div className="text-right">
                <span className="text-xs text-teal-300/80 block">{t.equivalentLabel}</span>
                <span className="text-sm font-bold text-teal-100 font-tabular">{altEquivText}</span>
              </div>
            )}
          </div>

          {/* Explanation banner */}
          {numRate > 0 && numAmount > 0 ? (
            <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-700/60 text-xs text-teal-100 leading-relaxed">
              {t.p2qExplanation(numAmount, formattedResult, targetUnit.symbol)}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-800/40 text-xs text-teal-300/70">
              {t.p2qEmptyPrompt}
            </div>
          )}

          {/* Action Buttons: Coral primary CTA */}
          <div className="mt-5 flex items-center gap-3 pt-3 border-t border-teal-800/50 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleSave}
              disabled={numRate <= 0 || numAmount <= 0}
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
              disabled={numRate <= 0 || numAmount <= 0}
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
          if (unit.category !== targetUnit.category) {
            if (unit.category === 'weight') setTargetUnit(getUnitById('gram', customUnits)!);
            else if (unit.category === 'length') setTargetUnit(getUnitById('meter', customUnits)!);
            else if (unit.category === 'volume') setTargetUnit(getUnitById('ml', customUnits)!);
            else if (unit.category === 'count') setTargetUnit(getUnitById('piece', customUnits)!);
          }
        }}
        title={language === 'hi' ? 'भाव की इकाई चुनें' : 'Select Rate Unit'}
        customUnits={customUnits}
        onOpenAddCustomUnit={onOpenAddCustomUnit}
      />

      <UnitSelectorModal
        isOpen={isPickingTargetUnit}
        onClose={() => setIsPickingTargetUnit(false)}
        selectedUnitId={targetUnit.id}
        onSelectUnit={(unit) => setTargetUnit(unit)}
        allowedCategory={rateUnit.category}
        title={language === 'hi' ? 'मात्रा इकाई चुनें' : `Select Target Unit (${rateUnit.category})`}
        customUnits={customUnits}
        onOpenAddCustomUnit={onOpenAddCustomUnit}
      />
    </div>
  );
};
