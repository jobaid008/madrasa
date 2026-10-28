import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDate, toBengaliNumber } from '../translations';
import { SummaryCards } from '../components/SummaryCards';
import { NavigationCards } from '../components/NavigationCards';
import { exportPdfDocument, printFinancialReport } from '../utils/pdfGenerator';
import {
  ListFilter,
  ArrowRight,
  Eye,
  PlusCircle,
  Search,
  Download,
  Printer,
  ShieldCheck,
  Edit2,
  Trash2,
  Lock,
  FileText,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    language,
    madrasa,
    setCurrentPage,
    transactions,
    userSession,
    setSelectedTransactionForView,
    setEditingTransaction,
    setDeletingTransaction,
    deleteTransaction,
    setIsAddModalOpen,
    setAddModalDefaultType,
  } = useApp();
  const t = translations[language];

  const [searchTerm, setSearchTerm] = useState('');

  // Latest transactions (filtered by search term if typed)
  const filtered = transactions.filter((tx) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      tx.categoryNameBn.toLowerCase().includes(term) ||
      tx.categoryNameEn.toLowerCase().includes(term) ||
      tx.description.toLowerCase().includes(term) ||
      (tx.donorOrPayee && tx.donorOrPayee.toLowerCase().includes(term)) ||
      (tx.voucherNo && tx.voucherNo.toLowerCase().includes(term))
    );
  });

  const latestTransactions = filtered.slice(0, 10);

  const handleDownloadDashboardPdf = () => {
    exportPdfDocument('Madrasa Financial Statement', latestTransactions, madrasa);
  };

  const handlePrintDashboard = () => {
    printFinancialReport(
      language === 'bn' ? 'মাদ্রাসার সাম্প্রতিক আর্থিক লেনদেন বিবরণী' : 'Latest Financial Statement',
      latestTransactions,
      madrasa,
      language
    );
  };

  return (
    <div className="space-y-6">
      {/* Admin Mode Floating Alert Badge if logged in */}
      {userSession.isAuthenticated && (
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-xl p-3 border border-emerald-500/50 shadow-md flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300">
              {language === 'bn' ? 'অ্যাডমিন মোড সক্রিয়: আপনি ড্যাশবোর্ড থেকে সরাসরি লেনদেন এডিট, ডিলিট ও যুক্ত করতে পারবেন।' : 'Admin Control Active: You have full permissions to add, edit, and delete transactions.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAddModalDefaultType('income');
                setIsAddModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition"
            >
              <PlusCircle className="w-3 h-3" />
              <span>{t.addIncome}</span>
            </button>
            <button
              onClick={() => {
                setAddModalDefaultType('expense');
                setIsAddModalOpen(true);
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition"
            >
              <PlusCircle className="w-3 h-3" />
              <span>{t.addExpense}</span>
            </button>
            <button
              onClick={() => setCurrentPage('admin-dashboard')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-md text-[11px] transition"
            >
              {language === 'bn' ? 'কন্ট্রোল প্যানেল' : 'Control Panel'}
            </button>
          </div>
        </div>
      )}

      {/* 3 Top Financial Summary Cards */}
      <SummaryCards />

      {/* 6 Large Colorful Navigation Cards */}
      <NavigationCards />

      {/* Latest Transactions Table Section */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        
        {/* Table Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-slate-50 via-emerald-50/20 to-slate-50">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm sm:text-base">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ListFilter className="w-4 h-4" />
            </div>
            <span>{t.latestTransactions}</span>
            {!userSession.isAuthenticated && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border border-slate-200">
                <Lock className="w-2.5 h-2.5" />
                <span>{language === 'bn' ? 'পাবলিক অডিট ভিউ' : 'Public Audit View'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick search input */}
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-40 sm:w-48"
              />
            </div>

            {/* Public users can print and export PDF */}
            <button
              onClick={handlePrintDashboard}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition"
              title="Print Table"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">{t.printReport}</span>
            </button>

            <button
              onClick={handleDownloadDashboardPdf}
              className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>PDF</span>
            </button>

            {/* ONLY ADMIN sees Add Transaction button on dashboard */}
            {userSession.isAuthenticated && (
              <button
                onClick={() => {
                  setAddModalDefaultType('income');
                  setIsAddModalOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.addTransaction}</span>
              </button>
            )}

            {/* View All Transactions Button */}
            <button
              onClick={() => setCurrentPage('summary')}
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition"
            >
              <span>{t.viewAllTransactions}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[620px]">
            <thead className="bg-[#0c3427] text-white uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-3.5 text-center w-12">{t.sl}</th>
                <th className="py-3 px-3.5 w-24">{t.date}</th>
                <th className="py-3 px-3.5 text-center w-20">{t.type}</th>
                <th className="py-3 px-3.5">{t.category}</th>
                <th className="py-3 px-3.5">{t.description}</th>
                <th className="py-3 px-3.5 text-right w-28">{t.amount}</th>
                <th className="py-3 px-3.5 text-center w-20">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {latestTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-normal">
                    {t.noRecords}
                  </td>
                </tr>
              ) : (
                latestTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-emerald-50/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedTransactionForView(tx)}
                    >
                      {/* SL */}
                      <td className="py-3 px-3.5 text-center text-slate-500 font-semibold">
                        {language === 'bn' ? toBengaliNumber(tx.sl) : tx.sl}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                        {formatDate(tx.date, language)}
                      </td>

                      {/* Type Badge */}
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

                      {/* Category */}
                      <td className="py-3 px-3.5 font-bold text-slate-800">
                        {language === 'bn' ? tx.categoryNameBn : tx.categoryNameEn}
                      </td>

                      {/* Description */}
                      <td className="py-3 px-3.5 text-slate-600 max-w-[240px] truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{tx.description}</span>
                          {tx.attachmentUrl && (
                            <span
                              className={`shrink-0 ${isIncome ? 'text-emerald-700' : 'text-red-600'}`}
                              title={language === 'bn' ? 'ভাউচার রসিদ ফাইল সংযুক্ত আছে' : 'Voucher attached'}
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td
                        className={`py-3 px-3.5 text-right font-black tracking-tight ${
                          isIncome ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(tx.amount, language)}
                      </td>

                      {/* Action View & Admin Controls */}
                      <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {/* View button (Visible to everyone) */}
                          <button
                            onClick={() => setSelectedTransactionForView(tx)}
                            title={t.view}
                            className="w-7 h-7 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* ADMIN ONLY: Edit & Delete buttons right from the dashboard */}
                          {userSession.isAuthenticated && (
                            <>
                              <button
                                onClick={() => setEditingTransaction(tx)}
                                title={language === 'bn' ? 'এডিট করুন' : 'Edit'}
                                className="w-7 h-7 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingTransaction(tx)}
                                title={t.delete}
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

        {/* Table Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>
            {language === 'bn'
              ? `মোট ${toBengaliNumber(transactions.length)} টি লেনদেনের মধ্যে ${toBengaliNumber(latestTransactions.length)} টি প্রদর্শিত`
              : `Showing ${latestTransactions.length} of ${transactions.length} total records`}
          </span>
          <button
            onClick={() => setCurrentPage('summary')}
            className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
          >
            <span>{t.viewAllTransactions}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
