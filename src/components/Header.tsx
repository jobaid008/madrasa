import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { Menu, ShieldCheck, UserCheck, X, LogOut } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { language, setLanguage, currentPage, setCurrentPage, madrasa, userSession, logoutAdmin } = useApp();
  const t = translations[language];

  return (
    <header className="islamic-header-gradient text-white border-b-2 border-emerald-400 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Mobile hamburger & Madrasa Identity */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 shadow transition focus:outline-none shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>

            {/* Circular Official Logo */}
            <div 
              onClick={() => setCurrentPage('dashboard')}
              className="cursor-pointer shrink-0 group relative"
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white p-0.5 shadow-md border-2 border-amber-400 group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
                <img
                  src="/madrasa_logo.png"
                  alt="Madrasa Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Madrasa Title & Institutional Subtitle */}
            <div 
              onClick={() => setCurrentPage('dashboard')}
              className="cursor-pointer min-w-0"
            >
              <h1 className="text-xs sm:text-base md:text-lg lg:text-xl font-extrabold text-amber-300 tracking-wide leading-tight hover:text-amber-200 transition drop-shadow-sm line-clamp-1 sm:line-clamp-none">
                {language === 'bn' ? madrasa.nameBn : madrasa.nameEn}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-200 opacity-90 mt-0.5 line-clamp-1 flex flex-wrap items-center gap-x-2">
                <span>{language === 'bn' ? madrasa.addressBn : madrasa.addressEn}</span>
                <span className="hidden sm:inline text-amber-400 font-bold">|</span>
                <span className="hidden sm:inline">{language === 'bn' ? madrasa.establishedBn : madrasa.establishedEn}</span>
                <span className="hidden md:inline text-amber-400 font-bold">|</span>
                <span className="hidden md:inline">{language === 'bn' ? madrasa.registrationBn : madrasa.registrationEn}</span>
              </p>
            </div>
          </div>

          {/* Right: Actions, Language Switcher & Admin Control */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* Bilingual Switcher */}
            <div className="flex items-center bg-emerald-950/90 border border-emerald-600 rounded-lg p-0.5 text-xs font-semibold shadow-inner">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded text-[11px] sm:text-xs transition-all ${
                  language === 'bn'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-[11px] sm:text-xs transition-all ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Admin Login / Logout Actions */}
            {userSession.isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(currentPage === 'admin-dashboard' ? 'dashboard' : 'admin-dashboard')}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {currentPage === 'admin-dashboard' ? t.backToDashboard : t.adminDashboard}
                  </span>
                  <span className="sm:hidden">Admin</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  title="Logout"
                  className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t.adminLogout}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('admin-login')}
                className="bg-slate-900/90 hover:bg-black text-white border border-slate-700 hover:border-slate-500 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.adminLogin}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
