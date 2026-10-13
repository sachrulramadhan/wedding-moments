import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Camera, Image as ImageIcon, Heart, MapPin, Calendar, Clock, Lock, ArrowRight } from 'lucide-react';
import { PhotoLightbox } from '../components/common/PhotoLightbox';
import { Photo } from '../types';

interface GuestEventHomeProps {
  eventId: string;
}

export const GuestEventHome: React.FC<GuestEventHomeProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const { events, getPhotosForEvent, getWishesForEvent, registerEvent } = useWedding();

  const [enteredCode, setEnteredCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const searchParams = useMemo(() => {
    const rawSearch = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
    return new URLSearchParams(rawSearch);
  }, []);

  const event = useMemo(() => {
    const existing = events.find((e) => e.id === eventId);
    if (existing) return existing;

    const b = searchParams.get('b');
    const g = searchParams.get('g');
    if (b || g) {
      const bride = b || 'Pengantin Wanita';
      const groom = g || 'Pengantin Pria';
      return {
        id: eventId,
        brideName: bride,
        groomName: groom,
        title: `${bride} & ${groom}'s Wedding`,
        date: searchParams.get('d') || '2026-12-12',
        time: '16:00',
        location: searchParams.get('l') || 'Lokasi Resepsi',
        description: 'Selamat datang! Abadikan momen indah bersama kami.',
        coverImage: events[0]?.coverImage || '',
        theme: 'classic-cream' as const,
        privacy: 'PUBLIC' as const,
        moderationMode: 'AUTO_APPROVE' as const,
        createdBy: 'synced_guest',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return events[0];
  }, [events, eventId, searchParams]);

  useEffect(() => {
    if (event && !events.some((e) => e.id === event.id)) {
      registerEvent(event);
    }
  }, [event, events, registerEvent]);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar variant="public" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-stone-900">Event Tidak Ditemukan</h2>
          <p className="text-sm text-stone-500 mt-2">Coba minta link atau QR code dari pengantin.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold cursor-pointer"
          >
            Kembali
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isPrivate = event.privacy === 'PRIVATE' && !!event.accessCode && !isUnlocked;

  const handleUnlockPrivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.trim().toLowerCase() === event.accessCode?.trim().toLowerCase()) {
      setIsUnlocked(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  const photos = getPhotosForEvent(event.id);
  const wishes = getWishesForEvent(event.id);

  const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="guest" eventName={`${event.brideName} & ${event.groomName}`} eventId={event.id} />

      {isPrivate ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-5">
            <Lock className="w-8 h-8 text-amber-900 mx-auto" />
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">Event Privat</h2>
              <p className="text-xs text-stone-500 mt-1">Masukkan kode akses dari undangan.</p>
            </div>
            <form onSubmit={handleUnlockPrivate} className="space-y-3">
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => { setEnteredCode(e.target.value); setCodeError(false); }}
                placeholder="Kode Akses"
                className="w-full text-center tracking-widest font-mono text-lg py-3 px-4 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900"
                autoFocus
              />
              {codeError && <p className="text-xs text-rose-600">Kode salah. Coba lagi.</p>}
              <button type="submit" className="w-full py-3 bg-stone-900 text-white font-semibold text-sm rounded-xl hover:bg-stone-800 transition-all cursor-pointer">
                Masuk
              </button>
            </form>
          </div>
        </div>
      ) : (
        <main className="flex-1">
          {/* Cover Hero */}
          <div className="relative w-full h-[48vh] min-h-[340px] max-h-[520px] bg-stone-900 overflow-hidden">
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover brightness-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-4xl mx-auto text-white">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
                {event.brideName} & {event.groomName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-stone-300">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-300" />{formattedDate}</span>
                {event.time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-300" />{event.time}</span>}
                {event.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-300" />{event.location}</span>}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
            {/* Welcome message */}
            {event.description && (
              <div className="bg-white rounded-2xl p-5 border border-stone-200/80 text-center">
                <p className="text-base sm:text-lg font-serif italic text-stone-700 leading-relaxed">
                  "{event.description}"
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate(`/event/${event.id}/upload?mode=camera`)}
                className="w-full py-4 px-5 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-between active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-amber-200" />
                  <div className="text-left">
                    <p className="font-bold">📷 Ambil Foto</p>
                    <p className="text-[11px] text-amber-200 font-normal">Buka kamera langsung</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>

              <button
                onClick={() => navigate(`/event/${event.id}/upload?mode=file`)}
                className="w-full py-4 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-between active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-stone-300" />
                  <div className="text-left">
                    <p className="font-bold">Upload Foto</p>
                    <p className="text-[11px] text-stone-400 font-normal">Pilih dari galeri</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400" />
              </button>

              <button
                onClick={() => navigate(`/event/${event.id}/gallery`)}
                className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm shadow-xs transition-all flex items-center justify-between active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🖼️</span>
                  <div className="text-left">
                    <p className="font-bold">Galeri Foto</p>
                    <p className="text-[11px] text-stone-500 font-normal">{photos.length} foto tersedia</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400" />
              </button>

              <button
                onClick={() => navigate(`/event/${event.id}/wishes`)}
                className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm shadow-xs transition-all flex items-center justify-between active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                  <div className="text-left">
                    <p className="font-bold">Kirim Ucapan</p>
                    <p className="text-[11px] text-stone-500 font-normal">{wishes.length} ucapan</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            {/* Photo preview */}
            {photos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-bold text-stone-900">Foto Terbaru</h3>
                  <button onClick={() => navigate(`/event/${event.id}/gallery`)} className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline underline-offset-4 cursor-pointer">
                    Lihat Semua ({photos.length}) →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photos.slice(0, 4).map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative rounded-2xl overflow-hidden aspect-square bg-stone-100 border border-stone-200 cursor-pointer"
                    >
                      <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.guestName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-white text-xs font-semibold truncate">{photo.guestName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishes preview */}
            {wishes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-bold text-stone-900">Ucapan Tamu</h3>
                  <button onClick={() => navigate(`/event/${event.id}/wishes`)} className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline underline-offset-4 cursor-pointer">
                    Lihat Semua →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishes.slice(0, 2).map((wish) => (
                    <div key={wish.id} className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                      <span className="text-xs font-bold text-stone-900">{wish.guestName}</span>
                      <p className="text-xs font-serif italic text-stone-600 line-clamp-2 mt-1">"{wish.message}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      <PhotoLightbox photo={selectedPhoto} photos={photos} onClose={() => setSelectedPhoto(null)} onSelectPhoto={(p) => setSelectedPhoto(p)} />
      <Footer />
    </div>
  );
};
