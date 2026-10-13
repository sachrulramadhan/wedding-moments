import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { PhotoLightbox } from '../components/common/PhotoLightbox';
import { Photo } from '../types';
import { Image as ImageIcon, Users, Heart, Sparkles, QrCode, Download, Plus, AlertCircle, Eye, Star } from 'lucide-react';

export const CoupleDashboard: React.FC = () => {
  const { navigate, params } = useRouter();
  const { events, currentEvent, setCurrentEventId, getStats, getPhotosForEvent, toggleFavoritePhoto } = useWedding();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const activeEvent = (params.eventId && events.find((e) => e.id === params.eventId)) || currentEvent || events[0];
  const stats = activeEvent ? getStats(activeEvent.id) : { totalPhotos: 0, approvedPhotos: 0, pendingPhotos: 0, totalGuests: 0, totalWishes: 0, totalReactions: 0, favoritesCount: 0 };
  const allPhotos = activeEvent ? getPhotosForEvent(activeEvent.id, true) : [];
  const recentPhotos = allPhotos.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="dashboard" eventId={activeEvent?.id} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-stone-500 font-medium">
              {activeEvent?.date ? new Date(activeEvent.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </p>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              {activeEvent ? `${activeEvent.brideName} & ${activeEvent.groomName}` : 'Dashboard'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {events.length > 1 && (
              <select
                value={activeEvent?.id}
                onChange={(e) => { setCurrentEventId(e.target.value); navigate(`/dashboard/events/${e.target.value}`); }}
                className="py-2 px-3 text-xs font-semibold rounded-xl border border-stone-200 bg-white text-stone-800"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>{e.brideName} & {e.groomName}</option>
                ))}
              </select>
            )}
            <button onClick={() => navigate(`/dashboard/events/${activeEvent?.id}/qr`)}
              className="py-2 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <QrCode className="w-3.5 h-3.5" /> QR Code
            </button>
            <button onClick={() => navigate('/dashboard/events/create')}
              className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Event Baru
            </button>
          </div>
        </div>

        {/* Nav tabs */}
        {activeEvent && <DashboardNav eventId={activeEvent.id} activeTab="overview" pendingCount={stats.pendingPhotos} />}

        {/* Pending alert */}
        {stats.pendingPhotos > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-800 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-950">{stats.pendingPhotos} Foto Menunggu Persetujuan</p>
                <p className="text-[11px] text-amber-800">Setujui foto agar bisa dilihat tamu lain.</p>
              </div>
            </div>
            <button onClick={() => navigate(`/dashboard/events/${activeEvent?.id}/gallery?filter=pending`)}
              className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer">
              Tinjau →
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Foto', value: stats.totalPhotos, sub: `${stats.approvedPhotos} disetujui · ${stats.favoritesCount} favorit`, icon: <ImageIcon className="w-4 h-4 text-amber-800" /> },
            { label: 'Tamu Berkontribusi', value: stats.totalGuests, sub: 'Upload foto / ucapan', icon: <Users className="w-4 h-4 text-amber-800" /> },
            { label: 'Ucapan', value: stats.totalWishes, sub: 'Selamat diterima', icon: <Heart className="w-4 h-4 text-rose-600" /> },
            { label: 'Reaksi', value: stats.totalReactions, sub: '❤️ 😍 👏 😂', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
          ].map((s) => (
            <div key={s.label} className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-[11px] font-medium uppercase tracking-wider">{s.label}</span>
                {s.icon}
              </div>
              <div className="text-3xl font-serif font-bold text-stone-900 tabular-nums">{s.value.toLocaleString()}</div>
              <p className="text-[11px] text-stone-500">{s.sub}</p>
            </div>
          ))}
        </div>

        <ActivityChart totalUploads={stats.totalPhotos} />

        {/* Recent photos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-stone-900">Foto Terbaru</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => alert(`Mengunduh ${allPhotos.length} foto...`)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Unduh Semua
              </button>
              <button onClick={() => navigate(`/dashboard/events/${activeEvent?.id}/gallery`)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold cursor-pointer">
                Kelola Galeri →
              </button>
            </div>
          </div>

          {recentPhotos.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {recentPhotos.map((photo) => (
                <div key={photo.id} className="group relative rounded-2xl overflow-hidden aspect-square bg-stone-100 border border-stone-200">
                  <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.guestName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-1.5 left-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      photo.status === 'APPROVED' ? 'bg-emerald-900/80 text-emerald-200' :
                      photo.status === 'PENDING' ? 'bg-amber-900/90 text-amber-200' : 'bg-rose-900/90 text-rose-200'
                    }`}>{photo.status}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavoritePhoto(photo.id); }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/40 text-white hover:text-amber-400">
                    <Star className={`w-3.5 h-3.5 ${photo.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                  <div onClick={() => setSelectedPhoto(photo)}
                    className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
              <p className="text-xs text-stone-500">Belum ada foto yang diunggah.</p>
            </div>
          )}
        </div>
      </main>

      <PhotoLightbox photo={selectedPhoto} photos={allPhotos} onClose={() => setSelectedPhoto(null)} onSelectPhoto={(p) => setSelectedPhoto(p)} isCoupleView={true} />
      <Footer />
    </div>
  );
};
