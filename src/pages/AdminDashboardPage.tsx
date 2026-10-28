import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDate, toBengaliNumber } from '../translations';
import { generateSourceCodeZip, downloadIndexPhpFile } from '../utils/sourceCodeZip';
import {
  ShieldAlert,
  Settings,
  FolderTree,
  ListOrdered,
  KeyRound,
  Download,
  PlusCircle,
  Trash2,
  Edit2,
  Check,
  X,
  FileCode,
  LogOut,
  RefreshCw,
  Sparkles,
  Phone,
  User,
  Megaphone,
  Copy,
  Sliders,
  AlertTriangle,
  Play,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { Category, Transaction } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    language,
    madrasa,
    updateMadrasaInfo,
    categories,
    addCategory,
    deleteCategory,
    transactions,
    deleteTransaction,
    setDeletingTransaction,
    clearAllTransactions,
    setEditingTransaction,
    setSelectedTransactionForView,
    totalIncome,
    totalExpenses,
    currentBalance,
    userSession,
    logoutAdmin,
    changeAdminPassword,
    setIsAddModalOpen,
    setAddModalDefaultType,
    resetToInitialData,
  } = useApp();
  const t = translations[language];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'transactions' | 'notice' | 'categories' | 'settings' | 'sourcecode' | 'security'>('transactions');

  // Deletion modals state (bypasses window.confirm in iframe)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Password state
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Category addition
  const [catNameBn, setCatNameBn] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catType, setCatType] = useState<'income' | 'expense'>('income');

  // Settings & Notice form
  const [settingsForm, setSettingsForm] = useState({ ...madrasa });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ZIP Generation state
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  // Source code preview tab
  const [activeCodeFile, setActiveCodeFile] = useState<'index.php' | 'config.php' | 'database.sql'>('index.php');
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter in admin transactions
  const [adminSearch, setAdminSearch] = useState('');
  const [adminTypeFilter, setAdminTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Handle password change
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: language === 'bn' ? 'পাসওয়ার্ড দুটি মেলেনি।' : 'Passwords do not match.' });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ type: 'error', text: language === 'bn' ? 'কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড দিন।' : 'Password must be at least 6 characters.' });
      return;
    }
    changeAdminPassword(newPass);
    setPassMsg({ type: 'success', text: language === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।' : 'Password successfully updated.' });
    setNewPass('');
    setConfirmPass('');
  };

  // Handle category creation
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameBn.trim()) return;
    addCategory({
      nameBn: catNameBn.trim(),
      nameEn: catNameEn.trim() || catNameBn.trim(),
      type: catType,
      color: catType === 'income' ? '#059669' : '#dc2626',
    });
    setCatNameBn('');
    setCatNameEn('');
  };

  // Handle settings update
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateMadrasaInfo(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Handle Source code ZIP download
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await generateSourceCodeZip(madrasa, transactions, categories);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'madrasa-financial-management-php-mysql.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  const [liveIndexPhp, setLiveIndexPhp] = useState<string>('');

  React.useEffect(() => {
    fetch('/index.php')
      .then((res) => (res.ok ? res.text() : ''))
      .then((text) => {
        if (text) setLiveIndexPhp(text);
      })
      .catch(() => {});
  }, []);

  // Source code contents for live viewer
  const codeSnippets = {
    'index.php': liveIndexPhp || `<?php
/**
 * উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা
 * Master Financial Management Application (index.php)
 * PHP 8.2+ Architecture
 */

require_once __DIR__ . '/config.php';

$lang = getCurrentLanguage();
$page = $_GET['page'] ?? 'dashboard';

// Connect PDO Database
$db = getDBConnection();

// Fetch summary totals
$totalIncome = (float)$db->query("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type='income'")->fetchColumn();
$totalExpense = (float)$db->query("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type='expense'")->fetchColumn();
$balance = $totalIncome - $totalExpense;

// Render View
include __DIR__ . '/templates/header.php';
include __DIR__ . '/templates/' . $page . '.php';
include __DIR__ . '/templates/footer.php';
?>`,
    'config.php': `<?php
/**
 * Database & Institutional Configuration
 */
declare(strict_types=1);

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'madrasa_finance');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

function getDBConnection(): PDO {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    return new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}`,
    'database.sql': `-- Complete MySQL Database Schema
CREATE TABLE IF NOT EXISTS transactions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sl INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  category_name_bn VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  donor_or_payee VARCHAR(150),
  payment_method ENUM('cash','bkash','nagad','bank') DEFAULT 'cash',
  voucher_no VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeFile]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (adminTypeFilter !== 'all' && t.type !== adminTypeFilter) return false;
    if (adminSearch) {
      const q = adminSearch.toLowerCase();
      return (
        t.categoryNameBn.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.donorOrPayee && t.donorOrPayee.toLowerCase().includes(q)) ||
        (t.voucherNo && t.voucherNo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Admin Nav Banner */}
      <div className="islamic-header-gradient text-white rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-amber-500/80 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl shadow-lg font-black shrink-0">
            <ShieldAlert className="w-7 h-7 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-amber-300 tracking-wide">
                {t.adminTitle}
              </h2>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                Full Master Access
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1">
              {language === 'bn'
                ? `মুহতামিম ও কেন্দ্রীয় হিসাবরক্ষক প্যানেল | ফোন: ${userSession.phone}`
                : `Mahatamim & Chief Accountant Portal | Phone: ${userSession.phone}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 z-10 flex-wrap">
          <button
            onClick={() => {
              setAddModalDefaultType('income');
              setIsAddModalOpen(true);
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addIncome}</span>
          </button>

          <button
            onClick={() => {
              setAddModalDefaultType('expense');
              setIsAddModalOpen(true);
            }}
            className="bg-red-500 hover:bg-red-400 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>

          <button
            onClick={() => downloadIndexPhpFile()}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
            title="Download index.php single file"
          >
            <FileCode className="w-4 h-4 text-amber-300" />
            <span>index.php</span>
          </button>

          {/* Full Source Code ZIP Setup Download */}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
            title={language === 'bn' ? 'সম্পূর্ণ সোর্স কোড ও ডাটাবেজ সেটআপ জিপ (.ZIP) ডাউনলোড' : 'Download Complete Source Code Setup (.ZIP)'}
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{isZipping ? (language === 'bn' ? 'জিপ তৈরি হচ্ছে...' : 'Zipping...') : (language === 'bn' ? 'সম্পূর্ণ সোর্স কোড (.ZIP)' : 'Full Source (.ZIP)')}</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="bg-slate-900/90 hover:bg-red-950 text-slate-200 hover:text-white border border-slate-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.adminLogout}</span>
          </button>
        </div>
      </div>

      {/* Default Password Notice Warning */}
      {userSession.mustChangePassword && (
        <div className="bg-amber-500/10 border-2 border-amber-500 text-amber-900 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-900">
                {language === 'bn' ? 'সতর্কতা: প্রাথমিক পাসওয়ার্ড পরিবর্তন করুন!' : 'Security Warning: Change Initial Password!'}
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {language === 'bn'
                  ? 'আপনি এখনও ডিফল্ট পাসওয়ার্ড (524434) ব্যবহার করছেন। অননুমোদিত অ্যাক্সেস রোধে এখনই পাসওয়ার্ড পরিবর্তন করুন।'
                  : 'You are currently using the default password (524434). Please update it immediately for security.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('security')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow transition"
          >
            {t.changePassword}
          </button>
        </div>
      )}

      {/* Quick Financial Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-xs border-l-4 border-l-emerald-600">
          <span className="text-xs font-semibold text-slate-500 block uppercase">{t.totalIncome}</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{formatCurrency(totalIncome, language)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-xs border-l-4 border-l-red-600">
          <span className="text-xs font-semibold text-slate-500 block uppercase">{t.totalExpenses}</span>
          <p className="text-2xl font-black text-red-600 mt-1">{formatCurrency(totalExpenses, language)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-xs border-l-4 border-l-blue-600">
          <span className="text-xs font-semibold text-slate-500 block uppercase">{t.currentBalance}</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{formatCurrency(currentBalance, language)}</p>
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'transactions'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>{language === 'bn' ? 'লেনদেন নিয়ন্ত্রণ ও এডিট' : 'Transactions CRUD'}</span>
        </button>

        <button
          onClick={() => setActiveTab('notice')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'notice'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-500" />
          <span>{language === 'bn' ? 'বিজ্ঞপ্তি ও অ্যানিমেশন' : 'Notice & Animation'}</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'categories'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FolderTree className="w-4 h-4 text-emerald-600" />
          <span>{t.manageCategories}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'settings'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.systemSettings}</span>
        </button>

        <button
          onClick={() => setActiveTab('sourcecode')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'sourcecode'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>{language === 'bn' ? 'সোর্স কোড ও index.php' : 'Source Code & index.php'}</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'security'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>{language === 'bn' ? 'পাসওয়ার্ড নিরাপত্তা' : 'Security'}</span>
        </button>
      </div>

      {/* TAB 1: Complete Transactions CRUD (Add, Edit, Delete, Clear All, Restore) */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden space-y-4 p-4">
          
          {/* Action Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={language === 'bn' ? 'বিবরণ বা খাত খুঁজুন...' : 'Search records...'}
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-1.5 w-44 sm:w-56 text-xs focus:ring-1 focus:ring-emerald-500"
              />
              <select
                value={adminTypeFilter}
                onChange={(e) => setAdminTypeFilter(e.target.value as any)}
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
              >
                <option value="all">{language === 'bn' ? 'সকল লেনদেন' : 'All Types'}</option>
                <option value="income">{t.income}</option>
                <option value="expense">{t.expense}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {/* Add New Record */}
              <button
                onClick={() => {
                  setAddModalDefaultType('income');
                  setIsAddModalOpen(true);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'নতুন লেনদেন যুক্ত করুন' : 'Add Transaction'}</span>
              </button>

              {/* Clear All Transactions */}
              <button
                onClick={() => setShowClearAllModal(true)}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                title="সমস্ত লেনদেন ডিলিট করুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সব ডিলিট করুন' : 'Clear All'}</span>
              </button>

              {/* Restore Defaults */}
              <button
                onClick={() => setShowResetModal(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                title="রিসেট"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ডিফল্ট ডাটা' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="p-3 text-center w-12">{t.sl}</th>
                  <th className="p-3 w-24">{t.date}</th>
                  <th className="p-3 text-center w-20">{t.type}</th>
                  <th className="p-3">{t.category}</th>
                  <th className="p-3">{t.donorOrPayee}</th>
                  <th className="p-3">{t.description}</th>
                  <th className="p-3 text-right w-28">{t.amount}</th>
                  <th className="p-3 text-center w-28">{language === 'bn' ? 'অ্যাডমিন অ্যাকশন' : 'Admin Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-normal">
                      {language === 'bn' ? 'কোন লেনদেন নেই। "নতুন লেনদেন যুক্ত করুন" বাটনে ক্লিক করে এন্ট্রি দিন।' : 'No records found. Click "Add Transaction" to create an entry.'}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center text-slate-500 font-semibold">{tx.sl}</td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">{formatDate(tx.date, language)}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {tx.type === 'income' ? t.income : t.expense}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-800">{language === 'bn' ? tx.categoryNameBn : tx.categoryNameEn}</td>
                      <td className="p-3 text-slate-600">{tx.donorOrPayee || '-'}</td>
                      <td className="p-3 text-slate-500 max-w-[200px] truncate">{tx.description}</td>
                      <td className={`p-3 text-right font-black ${tx.type === 'income' ? 'text-emerald-700' : 'text-red-600'}`}>
                        {formatCurrency(tx.amount, language)}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View voucher */}
                          <button
                            onClick={() => setSelectedTransactionForView(tx)}
                            title="রসিদ দেখুন"
                            className="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Transaction */}
                          <button
                            onClick={() => setEditingTransaction(tx)}
                            title="এডিট করুন"
                            className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition font-bold"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Transaction */}
                          <button
                            onClick={() => setDeletingTransaction(tx)}
                            title="মুছে ফেলুন"
                            className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Notice & Animation Controller */}
      {activeTab === 'notice' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'বিজ্ঞপ্তি বার্তা ও আসা-যাওয়া অ্যানিমেশন কন্ট্রোলার' : 'Notice Announcement & Animation Controller'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'হেডারে প্রদর্শিত চলমান বিজ্ঞপ্তির লেখা ও অ্যানিমেশন স্টাইল পরিবর্তন করুন' : 'Configure the live moving announcement text and ticker speed'}
              </p>
            </div>
            {settingsSaved && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'আপডেট সফল হয়েছে' : 'Updated Successfully'}</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            {/* Live Preview Box */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">{language === 'bn' ? 'লাইভ অ্যানিমেশন প্রিভিউ:' : 'Live Animation Preview:'}</label>
              <div className="bg-emerald-950 p-3 rounded-xl border border-emerald-800 overflow-hidden text-amber-200 flex items-center">
                <div
                  className={`whitespace-nowrap font-bold text-xs ${
                    settingsForm.noticeAnimation === 'bounce' ? 'animate-notice-bounce' : 'animate-marquee'
                  }`}
                  style={{ animationDuration: `${settingsForm.noticeSpeed || 22}s` }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 inline mr-2" />
                  {settingsForm.announcementBn || 'মাদ্রাসার নিয়মিত নোটিশ...'}
                </div>
              </div>
            </div>

            {/* Announcement Message Text */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'বিজ্ঞপ্তির মূল বার্তা (বাংলা)' : 'Announcement Message (Bangla)'} *
              </label>
              <textarea
                rows={3}
                required
                value={settingsForm.announcementBn}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementBn: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-3 text-xs focus:ring-1 focus:ring-emerald-500 bg-white leading-relaxed"
                placeholder="মাদ্রাসার নোটিশ লিখুন..."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'বিজ্ঞপ্তির বার্তা (English)' : 'Announcement Message (English)'}
              </label>
              <input
                type="text"
                value={settingsForm.announcementEn}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementEn: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Animation Style Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="border border-slate-200 p-3 rounded-xl">
                <label className="block font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'অ্যানিমেশন ধরন (Movement Style)' : 'Movement Style'}</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="animationMode"
                      value="marquee"
                      checked={settingsForm.noticeAnimation === 'marquee' || !settingsForm.noticeAnimation}
                      onChange={() => setSettingsForm({ ...settingsForm, noticeAnimation: 'marquee' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{language === 'bn' ? 'ধারাবাহিক চলমান স্ক্রোল (Continuous Marquee)' : 'Continuous Marquee'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="animationMode"
                      value="bounce"
                      checked={settingsForm.noticeAnimation === 'bounce'}
                      onChange={() => setSettingsForm({ ...settingsForm, noticeAnimation: 'bounce' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{language === 'bn' ? 'আসা-যাওয়া ও মৃদু দোলন (Ping-Pong / Bounce)' : 'Ping-Pong / Bounce'}</span>
                  </label>
                </div>
              </div>

              {/* Speed Slider */}
              <div className="border border-slate-200 p-3 rounded-xl">
                <div className="flex justify-between items-center mb-2 font-bold text-slate-800">
                  <span>{language === 'bn' ? 'স্ক্রোল স্পিড (গতি)' : 'Ticker Speed'}</span>
                  <span className="text-emerald-700 font-black">{settingsForm.noticeSpeed || 22}s</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="40"
                  step="2"
                  value={settingsForm.noticeSpeed || 22}
                  onChange={(e) => setSettingsForm({ ...settingsForm, noticeSpeed: parseInt(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>দ্রুত (8s)</span>
                  <span>স্বাভাবিক (22s)</span>
                  <span>ধীর (40s)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow transition flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'bn' ? 'বিজ্ঞপ্তি ও অ্যানিমেশন সংরক্ষণ করুন' : 'Save Notice & Animation'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Category Management */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Category Form */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs h-fit space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b pb-2">
              {language === 'bn' ? 'নতুন হিসাবের খাত যোগ করুন' : 'Add New Category'}
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {language === 'bn' ? 'খাতের নাম (বাংলা)' : 'Category Name (Bangla)'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: নির্মাণ তহবিল"
                  value={catNameBn}
                  onChange={(e) => setCatNameBn(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {language === 'bn' ? 'খাতের নাম (English)' : 'Category Name (English)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Construction Fund"
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {language === 'bn' ? 'খাতের ধরন' : 'Category Type'} *
                </label>
                <select
                  value={catType}
                  onChange={(e) => setCatType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white"
                >
                  <option value="income">{t.income} (Income)</option>
                  <option value="expense">{t.expense} (Expense)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-lg transition"
              >
                {language === 'bn' ? 'খাত সংরক্ষণ করুন' : 'Add Category'}
              </button>
            </form>
          </div>

          {/* Existing Categories List */}
          <div className="md:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b pb-2">
              {language === 'bn' ? 'বিদ্যমান হিসাবের খাতসমূহ' : 'Existing Categories'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50/50"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {language === 'bn' ? c.nameBn : c.nameEn}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${c.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {c.type === 'income' ? t.income : t.expense}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeletingCategory(c)}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition"
                    title={language === 'bn' ? 'খাতটি মুছে ফেলুন' : 'Delete category'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Madrasa Institutional Settings & Opening Balance */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-slate-800">
              {language === 'bn' ? 'প্রাতিষ্ঠানিক তথ্য ও প্রারম্ভিক জের (Opening Balance) সমন্বয়' : 'Institutional Profile & Opening Balance'}
            </h3>
            {settingsSaved && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সংরক্ষিত হয়েছে' : 'Saved'}</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{language === 'bn' ? 'মুহতামিমের নাম (বাংলা)' : 'Principal Name (BN)'}</label>
                <input
                  type="text"
                  value={settingsForm.mahatamimBn}
                  onChange={(e) => setSettingsForm({ ...settingsForm, mahatamimBn: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{language === 'bn' ? 'মুহতামিম মোবাইল' : 'Principal Phone'}</label>
                <input
                  type="text"
                  value={settingsForm.mahatamimPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, mahatamimPhone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{language === 'bn' ? 'অফিস মোবাইল' : 'Office Phone'}</label>
                <input
                  type="text"
                  value={settingsForm.officePhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, officePhone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'প্রারম্ভিক ব্যালেন্স (Opening Balance ৳)' : 'Opening Balance'}
                </label>
                <input
                  type="number"
                  value={settingsForm.openingBalance}
                  onChange={(e) => setSettingsForm({ ...settingsForm, openingBalance: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl transition shadow"
              >
                {language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: Live PHP Source Code Viewer & ZIP Download */}
      {activeTab === 'sourcecode' && (
        <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-purple-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  {language === 'bn' ? 'সোর্স কোড ম্যানেজার ও index.php কন্ট্রোল' : 'Live Source Code & index.php Control'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'cPanel ও পিএইচপি সার্ভারে ব্যবহারের জন্য প্রস্তুত ফাইলসমূহ' : 'Inspect and export production PHP & MySQL files'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কোড কপি করুন' : 'Copy Code')}</span>
              </button>

              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isZipping ? 'Generating...' : t.downloadZip}</span>
              </button>
            </div>
          </div>

          {zipSuccess && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{language === 'bn' ? 'সোর্স কোড ZIP সফলভাবে তৈরি ও ডাউনলোড হয়েছে!' : 'Source code ZIP generated and downloaded successfully!'}</span>
            </div>
          )}

          {/* Code File Selector */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-mono font-semibold">
            {(['index.php', 'config.php', 'database.sql'] as const).map((file) => (
              <button
                key={file}
                onClick={() => setActiveCodeFile(file)}
                className={`px-3 py-1.5 rounded-md transition ${
                  activeCodeFile === file ? 'bg-slate-900 text-amber-300 shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {file}
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 max-h-96">
            <pre className="leading-relaxed">
              <code>{codeSnippets[activeCodeFile]}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 6: Password Security */}
      {activeTab === 'security' && (
        <div className="max-w-md bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b pb-2 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-700" />
            <span>{t.changePassword}</span>
          </h3>

          {passMsg && (
            <div className={`p-3 rounded-lg text-xs font-semibold ${passMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {passMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.newPassword} *</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড দিন"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.confirmPassword} *</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg transition"
            >
              {t.changePassword}
            </button>
          </form>
        </div>
      )}

      {/* Category Deletion Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setDeletingCategory(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              {language === 'bn' ? 'হিসাবের খাত মুছে ফেলার নিশ্চিতকরণ' : 'Confirm Category Deletion'}
            </h4>
            <p className="text-xs text-slate-600 mb-4">
              {language === 'bn'
                ? `আপনি কি নিশ্চিত যে '${deletingCategory.nameBn}' খাতটি তালিকা থেকে মুছে ফেলতে চান?`
                : `Are you sure you want to delete the category '${deletingCategory.nameEn}'?`}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCategory(deletingCategory.id);
                  setDeletingCategory(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
              >
                {language === 'bn' ? 'হ্যাঁ, খাতটি মুছুন' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Transactions Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowClearAllModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              {language === 'bn' ? 'সমস্ত লেনদেন মুছে ফেলার সতর্কতা' : 'Clear All Transactions'}
            </h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {language === 'bn'
                ? 'সতর্কতা: আপনি কি নিশ্চিত যে সমস্ত লেনদেন মুছে ফেলে শূন্য ব্যালেন্স (৳ ০.০০) থেকে নতুন হিসাব শুরু করতে চান?'
                : 'Warning: This will remove all transactions and reset current balance to ৳ 0.00. Continue?'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllTransactions();
                  setShowClearAllModal(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
              >
                {language === 'bn' ? 'হ্যাঁ, সব মুছে ফেলুন' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowResetModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              {language === 'bn' ? 'ডিফল্ট ডাটায় রিসেট করুন' : 'Reset to Default Records'}
            </h4>
            <p className="text-xs text-slate-600 mb-4">
              {language === 'bn'
                ? 'মূল স্ক্রিনশটের ডিফল্ট লেনদেন ও হিসাবে রিসেট করতে চান?'
                : 'Reset transactions and categories to initial default state?'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToInitialData();
                  setShowResetModal(false);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
              >
                {language === 'bn' ? 'হ্যাঁ, রিসেট করুন' : 'Reset Data'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
