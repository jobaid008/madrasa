import React from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, Calendar, Volume2 } from 'lucide-react';
import { toBengaliNumber } from '../translations';

export const NoticeBar: React.FC = () => {
  const { language, madrasa } = useApp();

  const getFormattedToday = (): string => {
    const now = new Date();
    if (language === 'bn') {
      const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      const months = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const dayName = days[now.getDay()];
      const dayNum = toBengaliNumber(now.getDate());
      const monthName = months[now.getMonth()];
      const yearNum = toBengaliNumber(now.getFullYear());
      return `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
    } else {
      return now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const announcement = language === 'bn' ? madrasa.announcementBn : madrasa.announcementEn;

  return (
    <div className="bg-[#051c24] text-emerald-100 border-b border-emerald-800/80 text-[11px] sm:text-xs shadow-inner overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-1.5 flex items-center justify-between gap-2">
        
        {/* Left: Compact Ticker Badge */}
        <div className="flex items-center gap-1.5 shrink-0 z-10 bg-[#051c24] pr-2">
          <span className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-xs uppercase tracking-wider">
            <Megaphone className="w-3 h-3 animate-pulse" />
            <span>{language === 'bn' ? 'জরুরি ঘোষণা' : 'Notice'}</span>
          </span>
        </div>

        {/* Center: Non-stop Continuous Seamless Ticker */}
        <div className="flex-1 overflow-hidden whitespace-nowrap min-w-0 flex items-center">
          <div className="seamless-marquee-track font-medium text-amber-200 text-[11px] sm:text-xs cursor-default">
            <div className="flex items-center gap-8 pr-8">
              <span>{announcement}</span>
              <span className="text-amber-400 font-bold">✦</span>
            </div>
            {/* Duplicated tracks for seamless infinite continuous loop with zero gap */}
            <div className="flex items-center gap-8 pr-8" aria-hidden="true">
              <span>{announcement}</span>
              <span className="text-amber-400 font-bold">✦</span>
            </div>
            <div className="flex items-center gap-8 pr-8" aria-hidden="true">
              <span>{announcement}</span>
              <span className="text-amber-400 font-bold">✦</span>
            </div>
            <div className="flex items-center gap-8 pr-8" aria-hidden="true">
              <span>{announcement}</span>
              <span className="text-amber-400 font-bold">✦</span>
            </div>
          </div>
        </div>

        {/* Right: Date */}
        <div className="hidden md:flex items-center gap-1.5 text-slate-300 text-[10px] sm:text-[11px] shrink-0 font-medium z-10 bg-[#051c24] pl-2 border-l border-emerald-800/60">
          <Calendar className="w-3 h-3 text-emerald-400" />
          <span className="text-slate-200">{getFormattedToday()}</span>
        </div>

      </div>
    </div>
  );
};
