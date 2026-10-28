import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { ShieldCheck, Lock, Phone, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { language, loginAdmin, setCurrentPage } = useApp();
  const t = translations[language];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(username, password);
    if (success) {
      setCurrentPage('admin-dashboard');
    } else {
      setError(t.loginError);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="islamic-header-gradient p-6 text-white text-center border-b-4 border-amber-500">
          <div className="w-16 h-16 rounded-full bg-white p-1 mx-auto mb-3 border-2 border-amber-400 shadow-md">
            <img
              src="/madrasa_logo.png"
              alt="Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h2 className="text-lg font-bold text-amber-300">
            {language === 'bn' ? 'কেন্দ্রীয় প্রশাসন ও হিসাব লগইন' : 'Admin & Accounts Authentication'}
          </h2>
          <p className="text-xs text-slate-200 opacity-90 mt-1">
            {language === 'bn'
              ? 'উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা'
              : 'Uttar Deshibai Faizul Uloom Qawmi Hafizia Madrasa & Orphanage'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {language === 'bn' ? 'ইউজারনেম বা মোবাইল নম্বর' : 'Phone or Username'} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="01832693837"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {language === 'bn' ? 'গোপন পাসওয়ার্ড' : 'Password'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'bn' ? 'নিরাপদ লগইন করুন' : 'Secure Login'}</span>
            </button>
          </form>

          {/* Back link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="text-xs text-slate-500 hover:text-emerald-700 font-medium inline-flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'পাবলিক ড্যাশবোর্ডে ফিরে যান' : 'Back to Public Dashboard'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
