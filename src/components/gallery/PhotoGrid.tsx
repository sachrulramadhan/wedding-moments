import React, { useState } from 'react';
import { Photo } from '../../types';
import { PhotoCard } from './PhotoCard';
import { PhotoLightbox } from '../common/PhotoLightbox';
import { EmptyState } from '../common/EmptyState';

interface PhotoGridProps {
  photos: Photo[];
  onCaptureClick?: () => void;
  onPhotoClick?: (photo: Photo) => void;
  isCoupleView?: boolean;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  onCaptureClick,
  onPhotoClick,
  isCoupleView = false,
}) => {
  const [internalSelectedPhoto, setInternalSelectedPhoto] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return (
      <EmptyState
        title="No moments yet"
        description="Be the first guest to capture a memory and help build the newlyweds' live album."
        actionText="Capture a Moment"
        onAction={onCaptureClick}
        icon="camera"
      />
    );
  }

  const handleCardClick = (photo: Photo) => {
    if (onPhotoClick) {
      onPhotoClick(photo);
    } else {
      setInternalSelectedPhoto(photo);
    }
  };

  return (
    <>
      {/* CSS-Based Masonry Grid */}
      <div className="masonry-grid w-full">
        {photos.map((photo) => (
          <div key={photo.id} className="masonry-item">
            <PhotoCard
              photo={photo}
              onClick={() => handleCardClick(photo)}
              showModerationBadge={isCoupleView}
            />
          </div>
        ))}
      </div>

      {/* Internal Lightbox Modal if not controlled externally */}
      {!onPhotoClick && (
        <PhotoLightbox
          photo={internalSelectedPhoto}
          photos={photos}
          onClose={() => setInternalSelectedPhoto(null)}
          onSelectPhoto={(photo) => setInternalSelectedPhoto(photo)}
          isCoupleView={isCoupleView}
        />
      )}
    </>
  );
};
