import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Lock, Sparkles } from 'lucide-react';

export const CoupleLogin: React.FC = () => {
  const { navigate } = useRouter();
  const { loginAsCouple } = useWedding();

  const [email, setEmail] = useState('aulia.rizky@weddingmoments.love');
  const [password, setPassword] = useState('wedding2026');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsCouple(email, 'Aulia & Rizky');
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    loginAsCouple('aulia.rizky@weddingmoments.love', 'Aulia & Rizky');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="public" />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-sm bg-white rounded-3xl p-7 border border-stone-200/90 shadow-xl space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center mx-auto border border-amber-200/60">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold text-stone-900">Masuk Dashboard</h1>
            <p className="text-xs text-stone-500">Kelola foto & ucapan tamu pernikahan Anda</p>
          </div>

          {/* Demo shortcut */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/70 text-center space-y-2">
            <p className="text-xs font-semibold text-amber-900 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Demo Akses Cepat
            </p>
            <button
              onClick={handleDemoLogin}
              className="w-full py-2 bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              Masuk sebagai Aulia & Rizky
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm" />
            </div>
            <button type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all cursor-pointer">
              Masuk
            </button>
          </form>

          <div className="text-center pt-1 border-t border-stone-100">
            <button onClick={() => navigate('/dashboard/events/create')} className="text-xs text-stone-500 hover:text-stone-900 font-medium">
              Belum punya event? <span className="font-semibold underline">Buat sekarang</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
