import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDate, toBengaliNumber } from '../translations';
import { printVoucher, exportPdfDocument } from '../utils/pdfGenerator';
import { Printer, ArrowLeft, X, FileText, Image as ImageIcon, ExternalLink, Download, CheckCircle, Eye } from 'lucide-react';

export const TransactionModal: React.FC = () => {
  const { language, selectedTransactionForView, setSelectedTransactionForView, madrasa } = useApp();
  const t = translations[language];
  const [showFullAttachment, setShowFullAttachment] = useState(false);

  if (!selectedTransactionForView) return null;
  const tx = selectedTransactionForView;
  const isIncome = tx.type === 'income';

  const handlePrint = () => {
    printVoucher(tx, madrasa, language);
  };

  const handleDownloadDigitalReceipt = () => {
    exportPdfDocument(`Voucher_${tx.voucherNo || tx.sl}`, [tx], madrasa);
  };

  const formattedAmount = formatCurrency(tx.amount, language);
  const amountInWordsBn = `${toBengaliNumber(tx.amount)} টাকা মাত্র`;
  const voucherCode = tx.voucherNo || (isIncome ? `#INC-${tx.sl}` : `#EXP-${tx.sl}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => {
          setSelectedTransactionForView(null);
          setShowFullAttachment(false);
        }}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
      />

      {/* Official Voucher Card - Styled exactly as Official Madrasa Receipt */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden z-10 border-2 border-slate-300 animate-in fade-in zoom-in-95 duration-150 p-5 sm:p-7 my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button top-right */}
        <button
          onClick={() => {
            setSelectedTransactionForView(null);
            setShowFullAttachment(false);
          }}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-20"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Quick Actions Bar */}
        <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-100 pr-10">
          <button
            onClick={handlePrint}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            title="ভাউচার প্রিন্ট করুন"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
          </button>

          {tx.attachmentUrl ? (
            <a
              href={tx.attachmentUrl}
              download={tx.attachmentName || `voucher_${tx.sl}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
              title="সংযুক্ত মূল ভাউচার ফাইল ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ভাউচার ডাউনলোড' : 'Download File'}</span>
            </a>
          ) : (
            <button
              onClick={handleDownloadDigitalReceipt}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
              title="অফিসিয়াল ডিজিটাল রশিদ PDF ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রশিদ PDF ডাউনলোড' : 'Download PDF'}</span>
            </button>
          )}

          <span className="text-[11px] text-slate-500 font-medium ml-auto">
            {language === 'bn' ? 'অফিসিয়াল ভাউচার রেকর্ড' : 'Official Record'}
          </span>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto pr-1">
          {/* Bismillah Header */}
          <div className="text-center font-serif text-sm font-bold text-emerald-900 mb-1">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Institutional Header with Logo & Details */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-400 bg-white p-0.5 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/madrasa_logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-emerald-900 tracking-tight leading-snug">
                  {language === 'bn' ? madrasa.nameBn : madrasa.nameEn}
                </h2>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  {language === 'bn' ? madrasa.addressBn : madrasa.addressEn}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {language === 'bn' ? madrasa.establishedBn : madrasa.establishedEn} | {language === 'bn' ? madrasa.registrationBn : madrasa.registrationEn}
                </p>
              </div>
            </div>

            {/* Type Badge & Voucher SL */}
            <div className="shrink-0 text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                  isIncome
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {isIncome
                  ? (language === 'bn' ? 'আদায় রশিদ' : 'Income Receipt')
                  : (language === 'bn' ? 'ব্যয় ভাউচার' : 'Expense Voucher')}
              </span>
              <div className="text-[11px] font-mono font-bold text-slate-500 mt-1">
                {voucherCode}
              </div>
            </div>
          </div>

          {/* Receipt Key-Value Rows */}
          <div className="py-3.5 space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 font-medium">{t.date}:</span>
                <div className="font-bold text-slate-800 mt-0.5">{formatDate(tx.date, language)}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">{t.paymentMethod}:</span>
                <div className="font-bold text-slate-800 uppercase mt-0.5">{tx.paymentMethod}</div>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-medium">
                {isIncome ? (language === 'bn' ? 'দাতার নাম / উৎস:' : 'Donor / Source:') : (language === 'bn' ? 'গ্রহীতার নাম / ব্যয়ের খাত:' : 'Payee / Purpose:')}
              </span>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                {tx.donorOrPayee || (language === 'bn' ? 'সাধারণ শুভাকাঙ্ক্ষী' : 'General Donor')}
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-medium">{t.category}:</span>
              <div className="font-bold text-slate-800 mt-0.5">
                {language === 'bn' ? tx.categoryNameBn : tx.categoryNameEn}
              </div>
            </div>

            {/* Highlight Amount Box */}
            <div className={`p-4 rounded-2xl border ${isIncome ? 'bg-emerald-50/70 border-emerald-200' : 'bg-red-50/70 border-red-200'} my-2`}>
              <span className="text-[11px] font-semibold text-slate-500 block">
                {language === 'bn' ? 'টাকার পরিমাণ:' : 'Amount:'}
              </span>
              <div className={`text-2xl sm:text-3xl font-black mt-0.5 ${isIncome ? 'text-emerald-800' : 'text-red-700'}`}>
                {formattedAmount} <span className="text-sm font-bold text-slate-600">({amountInWordsBn})</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-medium">{t.description}:</span>
              <div className="font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-0.5 text-xs">
                {tx.description}
              </div>
            </div>

            {/* Admin Uploaded Physical Voucher (Image or PDF) */}
            <div className="mt-4 pt-3.5 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  {tx.attachmentType === 'pdf' ? (
                    <FileText className="w-4 h-4 text-red-600" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>
                    {language === 'bn'
                      ? 'এডমিনের সংযুক্ত মূল ভাউচার / ক্যাশমেমোর ফাইল:'
                      : 'Admin Uploaded Physical Voucher / Memo File:'}
                  </span>
                </div>

                {tx.attachmentUrl && (
                  <a
                    href={tx.attachmentUrl}
                    download={tx.attachmentName || `voucher_${tx.sl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-xl flex items-center gap-1 shadow-xs transition"
                  >
                    <Download className="w-3 h-3" />
                    <span>{language === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                  </a>
                )}
              </div>

              {tx.attachmentUrl ? (
                tx.attachmentType === 'pdf' ? (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center">
                    <FileText className="w-10 h-10 text-red-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-800 text-xs truncate mb-2">
                      {tx.attachmentName || 'সংযুক্ত ভাউচার ডকুমেন্ট (PDF)'}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={tx.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'PDF খুলুন' : 'Open PDF'}</span>
                      </a>
                      <a
                        href={tx.attachmentUrl}
                        download={tx.attachmentName || `voucher_${tx.sl}.pdf`}
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'PDF ডাউনলোড' : 'Download'}</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={tx.attachmentUrl}
                      alt="Voucher copy"
                      className="w-full max-h-56 object-contain bg-slate-900/5 cursor-pointer hover:opacity-95 transition"
                      onClick={() => setShowFullAttachment(true)}
                    />
                    <div className="p-2.5 bg-white/95 backdrop-blur-xs text-[11px] text-slate-700 flex justify-between items-center border-t border-slate-100">
                      <span className="truncate font-semibold">{tx.attachmentName || 'ভাউচার রসিদ ছবি'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowFullAttachment(true)}
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'বড় করুন' : 'Zoom'}</span>
                        </button>
                        <a
                          href={tx.attachmentUrl}
                          download={tx.attachmentName || `voucher_${tx.sl}.jpg`}
                          className="text-blue-700 font-bold hover:underline flex items-center gap-0.5 ml-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-slate-50 rounded-2xl p-3 border border-dashed border-slate-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'bn' ? 'ডিজিটাল অনুমোদিত অফিশিয়াল রশিদ সংরক্ষিত আছে' : 'Digital Madrasa Verified Receipt'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadDigitalReceipt}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'রশিদ PDF ডাউনলোড' : 'Download'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Official Signatures Row */}
          <div className="pt-6 border-t border-dashed border-slate-300 grid grid-cols-2 gap-4 text-center mt-2">
            <div>
              <div className="border-t border-slate-700 pt-1 font-bold text-xs text-slate-800">
                {language === 'bn' ? 'আদায়কারী / ক্যাশিয়ার' : 'Cashier / Accountant'}
              </div>
              <p className="text-[10px] text-slate-500">
                {language === 'bn' ? 'ফয়জুল উলুম হাফেজিয়া মাদ্রাসা' : 'Faizul Uloom Hafizia Madrasa'}
              </p>
            </div>

            <div>
              <div className="border-t border-slate-700 pt-1 font-bold text-xs text-slate-800">
                {language === 'bn' ? 'মাওলানা মোস্তফা কামাল' : 'Mawlana Md. Mostafa Kamal'}
              </div>
              <p className="text-[10px] text-slate-600 font-bold">
                {language === 'bn' ? 'মুহতামিম (+8801744618311)' : 'Principal (+8801744618311)'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Buttons Footer */}
        <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-center gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'রশিদ প্রিন্ট করুন' : 'Print Voucher'}</span>
          </button>
          {tx.attachmentUrl ? (
            <a
              href={tx.attachmentUrl}
              download={tx.attachmentName || `voucher_${tx.sl}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'bn' ? 'ভাউচার ডাউনলোড' : 'Download File'}</span>
            </a>
          ) : (
            <button
              onClick={handleDownloadDigitalReceipt}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'bn' ? 'রশিদ PDF ডাউনলোড' : 'Download PDF'}</span>
            </button>
          )}
          <button
            onClick={() => {
              setSelectedTransactionForView(null);
              setShowFullAttachment(false);
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'ফিরে যান' : 'Back'}</span>
          </button>
        </div>

      </div>

      {/* Full Size Image Overlay if requested */}
      {showFullAttachment && tx.attachmentUrl && tx.attachmentType !== 'pdf' && (
        <div
          onClick={() => setShowFullAttachment(false)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setShowFullAttachment(false)}
            className="absolute top-4 right-4 text-white hover:text-amber-300 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={tx.attachmentUrl}
            alt="Full voucher"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
