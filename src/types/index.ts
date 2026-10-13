export type EventPrivacy = 'PUBLIC' | 'PRIVATE' | 'UPLOAD_ONLY';
export type ModerationMode = 'AUTO_APPROVE' | 'MANUAL';
export type PhotoStatus = 'UPLOADING' | 'PROCESSING' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN' | 'DELETED';
export type ReactionType = 'heart' | 'love' | 'applause' | 'laugh';
export type PackageTier = 'BASIC' | 'PREMIUM' | 'ULTIMATE';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
export type EventLifecycleStatus = 'DRAFT' | 'ACTIVE' | 'POST_EVENT' | 'ARCHIVED' | 'EXPIRED';

export type EventThemeType =
  | 'classic-cream'
  | 'romantic-rose'
  | 'minimalist-stone'
  | 'luxury-gold'
  | 'sage-botanical'
  | 'noir-luxe'
  | 'traditional-heritage';

export interface PackageConfig {
  id: PackageTier;
  name: string;
  price: number;
  priceFormatted: string;
  photoLimit: number;
  durationDays: number;
  storageMb: number;
  features: string[];
  isPopular?: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  discountAmount?: number;
  minOrder?: number;
  active: boolean;
  expiresAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  packageId: PackageTier;
  amount: number;
  promoCode?: string;
  discount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  createdAt: string;
  paidAt?: string;
}

export interface WeddingEvent {
  id: string;
  ownerId: string;
  orderId?: string;
  brideName: string;
  groomName: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  welcomeMessage?: string;
  coverImage: string;
  theme: EventThemeType;
  accentColor?: string;
  privacy: EventPrivacy;
  accessCode?: string;
  moderationMode: ModerationMode;
  status: EventLifecycleStatus;
  maxPhotos: number;
  storageLimitMb: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface Photo {
  id: string;
  eventId: string;
  guestSessionId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  guestName: string;
  message?: string;
  status: PhotoStatus;
  isFavorite: boolean;
  aspectRatio?: number;
  reactions: Record<ReactionType, number>;
  createdAt: string;
  updatedAt?: string;
}

export interface WeddingWish {
  id: string;
  eventId: string;
  guestName: string;
  message: string;
  status: 'APPROVED' | 'PENDING' | 'HIDDEN' | 'DELETED';
  createdAt: string;
}

export interface ReactionRecord {
  id: string;
  photoId: string;
  reactionType: ReactionType;
  guestSessionId: string;
  createdAt: string;
}

export interface DigitalAlbumSection {
  id: string;
  title: string;
  description?: string;
  photoIds: string[];
}

export interface DigitalAlbum {
  id: string;
  eventId: string;
  title: string;
  subtitle?: string;
  coverPhotoId?: string;
  theme: string;
  isPublic: boolean;
  sections: DigitalAlbumSection[];
  createdAt: string;
  updatedAt: string;
}

export interface CoupleUser {
  id: string;
  email: string;
  name: string;
  role: 'COUPLE' | 'ADMIN';
  packageId?: PackageTier;
  activeEventId?: string;
}

export interface EventStats {
  totalPhotos: number;
  approvedPhotos: number;
  pendingPhotos: number;
  rejectedPhotos: number;
  totalGuests: number;
  totalWishes: number;
  totalReactions: number;
  favoritesCount: number;
  storageUsedMb: number;
}
