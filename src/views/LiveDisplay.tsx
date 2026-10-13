import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Photo } from '../types';
import { QrCode, Maximize2, Minimize2, ArrowLeft, Heart, Sparkles } from 'lucide-react';

interface LiveDisplayProps {
  eventId: string;
}

export const LiveDisplay: React.FC<LiveDisplayProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const { events, getPhotosForEvent } = useWedding();

  const event = events.find((e) => e.id === eventId) || events[0];
  const photos = getPhotosForEvent(event?.id || '', false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);

  // Auto rotate highlight photo every 6 seconds
  useEffect(() => {
    if (photos.length === 0) return;
    const interval = setInterval(() => {
      setActiveHighlightIndex((prev) => (prev + 1) % photos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const highlightPhoto = photos[activeHighlightIndex] || photos[0];

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col justify-between overflow-hidden p-6 sm:p-10 select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-stone-800/80 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/event/${event?.id}`)}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Keluar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold block">
              LIVE WEDDING PHOTO WALL
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              {event?.brideName} & {event?.groomName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-stone-900/90 border border-stone-800 px-3.5 py-1.5 rounded-full text-xs text-amber-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{photos.length} Momen Terkumpul</span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white cursor-pointer transition-colors"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Showcase Stage */}
      <main className="flex-1 my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Highlight Focus Left */}
        {highlightPhoto ? (
          <div className="lg:col-span-8 flex flex-col items-center justify-center h-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-800 bg-stone-900 max-h-[68vh] w-full flex items-center justify-center">
              <img
                key={highlightPhoto.id}
                src={highlightPhoto.imageUrl}
                alt={highlightPhoto.guestName}
                className="max-h-[68vh] w-auto object-contain animate-in fade-in duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent p-6 text-left">
                <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block">
                  Diabadikan oleh {highlightPhoto.guestName}
                </span>
                {highlightPhoto.message && (
                  <p className="text-sm sm:text-lg font-serif italic text-white mt-1 line-clamp-2">
                    "{highlightPhoto.message}"
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 text-center text-stone-500 py-16">
            Menunggu foto pertama dari tamu undangan...
          </div>
        )}

        {/* Live QR Scan Reminder Right */}
        <div className="lg:col-span-4 bg-stone-900/90 rounded-3xl p-8 border border-stone-800 text-center space-y-5 shadow-xl">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
            SCAN & MUNCUL DI LAYAR
          </span>
          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
            <QrCode className="w-40 h-40 text-stone-950 mx-auto" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-white">Foto Anda Langsung Tayang!</h3>
            <p className="text-xs text-stone-400">
              Arahkan kamera smartphone ke kode QR di atas atau kartu meja untuk membagikan foto momen bahagia ini.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Photo Ticker */}
      <footer className="pt-2">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-2">
          {photos.slice(0, 12).map((p, idx) => (
            <div
              key={p.id}
              onClick={() => setActiveHighlightIndex(idx)}
              className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                activeHighlightIndex === idx
                  ? 'border-amber-400 scale-105 ring-2 ring-amber-400/40'
                  : 'border-stone-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={p.thumbnailUrl || p.imageUrl} alt={p.guestName} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};
