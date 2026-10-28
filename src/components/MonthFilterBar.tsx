import React from 'react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../translations';
import { Calendar, Check } from 'lucide-react';

export interface MonthOption {
  monthIndex: number; // 1 to 12
  nameBn: string;
  nameEn: string;
  shortBn: string;
  shortEn: string;
}

export const MONTHS: MonthOption[] = [
  { monthIndex: 1, nameBn: 'জানুয়ারি', nameEn: 'January', shortBn: '১. জানু', shortEn: '01. Jan' },
  { monthIndex: 2, nameBn: 'ফেব্রুয়ারি', nameEn: 'February', shortBn: '২. ফেব্রু', shortEn: '02. Feb' },
  { monthIndex: 3, nameBn: 'মার্চ', nameEn: 'March', shortBn: '৩. মার্চ', shortEn: '03. Mar' },
  { monthIndex: 4, nameBn: 'এপ্রিল', nameEn: 'April', shortBn: '৪. এপ্রিল', shortEn: '04. Apr' },
  { monthIndex: 5, nameBn: 'মে', nameEn: 'May', shortBn: '৫. মে', shortEn: '05. May' },
  { monthIndex: 6, nameBn: 'জুন', nameEn: 'June', shortBn: '৬. জুন', shortEn: '06. Jun' },
  { monthIndex: 7, nameBn: 'জুলাই', nameEn: 'July', shortBn: '৭. জুলাই', shortEn: '07. Jul' },
  { monthIndex: 8, nameBn: 'আগস্ট', nameEn: 'August', shortBn: '৮. আগস্ট', shortEn: '08. Aug' },
  { monthIndex: 9, nameBn: 'সেপ্টেম্বর', nameEn: 'September', shortBn: '৯. সেপ্টে', shortEn: '09. Sep' },
  { monthIndex: 10, nameBn: 'অক্টোবর', nameEn: 'October', shortBn: '১০. অক্টো', shortEn: '10. Oct' },
  { monthIndex: 11, nameBn: 'নভেম্বর', nameEn: 'November', shortBn: '১১. নভে', shortEn: '11. Nov' },
  { monthIndex: 12, nameBn: 'ডিসেম্বর', nameEn: 'December', shortBn: '১২. ডিসে', shortEn: '12. Dec' },
];

interface MonthFilterBarProps {
  selectedMonth: number | null; // null = all months, 1..12 = specific month
  onSelectMonth: (month: number | null) => void;
  selectedYear: number;
  onSelectYear?: (year: number) => void;
  availableYears?: number[];
  monthCounts?: { [monthIndex: number]: number };
  accentColor?: 'emerald' | 'red' | 'blue' | 'amber' | 'purple';
}

export const MonthFilterBar: React.FC<MonthFilterBarProps> = ({
  selectedMonth,
  onSelectMonth,
  selectedYear,
  onSelectYear,
  availableYears = [2026, 2025, 2024],
  monthCounts = {},
  accentColor = 'emerald',
}) => {
  const { language } = useApp();

  const getActiveClasses = () => {
    switch (accentColor) {
      case 'red':
        return 'bg-red-700 text-white shadow-md border-red-700 ring-2 ring-red-400/40';
      case 'blue':
        return 'bg-blue-700 text-white shadow-md border-blue-700 ring-2 ring-blue-400/40';
      case 'amber':
        return 'bg-amber-700 text-white shadow-md border-amber-700 ring-2 ring-amber-400/40';
      case 'purple':
        return 'bg-purple-700 text-white shadow-md border-purple-700 ring-2 ring-purple-400/40';
      case 'emerald':
      default:
        return 'bg-emerald-700 text-white shadow-md border-emerald-700 ring-2 ring-emerald-400/40';
    }
  };

  const getBadgeClasses = (isActive: boolean) => {
    if (isActive) return 'bg-white/20 text-white';
    switch (accentColor) {
      case 'red':
        return 'bg-red-50 text-red-700';
      case 'blue':
        return 'bg-blue-50 text-blue-700';
      case 'amber':
        return 'bg-amber-50 text-amber-700';
      case 'purple':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-emerald-50 text-emerald-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-xs text-slate-800">
            {language === 'bn' ? '১ থেকে ১২ মাস অনুযায়ী ফিল্টার করুন:' : 'Filter by Month (1 to 12):'}
          </span>
          {selectedMonth ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {language === 'bn'
                ? `নির্বাচিত: ${MONTHS[selectedMonth - 1].nameBn}`
                : `Active: ${MONTHS[selectedMonth - 1].nameEn}`}
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {language === 'bn' ? 'সকল ১২ মাস (প্রতি পৃষ্ঠায় ৩১টি রেকর্ড)' : 'All 12 Months (31 per page)'}
            </span>
          )}
        </div>

        {onSelectYear && availableYears.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">{language === 'bn' ? 'সাল:' : 'Year:'}</span>
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(parseInt(e.target.value, 10))}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {language === 'bn' ? `${toBengaliNumber(yr)} খ্রিঃ` : yr}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 12 Months Button Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-1.5">
        {/* All Months button */}
        <button
          type="button"
          onClick={() => onSelectMonth(null)}
          className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
            selectedMonth === null
              ? getActiveClasses()
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="whitespace-nowrap">{language === 'bn' ? 'সকল মাস' : 'All Months'}</span>
          <span className={`text-[10px] px-1.5 rounded-full mt-0.5 font-medium ${getBadgeClasses(selectedMonth === null)}`}>
            {language === 'bn' ? '১২ মাস' : '12 Mo'}
          </span>
        </button>

        {/* 1..12 Months */}
        {MONTHS.map((m) => {
          const isSelected = selectedMonth === m.monthIndex;
          const count = monthCounts[m.monthIndex] || 0;

          return (
            <button
              key={m.monthIndex}
              type="button"
              onClick={() => onSelectMonth(m.monthIndex)}
              className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                isSelected
                  ? getActiveClasses()
                  : count > 0
                  ? 'bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:shadow-xs'
                  : 'bg-slate-50/70 text-slate-400 border-slate-200/80 hover:bg-slate-100/80'
              }`}
            >
              <span className="leading-tight text-center">
                {language === 'bn' ? m.shortBn : m.shortEn}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full mt-0.5 font-semibold ${getBadgeClasses(isSelected)}`}
              >
                {count > 0 ? (language === 'bn' ? `${toBengaliNumber(count)} টি` : count) : (language === 'bn' ? '০' : '0')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
