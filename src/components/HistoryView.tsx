import React, { useState } from 'react';
import { CalculationRecord } from '../types/units';
import { useTranslation } from '../i18n/LanguageContext';
import { Search, Trash2, Share2, CornerDownLeft, Calendar, FileText } from 'lucide-react';
import { playTactileClick } from '../utils/feedback';

interface HistoryViewProps {
  history: CalculationRecord[];
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
  onOpenReceipt: (record: CalculationRecord) => void;
  onReloadToCalculator: (record: CalculationRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory,
  onDeleteRecord,
  onOpenReceipt,
  onReloadToCalculator,
}) => {
  const { t, language } = useTranslation();
  const [filterMode, setFilterMode] = useState<'all' | 'price_to_qty' | 'qty_to_price'>('all');
  const [search, setSearch] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredHistory = history.filter((item) => {
    if (filterMode !== 'all' && item.mode !== filterMode) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(q) ||
      (item.customerName && item.customerName.toLowerCase().includes(q)) ||
      item.rateUnitSymbol.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <span>{t.historyTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.historySubtitle} ({history.length} {language === 'hi' ? 'सहेजे गए' : 'saved'})
            </p>
          </div>

          {history.length > 0 && (
            <div>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-semibold">{t.confirmClearPrompt}</span>
                  <button
                    onClick={() => {
                      playTactileClick();
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    {t.yesClearBtn}
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    {t.cancelBtn}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.clearHistoryBtn}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                playTactileClick();
                setFilterMode('all');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.allFilter} ({history.length})
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setFilterMode('price_to_qty');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterMode === 'price_to_qty'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.priceToQtyTitle}
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setFilterMode('qty_to_price');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterMode === 'qty_to_price'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.qtyToPriceTitle}
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">{t.noHistoryTitle}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{t.noHistoryDesc}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredHistory.map((rec) => {
            const timeStr = new Date(rec.timestamp).toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            });
            const dateStr = new Date(rec.timestamp).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <div
                key={rec.id}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 hover:border-slate-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left Info */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      rec.mode === 'price_to_qty'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {rec.mode === 'price_to_qty' ? '₹→Q' : 'Q→₹'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {rec.itemName || 'Retail Item'}
                      </span>
                      {rec.customerName && (
                        <span className="text-xs text-slate-500 font-medium">
                          ({rec.customerName})
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>
                        Rate: ₹{rec.rate}/{rec.rateUnitSymbol}
                      </span>
                      <span>·</span>
                      {rec.mode === 'price_to_qty' ? (
                        <span>{t.amountPaidLabel}: ₹{rec.customerAmount}</span>
                      ) : (
                        <span>{t.qtyTakenLabel}: {rec.inputQuantity} {rec.inputUnitSymbol}</span>
                      )}
                      <span>·</span>
                      <span className="text-slate-400">
                        {dateStr}, {timeStr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Result & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      {rec.mode === 'price_to_qty' ? t.totalQtyLabel : t.totalBillLabel}
                    </span>
                    <span className="text-lg font-extrabold text-teal-700 font-tabular">
                      {rec.mode === 'price_to_qty'
                        ? `${rec.resultQuantity} ${rec.targetUnitSymbol}`
                        : `₹${rec.resultPrice}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        playTactileClick();
                        onReloadToCalculator(rec);
                      }}
                      className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title={t.loadIntoCalcTooltip}
                      aria-label="Load into calculator"
                    >
                      <CornerDownLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        playTactileClick();
                        onOpenReceipt(rec);
                      }}
                      className="p-2 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Share / Print receipt"
                      aria-label="Share receipt"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        playTactileClick();
                        onDeleteRecord(rec.id);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title={t.deleteTooltip}
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
