import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Download, CheckCircle2, HelpCircle } from 'lucide-react';
import { playTactileClick } from '../utils/feedback';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or running as standalone APK / WebView, show offline ready badge
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>APK / App Ready</span>
      </span>
    );
  }

  // Chromium / Android / Desktop Install Flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => {
          playTactileClick();
          install();
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors shrink-0"
        title="Install Android App directly on phone"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari Flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            playTactileClick();
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <HelpCircle className="w-3 h-3 text-slate-400" />
          <span>Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                1. Tap the <strong>Share</strong> icon in Safari toolbar.<br />
                2. Scroll and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
