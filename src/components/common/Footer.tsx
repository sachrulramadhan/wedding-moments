import React from 'react';
import { useRouter } from '../../router/Router';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="border-t border-stone-200/80 bg-stone-100/60 py-8 px-4 sm:px-8 text-stone-600 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-lg font-serif font-semibold tracking-tight text-stone-900">Wedding Moments</span>

        <div className="flex flex-wrap items-center gap-5 text-xs text-stone-600">
          <button onClick={() => navigate('/')} className="hover:text-stone-900 transition-colors cursor-pointer">Beranda</button>
          <button onClick={() => navigate('/event/aulia-rizky-2026')} className="hover:text-stone-900 transition-colors cursor-pointer">Demo</button>
          <button onClick={() => navigate('/dashboard/events/create')} className="hover:text-stone-900 transition-colors cursor-pointer">Buat Event</button>
          <button onClick={() => navigate('/login')} className="hover:text-stone-900 transition-colors cursor-pointer">Masuk</button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <span>Dibuat dengan</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
      </div>
    </footer>
  );
};
