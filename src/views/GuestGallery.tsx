import React, { useState, useMemo } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { PhotoCard } from '../components/gallery/PhotoCard';
import { PhotoLightbox } from '../components/common/PhotoLightbox';
import { EmptyState } from '../components/common/EmptyState';
import { Camera, Search, Star, ArrowLeft } from 'lucide-react';

interface GuestGalleryProps {
  eventId: string;
}

export const GuestGallery: React.FC<GuestGalleryProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const { events, getPhotosForEvent } = useWedding();

  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const event = events.find((e) => e.id === eventId) || events[0];
  const allApprovedPhotos = getPhotosForEvent(event?.id || '');

  const filteredPhotos = useMemo(() => {
    return allApprovedPhotos.filter((p) => {
      if (activeTab === 'favorites' && !p.isFavorite) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = p.guestName?.toLowerCase().includes(q);
        const msgMatch = p.message?.toLowerCase().includes(q);
        return nameMatch || msgMatch;
      }
      return true;
    });
  }, [allApprovedPhotos, activeTab, searchQuery]);

  const activePhoto = useMemo(() => {
    if (!selectedPhotoId) return null;
    return allApprovedPhotos.find((p) => p.id === selectedPhotoId) || null;
  }, [allApprovedPhotos, selectedPhotoId]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="guest" eventName={`${event?.brideName} & ${event?.groomName}`} eventId={event?.id} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Gallery Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <button
              onClick={() => navigate(`/event/${event?.id}`)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 mb-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Galeri Momen
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {allApprovedPhotos.length} foto diabadikan oleh tamu
            </p>
          </div>

          <button
            onClick={() => navigate(`/event/${event?.id}/upload`)}
            className="px-4 py-2.5 rounded-full bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Kirim Foto</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-xl self-start">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({allApprovedPhotos.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Favorit</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau pesan..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-stone-900 text-stone-800 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Masonry Grid */}
        {filteredPhotos.length === 0 ? (
          <EmptyState
            title="Belum ada foto"
            description="Jadilah yang pertama mengabadikan momen bahagia ini."
            actionText="Ambil Foto Sekarang"
            onAction={() => navigate(`/event/${event?.id}/upload`)}
            icon="camera"
          />
        ) : (
          <div
            className="masonry-grid columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance] w-full"
            style={{ columnGap: '1rem' }}
          >
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="masonry-item break-inside-avoid inline-block w-full mb-4"
              >
                <PhotoCard
                  photo={photo}
                  onClick={() => setSelectedPhotoId(photo.id)}
                  showModerationBadge={false}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <PhotoLightbox
        photo={activePhoto}
        photos={filteredPhotos}
        onClose={() => setSelectedPhotoId(null)}
        onSelectPhoto={(photo) => setSelectedPhotoId(photo.id)}
        isCoupleView={false}
      />

      <Footer />
    </div>
  );
};
