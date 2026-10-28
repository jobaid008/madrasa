import React from 'react';
import { useApp, PageRoute } from '../context/AppContext';
import { translations } from '../translations';
import {
  LayoutDashboard,
  HandCoins,
  ReceiptText,
  CalendarPlus,
  CalendarMinus,
  PieChart,
  ArrowRight,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';

export const NavigationCards: React.FC = () => {
  const { language, setCurrentPage } = useApp();
  const t = translations[language];

  const cards: {
    id: PageRoute;
    title: string;
    desc: string;
    icon: React.ReactNode;
    gradientClass: string;
    shadowClass: string;
    glowColor: string;
  }[] = [
    {
      id: 'dashboard',
      title: t.nav01Title,
      desc: t.nav01Desc,
      icon: <LayoutDashboard className="w-5 h-5 text-white" />,
      gradientClass: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800',
      shadowClass: 'hover:shadow-blue-500/25',
      glowColor: 'bg-blue-400/20',
    },
    {
      id: 'category-income',
      title: t.nav02Title,
      desc: t.nav02Desc,
      icon: <HandCoins className="w-5 h-5 text-white" />,
      gradientClass: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800',
      shadowClass: 'hover:shadow-emerald-500/25',
      glowColor: 'bg-emerald-400/20',
    },
    {
      id: 'category-expenses',
      title: t.nav03Title,
      desc: t.nav03Desc,
      icon: <ReceiptText className="w-5 h-5 text-white" />,
      gradientClass: 'bg-gradient-to-br from-rose-600 via-red-600 to-red-800',
      shadowClass: 'hover:shadow-red-500/25',
      glowColor: 'bg-red-400/20',
    },
    {
      id: 'daily-income',
      title: t.nav04Title,
      desc: t.nav04Desc,
      icon: <CalendarPlus className="w-5 h-5 text-white" />,
      gradientClass: 'bg-gradient-to-br from-indigo-600 via-blue-700 to-sky-800',
      shadowClass: 'hover:shadow-indigo-500/25',
      glowColor: 'bg-indigo-400/20',
    },
    {
      id: 'daily-expenses',
      title: t.nav05Title,
      desc: t.nav05Desc,
      icon: <CalendarMinus className="w-5 h-5 text-white" />,
      gradientClass: 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800',
      shadowClass: 'hover:shadow-orange-500/25',
      glowColor: 'bg-amber-400/20',
    },
    {
      id: 'summary',
      title: t.nav06Title,
      desc: t.nav06Desc,
      icon: <PieChart className="w-5 h-5 text-white" />,
      gradientClass: 'bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900',
      shadowClass: 'hover:shadow-purple-500/25',
      glowColor: 'bg-purple-400/20',
    },
  ];

  return (
    <div className="space-y-3.5">
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm sm:text-base">
          <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <h2>{t.navSectionTitle}</h2>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          {language === 'bn' ? 'ক্লিক করে সংশ্লিষ্ট পৃষ্ঠায় যান' : 'Click to navigate'}
        </span>
      </div>

      {/* Grid of 6 Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setCurrentPage(card.id)}
            className={`${card.gradientClass} ${card.shadowClass} text-white text-left rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-34 relative overflow-hidden focus:outline-none hover:-translate-y-1 active:translate-y-0`}
          >
            {/* Top corner radial light sheen */}
            <div className={`absolute top-0 right-0 w-28 h-28 ${card.glowColor} rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

            {/* Top row: Icon + Circle Arrow */}
            <div className="flex items-start justify-between w-full relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {card.icon}
              </div>
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 text-white transition-all duration-300 shadow-sm">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Bottom: Title & Description */}
            <div className="relative z-10">
              <h3 className="font-extrabold text-sm sm:text-base tracking-wide group-hover:text-amber-300 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-white/90 line-clamp-1 mt-0.5 font-normal">
                {card.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
