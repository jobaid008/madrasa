import React from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from './Sidebar';
import { X, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { language, setCurrentPage, userSession } = useApp();
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-slate-100 h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="islamic-header-gradient p-4 text-white flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <img
              src="/madrasa_logo.png"
              alt="Logo"
              className="w-9 h-9 rounded-full border border-amber-400 bg-white p-0.5 object-contain"
            />
            <span className="font-bold text-xs text-amber-300">
              {language === 'bn' ? 'মেনু ও হিসাব বিবরণী' : 'Navigation & Accounts'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 flex-1 space-y-4">
          <Sidebar onItemClick={onClose} />

          {/* Admin link inside drawer */}
          <div className="pt-2">
            {!userSession.isAuthenticated ? (
              <button
                onClick={() => {
                  setCurrentPage('admin-login');
                  onClose();
                }}
                className="w-full bg-slate-900 text-amber-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.adminLogin}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentPage('admin-dashboard');
                  onClose();
                }}
                className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.adminDashboard}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
