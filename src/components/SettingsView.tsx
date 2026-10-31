import React, { useState } from 'react';
import { AppSettings, ShopProfile } from '../types/units';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Sliders,
  Store,
  Volume2,
  Languages,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Download,
  Info,
} from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/feedback';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  shopProfile: ShopProfile;
  onUpdateShopProfile: (profile: ShopProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  shopProfile,
  onUpdateShopProfile,
}) => {
  const { t, language, setLanguage } = useTranslation();

  // Local form state for shop details
  const [shopName, setShopName] = useState(shopProfile.shopName || '');
  const [ownerName, setOwnerName] = useState(shopProfile.ownerName || '');
  const [mobile, setMobile] = useState(shopProfile.mobile || '');
  const [city, setCity] = useState(shopProfile.city || '');
  const [savedProfileMsg, setSavedProfileMsg] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();
    onUpdateShopProfile({
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      mobile: mobile.trim(),
      city: city.trim(),
    });
    playSuccessChime();
    setSavedProfileMsg(true);
    setTimeout(() => setSavedProfileMsg(false), 2200);
  };

  return (
    <div className="space-y-4">
      {/* 1. Language Selection */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <Languages className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.languageSettingTitle}</h3>
            <p className="text-xs text-slate-500">{t.languageSettingDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              playTactileClick();
              setLanguage('en');
            }}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              language === 'en'
                ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600 shadow-2xs'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="text-sm font-bold text-slate-900">English</div>
            <div className="text-xs text-slate-500 mt-0.5">Default Language</div>
            <span className="text-[10px] font-semibold text-teal-800 bg-teal-100/60 px-1.5 py-0.5 rounded mt-2 inline-block">
              100% English UI
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              setLanguage('hi');
            }}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              language === 'hi'
                ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600 shadow-2xs'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="text-sm font-bold text-slate-900">हिन्दी (Hindi)</div>
            <div className="text-xs text-slate-500 mt-0.5">पूर्ण हिंदी मेनू</div>
            <span className="text-[10px] font-semibold text-teal-800 bg-teal-100/60 px-1.5 py-0.5 rounded mt-2 inline-block">
              सभी मेनू हिंदी में
            </span>
          </button>
        </div>
      </div>

      {/* 2. Shop Profile & Receipt Customizer (Saved Locally, No Login Needed) */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.shopProfileTitle}</h3>
              <p className="text-xs text-slate-500">{t.shopProfileSubtitle}</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t.activeAccountBadge}</span>
          </span>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.shopNameLabel}
              </label>
              <input
                type="text"
                placeholder={language === 'hi' ? 'उदा. गुप्ता किराना स्टोर' : 'e.g. Gupta General Store'}
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.ownerNameLabel}
              </label>
              <input
                type="text"
                placeholder={language === 'hi' ? 'उदा. मनोज गुप्ता' : 'e.g. Manoj Gupta'}
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.mobileLabel}
              </label>
              <input
                type="tel"
                placeholder={language === 'hi' ? 'उदा. 9876543210' : 'e.g. 9876543210'}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 text-slate-900 font-tabular"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.cityLabel}
              </label>
              <input
                type="text"
                placeholder={language === 'hi' ? 'उदा. मुख्य बाजार, कानपुर' : 'e.g. Main Market, Kanpur'}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-emerald-600 font-bold">
              {savedProfileMsg ? t.profileUpdatedSuccess : ''}
            </span>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-2xs"
            >
              {t.updateShopBtn}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Calculator Preferences */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <Sliders className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.calcPrefsTitle}</h3>
            <p className="text-xs text-slate-500">{t.calcPrefsSubtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Decimal Places */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.decimalPrecisionLabel}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((decimals) => (
                <button
                  key={decimals}
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    onUpdateSettings({ ...settings, decimalPlaces: decimals });
                  }}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                    settings.decimalPlaces === decimals
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {decimals} {decimals === 1 ? 'place' : 'places'}
                </button>
              ))}
            </div>
          </div>

          {/* Rounding Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.roundingRuleLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: t.roundNormal },
                { id: 'ceil', label: t.roundCeil },
                { id: 'floor', label: t.roundFloor },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    onUpdateSettings({ ...settings, roundingMode: r.id as any });
                  }}
                  className={`p-2.5 text-center rounded-xl border text-xs font-bold transition-all ${
                    settings.roundingMode === r.id
                      ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500 text-teal-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Vibration Feedback */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {t.tactileFeedbackTitle}
                </span>
                <span className="text-[11px] text-slate-500">
                  {t.tactileFeedbackDesc}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playTactileClick();
                onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                settings.soundEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {settings.soundEnabled ? t.enabledBadge : t.mutedBadge}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Free App & Offline Android APK Information */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-xs border border-slate-700">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-sm font-bold text-white">{t.appInfoTitle}</h3>
              <p className="text-xs text-slate-300">{t.appInfoSubtitle}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
            {t.freeAppBadge}
          </span>
        </div>

        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              {language === 'hi'
                ? 'यह ऐप 100% मुफ़्त है। किसी भी प्रकार के लॉगिन, पासवर्ड, मोबाइल नंबर या ओटीपी की आवश्यकता नहीं है।'
                : '100% Free distribution. No account, password, mobile number, or SMS OTP is required.'}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              {language === 'hi'
                ? 'पूरी तरह ऑफ़लाइन काम करता है। आपका हिसाब, कस्टम इकाइयां और दुकान का विवरण सुरक्षित रूप से आपके फोन में ही रहता है।'
                : 'Works completely offline. Calculations, history records, and custom units remain securely stored on your device.'}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              {language === 'hi'
                ? 'एंड्रॉयड एपीके (APK) रेडी: कैपेसिटर (Capacitor) या पीडब्ल्यूए (PWA) द्वारा तुरंत फोन में इंस्टॉल करें।'
                : 'Android APK Ready: Instant PWA installation and pre-configured Capacitor setup for native APK generation.'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">v2.0 Standalone Edition</span>
          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
