import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { X, PlusCircle, Check, UploadCloud, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { TransactionType } from '../types';

export const AddTransactionModal: React.FC = () => {
  const {
    language,
    isAddModalOpen,
    setIsAddModalOpen,
    addModalDefaultType,
    categories,
    addTransaction,
  } = useApp();
  const t = translations[language];

  const [type, setType] = useState<TransactionType>(addModalDefaultType);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [donorOrPayee, setDonorOrPayee] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'nagad' | 'bank'>('cash');
  const [voucherNo, setVoucherNo] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [attachmentType, setAttachmentType] = useState<'image' | 'pdf' | undefined>(undefined);
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [error, setError] = useState('');

  if (!isAddModalOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError(language === 'bn' ? 'ফাইলের আকার ৮ মেগাবাইট (8MB) এর নিচে হতে হবে।' : 'File size must be below 8MB.');
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentUrl(reader.result as string);
      setAttachmentType(isPdf ? 'pdf' : 'image');
      setAttachmentName(file.name);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachmentUrl('');
    setAttachmentType(undefined);
    setAttachmentName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(language === 'bn' ? 'সঠিক টাকার পরিমাণ দিন।' : 'Please enter a valid amount.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId) || filteredCategories[0];
    if (!selectedCategory) {
      setError(language === 'bn' ? 'অনুগ্রহ করে একটি খাত নির্বাচন করুন।' : 'Please select a category.');
      return;
    }

    addTransaction({
      date,
      type,
      categoryId: selectedCategory.id,
      categoryNameBn: selectedCategory.nameBn,
      categoryNameEn: selectedCategory.nameEn,
      description: description.trim() || (language === 'bn' ? `${selectedCategory.nameBn} বাবদ জমা/খরচ` : `${selectedCategory.nameEn} entry`),
      amount: numAmount,
      donorOrPayee: donorOrPayee.trim() || undefined,
      phone: phone.trim() || undefined,
      paymentMethod,
      voucherNo: voucherNo.trim() || `${type === 'income' ? 'IN' : 'EX'}-${Date.now().toString().slice(-4)}`,
      isPublic: true,
      attachmentUrl: attachmentUrl || undefined,
      attachmentType: attachmentType,
      attachmentName: attachmentName || undefined,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsAddModalOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm">
              {type === 'income' ? t.addIncome : t.addExpense}
            </h3>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 font-medium">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategoryId('');
              }}
              className={`py-2 rounded-lg font-bold transition text-xs ${
                type === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.income}
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategoryId('');
              }}
              className={`py-2 rounded-lg font-bold transition text-xs ${
                type === 'expense' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.expense}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.date} *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.amount} (৳) *</label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 font-black text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">{t.category} *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">{language === 'bn' ? '-- খাত নির্বাচন করুন --' : '-- Select Category --'}</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'bn' ? c.nameBn : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Donor or Payee */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.donorOrPayee}</label>
              <input
                type="text"
                placeholder={type === 'income' ? (language === 'bn' ? 'দাতার নাম / উৎস' : 'Donor Name / Source') : (language === 'bn' ? 'গ্রহীতার নাম / ব্যয়ের উদ্দেশ্য' : 'Payee Name / Purpose')}
                value={donorOrPayee}
                onChange={(e) => setDonorOrPayee(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Voucher No */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.voucherNo}</label>
              <input
                type="text"
                placeholder="EX-001 / REC-001"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Payment Method */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.paymentMethod}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="cash">{t.cash}</option>
                <option value="bkash">{t.bkash}</option>
                <option value="nagad">{t.nagad}</option>
                <option value="bank">{t.bank}</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.phone}</label>
              <input
                type="text"
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">{t.description}</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'bn' ? 'লেনদেনের বিস্তারিত বিবরণ লিখুন...' : 'Enter transaction details...'}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Voucher / Receipt Upload (Image or PDF) */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="block text-slate-800 font-bold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-emerald-700" />
                <span>{language === 'bn' ? 'ভাউচার / রসিদ ফাইল আপলোড (ছবি বা PDF):' : 'Upload Receipt/Voucher (Image or PDF):'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">ঐচ্ছিক (Optional)</span>
            </label>

            {!attachmentUrl ? (
              <label className="mt-1.5 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 bg-white cursor-pointer transition hover:bg-emerald-50/30">
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'ছবি বা PDF আপলোড করতে ক্লিক করুন' : 'Click to upload Image or PDF'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP অথবা PDF (Max 8MB)</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="mt-2 flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {attachmentType === 'image' ? (
                    <img
                      src={attachmentUrl}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}
                  <div className="truncate">
                    <p className="font-bold text-slate-800 text-xs truncate">{attachmentName}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{attachmentType} সংযুক্ত হয়েছে</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeAttachment}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                  title="ফাইল মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition font-semibold"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Check className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
