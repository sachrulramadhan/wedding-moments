import React, { useState, useMemo } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { PhotoLightbox } from '../components/common/PhotoLightbox';
import { Photo } from '../types';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Star,
  Trash2,
  Download,
  Eye,
  CheckCheck
} from 'lucide-react';

interface CoupleGalleryManageProps {
  eventId: string;
}

export const CoupleGalleryManage: React.FC<CoupleGalleryManageProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const {
    events,
    getPhotosForEvent,
    moderatePhoto,
    toggleFavoritePhoto,
    deletePhoto,
  } = useWedding();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const event = events.find((e) => e.id === eventId) || events[0];
  const allPhotos = event ? getPhotosForEvent(event.id, true) : [];

  const pendingCount = allPhotos.filter((p) => p.status === 'PENDING').length;

  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((p) => {
      if (activeTab === 'pending' && p.status !== 'PENDING') return false;
      if (activeTab === 'approved' && p.status !== 'APPROVED') return false;
      if (activeTab === 'favorites' && !p.isFavorite) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = p.guestName?.toLowerCase().includes(q);
        const msgMatch = p.message?.toLowerCase().includes(q);
        return nameMatch || msgMatch;
      }
      return true;
    });
  }, [allPhotos, activeTab, searchQuery]);

  const handleApproveAllPending = () => {
    const pendingList = allPhotos.filter((p) => p.status === 'PENDING');
    pendingList.forEach((p) => moderatePhoto(p.id, 'APPROVED'));
  };

  const handleDownloadAll = () => {
    alert(`Mengunduh ${allPhotos.length} foto resolusi tinggi...`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="dashboard" eventId={event?.id} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              Kelola Galeri Foto
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Moderasi foto tamu, beri bintang favorit, dan unduh kenangan
            </p>
          </div>

          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <button
                onClick={handleApproveAllPending}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Setujui Semua ({pendingCount})</span>
              </button>
            )}
            <button
              onClick={handleDownloadAll}
              className="px-3.5 py-1.5 border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Unduh Foto</span>
            </button>
          </div>
        </div>

        {/* Dashboard sub navigation */}
        {event && (
          <DashboardNav
            eventId={event.id}
            activeTab="gallery"
            pendingCount={pendingCount}
          />
        )}

        {/* Controls Bar: Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Segmented Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-xl self-start overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({allPhotos.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-white text-amber-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Perlu Tinjauan</span>
              {pendingCount > 0 && (
                <span className="bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'approved'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Disetujui ({allPhotos.filter((p) => p.status === 'APPROVED').length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Favorit ({allPhotos.filter((p) => p.isFavorite).length})</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengirim atau pesan..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-stone-900 text-stone-800"
            />
          </div>
        </div>

        {/* Gallery Cards Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs flex flex-col justify-between group"
              >
                {/* Photo & Actions */}
                <div
                  className="relative overflow-hidden aspect-square bg-stone-100 cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.guestName}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />

                  {/* Status chip */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        photo.status === 'APPROVED'
                          ? 'bg-emerald-900/80 text-emerald-200 backdrop-blur-xs'
                          : photo.status === 'PENDING'
                          ? 'bg-amber-900/90 text-amber-200 backdrop-blur-xs'
                          : 'bg-rose-900/90 text-rose-200 backdrop-blur-xs'
                      }`}
                    >
                      {photo.status === 'APPROVED' ? 'Disetujui' : photo.status === 'PENDING' ? 'Menunggu' : 'Ditolak'}
                    </span>
                  </div>

                  {/* Favorite Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoritePhoto(photo.id);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                      photo.isFavorite
                        ? 'bg-amber-400 text-stone-900'
                        : 'bg-stone-900/40 text-white hover:bg-stone-900/70'
                    }`}
                    title={photo.isFavorite ? 'Hapus Favorit' : 'Jadikan Favorit'}
                  >
                    <Star className={`w-3.5 h-3.5 ${photo.isFavorite ? 'fill-stone-900' : ''}`} />
                  </button>

                  <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Lihat</span>
                  </div>
                </div>

                {/* Info & Moderation Actions */}
                <div className="p-3 space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-stone-900 truncate max-w-[120px]">
                        {photo.guestName}
                      </span>
                      <span className="font-mono text-[10px] tabular-nums text-stone-400">
                        {new Date(photo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {photo.message && (
                      <p className="text-xs text-stone-600 font-serif italic line-clamp-1 mt-0.5">
                        "{photo.message}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1 text-xs">
                    {photo.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => moderatePhoto(photo.id, 'APPROVED')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-center flex items-center justify-center gap-1 cursor-pointer text-xs"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Setujui</span>
                        </button>
                        <button
                          onClick={() => moderatePhoto(photo.id, 'REJECTED')}
                          className="flex-1 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 font-medium rounded-lg text-center flex items-center justify-center gap-1 cursor-pointer text-xs"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>Tolak</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            moderatePhoto(photo.id, photo.status === 'APPROVED' ? 'REJECTED' : 'APPROVED')
                          }
                          className="text-stone-500 hover:text-stone-900 text-xs font-medium cursor-pointer"
                        >
                          {photo.status === 'APPROVED' ? 'Sembunyikan' : 'Setujui'}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus foto ini secara permanen?')) {
                              deletePhoto(photo.id);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Hapus foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
            <h3 className="text-base font-serif font-bold text-stone-900">Tidak ada foto</h3>
            <p className="text-xs text-stone-500 mt-1">Coba ganti filter tab atau kata kunci pencarian.</p>
          </div>
        )}
      </main>

      <PhotoLightbox
        photo={selectedPhoto}
        photos={filteredPhotos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
        isCoupleView={true}
      />

      <Footer />
    </div>
  );
};
