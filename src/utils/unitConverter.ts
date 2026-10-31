import { UnitCategory, UnitDefinition } from '../types/units';

// Default standard units for Indian retail & wholesale trade
export const STANDARD_UNITS: UnitDefinition[] = [
  // Weight Units (Base: kg = 1)
  {
    id: 'kg',
    name: 'Kilogram',
    hindiName: 'किलोग्राम (किलो)',
    symbol: 'kg',
    category: 'weight',
    baseFactor: 1.0,
    description: '1 kg = 1000 grams',
  },
  {
    id: 'gram',
    name: 'Gram',
    hindiName: 'ग्राम',
    symbol: 'g',
    category: 'weight',
    baseFactor: 0.001,
    description: '1000 g = 1 kg',
  },
  {
    id: 'mg',
    name: 'Milligram',
    hindiName: 'मिलीग्राम',
    symbol: 'mg',
    category: 'weight',
    baseFactor: 0.000001,
    description: '1000 mg = 1 g',
  },
  {
    id: 'quintal',
    name: 'Quintal',
    hindiName: 'क्विंटल',
    symbol: 'qtl',
    category: 'weight',
    baseFactor: 100.0,
    description: '1 quintal = 100 kg',
  },
  {
    id: 'ton',
    name: 'Metric Ton',
    hindiName: 'टन',
    symbol: 'ton',
    category: 'weight',
    baseFactor: 1000.0,
    description: '1 ton = 1000 kg (10 quintals)',
  },
  {
    id: 'paav',
    name: 'Paav (250g)',
    hindiName: 'पाव (250 ग्राम)',
    symbol: 'paav',
    category: 'weight',
    baseFactor: 0.25,
    description: '1 paav = 250 grams (1/4 kg)',
  },
  {
    id: 'tola',
    name: 'Tola',
    hindiName: 'तोला (10g / 11.66g)',
    symbol: 'tola',
    category: 'weight',
    baseFactor: 0.01, // Standard commercial gold/grocery 10g or 11.66g, using 10g standard
    description: '1 tola = 10 grams (or traditional 11.66g)',
  },

  // Length Units (Base: meter = 1)
  {
    id: 'meter',
    name: 'Meter',
    hindiName: 'मीटर',
    symbol: 'm',
    category: 'length',
    baseFactor: 1.0,
    description: '1 meter = 100 cm',
  },
  {
    id: 'cm',
    name: 'Centimeter',
    hindiName: 'सेंटीमीटर',
    symbol: 'cm',
    category: 'length',
    baseFactor: 0.01,
    description: '100 cm = 1 meter',
  },
  {
    id: 'mm',
    name: 'Millimeter',
    hindiName: 'मिलीमीटर',
    symbol: 'mm',
    category: 'length',
    baseFactor: 0.001,
    description: '1000 mm = 1 meter',
  },
  {
    id: 'feet',
    name: 'Feet (Foot)',
    hindiName: 'फीट / फुट',
    symbol: 'ft',
    category: 'length',
    baseFactor: 0.3048,
    description: '1 ft = 12 inches (0.3048 m)',
  },
  {
    id: 'inch',
    name: 'Inch',
    hindiName: 'इंच',
    symbol: 'in',
    category: 'length',
    baseFactor: 0.0254,
    description: '1 inch = 2.54 cm',
  },
  {
    id: 'yard',
    name: 'Gaj / Yard',
    hindiName: 'गज / यार्ड',
    symbol: 'gaj',
    category: 'length',
    baseFactor: 0.9144,
    description: '1 gaj = 3 feet (0.9144 m)',
  },

  // Volume Units (Base: liter = 1)
  {
    id: 'liter',
    name: 'Liter',
    hindiName: 'लीटर',
    symbol: 'L',
    category: 'volume',
    baseFactor: 1.0,
    description: '1 liter = 1000 ml',
  },
  {
    id: 'ml',
    name: 'Milliliter',
    hindiName: 'मिलीलीटर',
    symbol: 'ml',
    category: 'volume',
    baseFactor: 0.001,
    description: '1000 ml = 1 liter',
  },

  // Counting Units (Base: piece = 1)
  {
    id: 'piece',
    name: 'Piece (Nagg)',
    hindiName: 'पीस (नग)',
    symbol: 'pc',
    category: 'count',
    baseFactor: 1.0,
    description: '1 single unit / piece',
  },
  {
    id: 'dozen',
    name: 'Dozen (Darjan)',
    hindiName: 'दर्जन (12 नग)',
    symbol: 'doz',
    category: 'count',
    baseFactor: 12.0,
    description: '1 dozen = 12 pieces',
  },
  {
    id: 'score',
    name: 'Kori (20 pcs)',
    hindiName: 'कोड़ी (20 नग)',
    symbol: 'kori',
    category: 'count',
    baseFactor: 20.0,
    description: '1 kori = 20 pieces',
  },
  {
    id: 'gross',
    name: 'Gross',
    hindiName: 'ग्रॉस (144 नग)',
    symbol: 'grs',
    category: 'count',
    baseFactor: 144.0,
    description: '1 gross = 12 dozen (144 pcs)',
  },
  {
    id: 'packet10',
    name: 'Packet (10 pcs)',
    hindiName: 'पैकेट (10 नग)',
    symbol: 'pkt-10',
    category: 'count',
    baseFactor: 10.0,
    description: '1 packet = 10 pieces',
  },
];

