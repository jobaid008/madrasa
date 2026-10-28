import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Language, MadrasaInfo, Transaction, UserSession } from '../types';
import {
  initialCategories,
  initialMadrasaInfo,
  initialTransactions,
} from '../data/initialData';

export type PageRoute =
  | 'dashboard'
  | 'category-income'
  | 'category-expenses'
  | 'daily-income'
  | 'daily-expenses'
  | 'summary'
  | 'admin-login'
  | 'admin-dashboard';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  madrasa: MadrasaInfo;
  updateMadrasaInfo: (info: Partial<MadrasaInfo>) => void;
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'sl' | 'createdAt'>) => void;
  updateTransaction: (id: string | number, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string | number) => void;
  clearAllTransactions: () => void;
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  incomeCount: number;
  expenseCount: number;
  userSession: UserSession;
  loginAdmin: (phoneOrUsername: string, pass: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPass: string) => boolean;
  selectedTransactionForView: Transaction | null;
  setSelectedTransactionForView: (tx: Transaction | null) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (tx: Transaction | null) => void;
  deletingTransaction: Transaction | null;
  setDeletingTransaction: (tx: Transaction | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  addModalDefaultType: 'income' | 'expense';
  setAddModalDefaultType: (type: 'income' | 'expense') => void;
  resetToInitialData: () => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('madrasa_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('madrasa_lang', lang);
  };

  // Toast notification state
  const [toastMessage, setToastMessageState] = useState<string | null>(null);

  const setToastMessage = (msg: string | null) => {
    setToastMessageState(msg);
    if (msg) {
      setTimeout(() => {
        setToastMessageState((curr) => (curr === msg ? null : curr));
      }, 3500);
    }
  };

  // 2. Clean Page Routing (clean URLs: /dashboard, /category-income, etc. with NO ?page=)
  const getPageFromUrl = (): PageRoute => {
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '').trim();
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get('page') || searchParams.get('route');
    const hashParam = window.location.hash.replace('#', '').trim();
    const candidate = pathname || pageParam || hashParam;

    const validRoutes: PageRoute[] = [
      'dashboard',
      'category-income',
      'category-expenses',
      'daily-income',
      'daily-expenses',
      'summary',
      'admin-login',
      'admin-dashboard',
    ];

    if (candidate && validRoutes.includes(candidate as PageRoute)) {
      return candidate as PageRoute;
    }
    return 'dashboard';
  };

  const [currentPage, setCurrentPageState] = useState<PageRoute>(getPageFromUrl);

  const setCurrentPage = (page: PageRoute) => {
    setCurrentPageState(page);
    try {
      const cleanPath = page === 'dashboard' ? '/' : `/${page}`;
      window.history.pushState({}, '', cleanPath);
    } catch {
      // fallback
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // If the browser loaded with legacy /?page=..., clean it up immediately
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('page') || searchParams.has('route')) {
      const page = getPageFromUrl();
      const cleanPath = page === 'dashboard' ? '/' : `/${page}`;
      window.history.replaceState({}, '', cleanPath);
    }

    const handlePopState = () => {
      setCurrentPageState(getPageFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Madrasa Institutional Details
  const [madrasa, setMadrasa] = useState<MadrasaInfo>(() => {
    const saved = localStorage.getItem('madrasa_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialMadrasaInfo;
  });

  const updateMadrasaInfo = (info: Partial<MadrasaInfo>) => {
    setMadrasa((prev) => {
      const updated = { ...prev, ...info };
      localStorage.setItem('madrasa_info', JSON.stringify(updated));
      return updated;
    });
    setToastMessage('মাদ্রাসার তথ্য ও বিজ্ঞপ্তি সফলভাবে আপডেট হয়েছে!');
  };

  // 4. Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('madrasa_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialCategories;
  });

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat_${Date.now()}`,
    };
    setCategories((prev) => {
      const updated = [...prev, newCat];
      localStorage.setItem('madrasa_categories', JSON.stringify(updated));
      return updated;
    });
    setToastMessage('নতুন হিসাবের খাত যোগ করা হয়েছে!');
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      localStorage.setItem('madrasa_categories', JSON.stringify(updated));
      return updated;
    });
    setToastMessage('হিসাবের খাত আপডেট করা হয়েছে!');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('madrasa_categories', JSON.stringify(updated));
      return updated;
    });
    setToastMessage('হিসাবের খাত মুছে ফেলা হয়েছে!');
  };

  // 5. Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('madrasa_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Transaction[];
        return parsed.map((t) => {
          if (!t.attachmentUrl) {
            const seed = initialTransactions.find((s) => s.id === t.id);
            if (seed?.attachmentUrl) {
              return {
                ...t,
                attachmentUrl: seed.attachmentUrl,
                attachmentType: seed.attachmentType,
                attachmentName: seed.attachmentName,
              };
            }
          }
          return t;
        });
      } catch {
        // ignore
      }
    }
    return initialTransactions;
  });

  const saveTransactions = (list: Transaction[]) => {
    setTransactions(list);
    try {
      localStorage.setItem('madrasa_transactions', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'sl' | 'createdAt'>) => {
    const nextSl = transactions.length > 0 ? Math.max(...transactions.map((t) => Number(t.sl) || 0)) + 1 : 1;
    const newTx: Transaction = {
      ...tx,
      amount: Number(tx.amount) || 0,
      id: `tx_${Date.now()}`,
      sl: nextSl,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    saveTransactions(updated);
    setToastMessage('নতুন লেনদেন সফলভাবে সংরক্ষণ করা হয়েছে এবং ব্যালেন্স হালনাগাদ হয়েছে!');
  };

  const updateTransaction = (id: string | number, tx: Partial<Transaction>) => {
    const updated = transactions.map((t) => {
      if (String(t.id) === String(id) || String(t.sl) === String(id)) {
        return {
          ...t,
          ...tx,
          amount: tx.amount !== undefined ? Number(tx.amount) : Number(t.amount),
        };
      }
      return t;
    });
    saveTransactions(updated);
    setToastMessage('লেনদেন সফলভাবে আপডেট করা হয়েছে এবং ব্যালেন্স পুনর্গণনা করা হয়েছে!');
  };

  const deleteTransaction = (id: string | number) => {
    const updated = transactions.filter((t) => String(t.id) !== String(id) && String(t.sl) !== String(id));
    saveTransactions(updated);
    setToastMessage('লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে এবং মোট আয়-ব্যয় ও ব্যালেন্স সমন্বয় হয়েছে!');
  };

  const clearAllTransactions = () => {
    saveTransactions([]);
    setToastMessage('সমস্ত লেনদেন সফলভাবে মুছে ফেলা হয়েছে! ব্যালেন্স এখন ৳ ০.০০');
  };

  // 6. Calculated Totals (Derived dynamically from current transaction list)
  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const totalExpenses = expenseTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const currentBalance = Number(madrasa.openingBalance || 0) + totalIncome - totalExpenses;
  const incomeCount = incomeTransactions.length;
  const expenseCount = expenseTransactions.length;

  // 7. Admin Session
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('madrasa_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      isAuthenticated: false,
      username: '',
      phone: '',
      role: 'admin',
    };
  });

  const [storedPassword, setStoredPassword] = useState<string>(() => {
    return localStorage.getItem('madrasa_admin_pw') || '524434';
  });

  const loginAdmin = (phoneOrUsername: string, pass: string): boolean => {
    const cleanInput = phoneOrUsername.trim();
    if (
      (cleanInput === '01832693837' || cleanInput === 'admin') &&
      pass === storedPassword
    ) {
      const session: UserSession = {
        isAuthenticated: true,
        username: '01832693837',
        phone: '01832693837',
        role: 'super_admin',
        mustChangePassword: storedPassword === '524434',
      };
      setUserSession(session);
      localStorage.setItem('madrasa_admin_session', JSON.stringify(session));
      setToastMessage('অ্যাডমিন সফলভাবে লগইন হয়েছেন!');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    const session: UserSession = {
      isAuthenticated: false,
      username: '',
      phone: '',
      role: 'admin',
    };
    setUserSession(session);
    localStorage.removeItem('madrasa_admin_session');
    setToastMessage('লগআউট সম্পন্ন হয়েছে।');
    setCurrentPage('dashboard');
  };

  const changeAdminPassword = (newPass: string): boolean => {
    if (!newPass || newPass.length < 4) return false;
    setStoredPassword(newPass);
    localStorage.setItem('madrasa_admin_pw', newPass);
    setUserSession((prev) => {
      const updated = { ...prev, mustChangePassword: false };
      localStorage.setItem('madrasa_admin_session', JSON.stringify(updated));
      return updated;
    });
    setToastMessage('অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
    return true;
  };

  // 8. Modals state
  const [selectedTransactionForView, setSelectedTransactionForView] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultType, setAddModalDefaultType] = useState<'income' | 'expense'>('income');

  const resetToInitialData = () => {
    localStorage.removeItem('madrasa_info');
    localStorage.removeItem('madrasa_categories');
    localStorage.removeItem('madrasa_transactions');
    localStorage.removeItem('madrasa_admin_pw');
    setMadrasa(initialMadrasaInfo);
    setCategories(initialCategories);
    setTransactions(initialTransactions);
    setStoredPassword('524434');
    setToastMessage('মূল স্ক্রিনশটের ডিফল্ট ডাটায় সফলভাবে রিসেট করা হয়েছে!');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentPage,
        setCurrentPage,
        madrasa,
        updateMadrasaInfo,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearAllTransactions,
        totalIncome,
        totalExpenses,
        currentBalance,
        incomeCount,
        expenseCount,
        userSession,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        selectedTransactionForView,
        setSelectedTransactionForView,
        editingTransaction,
        setEditingTransaction,
        deletingTransaction,
        setDeletingTransaction,
        isAddModalOpen,
        setIsAddModalOpen,
        addModalDefaultType,
        setAddModalDefaultType,
        resetToInitialData,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
