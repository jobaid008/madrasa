import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { NoticeBar } from './components/NoticeBar';
import { Sidebar } from './components/Sidebar';
import { MobileDrawer } from './components/MobileDrawer';
import { TransactionModal } from './components/TransactionModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { EditTransactionModal } from './components/EditTransactionModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CheckCircle2, X, Phone, User } from 'lucide-react';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { CategoryIncomePage } from './pages/CategoryIncomePage';
import { CategoryExpensesPage } from './pages/CategoryExpensesPage';
import { DailyIncomePage } from './pages/DailyIncomePage';
import { DailyExpensesPage } from './pages/DailyExpensesPage';
import { SummaryPage } from './pages/SummaryPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const MainLayout: React.FC = () => {
  const { currentPage, language, madrasa, toastMessage, setToastMessage } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Render the current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'category-income':
        return <CategoryIncomePage />;
      case 'category-expenses':
        return <CategoryExpensesPage />;
      case 'daily-income':
        return <DailyIncomePage />;
      case 'daily-expenses':
        return <DailyExpensesPage />;
      case 'summary':
        return <SummaryPage />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      default:
        return <DashboardPage />;
    }
  };

  const isFullWidthPage = currentPage === 'admin-login';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 antialiased selection:bg-emerald-600 selection:text-white">
      {/* 1. Permanent Sticky Top Bar: Header + Non-stop Notice Ticker pinned together */}
      <div className="sticky top-0 z-40 w-full shadow-md bg-[#061e29]">
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <NoticeBar />
      </div>

      {/* Floating Real-time Action Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white border-2 border-emerald-400 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/70 hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Mobile Slide-out Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 3. Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-6">
        {isFullWidthPage ? (
          <div>{renderCurrentPage()}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 items-start">
            {/* Desktop Left Sidebar (Fixed / Collapsible) */}
            <div className="hidden lg:block lg:col-span-1 sticky top-28">
              <Sidebar />
            </div>

            {/* Right Main Dashboard / Page view */}
            <main className="lg:col-span-3 min-w-0">
              {renderCurrentPage()}
            </main>
          </div>
        )}
      </div>

      {/* 4. Institutional Footer */}
      <footer className="bg-[#051c24] text-slate-400 text-xs py-8 border-t border-emerald-900/80 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Left: Branding & Registration */}
            <div className="text-center md:text-left space-y-2 md:col-span-2">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <img
                  src="/madrasa_logo.png"
                  alt="Madrasa Logo"
                  className="w-10 h-10 rounded-full border-2 border-amber-400 bg-white p-0.5 object-contain shrink-0"
                />
                <div>
                  <p className="font-extrabold text-amber-300 text-sm sm:text-base leading-tight">
                    {language === 'bn' ? madrasa.nameBn : madrasa.nameEn}
                  </p>
                  <p className="text-[11px] text-slate-300 opacity-90">
                    {language === 'bn' ? madrasa.addressBn : madrasa.addressEn}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                {language === 'bn' ? madrasa.establishedBn : madrasa.establishedEn} | {language === 'bn' ? madrasa.registrationBn : madrasa.registrationEn} | {language === 'bn' ? 'অফিস মোবাইল:' : 'Office:'} {madrasa.officePhone}
              </p>

              <p className="text-[10px] text-slate-500 pt-1">
                {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত © ২০২৬ • উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা' : 'All Rights Reserved © 2026 • Uttar Deshibai Faizul Uloom Qawmi Hafizia Madrasa'}
              </p>
            </div>

            {/* Right Corner: Dedicated Mohtamim Contact Card */}
            <div className="flex justify-center md:justify-end">
              <div className="bg-[#0c2f38] p-3.5 rounded-2xl border-2 border-emerald-600/70 shadow-lg w-full max-w-xs text-left">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 block border-b border-emerald-800 pb-1 mb-1.5">
                  {language === 'bn' ? 'মুহতামিম:' : 'Principal / Mohtamim:'}
                </span>
                <p className="text-white font-extrabold text-sm flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? 'মাও: মো: মোস্তফা কামাল' : 'Mawlana Md. Mostafa Kamal'}</span>
                </p>
                <a
                  href={`tel:${madrasa.mahatamimPhone}`}
                  className="text-amber-300 hover:text-white font-bold text-xs mt-1.5 flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{madrasa.mahatamimPhone}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Modals */}
      <TransactionModal />
      <AddTransactionModal />
      <EditTransactionModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
