import React, { useState } from 'react';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { PriceToQtyCalculator } from './components/PriceToQtyCalculator';
import { QtyToPriceCalculator } from './components/QtyToPriceCalculator';
import { BusinessProfitCalculator } from './components/BusinessProfitCalculator';
import { HistoryView } from './components/HistoryView';
import { CustomUnitsView } from './components/CustomUnitsView';
import { SettingsView } from './components/SettingsView';
import { ReceiptModal } from './components/ReceiptModal';
import { CustomUnitModal } from './components/CustomUnitModal';
import { LanguageOnboardingModal } from './components/LanguageOnboardingModal';
import { ShopkeeperCheatSheet } from './components/ShopkeeperCheatSheet';
import { UnitDefinition, CalculationRecord, AppSettings, ShopProfile } from './types/units';
import {
  loadSettings,
  saveSettings,
  loadShopProfile,
  saveShopProfile,
} from './utils/settingsStorage';
import { getCustomUnits, saveCustomUnits } from './utils/unitConverter';
import {
  getHistory,
  addHistoryRecord,
  removeHistoryRecord,
  clearHistory,
} from './utils/historyStorage';
import { playTactileClick } from './utils/feedback';
import { Clock, Store, Sparkles, TrendingUp } from 'lucide-react';

function MainApp() {
  const { t, hasSeenOnboarding, language } = useTranslation();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'calc' | 'profit' | 'history' | 'units' | 'settings'>('calc');
  const [calcMode, setCalcMode] = useState<'price_to_qty' | 'qty_to_price'>('price_to_qty');

  // Persistence State (Works 100% offline in localStorage)
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [shopProfile, setShopProfile] = useState<ShopProfile>(loadShopProfile);
  const [customUnits, setCustomUnits] = useState<UnitDefinition[]>(getCustomUnits);
  const [history, setHistory] = useState<CalculationRecord[]>(getHistory);

  // Modals
  const [activeReceipt, setActiveReceipt] = useState<CalculationRecord | null>(null);
  const [isAddCustomUnitOpen, setIsAddCustomUnitOpen] = useState(false);
  const [showLanguageOnboarding, setShowLanguageOnboarding] = useState(!hasSeenOnboarding);

  // Desktop Android Frame View Toggle
  const [isPhoneFrameView, setIsPhoneFrameView] = useState(false);

  // Pre-load values into calculator when clicking an item from history or cheat sheet
  const [calcInitialValues, setCalcInitialValues] = useState<{
    itemName?: string;
    rate?: number;
    rateUnitId?: string;
    customerAmount?: number;
    inputQuantity?: number;
    inputUnitId?: string;
    targetUnitId?: string;
  } | undefined>(undefined);

  // Handlers
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleUpdateShopProfile = (newProfile: ShopProfile) => {
    setShopProfile(newProfile);
    saveShopProfile(newProfile);
  };

  const handleAddCustomUnit = (newUnit: UnitDefinition) => {
    const updated = [...customUnits, newUnit];
    setCustomUnits(updated);
    saveCustomUnits(updated);
  };

  const handleDeleteCustomUnit = (unitId: string) => {
    const updated = customUnits.filter((u) => u.id !== unitId);
    setCustomUnits(updated);
    saveCustomUnits(updated);
  };

  const handleSaveRecord = (rec: CalculationRecord) => {
    const updated = addHistoryRecord(rec);
    setHistory(updated);
  };

  const handleDeleteHistoryRecord = (id: string) => {
    const updated = removeHistoryRecord(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleReloadToCalc = (rec: CalculationRecord) => {
    if (rec.mode === 'price_to_qty') {
      setCalcMode('price_to_qty');
      setCalcInitialValues({
        itemName: rec.itemName,
        rate: rec.rate,
        rateUnitId: rec.rateUnitId,
        customerAmount: rec.customerAmount,
        targetUnitId: rec.targetUnitId,
      });
    } else {
      setCalcMode('qty_to_price');
      setCalcInitialValues({
        itemName: rec.itemName,
        rate: rec.rate,
        rateUnitId: rec.rateUnitId,
        inputQuantity: rec.inputQuantity,
        inputUnitId: rec.inputUnitId,
      });
    }
    setActiveTab('calc');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheatSheetLoad = (mode: 'price_to_qty' | 'qty_to_price', rate: number, val: number) => {
    setCalcMode(mode);
    if (mode === 'price_to_qty') {
      setCalcInitialValues({
        rate,
        customerAmount: val,
        rateUnitId: 'kg',
        targetUnitId: 'gram',
      });
    } else {
      setCalcInitialValues({
        rate,
        inputQuantity: val,
        rateUnitId: 'kg',
        inputUnitId: 'gram',
      });
    }
    setActiveTab('calc');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans pb-20 md:pb-6">
      {/* Top Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shopProfile={shopProfile}
        isPhoneFrameView={isPhoneFrameView}
        setIsPhoneFrameView={setIsPhoneFrameView}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div
          className={
            isPhoneFrameView
              ? 'max-w-[430px] mx-auto bg-white rounded-[40px] shadow-2xl border-[10px] border-slate-900 overflow-hidden relative'
              : 'w-full'
          }
        >
          {/* Simulated Android Status Bar */}
          {isPhoneFrameView && (
            <div className="h-7 bg-slate-900 text-white text-[11px] px-6 flex items-center justify-between font-mono select-none">
              <span>9:41</span>
              <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-700" />
              <div className="flex items-center gap-1.5 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Subheader / Shop Bar Banner */}
          <div className="mb-4 bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate">
                  {shopProfile.shopName || (language === 'hi' ? 'मेरी दुकान' : 'My Dukaan')}
                </span>
                <span className="text-[11px] text-slate-500">
                  {shopProfile.ownerName ? `${shopProfile.ownerName} · ` : ''}
                  <span className="text-slate-400">
                    {shopProfile.city || (language === 'hi' ? '100% ऑफ़लाइन हिसाब' : '100% Offline Mode')}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setActiveTab('settings');
                }}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50/70 hover:bg-teal-100/70 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors shrink-0"
              >
                {language === 'hi' ? 'दुकान का नाम बदलें' : 'Edit Shop'}
              </button>
            </div>
          </div>

          {/* TAB 1: CALCULATOR */}
          {activeTab === 'calc' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className={isPhoneFrameView ? 'w-full' : 'lg:col-span-8 space-y-4'}>
                {/* Mode Selector Tabs ( भाव से मात्रा vs मात्रा से भाव ) */}
                <div className="p-1 bg-slate-200/80 rounded-2xl grid grid-cols-2 gap-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setCalcMode('price_to_qty');
                    }}
                    className={`min-h-[46px] py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      calcMode === 'price_to_qty'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{t.priceToQtyTitle}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setCalcMode('qty_to_price');
                    }}
                    className={`min-h-[46px] py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      calcMode === 'qty_to_price'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{t.qtyToPriceTitle}</span>
                  </button>
                </div>

                {/* Calculator View depending on mode */}
                {calcMode === 'price_to_qty' ? (
                  <PriceToQtyCalculator
                    key={`p2q_${calcInitialValues?.rate}_${calcInitialValues?.customerAmount}_${language}`}
                    settings={settings}
                    customUnits={customUnits}
                    onSaveRecord={handleSaveRecord}
                    onOpenReceipt={(rec) => setActiveReceipt(rec)}
                    onOpenAddCustomUnit={() => setIsAddCustomUnitOpen(true)}
                    initialValues={calcInitialValues}
                  />
                ) : (
                  <QtyToPriceCalculator
                    key={`q2p_${calcInitialValues?.rate}_${calcInitialValues?.inputQuantity}_${language}`}
                    settings={settings}
                    customUnits={customUnits}
                    onSaveRecord={handleSaveRecord}
                    onOpenReceipt={(rec) => setActiveReceipt(rec)}
                    onOpenAddCustomUnit={() => setIsAddCustomUnitOpen(true)}
                    initialValues={calcInitialValues}
                  />
                )}
              </div>

              {/* Right Sidebar on Desktop (Cheat sheet & quick parchi glance) */}
              {!isPhoneFrameView && (
                <div className="hidden lg:block lg:col-span-4 space-y-4">
                  <ShopkeeperCheatSheet onQuickLoad={handleCheatSheetLoad} />

                  {/* Recent 3 Receipts Preview */}
                  {history.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          {t.recentParchi}
                        </span>
                        <button
                          onClick={() => {
                            playTactileClick();
                            setActiveTab('history');
                          }}
                          className="text-[11px] font-semibold text-teal-700 hover:text-teal-900"
                        >
                          {t.viewAll} ({history.length})
                        </button>
                      </div>

                      <div className="space-y-2">
                        {history.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              playTactileClick();
                              handleReloadToCalc(item);
                            }}
                            className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-800">{item.itemName}</div>
                              <div className="text-[10px] text-slate-400">
                                @ ₹{item.rate}/{item.rateUnitSymbol}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-extrabold text-teal-700 font-tabular block">
                                {item.mode === 'price_to_qty'
                                  ? `${item.resultQuantity} ${item.targetUnitSymbol}`
                                  : `₹${item.resultPrice}`}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {item.mode === 'price_to_qty'
                                  ? `Paid ₹${item.customerAmount}`
                                  : `Qty ${item.inputQuantity}`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BUSINESS PROFIT CALCULATOR */}
          {activeTab === 'profit' && (
            <BusinessProfitCalculator settings={settings} />
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === 'history' && (
            <HistoryView
              history={history}
              onClearHistory={handleClearHistory}
              onDeleteRecord={handleDeleteHistoryRecord}
              onOpenReceipt={(rec) => setActiveReceipt(rec)}
              onReloadToCalculator={handleReloadToCalc}
            />
          )}

          {/* TAB 4: UNITS */}
          {activeTab === 'units' && (
            <CustomUnitsView
              customUnits={customUnits}
              onOpenAddModal={() => setIsAddCustomUnitOpen(true)}
              onDeleteCustomUnit={handleDeleteCustomUnit}
            />
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              shopProfile={shopProfile}
              onUpdateShopProfile={handleUpdateShopProfile}
            />
          )}
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
      />

      {/* Thermal Receipt Slip Modal */}
      <ReceiptModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        record={activeReceipt}
        shopName={shopProfile.shopName || (language === 'hi' ? 'दुकान हिसाब पर्ची' : 'Dukaan Hisab Slip')}
        ownerMobile={shopProfile.mobile || ''}
        shopCity={shopProfile.city || (language === 'hi' ? 'दुकानदार पर्ची' : 'Shopkeeper Counter')}
      />

      {/* Add Custom Unit Modal */}
      <CustomUnitModal
        isOpen={isAddCustomUnitOpen}
        onClose={() => setIsAddCustomUnitOpen(false)}
        onAddCustomUnit={handleAddCustomUnit}
      />

      {/* First-Time Setup Language Selector */}
      <LanguageOnboardingModal
        isOpen={showLanguageOnboarding}
        onClose={() => setShowLanguageOnboarding(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
