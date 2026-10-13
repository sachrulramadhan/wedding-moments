import React from 'react';
import { Camera, Heart, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'camera' | 'heart' | 'sparkles';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = 'camera',
}) => {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto text-amber-800 shadow-xs">
        {icon === 'camera' && <Camera className="w-8 h-8" />}
        {icon === 'heart' && <Heart className="w-8 h-8" />}
        {icon === 'sparkles' && <Sparkles className="w-8 h-8" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-stone-50 text-xs font-semibold hover:bg-stone-800 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
