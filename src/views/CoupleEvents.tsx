import React from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Plus, Calendar, MapPin, ExternalLink } from 'lucide-react';

export const CoupleEvents: React.FC = () => {
  const { navigate } = useRouter();
  const { events, getStats } = useWedding();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="dashboard" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              Daftar Event Pernikahan
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Pilih event untuk mengelola galeri, ucapan, atau kartu QR
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard/events/create')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Event Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => {
            const stats = getStats(event.id);
            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="relative h-44 bg-stone-100">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-stone-950/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold text-white tracking-wider">
                    {event.privacy === 'PUBLIC' ? 'Publik' : 'Privat'}
                  </div>
                </div>

                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h2 className="text-lg font-serif font-bold text-stone-900">
                      {event.brideName} & {event.groomName}
                    </h2>
                    <p className="text-xs text-stone-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </p>
                    {event.location && (
                      <p className="text-xs text-stone-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span className="truncate">{event.location}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="block font-bold text-stone-900 tabular-nums">{stats.totalPhotos}</span>
                      <span className="text-[10px] text-stone-500">Foto</span>
                    </div>
                    <div>
                      <span className="block font-bold text-stone-900 tabular-nums">{stats.totalGuests}</span>
                      <span className="text-[10px] text-stone-500">Tamu</span>
                    </div>
                    <div>
                      <span className="block font-bold text-stone-900 tabular-nums">{stats.totalWishes}</span>
                      <span className="text-[10px] text-stone-500">Ucapan</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => navigate(`/dashboard/events/${event.id}`)}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold text-center cursor-pointer transition-all"
                    >
                      Kelola
                    </button>
                    <button
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Lihat Tamu</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
