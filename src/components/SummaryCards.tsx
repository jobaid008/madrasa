import React from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, toBengaliNumber } from '../translations';
import { CircleDollarSign, Receipt, Wallet, TrendingUp, TrendingDown, BarChart2, Sparkles } from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { language, totalIncome, totalExpenses, currentBalance, incomeCount, expenseCount } = useApp();
  const t = translations[language];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
      
      {/* 1. Total Income Card */}
      <div className="bg-gradient-to-br from-white via-emerald-50/20 to-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden border-l-4 border-l-emerald-600 group hover:-translate-y-1">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl group-hover:bg-emerald-400/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <CircleDollarSign className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t.totalIncome}
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight block mt-0.5 group-hover:text-emerald-600 transition-colors">
                {formatCurrency(totalIncome, language)}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  {language === 'bn' ? `${toBengaliNumber(incomeCount)} টি লেনদেন সম্পন্ন` : `${incomeCount} Records`}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-center justify-center w-8 h-8 rounded-full bg-emerald-100/60 text-emerald-600 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Total Expenses Card */}
      <div className="bg-gradient-to-br from-white via-red-50/20 to-white rounded-2xl p-4 sm:p-5 border border-red-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden border-l-4 border-l-red-600 group hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-400/10 rounded-full blur-xl group-hover:bg-red-400/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <Receipt className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t.totalExpenses}
              </span>
              <span className="text-xl sm:text-2xl font-black text-red-600 tracking-tight block mt-0.5 group-hover:text-red-500 transition-colors">
                {formatCurrency(totalExpenses, language)}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold mt-1">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-xs animate-pulse"></span>
                <span>
                  {language === 'bn' ? `${toBengaliNumber(expenseCount)} টি ভাউচার পরিশোধ` : `${expenseCount} Records`}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-center justify-center w-8 h-8 rounded-full bg-red-100/60 text-red-600 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Current Balance Card */}
      <div className="bg-gradient-to-br from-white via-blue-50/20 to-white rounded-2xl p-4 sm:p-5 border border-blue-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden border-l-4 border-l-blue-600 group hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full blur-xl group-hover:bg-blue-400/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xl shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Wallet className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t.currentBalance}
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-700 tracking-tight block mt-0.5 group-hover:text-blue-600 transition-colors">
                {formatCurrency(currentBalance, language)}
              </span>
              <div className="text-[11px] text-blue-600 font-bold mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{t.balanceFormula}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-center justify-center w-8 h-8 rounded-full bg-blue-100/60 text-blue-600 group-hover:scale-110 transition-transform">
            <BarChart2 className="w-4 h-4" />
          </div>
        </div>
      </div>

    </div>
  );
};
