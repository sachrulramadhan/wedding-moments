import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { PhotoLightbox } from '../components/common/PhotoLightbox';
import { Photo } from '../types';
import { Heart, Share2, Sparkles, ArrowLeft, BookOpen, Download } from 'lucide-react';

interface PublicAlbumViewProps {
  albumId: string;
}

export const PublicAlbumView: React.FC<PublicAlbumViewProps> = ({ albumId }) => {
  const { navigate } = useRouter();
  const { albums, events, photos } = useWedding();

  const album = albums.find((a) => a.id === albumId) || albums[0];
  const event = events.find((e) => e.id === album?.eventId) || events[0];

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allAlbumPhotos = (album?.sections.flatMap((s) => s.photoIds) || [])
    .map((id) => photos.find((p) => p.id === id))
    .filter(Boolean) as Photo[];

  return (
    <div className="min-h-screen flex flex-col bg-stone-900 text-stone-100 selection:bg-amber-300 selection:text-stone-950 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={() => navigate(`/event/${event?.id}`)}
          className="text-xs font-semibold text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Tamu</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Share2 className="w-3 h-3" />
            <span>{copied ? 'Link Disalin!' : 'Bagikan'}</span>
          </button>
        </div>
      </header>

      {/* Album Cover */}
      <section className="relative py-20 px-4 text-center max-w-4xl mx-auto space-y-4">
        <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold bg-amber-950/60 px-3.5 py-1 rounded-full border border-amber-800/60 inline-block">
          Official Digital Wedding Book
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
          {album?.title || `Our Wedding Album — ${event?.brideName} & ${event?.groomName}`}
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 font-serif italic max-w-lg mx-auto">
          {album?.subtitle || 'Momen Tulus & Abadi dari Sudut Pandang Para Sahabat'}
        </p>
        <p className="text-[11px] text-stone-500">
          {event?.brideName} & {event?.groomName} · {event?.location}
        </p>
      </section>

      {/* Album Sections */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 pb-20 space-y-16">
        {album?.sections.map((section, sIdx) => {
          const sectionPhotos = section.photoIds
            .map((id) => photos.find((p) => p.id === id))
            .filter(Boolean) as Photo[];

          return (
            <div key={section.id} className="space-y-6">
              <div className="border-b border-stone-800 pb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    BAGIAN 0{sIdx + 1}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                    {section.title}
                  </h2>
                </div>
                <span className="text-xs text-stone-500 font-mono">{sectionPhotos.length} Foto</span>
              </div>

              {sectionPhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sectionPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="bg-stone-800/80 rounded-2xl overflow-hidden border border-stone-700/60 shadow-lg cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative aspect-4/3 overflow-hidden bg-stone-950">
                        <img
                          src={photo.thumbnailUrl || photo.imageUrl}
                          alt={photo.guestName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3.5 space-y-1">
                        <div className="flex items-center justify-between text-xs text-stone-400">
                          <span className="font-semibold text-stone-200">{photo.guestName}</span>
                          <span className="flex items-center gap-1 text-[11px] text-rose-400">
                            <Heart className="w-3 h-3 fill-rose-500/40" />
                            <span>
                              {(photo.reactions?.heart || 0) + (photo.reactions?.love || 0)}
                            </span>
                          </span>
                        </div>
                        {photo.message && (
                          <p className="text-xs text-stone-300 font-serif italic line-clamp-2">
                            "{photo.message}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded-2xl">
                  Belum ada foto yang dimasukkan di bab ini.
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Lightbox */}
      <PhotoLightbox
        photo={selectedPhoto}
        photos={allAlbumPhotos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
        isCoupleView={false}
      />
    </div>
  );
};
