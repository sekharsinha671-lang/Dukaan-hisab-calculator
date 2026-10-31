export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  // Navigation & Header
  appTitle: string;
  appSubtitle: string;
  calcTab: string;
  profitTab: string;
  historyTab: string;
  unitsTab: string;
  settingsTab: string;
  wideDashboard: string;
  phoneView: string;

  // First-time onboarding / setup
  welcomeTitle: string;
  welcomeSubtitle: string;
  selectLanguagePrompt: string;
  continueBtn: string;

  // Calculator Modes
  priceToQtyTitle: string;
  priceToQtySubtitle: string;
  qtyToPriceTitle: string;
  qtyToPriceSubtitle: string;
  resetBtn: string;

  // Calculator Form Labels
  productRateLabel: string;
  ratePlaceholder: string;
  customerAmountLabel: string;
  amountPlaceholder: string;
  customerWantsQtyLabel: string;
  qtyPlaceholder: string;
  quickAddLabel: string;
  presetsLabel: string;
  quickPortionsLabel: string;
  quickLengthsLabel: string;
  quickVolumeLabel: string;
  calculateInLabel: string;
  itemNameLabel: string;
  itemPlaceholder: string;
  customerNameLabel: string;
  customerPlaceholder: string;

  // Results & Verbal Explanations
  exactQtyToGive: string;
  totalAmountToCollect: string;
  equivalentLabel: string;
  p2qExplanation: (amount: string | number, qty: string | number, unit: string) => string;
  q2pExplanation: (qty: string | number, unit: string, price: string | number) => string;
  p2qEmptyPrompt: string;
  q2pEmptyPrompt: string;
  saveToParchiBtn: string;
  savedToParchiSuccess: string;
  shareSlipBtn: string;

  // History & Parchi
  historyTitle: string;
  historySubtitle: string;
  clearHistoryBtn: string;
  confirmClearPrompt: string;
  yesClearBtn: string;
  cancelBtn: string;
  allFilter: string;
  searchPlaceholder: string;
  noHistoryTitle: string;
  noHistoryDesc: string;
  loadIntoCalcTooltip: string;
  recentParchi: string;
  viewAll: string;
  deleteTooltip: string;

  // Receipt Modal
  receiptTitle: string;
  receiptHeader: string;
  dateLabel: string;
  customerLabel: string;
  itemLabel: string;
  rateLabel: string;
  amountPaidLabel: string;
  totalQtyLabel: string;
  qtyTakenLabel: string;
  totalBillLabel: string;
  thankYouMessage: string;
  copyTextBtn: string;
  copiedSuccess: string;
  printBtn: string;
  whatsappBtn: string;

  // Units
  unitsTitle: string;
  unitsSubtitle: string;
  addCustomUnitBtn: string;
  quickTesterTitle: string;
  equalsText: string;
  allUnits: string;
  weightCategory: string;
  lengthCategory: string;
  volumeCategory: string;
  countingCategory: string;
  customCategory: string;
  unitNameLabel: string;
  shortSymbolLabel: string;
  equalsEquationLabel: (symbol: string) => string;
  saveUnitBtn: string;

  // Settings
  shopProfileTitle: string;
  shopProfileSubtitle: string;
  activeAccountBadge: string;
  shopNameLabel: string;
  ownerNameLabel: string;
  mobileLabel: string;
  cityLabel: string;
  updateShopBtn: string;
  profileUpdatedSuccess: string;
  calcPrefsTitle: string;
  calcPrefsSubtitle: string;
  decimalPrecisionLabel: string;
  placesSuffix: string;
  roundingRuleLabel: string;
  roundNormal: string;
  roundCeil: string;
  roundFloor: string;
  tactileFeedbackTitle: string;
  tactileFeedbackDesc: string;
  enabledBadge: string;
  mutedBadge: string;
  languageSettingTitle: string;
  languageSettingDesc: string;
  appInfoTitle: string;
  appInfoSubtitle: string;
  freeAppBadge: string;
  offlineCacheActive: string;

  // Offline banner
  offlineModeNotice: string;
  offlineSubnotice: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    // Navigation & Header
    appTitle: 'Dukaan Hisab Calculator',
    appSubtitle: 'Indian Shopkeeper Calculator & Profit Manager',
    calcTab: 'Calculator',
    profitTab: 'Profit',
    historyTab: 'History',
    unitsTab: 'Units',
    settingsTab: 'Settings',
    wideDashboard: 'Wide View',
    phoneView: 'Mobile View',

    // First-time onboarding / setup
    welcomeTitle: 'Welcome to Dukaan Hisab Calculator',
    welcomeSubtitle: 'Free, 100% offline calculator crafted for Indian shopkeepers and merchants.',
    selectLanguagePrompt: 'Choose your preferred language:',
    continueBtn: 'Continue to Calculator',

    // Calculator Modes
    priceToQtyTitle: 'Price to Quantity',
    priceToQtySubtitle: 'Enter customer budget (₹) → Get exact weight or units',
    qtyToPriceTitle: 'Quantity to Price',
    qtyToPriceSubtitle: 'Enter customer quantity (e.g. 250g) → Get exact payable bill (₹)',
    resetBtn: 'Reset',

    // Calculator Form Labels
    productRateLabel: 'Product Rate / Price *',
    ratePlaceholder: 'e.g. 60',
    customerAmountLabel: 'Customer Paid / Budget Amount *',
    amountPlaceholder: 'e.g. 40',
    customerWantsQtyLabel: 'Customer Requested Quantity *',
    qtyPlaceholder: 'e.g. 250',
    quickAddLabel: 'Quick Budget Presets (₹)',
    presetsLabel: 'Common Amounts',
    quickPortionsLabel: 'Quick Portions & Weights',
    quickLengthsLabel: 'Quick Length Presets',
    quickVolumeLabel: 'Quick Volume Presets',
    calculateInLabel: 'Display Result In',
    itemNameLabel: 'Item / Product Name (Optional)',
    itemPlaceholder: 'e.g. Basmati Rice, Mustard Oil, Onion, Wire',
    customerNameLabel: 'Customer Name / Phone (Optional)',
    customerPlaceholder: 'e.g. Ramesh Bhai',

    // Results & Verbal Explanations
    exactQtyToGive: 'Exact Quantity to Measure & Give:',
    totalAmountToCollect: 'Total Bill Amount to Collect:',
    equivalentLabel: 'Standard Equivalent:',
    p2qExplanation: (amount, qty, unit) =>
      `For ₹${amount}, give exactly ${qty} ${unit} to the customer.`,
    q2pExplanation: (qty, unit, price) =>
      `For ${qty} ${unit}, collect exactly ₹${price} from the customer.`,
    p2qEmptyPrompt: 'Enter product rate and customer budget above to calculate quantity.',
    q2pEmptyPrompt: 'Enter product rate and requested quantity above to calculate total price.',
    saveToParchiBtn: 'Save to Parchi History',
    savedToParchiSuccess: 'Saved to Parchi ✓',
    shareSlipBtn: 'Share Receipt Slip',

    // History & Parchi
    historyTitle: 'Calculation History & Parchi',
    historySubtitle: 'Recent transactions saved locally on your phone',
    clearHistoryBtn: 'Clear History',
    confirmClearPrompt: 'Are you sure you want to delete all saved calculations?',
    yesClearBtn: 'Yes, Clear All',
    cancelBtn: 'Cancel',
    allFilter: 'All Calculations',
    searchPlaceholder: 'Search by item, customer or date...',
    noHistoryTitle: 'No Calculations Saved Yet',
    noHistoryDesc: 'Calculations you save using "Save to Parchi" will appear here.',
    loadIntoCalcTooltip: 'Load into Calculator',
    recentParchi: 'Recent Receipts',
    viewAll: 'View All',
    deleteTooltip: 'Delete record',

    // Receipt Modal
    receiptTitle: 'Customer Receipt Slip',
    receiptHeader: 'Cash Memo / Hisab Parchi',
    dateLabel: 'Date & Time:',
    customerLabel: 'Customer:',
    itemLabel: 'Product / Item:',
    rateLabel: 'Rate:',
    amountPaidLabel: 'Amount Paid:',
    totalQtyLabel: 'Total Quantity Given:',
    qtyTakenLabel: 'Quantity Purchased:',
    totalBillLabel: 'Total Bill:',
    thankYouMessage: 'Thank you! Visit again 🙏',
    copyTextBtn: 'Copy WhatsApp Text',
    copiedSuccess: 'Copied to Clipboard! ✓',
    printBtn: 'Print / Save PDF',
    whatsappBtn: 'Share on WhatsApp',

    // Units
    unitsTitle: 'Measurement Units & Conversions',
    unitsSubtitle: 'Weight, length, volume, counting, and custom shop units',
    addCustomUnitBtn: 'Add Custom Unit',
    quickTesterTitle: 'Quick Unit Converter',
    equalsText: 'equals',
    allUnits: 'All Standard Units',
    weightCategory: 'Weight (वजन)',
    lengthCategory: 'Length (लंबाई)',
    volumeCategory: 'Volume (तरल / आयतन)',
    countingCategory: 'Counting (गिनती)',
    customCategory: 'Custom Shop Units (कस्टम इकाइयां)',
    unitNameLabel: 'Unit Name *',
    shortSymbolLabel: 'Short Symbol / Abbreviation *',
    equalsEquationLabel: (symbol) => `1 ${symbol} equals:`,
    saveUnitBtn: 'Save Custom Unit',

    // Settings
    shopProfileTitle: 'Shop Details & Cash Memo Header',
    shopProfileSubtitle: 'Details displayed on printed receipts and WhatsApp slips',
    activeAccountBadge: 'Stored Locally On Device',
    shopNameLabel: 'Shop / Store Name',
    ownerNameLabel: 'Shopkeeper / Owner Name',
    mobileLabel: 'Contact Mobile Number (Printed on Slips)',
    cityLabel: 'City / Market Location',
    updateShopBtn: 'Save Shop Details',
    profileUpdatedSuccess: 'Shop details saved successfully! ✓',
    calcPrefsTitle: 'Calculation Preferences',
    calcPrefsSubtitle: 'Set decimal places and mathematical rounding rules',
    decimalPrecisionLabel: 'Decimal Precision',
    placesSuffix: 'decimal places',
    roundingRuleLabel: 'Rounding Rule',
    roundNormal: 'Standard (Nearest)',
    roundCeil: 'Ceiling (Round Up)',
    roundFloor: 'Floor (Round Down)',
    tactileFeedbackTitle: 'Tactile Sound & Vibration Feedback',
    tactileFeedbackDesc: 'Sound clicks and vibration on keypresses',
    enabledBadge: 'Enabled ✓',
    mutedBadge: 'Muted',
    languageSettingTitle: 'Application Language',
    languageSettingDesc: 'Switch the entire application language between English and Hindi',
    appInfoTitle: 'App Information & 100% Free Distribution',
    appInfoSubtitle: 'Offline standalone shopkeeper tool with zero server requirements',
    freeAppBadge: '100% Free • No Login • No Subscriptions',
    offlineCacheActive: 'All Data Stored Locally & Offline',

    // Offline banner
    offlineModeNotice: 'Offline Mode Active',
    offlineSubnotice: 'All calculator and profit features work completely offline.',
  },

  hi: {
    // Navigation & Header
    appTitle: 'दुकान हिसाब कैलकुलेटर',
    appSubtitle: 'भारतीय दुकानदार कैलकुलेटर एवं मुनाफा मैनेजर',
    calcTab: 'कैलकुलेटर',
    profitTab: 'मुनाफा',
    historyTab: 'हिसाब पर्ची',
    unitsTab: 'इकाइयां',
    settingsTab: 'सेटिंग्स',
    wideDashboard: 'बड़ा व्यू',
    phoneView: 'मोबाइल व्यू',

    // First-time onboarding / setup
    welcomeTitle: 'दुकान हिसाब कैलकुलेटर में आपका स्वागत है',
    welcomeSubtitle: 'भारतीय दुकानदारों और व्यापारियों के लिए 100% मुफ़्त एवं ऑफ़लाइन कैलकुलेटर।',
    selectLanguagePrompt: 'अपनी पसंदीदा भाषा चुनें:',
    continueBtn: 'कैलकुलेटर शुरू करें',

    // Calculator Modes
    priceToQtyTitle: 'भाव से मात्रा निकालें',
    priceToQtySubtitle: 'रुपये दर्ज करें → सही वजन व मात्रा तुरंत पाएं (उदा. ₹40 में कितना सामान?)',
    qtyToPriceTitle: 'मात्रा से भाव निकालें',
    qtyToPriceSubtitle: 'वजन दर्ज करें → ग्राहक का सही बिल तुरंत पाएं (उदा. 250 ग्राम के कितने रुपये?)',
    resetBtn: 'रीसेट',

    // Calculator Form Labels
    productRateLabel: 'सामान का भाव (दर) *',
    ratePlaceholder: 'उदा. 60 प्रति किलो',
    customerAmountLabel: 'ग्राहक द्वारा दिए गए रुपये (बजट) *',
    amountPlaceholder: 'उदा. 40 रुपये का सामान',
    customerWantsQtyLabel: 'ग्राहक को चाहिए मात्रा (वजन) *',
    qtyPlaceholder: 'उदा. 250 ग्राम',
    quickAddLabel: 'त्वरित रुपये चयन (₹)',
    presetsLabel: 'आम बजट रुपये',
    quickPortionsLabel: 'आम वजन व हिस्से',
    quickLengthsLabel: 'लंबाई माप',
    quickVolumeLabel: 'तरल / दूध / तेल माप',
    calculateInLabel: 'परिणाम किस इकाई में देखें',
    itemNameLabel: 'सामान का नाम (वैकल्पिक)',
    itemPlaceholder: 'उदा. बासमती चावल, सरसों तेल, चीनी, प्याज, तार',
    customerNameLabel: 'ग्राहक का नाम / फोन (वैकल्पिक)',
    customerPlaceholder: 'उदा. रमेश भाई',

    // Results & Verbal Explanations
    exactQtyToGive: 'ग्राहक को तौलकर देने योग्य मात्रा:',
    totalAmountToCollect: 'ग्राहक से लेने योग्य कुल रुपये:',
    equivalentLabel: 'मानक बराबर माप:',
    p2qExplanation: (amount, qty, unit) =>
      `₹${amount} में ग्राहक को ठीक ${qty} ${unit} तौलकर दें।`,
    q2pExplanation: (qty, unit, price) =>
      `${qty} ${unit} सामान के लिए ग्राहक से ठीक ₹${price} लें।`,
    p2qEmptyPrompt: 'सामान का भाव और ग्राहक के रुपये दर्ज करें, मात्रा तुरंत आ जाएगी।',
    q2pEmptyPrompt: 'सामान का भाव और मांगी गई मात्रा दर्ज करें, कुल रुपये तुरंत आ जाएंगे।',
    saveToParchiBtn: 'पर्ची / हिसाब में सेव करें',
    savedToParchiSuccess: 'पर्ची में सेव हुआ ✓',
    shareSlipBtn: 'हिसाब पर्ची शेयर करें',

    // History & Parchi
    historyTitle: 'पुराना हिसाब एवं पर्ची',
    historySubtitle: 'हाल ही में किए गए हिसाब जो आपके फोन में सुरक्षित हैं',
    clearHistoryBtn: 'पूरा हिसाब मिटाएं',
    confirmClearPrompt: 'क्या आप सभी सहेजे गए हिसाब को हटाना चाहते हैं?',
    yesClearBtn: 'हाँ, सब हटाएं',
    cancelBtn: 'रद्द करें',
    allFilter: 'सभी हिसाब',
    searchPlaceholder: 'सामान, ग्राहक या तारीख से खोजें...',
    noHistoryTitle: 'अभी कोई हिसाब पर्ची नहीं है',
    noHistoryDesc: 'कैलकुलेटर में हिसाब करके "पर्ची में सेव करें" दबाएं, वह यहाँ दिखेगा।',
    loadIntoCalcTooltip: 'कैलकुलेटर में लोड करें',
    recentParchi: 'हालिया पर्चियां',
    viewAll: 'सभी देखें',
    deleteTooltip: 'हिसाब हटाएं',

    // Receipt Modal
    receiptTitle: 'ग्राहक हिसाब पर्ची',
    receiptHeader: 'दुकान कैश मेमो / हिसाब पर्ची',
    dateLabel: 'दिनांक व समय:',
    customerLabel: 'ग्राहक:',
    itemLabel: 'सामान:',
    rateLabel: 'भाव (दर):',
    amountPaidLabel: 'दिए गए रुपये:',
    totalQtyLabel: 'दी गई मात्रा:',
    qtyTakenLabel: 'खरीदी गई मात्रा:',
    totalBillLabel: 'कुल बिल राशि:',
    thankYouMessage: 'धन्यवाद! पुनः पधारें 🙏',
    copyTextBtn: 'व्हाट्सएप टेक्स्ट कॉपी करें',
    copiedSuccess: 'पर्ची कॉपी हो गई! ✓',
    printBtn: 'प्रिंट / PDF सेव करें',
    whatsappBtn: 'व्हाट्सएप पर भेजें',

    // Units
    unitsTitle: 'इकाइयां एवं परिवर्तन (कन्वर्टर)',
    unitsSubtitle: 'वजन, लंबाई, आयतन, गिनती और आपकी दुकान की कस्टम इकाइयां',
    addCustomUnitBtn: 'नई कस्टम इकाई जोड़ें',
    quickTesterTitle: 'त्वरित इकाई परिवर्तक',
    equalsText: 'बराबर है',
    allUnits: 'सभी मानक इकाइयां',
    weightCategory: 'वजन (Weight)',
    lengthCategory: 'लंबाई (Length)',
    volumeCategory: 'आयतन / तरल (Volume)',
    countingCategory: 'गिनती / संख्या (Count)',
    customCategory: 'दुकान की कस्टम इकाइयां',
    unitNameLabel: 'इकाई का नाम *',
    shortSymbolLabel: 'संक्षिप्त संकेत (Symbol) *',
    equalsEquationLabel: (symbol) => `1 ${symbol} किसके बराबर है:`,
    saveUnitBtn: 'कस्टम इकाई सेव करें',

    // Settings
    shopProfileTitle: 'दुकान का विवरण एवं रसीद हेडर',
    shopProfileSubtitle: 'यह नाम और नंबर आपकी प्रिंटेड पर्ची और व्हाट्सएप बिल पर दिखेगा',
    activeAccountBadge: 'फोन में सुरक्षित',
    shopNameLabel: 'दुकान का नाम',
    ownerNameLabel: 'दुकानदार / मालिक का नाम',
    mobileLabel: 'संपर्क मोबाइल नंबर (पर्ची पर प्रिंट होगा)',
    cityLabel: 'शहर / बाजार का पता',
    updateShopBtn: 'दुकान का विवरण सेव करें',
    profileUpdatedSuccess: 'दुकान का विवरण सफलतापूर्वक सुरक्षित हुआ! ✓',
    calcPrefsTitle: 'कैलकुलेटर प्राथमिकताएं',
    calcPrefsSubtitle: 'दशमलव स्थान और राउंडिंग नियम निर्धारित करें',
    decimalPrecisionLabel: 'दशमलव परिशुद्धता',
    placesSuffix: 'दशमलव स्थान',
    roundingRuleLabel: 'राउंडिंग नियम',
    roundNormal: 'सामान्य (निकटतम संख्या)',
    roundCeil: 'अधिकतम (ऊपर राउंड करें)',
    roundFloor: 'न्यूनतम (नीचे राउंड करें)',
    tactileFeedbackTitle: 'क्लिक ध्वनि और कंपन फीडबैक',
    tactileFeedbackDesc: 'बटन दबाने पर स्पर्श ध्वनि एवं हल्का कंपन',
    enabledBadge: 'सक्रिय ✓',
    mutedBadge: 'बंद',
    languageSettingTitle: 'ऐप की भाषा',
    languageSettingDesc: 'पूरी ऐप की भाषा अंग्रेजी या हिंदी में बदलें',
    appInfoTitle: 'ऐप जानकारी एवं 100% मुफ़्त वितरण',
    appInfoSubtitle: 'बिना किसी लॉगिन या सर्वर के चलने वाला ऑफ़लाइन दुकानदार टूल',
    freeAppBadge: '100% मुफ़्त • कोई लॉगिन नहीं • कोई सब्सक्रिप्शन नहीं',
    offlineCacheActive: 'सभी डेटा ऑफ़लाइन सुरक्षित',

    // Offline banner
    offlineModeNotice: 'ऑफ़लाइन मोड सक्रिय',
    offlineSubnotice: 'कैलकुलेटर और पुराना हिसाब बिना इंटरनेट काम कर रहे हैं।',
  },
};
