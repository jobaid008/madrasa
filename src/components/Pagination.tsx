import React from 'react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../translations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize = 31,
  onPageChange,
}) => {
  const { language } = useApp();
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalPages <= 1) {
    return (
      <div className="p-3 text-xs text-slate-500 text-center border-t border-slate-100 bg-slate-50/50">
        {language === 'bn'
          ? `মোট ${toBengaliNumber(totalItems)} টি রেকর্ডের সবকটি প্রদর্শিত হচ্ছে`
          : `Showing all ${totalItems} records`}
      </div>
    );
  }

  // Generate page numbers array with max 7 buttons
  const pages: number[] = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="p-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="text-slate-600 font-medium">
        {language === 'bn'
          ? `রেকর্ড ${toBengaliNumber(startRecord)} - ${toBengaliNumber(endRecord)} (সর্বমোট ${toBengaliNumber(totalItems)} টির মধ্যে, পৃষ্ঠা ${toBengaliNumber(currentPage)}/${toBengaliNumber(totalPages)})`
          : `Showing ${startRecord}-${endRecord} of ${totalItems} records (Page ${currentPage} of ${totalPages})`}
      </div>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-semibold transition ${
            currentPage === 1
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Prev'}</span>
        </button>

        {/* First page if far */}
        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="w-7 h-7 rounded-lg border bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              {language === 'bn' ? '১' : '1'}
            </button>
            {startPage > 2 && <span className="px-1 text-slate-400">...</span>}
          </>
        )}

        {/* Page buttons */}
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg font-bold text-xs transition ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {language === 'bn' ? toBengaliNumber(p) : p}
            </button>
          );
        })}

        {/* Last page if far */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="w-7 h-7 rounded-lg border bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              {language === 'bn' ? toBengaliNumber(totalPages) : totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-semibold transition ${
            currentPage === totalPages
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <span>{language === 'bn' ? 'পরবর্তী' : 'Next'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
