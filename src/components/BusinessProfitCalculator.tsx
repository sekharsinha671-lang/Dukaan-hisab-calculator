import React, { useState } from 'react';
import { AppSettings } from '../types/units';
import { useTranslation } from '../i18n/LanguageContext';
import { playTactileClick, playSuccessChime } from '../utils/feedback';
import {
  TrendingUp,
  Percent,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  BadgeDollarSign,
} from 'lucide-react';

interface BusinessProfitCalculatorProps {
  settings: AppSettings;
}

export const BusinessProfitCalculator: React.FC<BusinessProfitCalculatorProps> = ({
  settings,
}) => {
  const { t, language } = useTranslation();

  // Mode: 'calculate_profit' (CP & SP -> Margin & Total Profit) or 'target_margin' (CP & Desired Margin % -> Target SP)
  const [calcMode, setCalcMode] = useState<'calculate_profit' | 'target_margin'>('calculate_profit');

  // Input states
  const [itemName, setItemName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [desiredMargin, setDesiredMargin] = useState('20');
  const [quantity, setQuantity] = useState('1');
  const [gstRate, setGstRate] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const numCost = parseFloat(costPrice) || 0;
  const numSelling = parseFloat(sellingPrice) || 0;
  const numQty = parseFloat(quantity) || 1;
  const numTargetMargin = parseFloat(desiredMargin) || 0;

  // Mode 1: Calculate Profit & Margin
  const profitPerUnit = numSelling > 0 ? numSelling - numCost : 0;
  const totalCost = numCost * numQty;
  const totalRevenue = numSelling * numQty;
  const totalProfit = profitPerUnit * numQty;
  const profitMarginPercent = numSelling > 0 ? (profitPerUnit / numSelling) * 100 : 0;
  const markupPercent = numCost > 0 ? (profitPerUnit / numCost) * 100 : 0;

  // GST calculations
  const gstAmount = gstRate > 0 ? (totalRevenue * gstRate) / (100 + gstRate) : 0;
  const netRevenueExcludingGst = totalRevenue - gstAmount;
  const netProfitAfterGst = totalProfit - gstAmount;

  // Mode 2: Calculate Selling Price from Target Margin
  // Formula: SP = CP / (1 - Margin%/100)
  const calculatedSP =
    numCost > 0 && numTargetMargin < 100
      ? numCost / (1 - numTargetMargin / 100)
      : 0;
  const calculatedProfitPerUnit = calculatedSP - numCost;
  const calculatedTotalProfit = calculatedProfitPerUnit * numQty;

  const formatNumber = (val: number) => {
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: settings.decimalPlaces,
      maximumFractionDigits: settings.decimalPlaces,
    });
  };

  const handleReset = () => {
    playTactileClick();
    setItemName('');
    setCostPrice('');
    setSellingPrice('');
    setQuantity('1');
    setDesiredMargin('20');
    setGstRate(0);
  };

  const handleCopySummary = () => {
    playSuccessChime();
    let text = '';
    if (calcMode === 'calculate_profit') {
      text = `📊 *${language === 'hi' ? 'दुकान हिसाब - मुनाफा रिपोर्ट' : 'Dukaan Hisab - Profit Report'}*\n` +
        (itemName ? `🛍️ ${language === 'hi' ? 'सामान' : 'Item'}: ${itemName}\n` : '') +
        `💰 ${language === 'hi' ? 'खरीद भाव (CP)' : 'Cost Price'}: ₹${numCost}\n` +
        `🏷️ ${language === 'hi' ? 'बिक्री भाव (SP)' : 'Selling Price'}: ₹${numSelling}\n` +
        `📦 ${language === 'hi' ? 'मात्रा' : 'Quantity'}: ${numQty}\n` +
        `--------------------\n` +
        `💵 ${language === 'hi' ? 'प्रति यूनिट मुनाफा' : 'Profit / Unit'}: ₹${formatNumber(profitPerUnit)}\n` +
        `📈 ${language === 'hi' ? 'कुल शुद्ध मुनाफा' : 'Total Net Profit'}: ₹${formatNumber(totalProfit)}\n` +
        `🎯 ${language === 'hi' ? 'प्रॉफिट मार्जिन' : 'Margin'}: ${profitMarginPercent.toFixed(1)}%\n` +
        `⚡ ${language === 'hi' ? 'मार्कअप' : 'Markup'}: ${markupPercent.toFixed(1)}%\n` +
        (gstRate > 0 ? `🏛️ GST (${gstRate}%): ₹${formatNumber(gstAmount)}\n` : '');
    } else {
      text = `🎯 *${language === 'hi' ? 'दुकान हिसाब - लक्षित बिक्री भाव' : 'Dukaan Hisab - Target Price'}*\n` +
        (itemName ? `🛍️ ${language === 'hi' ? 'सामान' : 'Item'}: ${itemName}\n` : '') +
        `💰 ${language === 'hi' ? 'खरीद भाव (CP)' : 'Cost Price'}: ₹${numCost}\n` +
        `🎯 ${language === 'hi' ? 'वांछित मार्जिन' : 'Desired Margin'}: ${numTargetMargin}%\n` +
        `🏷️ ${language === 'hi' ? 'बिक्री भाव तय करें' : 'Target Selling Price'}: ₹${formatNumber(calculatedSP)}\n` +
        `💵 ${language === 'hi' ? 'मुनाफा प्रति यूनिट' : 'Profit / Unit'}: ₹${formatNumber(calculatedProfitPerUnit)}\n` +
        `📦 ${language === 'hi' ? 'कुल मुनाफा' : 'Total Profit'} (${numQty} qty): ₹${formatNumber(calculatedTotalProfit)}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const marginPresets = [5, 10, 15, 20, 25, 30, 40, 50];
  const qtyPresets = [1, 5, 10, 20, 50, 100];
  const gstOptions = [0, 5, 12, 18, 28];

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="bg-slate-200/80 p-1 rounded-2xl grid grid-cols-2 gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => {
            playTactileClick();
            setCalcMode('calculate_profit');
          }}
          className={`min-h-[46px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            calcMode === 'calculate_profit'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <span>{language === 'hi' ? 'मुनाफा और मार्जिन निकालें' : 'Calculate Profit & Margin'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playTactileClick();
            setCalcMode('target_margin');
          }}
          className={`min-h-[46px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            calcMode === 'target_margin'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Percent className="w-4 h-4 text-teal-600" />
          <span>{language === 'hi' ? 'मार्जिन से बिक्री भाव तय करें' : 'Target Margin Price'}</span>
        </button>
      </div>

      {/* Main Calculation Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                {language === 'hi' ? 'बिजनेस मुनाफा कैलकुलेटर' : 'Business Profit Calculator'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {calcMode === 'calculate_profit'
                  ? (language === 'hi' ? 'खरीद और बिक्री भाव डालकर शुद्ध मुनाफा व मार्जिन देखें' : 'Enter purchase and selling prices to view net profit & margin')
                  : (language === 'hi' ? 'लागत और पसंदीदा मार्जिन % डालकर सही बिक्री भाव जानें' : 'Set your desired profit percentage to determine ideal selling price')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetBtn}</span>
          </button>
        </div>

        {/* Optional Item Name */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {language === 'hi' ? 'सामान का नाम (वैकल्पिक)' : 'Item Name (Optional)'}
          </label>
          <div className="relative">
            <ShoppingBag className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'उदा. बासमती चावल, रिफाइंड तेल, चीनी' : 'e.g. Basmati Rice, Refined Oil, Sugar'}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cost Price */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {language === 'hi' ? 'खरीद मूल्य / लागत भाव (Cost Price) *' : 'Cost Price (Purchase Rate) *'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-base">₹</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 text-base sm:text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white text-slate-900 font-tabular"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {language === 'hi' ? 'थोक या डीलर से मिला खरीद भाव' : 'Rate you paid to wholesale supplier'}
            </span>
          </div>

          {/* Mode 1: Selling Price Input */}
          {calcMode === 'calculate_profit' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {language === 'hi' ? 'बिक्री मूल्य (Selling Price) *' : 'Selling Price (Customer Rate) *'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-base">₹</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 text-base sm:text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white text-slate-900 font-tabular"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {language === 'hi' ? 'ग्राहक को बेचने का भाव' : 'Rate charged to customer'}
              </span>
            </div>
          )}

          {/* Mode 2: Desired Margin Input */}
          {calcMode === 'target_margin' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {language === 'hi' ? 'पसंदीदा प्रॉफिट मार्जिन % (Target Margin) *' : 'Desired Profit Margin % *'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="20"
                  value={desiredMargin}
                  onChange={(e) => setDesiredMargin(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 text-base sm:text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white text-slate-900 font-tabular"
                />
                <span className="absolute right-3 top-2.5 text-slate-500 font-bold text-base">%</span>
              </div>
              {/* Presets */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {marginPresets.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setDesiredMargin(m.toString());
                    }}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-lg border transition-colors ${
                      parseFloat(desiredMargin) === m
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {m}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quantity and GST Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'hi' ? 'बिक्री मात्रा / यूनिट्स (Quantity)' : 'Quantity Sold / Units'}
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white text-slate-900 font-tabular"
            />
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {qtyPresets.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setQuantity(q.toString());
                  }}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors ${
                    parseFloat(quantity) === q
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {q} {q === 1 ? (language === 'hi' ? 'यूनिट' : 'unit') : (language === 'hi' ? 'मात्रा' : 'qty')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'hi' ? 'जीएसटी कर दर (GST Rate, यदि लागू हो)' : 'GST Tax Rate (If applicable)'}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {gstOptions.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setGstRate(rate);
                  }}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                    gstRate === rate
                      ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {gstRate === 0
                ? (language === 'hi' ? 'कोई जीएसटी नहीं (सामान्य किराना)' : 'No tax included (Normal grocery)')
                : (language === 'hi' ? `बिक्री में ${gstRate}% जीएसटी शामिल गिना जाएगा` : `${gstRate}% GST accounted in sales`)}
            </span>
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY CARD */}
      {calcMode === 'calculate_profit' && (
        <div className="bg-gradient-to-br from-[#042F2E] via-[#0D9488] to-[#115E59] text-white rounded-2xl p-5 shadow-lg border border-teal-500/30">
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <span className="text-xs font-bold tracking-wide uppercase text-teal-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'hi' ? 'मुनाफा परिणाम' : 'Profit Results'}
            </span>
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white/15 hover:bg-white/25 rounded-lg transition-colors border border-white/20 text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'hi' ? 'कॉपी हुआ ✓' : 'Copied!') : (language === 'hi' ? 'रिपोर्ट कॉपी करें' : 'Copy Report')}</span>
            </button>
          </div>

          {/* Primary High-Impact Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            {/* Total Profit */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-teal-100 block mb-0.5 font-medium">
                {language === 'hi' ? 'कुल शुद्ध मुनाफा' : 'Total Net Profit'}
              </span>
              <span className={`text-xl sm:text-2xl font-black font-tabular block ${totalProfit >= 0 ? 'text-white' : 'text-rose-300'}`}>
                ₹{formatNumber(totalProfit)}
              </span>
              <span className="text-[10px] text-teal-200">
                {numQty} {language === 'hi' ? 'यूनिट पर' : 'units total'}
              </span>
            </div>

            {/* Profit Margin */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-teal-100 block mb-0.5 font-medium">
                {language === 'hi' ? 'प्रॉफिट मार्जिन' : 'Profit Margin'}
              </span>
              <span className={`text-xl sm:text-2xl font-black font-tabular block ${profitMarginPercent >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                {profitMarginPercent.toFixed(1)}%
              </span>
              <span className="text-[10px] text-teal-200">
                {language === 'hi' ? 'बिक्री का हिस्सा' : 'of selling price'}
              </span>
            </div>

            {/* Markup % */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-teal-100 block mb-0.5 font-medium">
                {language === 'hi' ? 'मार्कअप' : 'Markup %'}
              </span>
              <span className="text-xl sm:text-2xl font-black font-tabular text-white block">
                {markupPercent.toFixed(1)}%
              </span>
              <span className="text-[10px] text-teal-200">
                {language === 'hi' ? 'लागत के ऊपर' : 'over cost price'}
              </span>
            </div>

            {/* Profit Per Unit */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-teal-100 block mb-0.5 font-medium">
                {language === 'hi' ? 'प्रति यूनिट मुनाफा' : 'Profit Per Unit'}
              </span>
              <span className="text-xl sm:text-2xl font-black font-tabular text-white block">
                ₹{formatNumber(profitPerUnit)}
              </span>
              <span className="text-[10px] text-teal-200">
                {language === 'hi' ? 'प्रति पीस / किलो' : 'per single piece'}
              </span>
            </div>
          </div>

          {/* Breakdown summary row */}
          <div className="bg-black/20 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-3 text-teal-50 border border-white/5">
            <div>
              <span className="text-teal-300 mr-1.5">{language === 'hi' ? 'कुल लागत (Investment):' : 'Total Investment:'}</span>
              <span className="font-bold font-tabular text-white">₹{formatNumber(totalCost)}</span>
            </div>
            <div>
              <span className="text-teal-300 mr-1.5">{language === 'hi' ? 'कुल बिक्री (Sales):' : 'Total Sales:'}</span>
              <span className="font-bold font-tabular text-white">₹{formatNumber(totalRevenue)}</span>
            </div>
            {gstRate > 0 && (
              <div>
                <span className="text-teal-300 mr-1.5">GST ({gstRate}%):</span>
                <span className="font-bold font-tabular text-amber-200">₹{formatNumber(gstAmount)}</span>
              </div>
            )}
          </div>

          {/* Explanatory Sentence */}
          <div className="mt-3 text-xs text-teal-100/90 leading-relaxed">
            💡 {language === 'hi' ? (
              numCost > 0 && numSelling > 0 ? (
                <span>
                  यदि आप <strong>₹{numCost}</strong> की वस्तु <strong>₹{numSelling}</strong> में बेचते हैं, तो हर यूनिट पर{' '}
                  <strong className="text-white underline">₹{formatNumber(profitPerUnit)}</strong> ({profitMarginPercent.toFixed(1)}% मार्जिन) बचेगा।{' '}
                  {numQty > 1 && <>कुल <strong>{numQty}</strong> यूनिट पर कुल मुनाफा <strong className="text-white">₹{formatNumber(totalProfit)}</strong> होगा।</>}
                </span>
              ) : (
                'लागत और बिक्री भाव दर्ज करें।'
              )
            ) : (
              numCost > 0 && numSelling > 0 ? (
                <span>
                  Selling an item bought at <strong>₹{numCost}</strong> for <strong>₹{numSelling}</strong> yields{' '}
                  <strong className="text-white underline">₹{formatNumber(profitPerUnit)}</strong> profit per unit ({profitMarginPercent.toFixed(1)}% margin).{' '}
                  {numQty > 1 && <>For <strong>{numQty}</strong> units, total profit is <strong className="text-white">₹{formatNumber(totalProfit)}</strong>.</>}
                </span>
              ) : (
                'Enter cost and selling prices above to see real-time profit analysis.'
              )
            )}
          </div>
        </div>
      )}

      {/* MODE 2 RESULTS: TARGET MARGIN PRICE */}
      {calcMode === 'target_margin' && (
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white rounded-2xl p-5 shadow-lg border border-slate-700">
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <span className="text-xs font-bold tracking-wide uppercase text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'hi' ? 'सुझाया गया बिक्री भाव' : 'Recommended Selling Price'}
            </span>
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/15 text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'hi' ? 'कॉपी हुआ ✓' : 'Copied!') : (language === 'hi' ? 'कॉपी करें' : 'Copy')}</span>
            </button>
          </div>

          <div className="my-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 bg-teal-950/60 p-4 rounded-xl border border-teal-500/30">
            <div>
              <span className="text-xs text-teal-300 font-semibold block mb-1">
                {language === 'hi' ? 'इस भाव पर बेचें (Target Selling Price):' : 'Set Your Selling Price To:'}
              </span>
              <span className="text-3xl sm:text-4xl font-black font-tabular text-emerald-400">
                ₹{formatNumber(calculatedSP)}
              </span>
            </div>

            <div className="sm:text-right space-y-1">
              <div className="text-xs text-slate-300">
                <span>{language === 'hi' ? 'प्रति यूनिट शुद्ध मुनाफा:' : 'Profit Per Unit:'} </span>
                <span className="font-bold text-white font-tabular">₹{formatNumber(calculatedProfitPerUnit)}</span>
              </div>
              <div className="text-xs text-slate-300">
                <span>{language === 'hi' ? 'मार्कअप दर:' : 'Markup Added:'} </span>
                <span className="font-bold text-teal-300 font-tabular">
                  {numCost > 0 ? ((calculatedProfitPerUnit / numCost) * 100).toFixed(1) : 0}%
                </span>
              </div>
              {numQty > 1 && (
                <div className="text-xs text-emerald-300 font-bold">
                  <span>{language === 'hi' ? `कुल ${numQty} मात्रा पर मुनाफा:` : `Total Profit for ${numQty} qty:`} </span>
                  <span className="font-black font-tabular">₹{formatNumber(calculatedTotalProfit)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed">
            💡 {language === 'hi' ? (
              <span>
                खरीद मूल्य <strong>₹{numCost}</strong> पर <strong>{numTargetMargin}%</strong> शुद्ध मुनाफा मार्जिन पाने के लिए ग्राहक को{' '}
                <strong className="text-emerald-300 underline">₹{formatNumber(calculatedSP)}</strong> में बेचें।
              </span>
            ) : (
              <span>
                To earn a <strong>{numTargetMargin}%</strong> profit margin on a <strong>₹{numCost}</strong> purchase, set your retail selling price to{' '}
                <strong className="text-emerald-300 underline">₹{formatNumber(calculatedSP)}</strong>.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
