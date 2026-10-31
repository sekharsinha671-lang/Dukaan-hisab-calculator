import { AppSettings, ShopProfile } from '../types/units';

const SETTINGS_KEY = 'dukaan_calculator_settings_v1';
const SHOP_PROFILE_KEY = 'dukaan_shop_profile_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  decimalPlaces: 2,
  roundingMode: 'normal',
  language: 'hinglish',
  soundEnabled: true,
  vibrationEnabled: true,
  currencySymbol: '₹',
  defaultCategory: 'weight',
};

export const DEFAULT_SHOP_PROFILE: ShopProfile = {
  shopName: 'मेरी दुकान (My Dukaan)',
  ownerName: 'दुकानदार भाई',
  mobile: '',
  city: 'भारत (India)',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadShopProfile(): ShopProfile {
  try {
    const raw = localStorage.getItem(SHOP_PROFILE_KEY);
    if (!raw) return DEFAULT_SHOP_PROFILE;
    return { ...DEFAULT_SHOP_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SHOP_PROFILE;
  }
}

export function saveShopProfile(profile: ShopProfile): void {
  try {
    localStorage.setItem(SHOP_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save shop profile', e);
  }
}
