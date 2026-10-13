import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { Eye, EyeOff, Trash2, Search } from 'lucide-react';

interface CoupleWishesManageProps {
  eventId: string;
}

export const CoupleWishesManage: React.FC<CoupleWishesManageProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const { events, getWishesForEvent, moderateWish, deleteWish, getPhotosForEvent } = useWedding();

  const [search, setSearch] = useState('');

  const event = events.find((e) => e.id === eventId) || events[0];
  const allWishes = event ? getWishesForEvent(event.id, true) : [];
  const pendingPhotosCount = event ? getPhotosForEvent(event.id, true).filter((p) => p.status === 'PENDING').length : 0;

  const filteredWishes = allWishes.filter((w) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return w.guestName.toLowerCase().includes(q) || w.message.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="dashboard" eventId={event?.id} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              Kelola Ucapan Tamu ({allWishes.length})
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Tinjau ucapan pernikahan yang telah dikirim oleh para tamu
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        {event && (
          <DashboardNav
            eventId={event.id}
            activeTab="wishes"
            pendingCount={pendingPhotosCount}
          />
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau pesan..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-stone-900 text-stone-800"
          />
        </div>

        {/* Wishes Cards */}
        {filteredWishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredWishes.map((wish) => (
              <div
                key={wish.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">{wish.guestName}</span>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        wish.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {wish.status === 'APPROVED' ? 'Tampil' : 'Tersembunyi'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-serif italic text-stone-800 leading-relaxed">
                    "{wish.message}"
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-mono text-[10px] tabular-nums text-stone-400">
                    {new Date(wish.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moderateWish(wish.id, wish.status === 'APPROVED' ? 'HIDDEN' : 'APPROVED')}
                      className="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                      title={wish.status === 'APPROVED' ? 'Sembunyikan ucapan' : 'Tampilkan ucapan'}
                    >
                      {wish.status === 'APPROVED' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Hapus ucapan ini?')) deleteWish(wish.id);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Hapus ucapan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
            <p className="text-xs text-stone-500">Tidak ada ucapan ditemukan.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
