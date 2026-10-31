import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { BookOpen, ArrowRight } from 'lucide-react';
import { playTactileClick } from '../utils/feedback';

interface ShopkeeperCheatSheetProps {
  onQuickLoad: (mode: 'price_to_qty' | 'qty_to_price', rate: number, val: number) => void;
}

export const ShopkeeperCheatSheet: React.FC<ShopkeeperCheatSheetProps> = ({ onQuickLoad }) => {
  const { language } = useTranslation();

  const isHindi = language === 'hi';

  const commonTrades = isHindi
    ? [
        {
          title: 'चीनी @ ₹60/किग्रा',
          sub: '₹40 ग्राहक ने दिए',
          calc: '666.67 ग्राम',
          onClick: () => onQuickLoad('price_to_qty', 60, 40),
        },
        {
          title: 'सरसों तेल @ ₹160/लीटर',
          sub: '250 मिली ग्राहक को चाहिए',
          calc: '₹40.00 कुल',
          onClick: () => onQuickLoad('qty_to_price', 160, 250),
        },
        {
          title: 'देसी घी @ ₹650/किग्रा',
          sub: '₹100 ग्राहक ने दिए',
          calc: '153.85 ग्राम',
          onClick: () => onQuickLoad('price_to_qty', 650, 100),
        },
        {
          title: 'केला @ ₹60/दर्जन',
          sub: '6 पीस (आधा दर्जन)',
          calc: '₹30.00 कुल',
          onClick: () => onQuickLoad('qty_to_price', 60, 6),
        },
        {
          title: 'गेहूं @ ₹2400/क्विंटल',
          sub: '25 किग्रा (कट्टा)',
          calc: '₹600.00 कुल',
          onClick: () => onQuickLoad('qty_to_price', 2400, 25),
        },
      ]
    : [
        {
          title: 'Sugar @ ₹60/kg',
          sub: '₹40 customer amount',
          calc: '666.67 grams',
          onClick: () => onQuickLoad('price_to_qty', 60, 40),
        },
        {
          title: 'Cooking Oil @ ₹160/L',
          sub: '250 ml customer quantity',
          calc: '₹40.00 total',
          onClick: () => onQuickLoad('qty_to_price', 160, 250),
        },
        {
          title: 'Pure Ghee @ ₹650/kg',
          sub: '₹100 customer amount',
          calc: '153.85 grams',
          onClick: () => onQuickLoad('price_to_qty', 650, 100),
        },
        {
          title: 'Bananas @ ₹60/dozen',
          sub: '6 pieces (half dozen)',
          calc: '₹30.00 total',
          onClick: () => onQuickLoad('qty_to_price', 60, 6),
        },
        {
          title: 'Wheat Grain @ ₹2400/quintal',
          sub: '25 kg bag',
          calc: '₹600.00 total',
          onClick: () => onQuickLoad('qty_to_price', 2400, 25),
        },
      ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <BookOpen className="w-4 h-4 text-teal-600" />
        <h3 className="text-sm font-bold text-slate-900">
          {isHindi ? 'दुकान त्वरित तालिका' : 'Quick Trade Calculations'}
        </h3>
      </div>

      {/* Quick Test Scenarios */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {isHindi ? 'उदाहरण लोड करें' : 'Tap to Load Example'}
        </div>
        {commonTrades.map((t, idx) => (
          <button
            key={idx}
            onClick={() => {
              playTactileClick();
              t.onClick();
            }}
            className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition-colors group flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                {t.title}
              </div>
              <div className="text-[11px] text-slate-500">{t.sub}</div>
            </div>
            <div className="text-right flex items-center gap-1.5">
              <span className="text-xs font-bold font-tabular text-teal-700">{t.calc}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Traditional Indian Weight Conversions Reference */}
      <div className="pt-2 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {isHindi ? 'मानक माप संदर्भ' : 'Standard Units Reference'}
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block">{isHindi ? '1 पाव' : '1 Paav (Quarter)'}</span>
            <span>= {isHindi ? '250 ग्राम (1/4 किग्रा)' : '250 grams (0.25 kg)'}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block">{isHindi ? 'आधा किलो' : 'Half Kilogram'}</span>
            <span>= {isHindi ? '500 ग्राम' : '500 grams'}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block">{isHindi ? '1 क्विंटल' : '1 Quintal'}</span>
            <span>= {isHindi ? '100 किलोग्राम' : '100 kilograms'}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block">{isHindi ? '1 टन' : '1 Metric Ton'}</span>
            <span>= {isHindi ? '1,000 किलोग्राम' : '1,000 kilograms'}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block">{isHindi ? '1 दर्जन' : '1 Dozen'}</span>
            <span>= {isHindi ? '12 नग (पीस)' : '12 pieces'}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block">{isHindi ? '1 गज' : '1 Yard / Gaj'}</span>
            <span>= {isHindi ? '3 फीट (36 इंच)' : '3 feet (36 inches)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
