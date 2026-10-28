import React from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDate, toBengaliNumber } from '../translations';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal: React.FC = () => {
  const {
    language,
    deletingTransaction,
    setDeletingTransaction,
    deleteTransaction,
  } = useApp();
  const t = translations[language];

  if (!deletingTransaction) return null;
  const tx = deletingTransaction;
  const isIncome = tx.type === 'income';

  const handleConfirm = () => {
    deleteTransaction(tx.id);
    setDeletingTransaction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setDeletingTransaction(null)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden z-10 border border-red-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Warning Banner */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {language === 'bn' ? 'লেনদেন মুছে ফেলার নিশ্চিতকরণ' : 'Confirm Delete Transaction'}
              </h3>
              <p className="text-[11px] text-white/80">
                {tx.voucherNo || `SL: ${tx.sl}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDeletingTransaction(null)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {language === 'bn'
              ? 'আপনি কি নিশ্চিতভাবে এই লেনদেনটি সম্পূর্ণ মুছে ফেলতে চান?'
              : 'Are you sure you want to permanently delete this transaction record?'}
          </p>

          {/* Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.date}:</span>
              <span className="font-semibold text-slate-800">{formatDate(tx.date, language)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.category}:</span>
              <span className="font-bold text-slate-800">{language === 'bn' ? tx.categoryNameBn : tx.categoryNameEn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.donorOrPayee}:</span>
              <span className="font-semibold text-slate-800">{tx.donorOrPayee || '-'}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-slate-500">{t.amount}:</span>
              <span className={`text-base font-black ${isIncome ? 'text-emerald-700' : 'text-red-600'}`}>
                {formatCurrency(tx.amount, language)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            {language === 'bn'
              ? '⚠️ এটি মুছে ফেলার সাথে সাথে মাদ্রাসার মোট আয়, মোট ব্যয় এবং বর্তমান ব্যালেন্স স্বয়ংক্রিয়ভাবে পুনর্গণনা ও সমন্বয় হয়ে যাবে।'
              : '⚠️ Deleting this transaction will immediately deduct/adjust the amounts from Total Income, Total Expense, and Current Balance.'}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setDeletingTransaction(null)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'হ্যাঁ, নিশ্চিত মুছুন' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
