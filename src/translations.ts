import { Language } from './types';

// Convert English digits to Bengali numerals
export function toBengaliNumber(num: number | string): string {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

// Convert Bengali digits to English
export function toEnglishNumber(str: string): string {
  if (!str) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let res = str;
  bnDigits.forEach((bn, idx) => {
    res = res.replaceAll(bn, idx.toString());
  });
  return res;
}

// Format currency according to language
export function formatCurrency(amount: number, lang: Language = 'bn'): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (lang === 'bn') {
    return `৳ ${toBengaliNumber(formatted)}`;
  }
  return `৳ ${formatted}`;
}

// Format date into human readable form
export function formatDate(dateStr: string, lang: Language = 'bn'): string {
  try {
    const [year, month, day] = dateStr.split('-');
    if (lang === 'bn') {
      return `${toBengaliNumber(day)}-${toBengaliNumber(month)}-${toBengaliNumber(year)}`;
    }
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
}

export const translations = {
  bn: {
    // Header & Meta
    madrasaName: 'উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা',
    address: 'উত্তর দেশীবাই, কাঁঠালী, জলঢাকা, নীলফামারী',
    established: 'স্থাপিত: ১৯৭১ খ্রিষ্টাব্দ / ১৩৭১ বঙ্গাব্দ',
    registration: 'রেজি নং: রংপুর-৬৪২/৮৬',
    adminLogin: 'Admin Login',
    adminLogout: 'লগআউট',
    adminDashboard: 'অ্যাডমিন প্যানেল',
    backToDashboard: 'ড্যাশবোর্ডে ফিরুন',

    // Menu Options
    menu01: '০১. ড্যাশবোর্ড',
    menu02: '০২. খাতওয়ারী আয়',
    menu03: '০৩. খাতওয়ারী ব্যয়',
    menu04: '০৪. দিনওয়ারী আয়',
    menu05: '০৫. দিনওয়ারী ব্যয়',
    menu06: '০৬. বিবিধ / Summary',

    // Summary Cards
    totalIncome: 'মোট আয়',
    totalExpenses: 'মোট ব্যয়',
    currentBalance: 'বর্তমান ব্যালেন্স',
    transactionsCount: 'টি লেনদেন',
    balanceFormula: 'মোট আয় - মোট ব্যয়',

    // Navigation section
    navSectionTitle: 'অনলাইন হিসাবের সমূহ (ড্যাশবোর্ড নেভিগেশন)',
    nav01Title: '০১. ড্যাশবোর্ড',
    nav01Desc: 'সর্বমোট গুঁজি তথ্য, সারাংশ ও সাম্রাজ্য চিত্র',
    nav02Title: '০২. খাতওয়ারী আয়',
    nav02Desc: 'বিভিন্ন খাত থেকে প্রাপ্ত আয়ের বিস্তারিত দেখুন',
    nav03Title: '০৩. খাতওয়ারী ব্যয়',
    nav03Desc: 'বিভিন্ন খাতে ব্যয়ের বিস্তারিত দেখুন',
    nav04Title: '০৪. দিনওয়ারী আয়',
    nav04Desc: 'তারিখ অনুযায়ী দৈনিক আয়ের তালিকা দেখুন',
    nav05Title: '০৫. দিনওয়ারী ব্যয়',
    nav05Desc: 'তারিখ অনুযায়ী দৈনিক ব্যয়ের তালিকা দেখুন',
    nav06Title: '০৬. বিবিধ / Summary',
    nav06Desc: 'সার্বিক হিসাব, প্রতিবেদন ও সংক্ষিপ্ত বিবরণ দেখুন',

    // Table
    latestTransactions: 'সর্বশেষ লেনদেনসমূহ',
    viewAllTransactions: 'সব লেনদেন দেখুন',
    sl: 'ক্রম',
    date: 'তারিখ',
    type: 'ধরন',
    category: 'খাতের নাম',
    description: 'বিবরণ',
    amount: 'পরিমাণ (৳)',
    action: 'অ্যাকশন',
    income: 'আয়',
    expense: 'ব্যয়',
    view: 'দেখুন',
    noRecords: 'কোন লেনদেনের তথ্য পাওয়া যায়নি।',

    // Sidebar Info
    madrasaOverview: 'মাদ্রাসা পরিচিতি',
    mahatamim: 'মুহতামিম',
    mahatamimName: 'মাও: মো: মোস্তফা কামাল',
    mahatamimPhone: '+8801744618311',
    officePhone: '01832693837',

    // Action buttons & Modals
    addTransaction: 'নতুন লেনদেন যুক্ত করুন',
    addIncome: 'আয় যুক্ত করুন',
    addExpense: 'ব্যয় যুক্ত করুন',
    searchPlaceholder: 'খাত বা বিবরণ খুঁজুন...',
    allCategories: 'সকল খাত',
    filterByDate: 'তারিখ ফিল্টার',
    fromDate: 'শুরুর তারিখ',
    toDate: 'শেষের তারিখ',
    applyFilter: 'ফিল্টার করুন',
    resetFilter: 'রিসেট',
    downloadPdf: 'পিডিএফ ডাউনলোড',
    printReport: 'প্রিন্ট করুন',
    downloadZip: 'সোর্স কোড ZIP ডাউনলোড',
    details: 'বিস্তারিত বিবরণী',
    receiptVoucher: 'মানি রসিদ / ভাউচার',
    close: 'বন্ধ করুন',
    donorOrPayee: 'দাতা / গ্রহীতার নাম',
    phone: 'মোবাইল নম্বর',
    paymentMethod: 'পেমেন্ট মাধ্যম',
    cash: 'নগদ ক্যাশ',
    bkash: 'বিকাশ',
    nagad: 'নগদ (এমএফএস)',
    bank: 'ব্যাংক একাউন্ট',
    voucherNo: 'রসিদ / ভাউচার নং',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    edit: 'সম্পাদনা',
    delete: 'মুছুন',
    confirmDelete: 'আপনি কি নিশ্চিতভাবে এই লেনদেনটি মুছতে চান?',

    // Admin Panel
    adminTitle: 'মাদ্রাসার কেন্দ্রীয় হিসাব ও প্রশাসন প্যানেল',
    quickStats: 'দ্রুত আর্থিক পরিসংখ্যান',
    manageIncome: 'আয় ব্যবস্থাপনা',
    manageExpenses: 'ব্যয় ব্যবস্থাপনা',
    manageCategories: 'খাত ব্যবস্থাপনা',
    systemSettings: 'সিস্টেম ও প্রতিষ্ঠান সেটিংস',
    noticeText: 'বিজ্ঞপ্তি বার্তা',
    updateNotice: 'বিজ্ঞপ্তি আপডেট করুন',
    newPassword: 'নতুন পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    changePassword: 'পাসওয়ার্ড পরিবর্তন করুন',
    passwordNotice: 'নিরাপত্তার স্বার্থে প্রাথমিক পাসওয়ার্ডটি পরিবর্তন করুন।',
    loginSuccess: 'সফলভাবে লগইন হয়েছে।',
    loginError: 'সঠিক ইউজারনেম/ফোন ও পাসওয়ার্ড দিন।',
  },
  en: {
    // Header & Meta
    madrasaName: 'Uttar Deshibai Faizul Uloom Qawmi Hafizia Madrasa & Orphanage',
    address: 'Uttar Deshibai, Kanthali, Jaldhaka, Nilphamari',
    established: 'Est: 1971 AD / 1371 BS',
    registration: 'Reg No: Rangpur-642/86',
    adminLogin: 'Admin Login',
    adminLogout: 'Logout',
    adminDashboard: 'Admin Panel',
    backToDashboard: 'Back to Dashboard',

    // Menu Options
    menu01: '01. Dashboard',
    menu02: '02. Category-wise Income',
    menu03: '03. Category-wise Expenses',
    menu04: '04. Daily Income',
    menu05: '05. Daily Expenses',
    menu06: '06. Miscellaneous / Summary',

    // Summary Cards
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    currentBalance: 'Current Balance',
    transactionsCount: 'Transactions',
    balanceFormula: 'Total Income - Total Expenses',

    // Navigation section
    navSectionTitle: 'Online Accounts Overview (Dashboard Navigation)',
    nav01Title: '01. Dashboard',
    nav01Desc: 'Overall balance, financial overview and summaries',
    nav02Title: '02. Category-wise Income',
    nav02Desc: 'Detailed view of income received from various heads',
    nav03Title: '03. Category-wise Expenses',
    nav03Desc: 'Detailed breakdown of expenses incurred by category',
    nav04Title: '04. Daily Income',
    nav04Desc: 'View date-wise daily income receipts and registry',
    nav05Title: '05. Daily Expenses',
    nav05Desc: 'View date-wise daily expenses and voucher registry',
    nav06Title: '06. Miscellaneous / Summary',
    nav06Desc: 'Comprehensive balance sheets, audit summaries & reports',

    // Table
    latestTransactions: 'Latest Transactions',
    viewAllTransactions: 'View All Transactions',
    sl: 'SL',
    date: 'Date',
    type: 'Type',
    category: 'Category Name',
    description: 'Description',
    amount: 'Amount (৳)',
    action: 'Action',
    income: 'Income',
    expense: 'Expense',
    view: 'View',
    noRecords: 'No transaction records found.',

    // Sidebar Info
    madrasaOverview: 'Madrasa Overview',
    mahatamim: 'Mahatamim (Principal)',
    mahatamimName: 'Mawlana Md. Mostafa Kamal',
    mahatamimPhone: '+8801744618311',
    officePhone: '01832693837',

    // Action buttons & Modals
    addTransaction: 'Add New Transaction',
    addIncome: 'Add Income',
    addExpense: 'Add Expense',
    searchPlaceholder: 'Search category or description...',
    allCategories: 'All Categories',
    filterByDate: 'Filter by Date',
    fromDate: 'From Date',
    toDate: 'To Date',
    applyFilter: 'Apply Filter',
    resetFilter: 'Reset',
    downloadPdf: 'Download PDF',
    printReport: 'Print Report',
    downloadZip: 'Download Source Code ZIP',
    details: 'Transaction Details',
    receiptVoucher: 'Money Receipt / Voucher',
    close: 'Close',
    donorOrPayee: 'Donor / Payee Name',
    phone: 'Phone Number',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    bkash: 'bKash',
    nagad: 'Nagad',
    bank: 'Bank Account',
    voucherNo: 'Receipt / Voucher No.',
    save: 'Save Record',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this transaction record?',

    // Admin Panel
    adminTitle: 'Madrasa Central Accounts & Administration Panel',
    quickStats: 'Quick Financial Stats',
    manageIncome: 'Manage Income',
    manageExpenses: 'Manage Expenses',
    manageCategories: 'Category Management',
    systemSettings: 'System & Institutional Settings',
    noticeText: 'Announcement Notice',
    updateNotice: 'Update Announcement',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    changePassword: 'Change Password',
    passwordNotice: 'For security, please change the default password after first login.',
    loginSuccess: 'Successfully authenticated.',
    loginError: 'Invalid username/phone or password.',
  },
};
