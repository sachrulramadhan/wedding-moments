import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { ReactionType } from '../../types';

interface ReactionButtonsProps {
  photoId: string;
  reactions: Record<ReactionType, number>;
  compact?: boolean;
}

const REACTION_CONFIG: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'heart', emoji: '❤️', label: 'Heart' },
  { type: 'love', emoji: '😍', label: 'Love' },
  { type: 'applause', emoji: '👏', label: 'Applause' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
];

export const ReactionButtons: React.FC<ReactionButtonsProps> = ({
  photoId,
  reactions,
  compact = false,
}) => {
  const { toggleReaction, hasUserReacted } = useWedding();

  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2 flex-wrap'}`}>
      {REACTION_CONFIG.map(({ type, emoji, label }) => {
        const count = reactions[type] || 0;
        const active = hasUserReacted(photoId, type);

        return (
          <button
            key={type}
            onClick={(e) => {
              e.stopPropagation();
              toggleReaction(photoId, type);
            }}
            title={label}
            aria-label={`${label} (${count})`}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 transition-all duration-150 rounded-full cursor-pointer active:scale-90 select-none ${
              compact
                ? 'px-2 py-0.5 text-xs'
                : 'px-3 py-1.5 text-xs'
            } ${
              active
                ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-300 shadow-xs ring-1 ring-rose-200 scale-105'
                : 'bg-stone-100 hover:bg-stone-200/90 text-stone-700 font-medium border border-transparent'
            }`}
          >
            <span className="text-sm select-none transform hover:scale-115 transition-transform duration-150">{emoji}</span>
            {count > 0 && (
              <span className="tabular-nums font-mono text-[11px] font-semibold">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
