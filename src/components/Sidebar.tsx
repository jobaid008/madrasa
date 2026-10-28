import React from 'react';
import { useApp, PageRoute } from '../context/AppContext';
import { translations } from '../translations';
import {
  Home,
  HandCoins,
  Receipt,
  CalendarCheck,
  CalendarDays,
  FileSpreadsheet,
  ChevronRight,
  Landmark,
  MapPin,
  Phone,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const { language, currentPage, setCurrentPage, madrasa } = useApp();
  const t = translations[language];

  const menuItems: { id: PageRoute; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'dashboard',
      label: t.menu01,
      icon: <Home className="w-4 h-4" />,
      color: 'text-emerald-700',
    },
    {
      id: 'category-income',
      label: t.menu02,
      icon: <HandCoins className="w-4 h-4" />,
      color: 'text-emerald-600',
    },
    {
      id: 'category-expenses',
      label: t.menu03,
      icon: <Receipt className="w-4 h-4" />,
      color: 'text-red-600',
    },
    {
      id: 'daily-income',
      label: t.menu04,
      icon: <CalendarCheck className="w-4 h-4" />,
      color: 'text-blue-600',
    },
    {
      id: 'daily-expenses',
      label: t.menu05,
      icon: <CalendarDays className="w-4 h-4" />,
      color: 'text-amber-600',
    },
    {
      id: 'summary',
      label: t.menu06,
      icon: <FileSpreadsheet className="w-4 h-4" />,
      color: 'text-purple-600',
    },
  ];

  const handleNav = (id: PageRoute) => {
    setCurrentPage(id);
    if (onItemClick) onItemClick();
  };

  return (
    <aside className="w-full space-y-4">
      {/* Navigation Menu List */}
      <nav className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-100 text-sm font-semibold">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 transition-all text-left ${
                    isActive
                      ? 'bg-emerald-700 text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : item.color}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Madrasa Overview Card (মাদ্রাসা পরিচিতি) */}
      <div className="bg-gradient-to-br from-[#0c3427] to-[#08222d] text-white rounded-xl p-4 shadow-sm border border-emerald-800/80 text-xs space-y-2.5">
        <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-emerald-700/60 pb-2">
          <Landmark className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold tracking-wide">{t.madrasaOverview}</span>
        </div>

        <div>
          <p className="font-bold text-slate-100 leading-snug">
            {language === 'bn' ? madrasa.nameBn : madrasa.nameEn}
          </p>
        </div>

        <div className="space-y-1.5 text-slate-300">
          <p className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>{language === 'bn' ? madrasa.addressBn : madrasa.addressEn}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <a href={`tel:${madrasa.officePhone}`} className="hover:text-emerald-300 transition">
              {madrasa.officePhone}
            </a>
          </p>
        </div>

        <div className="border-t border-emerald-700/60 pt-2.5 mt-2">
          <span className="text-amber-300 font-bold block text-[11px] uppercase tracking-wider">
            {t.mahatamim}:
          </span>
          <span className="text-slate-100 font-bold text-xs block mt-0.5">
            {language === 'bn' ? madrasa.mahatamimBn : madrasa.mahatamimEn}
          </span>
          <p className="text-slate-300 mt-1 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <a href={`tel:${madrasa.mahatamimPhone}`} className="hover:text-emerald-300 transition">
              {madrasa.mahatamimPhone}
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
};
