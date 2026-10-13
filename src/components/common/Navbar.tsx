import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { useWedding } from '../../context/WeddingContext';
import { Camera, Sparkles, Menu, X, LogIn, Heart } from 'lucide-react';

interface NavbarProps {
  variant?: 'public' | 'guest' | 'dashboard';
  eventName?: string;
  eventId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ variant = 'public', eventName, eventId }) => {
  const { navigate, path } = useRouter();
  const { currentUser, currentEvent } = useWedding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeEventId = eventId || currentEvent?.id || 'aulia-rizky-2026';

  // Guest navbar
  if (variant === 'guest') {
    return (
      <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button onClick={() => navigate(`/event/${activeEventId}`)} className="text-left group cursor-pointer">
            <span className="block text-[10px] uppercase tracking-widest text-stone-400 font-medium">Wedding Moments</span>
            <span className="text-sm font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors truncate max-w-[180px] sm:max-w-xs block">
              {eventName || 'Pernikahan'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/event/${activeEventId}/gallery`)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${path.endsWith('/gallery') ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}
            >
              Galeri
            </button>
            <button
              onClick={() => navigate(`/event/${activeEventId}/wishes`)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${path.endsWith('/wishes') ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}
            >
              Ucapan
            </button>
            <button
              onClick={() => navigate(`/event/${activeEventId}/upload`)}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-900 text-stone-50 px-3.5 py-1.5 rounded-full shadow-sm hover:bg-amber-800 transition-all active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Foto</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Dashboard navbar
  if (variant === 'dashboard') {
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-lg font-serif font-semibold text-stone-900 hover:text-stone-600 transition-colors">
              Wedding Moments
            </button>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-medium text-stone-500">Dashboard</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/event/${activeEventId}`)}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              Lihat Halaman Tamu
            </button>
            <button
              onClick={() => navigate(`/dashboard/events/create`)}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-stone-900 text-white px-3.5 py-1.5 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Event Baru</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Public navbar
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-4">
        <button
          onClick={() => navigate('/')}
          className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-stone-900 hover:text-amber-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Wedding Moments
        </button>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => navigate(`/event/${activeEventId}`)}
            className="hover:text-stone-900 transition-colors cursor-pointer inline-flex items-center gap-1.5 text-amber-900"
          >
            <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700/20" />
            <span>Demo</span>
          </button>
          <button
            onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/dashboard/events/create')}
            className="px-4 py-2 text-xs font-semibold text-stone-50 bg-stone-900 hover:bg-stone-800 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Buat Event
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => navigate('/dashboard/events/create')}
            className="px-3 py-1.5 text-xs font-medium text-stone-50 bg-stone-900 rounded-full"
          >
            Buat Event
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-stone-900"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 px-4 py-4 space-y-3">
          <button
            onClick={() => { setMobileMenuOpen(false); navigate(`/event/${activeEventId}`); }}
            className="w-full text-left py-2 text-sm font-medium text-stone-800 flex items-center justify-between"
          >
            <span>Demo Wedding</span>
            <span className="text-xs text-amber-800 font-semibold">Live →</span>
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigate(currentUser ? '/dashboard' : '/login'); }}
            className="w-full text-left py-2 text-sm font-medium text-stone-800 flex items-center justify-between"
          >
            <span>Dashboard</span>
            <LogIn className="w-4 h-4 text-stone-500" />
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/dashboard/events/create'); }}
            className="w-full text-center py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-xl"
          >
            Buat Event
          </button>
        </div>
      )}
    </header>
  );
};
