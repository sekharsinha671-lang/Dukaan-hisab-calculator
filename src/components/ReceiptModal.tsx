import React, { useState } from 'react';
import { CalculationRecord } from '../types/units';
import { useTranslation } from '../i18n/LanguageContext';
import { X, Copy, Check, Printer, Share2 } from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/feedback';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: CalculationRecord | null;
  shopName: string;
  ownerMobile: string;
  shopCity?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  record,
  shopName,
  ownerMobile,
  shopCity,
}) => {
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !record) return null;

  const dateStr = new Date(record.timestamp).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const divider = '--------------------------------';
  const itemLine = record.itemName ? `*${t.itemLabel}:* ${record.itemName}\n` : '';
  const customerLine = record.customerName ? `*${t.customerLabel}:* ${record.customerName}\n` : '';

  const receiptText =
    record.mode === 'price_to_qty'
      ? `🧾 *${shopName}*
${divider}
${customerLine}${itemLine}*${t.rateLabel}:* ₹${record.rate} / ${record.rateUnitSymbol}
*${t.amountPaidLabel}:* ₹${record.customerAmount}
*${t.totalQtyLabel}:* *${record.resultQuantity} ${record.targetUnitSymbol}*
${divider}
📅 ${dateStr}
${ownerMobile ? `📞 ${ownerMobile}\n` : ''}${t.thankYouMessage}`
      : `🧾 *${shopName}*
${divider}
${customerLine}${itemLine}*${t.rateLabel}:* ₹${record.rate} / ${record.rateUnitSymbol}
*${t.qtyTakenLabel}:* ${record.inputQuantity} ${record.inputUnitSymbol}
*${t.totalBillLabel}:* *₹${record.resultPrice}*
${divider}
📅 ${dateStr}
${ownerMobile ? `📞 ${ownerMobile}\n` : ''}${t.thankYouMessage}`;

  const handleCopy = () => {
    playTactileClick();
    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    playSuccessChime();
    setTimeout(() => setCopied(false), 2200);
  };

  const handleWhatsApp = () => {
    playTactileClick();
    const encoded = encodeURIComponent(receiptText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    playTactileClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{t.receiptTitle}</span>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal Slip Styled Content */}
        <div className="p-5 overflow-y-auto bg-slate-50/50">
          <div
            id="printable-slip"
            className="bg-white p-5 rounded-xl border border-dashed border-slate-300 shadow-2xs font-mono text-xs text-slate-800 space-y-3"
          >
            {/* Shop Header */}
            <div className="text-center pb-2 border-b border-dashed border-slate-300">
              <h4 className="font-sans font-extrabold text-base text-slate-900 tracking-tight">
                {shopName || t.appTitle}
              </h4>
              {shopCity && <p className="text-[11px] text-slate-500">{shopCity}</p>}
              {ownerMobile && <p className="text-[11px] text-slate-500">Ph: +91 {ownerMobile}</p>}
              <p className="text-[10px] text-slate-400 mt-1">{dateStr}</p>
            </div>

            {/* Customer & Item details */}
            <div className="space-y-1.5 py-1 text-[11px]">
              {record.customerName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.customerLabel}:</span>
                  <span className="font-bold text-slate-900">{record.customerName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">{t.itemLabel}:</span>
                <span className="font-bold text-slate-900">{record.itemName || 'Retail Item'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.rateLabel}:</span>
                <span className="font-bold text-slate-900">
                  ₹{record.rate} / {record.rateUnitSymbol}
                </span>
              </div>
            </div>

            {/* Mode Specific Calculation */}
            <div className="pt-2 border-t border-dashed border-slate-300 space-y-2">
              {record.mode === 'price_to_qty' ? (
                <>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">{t.amountPaidLabel}:</span>
                    <span className="font-bold text-slate-900">₹{record.customerAmount}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-slate-200">
                    <span className="font-sans font-bold text-slate-900 text-xs">{t.totalQtyLabel}:</span>
                    <span className="font-sans font-extrabold text-base text-teal-700 font-tabular">
                      {record.resultQuantity} {record.targetUnitSymbol}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">{t.qtyTakenLabel}:</span>
                    <span className="font-bold text-slate-900">
                      {record.inputQuantity} {record.inputUnitSymbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-slate-200">
                    <span className="font-sans font-bold text-slate-900 text-xs">{t.totalBillLabel}:</span>
                    <span className="font-sans font-extrabold text-base text-teal-700 font-tabular">
                      ₹{record.resultPrice}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Blessing */}
            <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[11px] text-slate-600 font-sans">
              {t.thankYouMessage}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">{t.copiedSuccess}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyTextBtn}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            title="Print receipt slip"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex-1 min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
