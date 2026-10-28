import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDate, toBengaliNumber } from '../translations';
import { printFinancialReport, exportPdfDocument } from '../utils/pdfGenerator';
import { MonthFilterBar, MONTHS } from '../components/MonthFilterBar';
import { Pagination } from '../components/Pagination';
import {
  CalendarDays,
  Printer,
  Download,
  PlusCircle,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

export const DailyExpensesPage: React.FC = () => {
  const {
    language,
    madrasa,
    transactions,
    userSession,
    setSelectedTransactionForView,
    setEditingTransaction,
    setDeletingTransaction,
    setIsAddModalOpen,
    setAddModalDefaultType,
  } = useApp();
  const t = translations[language];

  const allExpenseTx = useMemo(() => transactions.filter((t) => t.type === 'expense'), [transactions]);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // null = all months, 1..12
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'calendarLedger' | 'table'>('calendarLedger');

  // Month counts calculation for the 12 month selector
  const monthCounts = useMemo(() => {
    const counts: { [m: number]: number } = {};
    allExpenseTx.forEach((tx) => {
      const parts = tx.date.split('-');
      const yr = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (yr === selectedYear) {
        counts[m] = (counts[m] || 0) + 1;
      }
    });
    return counts;
  }, [allExpenseTx, selectedYear]);

  // Filtered transactions
  const filteredTx = useMemo(() => {
    return allExpenseTx.filter((tx) => {
      if (selectedDate && tx.date !== selectedDate) return false;

      const parts = tx.date.split('-');
      const yr = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);

      if (yr !== selectedYear) return false;
      if (selectedMonth !== null && m !== selectedMonth) return false;

      return true;
    }).sort((a, b) => a.date.localeCompare(b.date) || a.sl - b.sl);
  }, [allExpenseTx, selectedDate, selectedMonth, selectedYear]);

  const displayedTotal = filteredTx.reduce((sum, t) => sum + t.amount, 0);

  // Pagination for table view: 31 items per page
  const PAGE_SIZE = 31;
  const paginatedTx = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTx.slice(start, start + PAGE_SIZE);
  }, [filteredTx, currentPage]);

  const handleSelectMonth = (m: number | null) => {
    setSelectedMonth(m);
    setSelectedDate('');
    setCurrentPage(1);
  };

  // 1 to 31 Days chronological structure for month
  const monthDaysData = useMemo(() => {
    if (selectedMonth === null) return [];
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const result = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTxs = filteredTx.filter((tx) => tx.date === dayStr);
      const dayTotal = dayTxs.reduce((sum, t) => sum + t.amount, 0);
      result.push({
        day,
        date: dayStr,
        txs: dayTxs,
        total: dayTotal,
        hasEntries: dayTxs.length > 0,
      });
    }
    return result;
  }, [selectedMonth, selectedYear, filteredTx]);

  const handlePrint = () => {
    const monthName = selectedMonth ? MONTHS[selectedMonth - 1].nameBn : 'সকল ১২ মাস';
    const title = language === 'bn' ? `দৈনিক ব্যয় ভাউচার রেজিস্টার (${monthName})` : `Daily Expense Register (${monthName})`;
    printFinancialReport(title, filteredTx, madrasa, language, selectedDate);
  };

  const handleExportPdf = () => {
    exportPdfDocument('Daily Expense Register', filteredTx, madrasa);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-amber-600/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-amber-300 shadow-inner">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white">
              {t.menu05}
            </h2>
            <p className="text-xs text-amber-100 opacity-90 mt-0.5">
              {language === 'bn'
                ? '১২ মাসের ১ থেকে ৩১ তারিখের নিয়মিত বাজার, খাদ্য, বিল ও শিক্ষক ভাউচার রেজিস্টার'
                : '12-Month day-by-day institutional expense vouchers, utility bills, and salary disbursals'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {userSession.isAuthenticated && (
            <button
              onClick={() => {
                setAddModalDefaultType('expense');
                setIsAddModalOpen(true);
              }}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addExpense}</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="bg-amber-800 hover:bg-amber-700 text-white font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-amber-600 shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printReport}</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="bg-slate-900/80 hover:bg-slate-950 text-white font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* 12-Month Filter Bar (১ থেকে ১২ মাস) */}
      <MonthFilterBar
        selectedMonth={selectedMonth}
        onSelectMonth={handleSelectMonth}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        monthCounts={monthCounts}
        accentColor="amber"
      />

      {/* Date Filter & View Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Specific date input */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-slate-700">{language === 'bn' ? 'নির্দিষ্ট তারিখ:' : 'Specific Date:'}</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="text-red-600 hover:text-red-700 font-bold ml-1"
              >
                {language === 'bn' ? 'ক্লিয়ার' : 'Clear'}
              </button>
            )}
          </div>

          {/* View Mode Toggle when month is selected */}
          {selectedMonth !== null && (
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 ml-2">
              <button
                type="button"
                onClick={() => setViewMode('calendarLedger')}
                className={`px-2.5 py-1 rounded-md font-bold text-xs transition ${
                  viewMode === 'calendarLedger' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {language === 'bn' ? '১–৩১ দিনের খতিয়ান' : '1–31 Days Ledger'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md font-bold text-xs transition ${
                  viewMode === 'table' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {language === 'bn' ? 'সাধারণ টেবিল' : 'Standard Table'}
              </button>
            </div>
          )}
        </div>

        <div className="text-right flex items-center gap-2">
          <span className="text-slate-500 font-medium">
            {language === 'bn'
              ? `মোট ${toBengaliNumber(filteredTx.length)} টি ব্যয় ভাউচার:`
              : `Total ${filteredTx.length} vouchers:`}
          </span>
          <span className="text-base font-black text-amber-700">
            {formatCurrency(displayedTotal, language)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      {selectedMonth !== null && viewMode === 'calendarLedger' ? (
        /* 1 to 31 Days Matrix for Selected Month */
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 bg-amber-950 text-white flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'bn'
                  ? `${MONTHS[selectedMonth - 1].nameBn} মাসের ১ থেকে ৩১ তারিখের সম্পূর্ণ দৈনিক ব্যয় বিবরণী`
                  : `1 to 31 Days Chronological Expenses for ${MONTHS[selectedMonth - 1].nameEn}`}
              </span>
            </h3>
            <span className="text-xs bg-amber-900 border border-amber-800 px-3 py-1 rounded-full text-amber-100">
              {language === 'bn'
                ? `মোট ব্যয়: ${formatCurrency(displayedTotal, language)}`
                : `Total: ${formatCurrency(displayedTotal, language)}`}
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {monthDaysData.map((d) => (
              <div
                key={d.day}
                className={`p-3.5 transition-colors ${
                  d.hasEntries ? 'bg-white hover:bg-amber-50/30' : 'bg-slate-50/40 text-slate-400'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                        d.hasEntries
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {language === 'bn' ? toBengaliNumber(d.day) : d.day}
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatDate(d.date, language)}
                    </span>
                    {!d.hasEntries && (
                      <span className="text-[11px] text-slate-400 italic">
                        {language === 'bn' ? '(এই তারিখে কোনো খরচ নেই / ফাঁকা)' : '(No expenses on this date)'}
                      </span>
                    )}
                  </div>

                  {d.hasEntries ? (
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 mr-1.5">{language === 'bn' ? 'তারিখের মোট ব্যয়:' : 'Day Total:'}</span>
                      <span className="font-black text-amber-700 text-sm">
                        {formatCurrency(d.total, language)}
                      </span>
                    </div>
                  ) : (
                    userSession.isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => {
                          setAddModalDefaultType('expense');
                          setIsAddModalOpen(true);
                        }}
                        className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 hover:underline"
                      >
                        {language === 'bn' ? '+ এই তারিখে ব্যয় ভাউচার যুক্ত করুন' : '+ Add expense for this date'}
                      </button>
                    )
                  )}
                </div>

                {d.hasEntries && (
                  <div className="pl-9 space-y-2 mt-2">
                    {d.txs.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => setSelectedTransactionForView(tx)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 flex flex-wrap items-center justify-between gap-2 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-500">
                            #{language === 'bn' ? toBengaliNumber(tx.sl) : tx.sl}
                          </span>
                          <span className="font-bold text-slate-800">
                            {language === 'bn' ? tx.categoryNameBn : tx.categoryNameEn}
                          </span>
                          <span className="text-slate-600 truncate max-w-[200px]">
                            — {tx.description}
                          </span>
                          {tx.donorOrPayee && (
                            <span className="text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                              {tx.donorOrPayee}
                            </span>
                          )}
                          {tx.attachmentUrl && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                              {tx.attachmentType === 'pdf' ? <FileText className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                              <span>ভাউচার</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                          <span className="font-black text-amber-700 text-xs sm:text-sm">
                            {formatCurrency(tx.amount, language)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransactionForView(tx);
                            }}
                            className="w-7 h-7 rounded-md bg-amber-100 text-amber-800 hover:bg-amber-200 flex items-center justify-center"
                            title="ভাউচার দেখুন"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {userSession.isAuthenticated && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTransaction(tx);
                                }}
                                className="w-7 h-7 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center"
                                title="এডিট"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingTransaction(tx);
                                }}
                                className="w-7 h-7 rounded-md bg-red-100 text-red-800 hover:bg-red-200 flex items-center justify-center"
                                title="মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Paginated Table View (Default 31 items per page) */
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[620px]">
              <thead className="bg-[#451a03] text-white uppercase text-[11px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-3.5 text-center w-12">{t.sl}</th>
                  <th className="py-3 px-3.5 w-24">{t.date}</th>
                  <th className="py-3 px-3.5">{t.category}</th>
                  <th className="py-3 px-3.5">{language === 'bn' ? 'গ্রহীতার নাম / ব্যয়ের খাত' : 'Payee / Purpose'}</th>
                  <th className="py-3 px-3.5">{t.description}</th>
                  <th className="py-3 px-3.5 text-center w-24">{t.voucherNo}</th>
                  <th className="py-3 px-3.5 text-right w-28">{t.amount}</th>
                  <th className="py-3 px-3.5 text-center w-20 sm:w-24">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paginatedTx.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400 font-normal">
                      {t.noRecords}
                    </td>
                  </tr>
                ) : (
                  paginatedTx.map((tx) => (
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
                            <span className="shrink-0 text-amber-600" title="ভাউচার সংযুক্ত আছে">
                              {tx.attachmentType === 'pdf' ? <FileText className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-center font-mono font-semibold text-slate-600">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {tx.voucherNo || `EX-${tx.sl}`}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-black text-amber-700">
                        {formatCurrency(tx.amount, language)}
                      </td>
                      <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedTransactionForView(tx)}
                            title={t.view}
                            className="w-7 h-7 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls (31 items per page) */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredTx.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
