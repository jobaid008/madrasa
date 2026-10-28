import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDate, toBengaliNumber } from '../translations';
import { printFinancialReport, exportPdfDocument } from '../utils/pdfGenerator';
import { Pagination } from '../components/Pagination';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  Eye,
  Search,
  Scale,
  TrendingUp,
  TrendingDown,
  Building2,
  CheckCircle2,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

export const SummaryPage: React.FC = () => {
  const {
    language,
    madrasa,
    transactions,
    categories,
    setSelectedTransactionForView,
    setEditingTransaction,
    setDeletingTransaction,
    userSession,
  } = useApp();
  const t = translations[language];

  // Half-Yearly Period Selection
  // 'h1' = Jan - Jun (১ম ৬ মাস)
  // 'h2' = Jul - Dec (২য় ৬ মাস)
  // 'full' = Entire Year (সার্বিক বার্ষিক)
  const [period, setPeriod] = useState<'full' | 'h1' | 'h2'>('full');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Filters for Master Ledger Table
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter transactions by period & year
  const periodTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const parts = tx.date.split('-');
      const yr = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);

      if (yr !== selectedYear) return false;

      if (period === 'h1') {
        return m >= 1 && m <= 6;
      }
      if (period === 'h2') {
        return m >= 7 && m <= 12;
      }
      return true; // 'full'
    });
  }, [transactions, period, selectedYear]);

  // Statistics for the selected period
  const periodIncome = useMemo(
    () => periodTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [periodTransactions]
  );
  const periodExpense = useMemo(
    () => periodTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [periodTransactions]
  );
  const periodBalance = periodIncome - periodExpense;
  const periodIncomeCount = periodTransactions.filter((t) => t.type === 'income').length;
  const periodExpenseCount = periodTransactions.filter((t) => t.type === 'expense').length;

  // Comparison stats (H1 vs H2 vs Full)
  const h1Transactions = useMemo(() => {
    return transactions.filter((tx) => {
      const parts = tx.date.split('-');
      const yr = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      return yr === selectedYear && m >= 1 && m <= 6;
    });
  }, [transactions, selectedYear]);

  const h1Income = h1Transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const h1Expense = h1Transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const h1Balance = h1Income - h1Expense;

  const h2Transactions = useMemo(() => {
    return transactions.filter((tx) => {
      const parts = tx.date.split('-');
      const yr = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      return yr === selectedYear && m >= 7 && m <= 12;
    });
  }, [transactions, selectedYear]);

  const h2Income = h2Transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const h2Expense = h2Transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const h2Balance = h2Income - h2Expense;

  // Specific fund allocations
  const zakatIncome = periodTransactions
    .filter((t) => t.type === 'income' && t.categoryNameBn.includes('যাকাত'))
    .reduce((sum, t) => sum + t.amount, 0);

  const lillahIncome = periodTransactions
    .filter((t) => t.type === 'income' && (t.categoryNameBn.includes('লিল্লা') || t.categoryNameBn.includes('এতিম')))
    .reduce((sum, t) => sum + t.amount, 0);

  const generalIncome = periodIncome - zakatIncome - lillahIncome;

  const foodExpense = periodTransactions
    .filter((t) => t.type === 'expense' && t.categoryNameBn.includes('খাদ্য'))
    .reduce((sum, t) => sum + t.amount, 0);

  const salaryExpense = periodTransactions
    .filter((t) => t.type === 'expense' && t.categoryNameBn.includes('বেতন'))
    .reduce((sum, t) => sum + t.amount, 0);

  const otherExpense = periodExpense - foodExpense - salaryExpense;

  // Filtered transactions for the ledger
  const filteredLedger = useMemo(() => {
    return periodTransactions.filter((tx) => {
      if (filterType !== 'all' && tx.type !== filterType) return false;
      if (filterCategory !== 'all' && tx.categoryId !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          tx.description.toLowerCase().includes(q) ||
          tx.categoryNameBn.toLowerCase().includes(q) ||
          tx.categoryNameEn.toLowerCase().includes(q) ||
          (tx.donorOrPayee && tx.donorOrPayee.toLowerCase().includes(q)) ||
          (tx.voucherNo && tx.voucherNo.toLowerCase().includes(q))
        );
      }
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date) || b.sl - a.sl);
  }, [periodTransactions, filterType, filterCategory, searchQuery]);

  // Pagination for ledger (31 items per page)
  const PAGE_SIZE = 31;
  const paginatedLedger = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLedger.slice(start, start + PAGE_SIZE);
  }, [filteredLedger, currentPage]);

  const handlePrint = () => {
    const periodLabel =
      period === 'h1'
        ? (language === 'bn' ? '১ম ৬ মাস (জানুয়ারি – জুন)' : '1st Half: Jan - Jun')
        : period === 'h2'
        ? (language === 'bn' ? '২য় ৬ মাস (জুলাই – ডিসেম্বর)' : '2nd Half: Jul - Dec')
        : (language === 'bn' ? 'সার্বিক বার্ষিক হিসাব' : 'Annual Audit');

    const title = language === 'bn' ? `সার্বিক অডিট ও আর্থিক বিবরণী (${periodLabel})` : `Financial Audit (${periodLabel})`;
    printFinancialReport(title, filteredLedger, madrasa, language);
  };

  const handleExportPdf = () => {
    exportPdfDocument('Comprehensive Financial Statement', filteredLedger, madrasa);
  };

  const pageTitle = language === 'bn' ? '০৬. বিবিধ / Summary' : '06. Miscellaneous / Summary';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-purple-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-amber-300 shadow-inner">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white">
              {pageTitle}
            </h2>
            <p className="text-xs text-purple-200 opacity-90 mt-0.5">
              {language === 'bn'
                ? '৬ মাসের ষাণ্মাসিক ও সার্বিক বার্ষিক অডিট হিসাব, ব্যালেন্স শিট এবং মাস্টার রেজিস্টার'
                : 'Half-yearly (6-month) & annual balance sheet, fund audit, and central ledger'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-purple-500 shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printReport}</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="bg-slate-900/80 hover:bg-slate-950 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Export</span>
          </button>
        </div>
      </div>

      {/* 6-Month Half-Yearly Tabs & Year Selector */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5 mr-1">
            <Layers className="w-4 h-4 text-purple-700" />
            <span>{language === 'bn' ? 'হিসাব কাল বিভাজন:' : 'Accounting Period:'}</span>
          </span>

          {/* 3 Main Period Buttons */}
          <button
            type="button"
            onClick={() => {
              setPeriod('full');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              period === 'full'
                ? 'bg-purple-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{language === 'bn' ? 'সার্বিক বার্ষিক হিসাব (পূর্ণাঙ্গ বছর)' : 'Full Annual Year'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPeriod('h1');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              period === 'h1'
                ? 'bg-purple-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{language === 'bn' ? '১ম ৬ মাস (জানুয়ারি – জুন)' : '1st Half: Jan - Jun'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPeriod('h2');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              period === 'h2'
                ? 'bg-purple-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{language === 'bn' ? '২য় ৬ মাস (জুলাই – ডিসেম্বর)' : '2nd Half: Jul - Dec'}</span>
          </button>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">{language === 'bn' ? 'অডিট সাল:' : 'Fiscal Year:'}</span>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value={2026}>{language === 'bn' ? '২০২৬ খ্রিষ্টাব্দ' : '2026'}</option>
            <option value={2025}>{language === 'bn' ? '২০২৫ খ্রিষ্টাব্দ' : '2025'}</option>
            <option value={2024}>{language === 'bn' ? '২০২৪ খ্রিষ্টাব্দ' : '2024'}</option>
          </select>
        </div>
      </div>

      {/* 6-Month Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1st Half Card */}
        <div
          onClick={() => {
            setPeriod('h1');
            setCurrentPage(1);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            period === 'h1'
              ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>{language === 'bn' ? '১ম ৬ মাস (জানু - জুন)' : '1st Half (Jan - Jun)'}</span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
              {language === 'bn' ? `${toBengaliNumber(h1Transactions.length)} টি লেনদেন` : `${h1Transactions.length} records`}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.income}:</span>
              <span className="font-bold text-emerald-700">{formatCurrency(h1Income, language)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.expense}:</span>
              <span className="font-bold text-red-600">{formatCurrency(h1Expense, language)}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-200 font-black">
              <span className="text-slate-700">{language === 'bn' ? 'ষাণ্মাসিক ব্যালেন্স:' : 'Net Balance:'}</span>
              <span className={h1Balance >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                {formatCurrency(h1Balance, language)}
              </span>
            </div>
          </div>
        </div>

        {/* 2nd Half Card */}
        <div
          onClick={() => {
            setPeriod('h2');
            setCurrentPage(1);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            period === 'h2'
              ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>{language === 'bn' ? '২য় ৬ মাস (জুলাই - ডিসে)' : '2nd Half (Jul - Dec)'}</span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
              {language === 'bn' ? `${toBengaliNumber(h2Transactions.length)} টি লেনদেন` : `${h2Transactions.length} records`}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.income}:</span>
              <span className="font-bold text-emerald-700">{formatCurrency(h2Income, language)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.expense}:</span>
              <span className="font-bold text-red-600">{formatCurrency(h2Expense, language)}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-200 font-black">
              <span className="text-slate-700">{language === 'bn' ? 'ষাণ্মাসিক ব্যালেন্স:' : 'Net Balance:'}</span>
              <span className={h2Balance >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                {formatCurrency(h2Balance, language)}
              </span>
            </div>
          </div>
        </div>

        {/* Full Year Summary Card */}
        <div
          onClick={() => {
            setPeriod('full');
            setCurrentPage(1);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            period === 'full'
              ? 'bg-purple-900 text-white shadow-md border-purple-800'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={period === 'full' ? 'text-amber-300' : 'text-slate-700'}>
              {language === 'bn' ? 'পূর্ণাঙ্গ বার্ষিক হিসাব' : 'Full Annual Year'}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                period === 'full' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {language === 'bn' ? `${toBengaliNumber(h1Income + h2Income > 0 ? 12 : 0)} মাস` : '12 Months'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className={period === 'full' ? 'text-purple-200' : 'text-slate-500'}>{t.totalIncome}:</span>
              <span className={`font-bold ${period === 'full' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {formatCurrency(h1Income + h2Income, language)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={period === 'full' ? 'text-purple-200' : 'text-slate-500'}>{t.totalExpenses}:</span>
              <span className={`font-bold ${period === 'full' ? 'text-red-300' : 'text-red-600'}`}>
                {formatCurrency(h1Expense + h2Expense, language)}
              </span>
            </div>
            <div className={`flex justify-between pt-1.5 border-t ${period === 'full' ? 'border-white/20' : 'border-slate-200'} font-black`}>
              <span className={period === 'full' ? 'text-white' : 'text-slate-700'}>{t.currentBalance}:</span>
              <span className={period === 'full' ? 'text-amber-300' : 'text-blue-700'}>
                {formatCurrency(h1Balance + h2Balance, language)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Period Balance Sheet Display */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Opening Balance */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {language === 'bn' ? 'প্রারম্ভিক তহবিল (Opening)' : 'Opening Balance'}
          </span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">
            {formatCurrency(madrasa.openingBalance, language)}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'bn' ? 'সেশনের প্রারম্ভিক জের' : 'Starting fiscal capital'}
          </p>
        </div>

        {/* Selected Period Income */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs border-l-4 border-l-emerald-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t.totalIncome} ({period === 'h1' ? '১ম ৬ মাস' : period === 'h2' ? '২য় ৬ মাস' : 'পূর্ণাঙ্গ বছর'})
          </span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">
            {formatCurrency(periodIncome, language)}
          </span>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {language === 'bn' ? `${toBengaliNumber(periodIncomeCount)} টি রসিদ জমা` : `${periodIncomeCount} collection receipts`}
          </p>
        </div>

        {/* Selected Period Expenses */}
        <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-xs border-l-4 border-l-red-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t.totalExpenses} ({period === 'h1' ? '১ম ৬ মাস' : period === 'h2' ? '২য় ৬ মাস' : 'পূর্ণাঙ্গ বছর'})
          </span>
          <span className="text-xl font-black text-red-600 mt-1 block">
            {formatCurrency(periodExpense, language)}
          </span>
          <p className="text-[11px] text-red-500 font-medium mt-1">
            {language === 'bn' ? `${toBengaliNumber(periodExpenseCount)} টি ভাউচার পরিশোধ` : `${periodExpenseCount} vouchers paid`}
          </p>
        </div>

        {/* Net Period Balance */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-2xl p-4 shadow-sm border border-indigo-700">
          <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider block">
            {t.currentBalance} (মোট আয় - মোট ব্যয়)
          </span>
          <span className="text-xl font-black text-amber-300 mt-1 block">
            {formatCurrency(periodBalance, language)}
          </span>
          <p className="text-[11px] text-indigo-200 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'সরাসরি স্বয়ংক্রিয় গণনা' : 'Real-time auto calculated'}</span>
          </p>
        </div>
      </div>

      {/* Fund Allocations Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Income Heads Allocation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'আয়ের তহবিল বিভাজন' : 'Income Fund Allocation'}</span>
            </div>
            <span className="text-xs font-black text-emerald-700">{formatCurrency(periodIncome, language)}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{language === 'bn' ? 'যাকাত তহবিল' : 'Zakat Fund'}</span>
                <span>{formatCurrency(zakatIncome, language)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${periodIncome > 0 ? (zakatIncome / periodIncome) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{language === 'bn' ? 'লিল্লা বোর্ডিং ও এতিম তহবিল' : 'Lillah Boarding & Orphanage'}</span>
                <span>{formatCurrency(lillahIncome, language)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-2 rounded-full"
                  style={{ width: `${periodIncome > 0 ? (lillahIncome / periodIncome) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{language === 'bn' ? 'সাধারণ অনুদান ও উন্নয়ন তহবিল' : 'General & Development Fund'}</span>
                <span>{formatCurrency(generalIncome, language)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${periodIncome > 0 ? (generalIncome / periodIncome) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expense Heads Allocation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span>{language === 'bn' ? 'ব্যয়ের খাতভিত্তিক বিভাজন' : 'Expenditure Breakdown'}</span>
            </div>
            <span className="text-xs font-black text-red-600">{formatCurrency(periodExpense, language)}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{language === 'bn' ? 'ছাত্র খাদ্য ও লিল্লা বোর্ডিং' : 'Student Meals & Lillah Boarding'}</span>
                <span>{formatCurrency(foodExpense, language)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${periodExpense > 0 ? (foodExpense / periodExpense) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{language === 'bn' ? 'শিক্ষক ও স্টাফ বেতন-ভাতা' : 'Teacher & Staff Salary'}</span>
                <span>{formatCurrency(salaryExpense, language)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-600 h-2 rounded-full"
                  style={{ width: `${periodExpense > 0 ? (salaryExpense / periodExpense) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{language === 'bn' ? 'বিদ্যুৎ, মেরামত ও বিবিধ খরচ' : 'Utility, Repairs & Misc'}</span>
                <span>{formatCurrency(otherExpense, language)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-600 h-2 rounded-full"
                  style={{ width: `${periodExpense > 0 ? (otherExpense / periodExpense) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Central Ledger Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Ledger Toolbar */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-48"
              />
            </div>

            {/* Type selector */}
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">{language === 'bn' ? 'সকল লেনদেন' : 'All Transactions'}</option>
              <option value="income">{t.income}</option>
              <option value="expense">{t.expense}</option>
            </select>

            {/* Category selector */}
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">{t.allCategories}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'bn' ? c.nameBn : c.nameEn} ({c.type === 'income' ? t.income : t.expense})
                </option>
              ))}
            </select>
          </div>

          <div className="text-right text-xs text-slate-500">
            <span>
              {language === 'bn'
                ? `মোট ${toBengaliNumber(filteredLedger.length)} টি রেকর্ড পাওয়া গেছে`
                : `${filteredLedger.length} records found`}
            </span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[650px]">
            <thead className="bg-[#1e1b4b] text-white uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-3.5 text-center w-12">{t.sl}</th>
                <th className="py-3 px-3.5 w-24">{t.date}</th>
                <th className="py-3 px-3.5 text-center w-20">{t.type}</th>
                <th className="py-3 px-3.5">{t.category}</th>
                <th className="py-3 px-3.5">{t.donorOrPayee}</th>
                <th className="py-3 px-3.5">{t.description}</th>
                <th className="py-3 px-3.5 text-right w-28">{t.amount}</th>
                <th className="py-3 px-3.5 text-center w-16">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedLedger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-normal">
                    {t.noRecords}
                  </td>
                </tr>
              ) : (
                paginatedLedger.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedTransactionForView(tx)}
                    >
                      <td className="py-3 px-3.5 text-center text-slate-500 font-semibold">
                        {language === 'bn' ? toBengaliNumber(tx.sl) : tx.sl}
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                        {formatDate(tx.date, language)}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-sm text-[10px] font-bold ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {isIncome ? t.income : t.expense}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-slate-800">
                        {language === 'bn' ? tx.categoryNameBn : tx.categoryNameEn}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700">
                        {tx.donorOrPayee || '-'}
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 max-w-[200px] truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{tx.description}</span>
                          {tx.attachmentUrl && (
                            <span className="shrink-0 text-purple-700" title="ভাউচার কপি সংযুক্ত আছে">
                              {tx.attachmentType === 'pdf' ? <FileText className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`py-3 px-3.5 text-right font-black tracking-tight ${
                          isIncome ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(tx.amount, language)}
                      </td>
                      {/* Action */}
                      <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedTransactionForView(tx)}
                            title={t.view}
                            className="w-7 h-7 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {userSession.isAuthenticated && (
                            <>
                              <button
                                onClick={() => setEditingTransaction(tx)}
                                title="এডিট"
                                className="w-7 h-7 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingTransaction(tx)}
                                title="মুছুন"
                                className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 text-red-700 flex items-center justify-center transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls (31 items per page) */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredLedger.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};
