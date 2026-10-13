import React from 'react';
import { Photo } from '../../types';
import { ReactionButtons } from './ReactionButtons';
import { Star, MessageCircle, Clock } from 'lucide-react';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  showModerationBadge?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onClick,
  showModerationBadge = false,
}) => {
  const formattedTime = new Date(photo.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer w-full"
    >
      {/* Photo Container */}
      <div className="relative overflow-hidden bg-stone-100 w-full">
        <img
          src={photo.thumbnailUrl || photo.imageUrl}
          alt={photo.message || `Wedding moment by ${photo.guestName}`}
          loading="lazy"
          style={photo.aspectRatio ? { aspectRatio: `${photo.aspectRatio}` } : undefined}
          className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        />

        {/* Favorite marker */}
        {photo.isFavorite && (
          <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md text-amber-500 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
          </div>
        )}

        {/* Status marker in couple dashboard view */}
        {showModerationBadge && photo.status !== 'APPROVED' && (
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                photo.status === 'PENDING'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {photo.status}
            </span>
          </div>
        )}
      </div>

      {/* Card Content & Details */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-2.5 bg-white">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold text-stone-900 truncate max-w-[140px]">
              {photo.guestName}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-stone-400">
              {formattedTime}
            </span>
          </div>

          {photo.message && (
            <p className="text-xs sm:text-sm text-stone-700 font-serif italic line-clamp-2 leading-relaxed">
              "{photo.message}"
            </p>
          )}
        </div>

        {/* Reaction Buttons */}
        <div className="pt-1 border-t border-stone-100 flex items-center justify-between">
          <ReactionButtons photoId={photo.id} reactions={photo.reactions} compact />
        </div>
      </div>
    </div>
  );
};