const CUSTOM_UNITS_STORAGE_KEY = 'dukaan_custom_units_v1';

export function getCustomUnits(): UnitDefinition[] {
  try {
    const raw = localStorage.getItem(CUSTOM_UNITS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomUnits(units: UnitDefinition[]): void {
  try {
    localStorage.setItem(CUSTOM_UNITS_STORAGE_KEY, JSON.stringify(units));
  } catch (e) {
    console.error('Failed to save custom units', e);
  }
}

export function getAllUnits(customUnits: UnitDefinition[] = []): UnitDefinition[] {
  return [...STANDARD_UNITS, ...customUnits];
}

export function getUnitById(id: string, customUnits: UnitDefinition[] = []): UnitDefinition | undefined {
  const all = getAllUnits(customUnits);
  return all.find((u) => u.id === id);
}

/**
 * Convert quantity from source unit to target unit within the same category
 */
export function convertQuantity(
  amount: number,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition
): number {
  if (fromUnit.id === toUnit.id) return amount;
  // Convert to base unit first, then to target unit
  const baseValue = amount * fromUnit.baseFactor;
  return baseValue / toUnit.baseFactor;
}

/**
 * Mode 1: Price to Quantity
 * Example: Rate = ₹60 per kg (rateUnit = kg), Customer pays ₹40, wants result in grams (targetUnit = gram)
 * Calculation:
 * - Rate per base unit = rate / rateUnit.baseFactor (e.g. 60 / 1 = ₹60 per kg)
 * - Quantity in base unit = customerAmount / ratePerBaseUnit (e.g. 40 / 60 = 0.666667 kg)
 * - Quantity in target unit = quantityInBaseUnit / targetUnit.baseFactor (e.g. 0.666667 / 0.001 = 666.667 g)
 */
export function calculatePriceToQuantity(
  customerAmount: number,
  rate: number,
  rateUnit: UnitDefinition,
  targetUnit: UnitDefinition
): {
  quantity: number;
  ratePerBaseUnit: number;
  baseUnitQuantity: number;
} {
  if (rate <= 0 || customerAmount <= 0) {
    return { quantity: 0, ratePerBaseUnit: 0, baseUnitQuantity: 0 };
  }

  const ratePerBaseUnit = rate / rateUnit.baseFactor;
  const baseUnitQuantity = customerAmount / ratePerBaseUnit;
  const targetQuantity = baseUnitQuantity / targetUnit.baseFactor;

  return {
    quantity: targetQuantity,
    ratePerBaseUnit,
    baseUnitQuantity,
  };
}

/**
 * Mode 2: Quantity to Price
 * Example: Rate = ₹60 per kg (rateUnit = kg), Customer wants 250 grams (inputUnit = gram)
 * Calculation:
 * - Rate per base unit = rate / rateUnit.baseFactor (e.g. 60 / 1 = 60)
 * - Input in base unit = inputQuantity * inputUnit.baseFactor (e.g. 250 * 0.001 = 0.25 kg)
 * - Total Price = inputInBaseUnit * ratePerBaseUnit = 0.25 * 60 = ₹15.00
 */
export function calculateQuantityToPrice(
  inputQuantity: number,
  rate: number,
  rateUnit: UnitDefinition,
  inputUnit: UnitDefinition
): {
  price: number;
  ratePerBaseUnit: number;
  baseUnitQuantity: number;
} {
  if (rate <= 0 || inputQuantity <= 0) {
    return { price: 0, ratePerBaseUnit: 0, baseUnitQuantity: 0 };
  }

  const ratePerBaseUnit = rate / rateUnit.baseFactor;
  const baseUnitQuantity = inputQuantity * inputUnit.baseFactor;
  const price = baseUnitQuantity * ratePerBaseUnit;

  return {
    price,
    ratePerBaseUnit,
    baseUnitQuantity,
  };
}

/**
 * Format number with given decimal precision and rounding mode
 */
export function formatValue(
  value: number,
  decimals: number = 2,
  roundingMode: 'normal' | 'ceil' | 'floor' = 'normal'
): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  
  const factor = Math.pow(10, decimals);
  let rounded: number;
  
  if (roundingMode === 'ceil') {
    rounded = Math.ceil(value * factor) / factor;
  } else if (roundingMode === 'floor') {
    rounded = Math.floor(value * factor) / factor;
  } else {
    // Normal round
    rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  }

  // If decimals is 0, integer format
  if (decimals === 0) {
    return Math.round(rounded).toLocaleString('en-IN');
  }

  // Format with Indian locale and fixed decimals
  return rounded.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
