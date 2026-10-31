import { CalculationRecord } from '../types/units';

const HISTORY_KEY = 'dukaan_calc_history_v1';

const INITIAL_DEMO_HISTORY: CalculationRecord[] = [
  {
    id: 'demo-1',
    timestamp: Date.now() - 1000 * 60 * 18,
    mode: 'price_to_qty',
    itemName: 'Sugar (चीनी)',
    rate: 60,
    rateUnitId: 'kg',
    rateUnitSymbol: 'kg',
    customerAmount: 40,
    resultQuantity: 666.67,
    targetUnitId: 'gram',
    targetUnitSymbol: 'g',
    customerName: 'Ramesh Ji',
  },
  {
    id: 'demo-2',
    timestamp: Date.now() - 1000 * 60 * 42,
    mode: 'qty_to_price',
    itemName: 'Mustard Oil (सरसों तेल)',
    rate: 160,
    rateUnitId: 'liter',
    rateUnitSymbol: 'L',
    inputQuantity: 250,
    inputUnitId: 'ml',
    inputUnitSymbol: 'ml',
    resultPrice: 40.0,
    customerName: 'Anil Kumar',
  },
  {
    id: 'demo-3',
    timestamp: Date.now() - 1000 * 60 * 95,
    mode: 'qty_to_price',
    itemName: 'Arhar Dal (अरहर दाल)',
    rate: 140,
    rateUnitId: 'kg',
    rateUnitSymbol: 'kg',
    inputQuantity: 500,
    inputUnitId: 'gram',
    inputUnitSymbol: 'g',
    resultPrice: 70.0,
    customerName: 'Pooja Devi',
  },
];

export function getHistory(): CalculationRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(INITIAL_DEMO_HISTORY));
      return INITIAL_DEMO_HISTORY;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveHistory(records: CalculationRecord[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save calculation history', e);
  }
}

export function addHistoryRecord(record: CalculationRecord): CalculationRecord[] {
  const current = getHistory();
  // Keep up to 200 recent records
  const updated = [record, ...current].slice(0, 200);
  saveHistory(updated);
  return updated;
}

export function removeHistoryRecord(id: string): CalculationRecord[] {
  const current = getHistory();
  const updated = current.filter((item) => item.id !== id);
  saveHistory(updated);
  return updated;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}

/**
 * Format calculation record into a clean Indian shop receipt text for WhatsApp
 */
export function formatReceiptText(
  record: CalculationRecord,
  shopName: string = 'Dukaan Hisab',
  ownerPhone: string = ''
): string {
  const dateStr = new Date(record.timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const divider = '--------------------------------';
  const itemLine = record.itemName ? `*सामान / Item:* ${record.itemName}\n` : '';
  const customerLine = record.customerName ? `*ग्राहक / Customer:* ${record.customerName}\n` : '';

  if (record.mode === 'price_to_qty') {
    return `🧾 *${shopName}*
${divider}
${customerLine}${itemLine}*भाव / Rate:* ₹${record.rate} per ${record.rateUnitSymbol}
*ग्राहक ने दिए / Amount:* ₹${record.customerAmount}
*तय मात्रा / Quantity:* *${record.resultQuantity} ${record.targetUnitSymbol}*
${divider}
📅 ${dateStr}
${ownerPhone ? `📞 ${ownerPhone}\n` : ''}धन्यवाद! फिर पधारें (Thank You!)`;
  } else {
    return `🧾 *${shopName}*
${divider}
${customerLine}${itemLine}*भाव / Rate:* ₹${record.rate} per ${record.rateUnitSymbol}
*मात्रा / Qty:* ${record.inputQuantity} ${record.inputUnitSymbol}
*कुल हिसाब / Total:* *₹${record.resultPrice}*
${divider}
📅 ${dateStr}
${ownerPhone ? `📞 ${ownerPhone}\n` : ''}धन्यवाद! फिर पधारें (Thank You!)`;
  }
}
