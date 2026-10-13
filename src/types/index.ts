export type EventPrivacy = 'PUBLIC' | 'PRIVATE' | 'UPLOAD_ONLY';
export type ModerationMode = 'AUTO_APPROVE' | 'MANUAL';
export type PhotoStatus = 'APPROVED' | 'PENDING' | 'REJECTED';
export type ReactionType = 'heart' | 'love' | 'applause' | 'laugh';

export interface WeddingEvent {
  id: string;
  brideName: string;
  groomName: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  coverImage: string;
  theme: 'classic-cream' | 'terracotta-warm' | 'sage-botanical' | 'noir-luxe';
  privacy: EventPrivacy;
  accessCode?: string;
  moderationMode: ModerationMode;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  eventId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  guestName: string;
  message?: string;
  status: PhotoStatus;
  isFavorite: boolean;
  createdAt: string;
  aspectRatio?: number; // width / height
  reactions: Record<ReactionType, number>;
}

export interface WeddingWish {
  id: string;
  eventId: string;
  guestName: string;
  message: string;
  status: 'APPROVED' | 'PENDING' | 'HIDDEN';
  createdAt: string;
}

export interface ReactionRecord {
  id: string;
  photoId: string;
  reactionType: ReactionType;
  guestSessionId: string;
  createdAt: string;
}

export interface CoupleUser {
  id: string;
  email: string;
  name: string;
  role: 'COUPLE' | 'ORGANIZER';
}

export interface EventStats {
  totalPhotos: number;
  approvedPhotos: number;
  pendingPhotos: number;
  totalGuests: number;
  totalWishes: number;
  totalReactions: number;
  favoritesCount: number;
}
