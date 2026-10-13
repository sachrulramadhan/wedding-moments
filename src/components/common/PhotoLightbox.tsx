import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Star, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Photo } from '../../types';
import { ReactionButtons } from '../gallery/ReactionButtons';
import { useWedding } from '../../context/WeddingContext';

interface PhotoLightboxProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
  isCoupleView?: boolean;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
  isCoupleView = false,
}) => {
  const { toggleFavoritePhoto, deletePhoto, moderatePhoto } = useWedding();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, photos]);

  if (!photo) return null;
  const currentPhoto = photos.find((p) => p.id === photo.id) || photo;

  const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = () => {
    if (hasPrev) onSelectPhoto(photos[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onSelectPhoto(photos[currentIndex + 1]);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentPhoto.imageUrl;
    link.download = `wedding-moment-${currentPhoto.guestName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${currentPhoto.id}.jpg`;
    link.click();
  };

  const formattedDate = new Date(currentPhoto.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Header */}
      <div
        className="w-full flex items-center justify-between text-white/90 z-20 max-w-6xl pb-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-mono tabular-nums">
            {currentIndex + 1} / {photos.length}
          </span>
          {isCoupleView && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                currentPhoto.status === 'APPROVED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : currentPhoto.status === 'PENDING'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {currentPhoto.status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isCoupleView && (
            <>
              <button
                onClick={() => toggleFavoritePhoto(currentPhoto.id)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  currentPhoto.isFavorite ? 'bg-amber-500/20 text-amber-400' : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
                title={currentPhoto.isFavorite ? 'Unfavorite' : 'Add to Favorites'}
              >
                <Star className={`w-5 h-5 ${currentPhoto.isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={() => {
                  if (confirm('Delete this wedding photo permanently?')) {
                    deletePhoto(currentPhoto.id);
                    onClose();
                  }
                }}
                className="p-2 text-stone-300 hover:text-rose-400 hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
                title="Delete Photo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}

          <button
            onClick={handleDownload}
            className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
            title="Download full resolution photo"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-full transition-colors ml-2 cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Photo Area with Navigation Arrows */}
      <div
        className="relative flex-1 w-full max-w-6xl flex items-center justify-center overflow-hidden my-2"
        onClick={(e) => e.stopPropagation()}
      >
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-30 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-sm transition-transform active:scale-95 cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentPhoto.imageUrl}
          alt={currentPhoto.message || `Photo by ${currentPhoto.guestName}`}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl selection:bg-transparent"
        />

        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-30 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-sm transition-transform active:scale-95 cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Info & Reactions bar */}
      <div
        className="w-full max-w-3xl bg-stone-900/80 backdrop-blur-md rounded-2xl p-4 text-white z-20 border border-stone-800/80 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <span className="font-semibold text-white">{currentPhoto.guestName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-stone-400">{formattedDate}</span>
          </div>
          {currentPhoto.message && (
            <p className="text-sm text-stone-200 font-serif italic max-w-md">
              "{currentPhoto.message}"
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ReactionButtons photoId={currentPhoto.id} reactions={currentPhoto.reactions} />

          {isCoupleView && currentPhoto.status === 'PENDING' && (
            <div className="flex items-center gap-1.5 pl-3 border-l border-stone-800">
              <button
                onClick={() => moderatePhoto(currentPhoto.id, 'APPROVED')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => moderatePhoto(currentPhoto.id, 'REJECTED')}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
