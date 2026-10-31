export type UnitCategory = 'weight' | 'length' | 'volume' | 'count' | 'custom';

export interface UnitDefinition {
  id: string;
  name: string;
  hindiName: string;
  symbol: string;
  category: UnitCategory;
  // Factor relative to category base unit:
  // Weight base: kg (1.0)
  // Length base: meter (1.0)
  // Volume base: liter (1.0)
  // Count base: piece (1.0)
  baseFactor: number;
  isCustom?: boolean;
  description?: string;
}

export interface CalculationRecord {
  id: string;
  timestamp: number;
  mode: 'price_to_qty' | 'qty_to_price';
  itemName: string;
  rate: number;
  rateUnitId: string;
  rateUnitSymbol: string;
  
  // For Price to Qty
  customerAmount?: number;
  resultQuantity?: number;
  targetUnitId?: string;
  targetUnitSymbol?: string;

  // For Qty to Price
  inputQuantity?: number;
  inputUnitId?: string;
  inputUnitSymbol?: string;
  resultPrice?: number;

  customerName?: string;
  notes?: string;
}

export interface ShopProfile {
  shopName: string;
  ownerName: string;
  mobile: string;
  city: string;
}

export interface UserProfile extends ShopProfile {
  id?: string;
  deviceId?: string;
  createdAt?: number;
}

export interface AppSettings {
  decimalPlaces: number;
  roundingMode: 'normal' | 'ceil' | 'floor';
  language: 'en' | 'hi' | 'hinglish';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  currencySymbol: string;
  defaultCategory: UnitCategory;
}
