import { WeddingEvent, Photo, WeddingWish, ReactionRecord, EventStats, ReactionType } from '../types';

import heroCoupleImg from '../assets/images/hero_wedding_couple_1791659951473.jpg';
import toastImg from '../assets/images/wedding_moment_toast_1791659963751.jpg';
import danceImg from '../assets/images/wedding_moment_dance_1791659975340.jpg';
import ringsImg from '../assets/images/wedding_moment_rings_1791659986049.jpg';
import laughterImg from '../assets/images/wedding_moment_laughter_1791659996411.jpg';

export const INITIAL_DEMO_EVENT: WeddingEvent = {
  id: 'aulia-rizky-2026',
  brideName: 'Aulia',
  groomName: 'Rizky',
  title: 'Aulia & Rizky’s Wedding Celebration',
  date: '2026-12-12',
  time: '16:00',
  location: 'Villa Amanzi, Cliffside Uluwatu, Bali',
  description: 'Welcome to our special day! Scan the QR code at your table, take candid photos throughout the evening, and help us preserve memories we might miss.',
  coverImage: heroCoupleImg,
  theme: 'classic-cream',
  privacy: 'PUBLIC',
  moderationMode: 'AUTO_APPROVE',
  createdBy: 'couple_demo_1',
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-10-10T12:00:00.000Z',
};

export const INITIAL_DEMO_PHOTOS: Photo[] = [
  {
    id: 'photo-1',
    eventId: 'aulia-rizky-2026',
    imageUrl: toastImg,
    thumbnailUrl: toastImg,
    guestName: 'Maya & Dimas',
    message: 'To a lifetime of joyful toasts, wild laughter, and endless adventure! Cheers to both of you! 🥂',
    status: 'APPROVED',
    isFavorite: true,
    createdAt: '2026-12-12T19:42:00.000Z',
    aspectRatio: 4 / 3,
    reactions: { heart: 28, love: 19, applause: 34, laugh: 4 },
  },
  {
    id: 'photo-2',
    eventId: 'aulia-rizky-2026',
    imageUrl: laughterImg,
    thumbnailUrl: laughterImg,
    guestName: 'Clara & The Bridesmaids',
    message: 'Still in awe of how radiant you look today, Aulia! We love you so much.',
    status: 'APPROVED',
    isFavorite: true,
    createdAt: '2026-12-12T17:15:00.000Z',
    aspectRatio: 4 / 3,
    reactions: { heart: 42, love: 31, applause: 16, laugh: 7 },
  },
  {
    id: 'photo-3',
    eventId: 'aulia-rizky-2026',
    imageUrl: ringsImg,
    thumbnailUrl: ringsImg,
    guestName: 'Tari (Sister of Bride)',
    message: 'The handwritten vows had every single one of us crying tears of pure joy.',
    status: 'APPROVED',
    isFavorite: false,
    createdAt: '2026-12-12T16:45:00.000Z',
    aspectRatio: 1,
    reactions: { heart: 35, love: 22, applause: 18, laugh: 2 },
  },
  {
    id: 'photo-4',
    eventId: 'aulia-rizky-2026',
    imageUrl: danceImg,
    thumbnailUrl: danceImg,
    guestName: 'Aditya Pratama',
    message: 'Rizky finally pulled off the twirl! Best first dance of the decade!',
    status: 'APPROVED',
    isFavorite: true,
    createdAt: '2026-12-12T20:30:00.000Z',
    aspectRatio: 4 / 3,
    reactions: { heart: 51, love: 40, applause: 62, laugh: 29 },
  },
  {
    id: 'photo-5',
    eventId: 'aulia-rizky-2026',
    imageUrl: heroCoupleImg,
    thumbnailUrl: heroCoupleImg,
    guestName: 'Jessica & Kevin',
    message: 'The golden hour light right after the ceremony was breathtaking. Pure poetry! ✨',
    status: 'APPROVED',
    isFavorite: true,
    createdAt: '2026-12-12T17:40:00.000Z',
    aspectRatio: 16 / 9,
    reactions: { heart: 64, love: 47, applause: 39, laugh: 3 },
  },
];

export const INITIAL_DEMO_WISHES: WeddingWish[] = [
  {
    id: 'wish-1',
    eventId: 'aulia-rizky-2026',
    guestName: 'Uncle Budi & Aunt Sarah',
    message: 'May your home always be filled with peace, your hearts with tender love, and your years with abundant grace. Happy wedding!',
    status: 'APPROVED',
    createdAt: '2026-12-12T16:10:00.000Z',
  },
  {
    id: 'wish-2',
    eventId: 'aulia-rizky-2026',
    guestName: 'Farhan (College Roommate)',
    message: 'From cramming for exams at 3 AM to seeing Rizky marry the love of his life. So proud of you both! Keep loving each other deeply.',
    status: 'APPROVED',
    createdAt: '2026-12-12T17:50:00.000Z',
  },
  {
    id: 'wish-3',
    eventId: 'aulia-rizky-2026',
    guestName: 'Natasha Wijaya',
    message: 'Everything tonight is pure magic. Wishing you a beautiful journey of partnership, companionship, and shared dreams.',
    status: 'APPROVED',
    createdAt: '2026-12-12T18:22:00.000Z',
  },
];

const STORAGE_KEYS = {
  EVENTS: 'wm_events_v2',
  PHOTOS: 'wm_photos_v2',
  WISHES: 'wm_wishes_v2',
  REACTIONS: 'wm_reactions_v2',
  GUEST_SESSION: 'wm_guest_session_id',
};

export function getGuestSessionId(): string {
  let id = localStorage.getItem(STORAGE_KEYS.GUEST_SESSION);
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEYS.GUEST_SESSION, id);
  }
  return id;
}

export function loadEvents(): WeddingEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      const initial = [INITIAL_DEMO_EVENT];
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [INITIAL_DEMO_EVENT];
    }
    return parsed;
  } catch {
    return [INITIAL_DEMO_EVENT];
  }
}

export function saveEvents(events: WeddingEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events:', err);
  }
}

export function loadPhotos(): Photo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(INITIAL_DEMO_PHOTOS));
      return INITIAL_DEMO_PHOTOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Merge initial demo photos if missing
      const existingIds = new Set(parsed.map((p: Photo) => p.id));
      const missingInitial = INITIAL_DEMO_PHOTOS.filter((p) => !existingIds.has(p.id));
      if (missingInitial.length > 0) {
        const combined = [...parsed, ...missingInitial];
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(combined));
        return combined;
      }
      return parsed;
    }
    return INITIAL_DEMO_PHOTOS;
  } catch {
    return INITIAL_DEMO_PHOTOS;
  }
}

export function savePhotos(photos: Photo[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  } catch (err) {
    console.error('Failed to save photos:', err);
  }
}

export function loadWishes(): WeddingWish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(INITIAL_DEMO_WISHES));
      return INITIAL_DEMO_WISHES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_WISHES;
  } catch {
    return INITIAL_DEMO_WISHES;
  }
}

export function saveWishes(wishes: WeddingWish[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(wishes));
  } catch (err) {
    console.error('Failed to save wishes:', err);
  }
}

export function loadReactions(): ReactionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REACTIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReactions(reactions: ReactionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactions));
  } catch (err) {
    console.error('Failed to save reactions:', err);
  }
}

export function computeEventStats(eventId: string, photos: Photo[], wishes: WeddingWish[]): EventStats {
  const eventPhotos = photos.filter((p) => p.eventId === eventId);
  const eventWishes = wishes.filter((w) => w.eventId === eventId);

  const approvedPhotos = eventPhotos.filter((p) => p.status === 'APPROVED');
  const pendingPhotos = eventPhotos.filter((p) => p.status === 'PENDING');
  const favoritesCount = eventPhotos.filter((p) => p.isFavorite).length;

  let totalReactions = 0;
  eventPhotos.forEach((p) => {
    Object.values(p.reactions).forEach((count) => {
      totalReactions += count;
    });
  });

  // Calculate unique guest contributors
  const guestSet = new Set<string>();
  eventPhotos.forEach((p) => {
    if (p.guestName?.trim()) guestSet.add(p.guestName.trim().toLowerCase());
  });
  eventWishes.forEach((w) => {
    if (w.guestName?.trim()) guestSet.add(w.guestName.trim().toLowerCase());
  });

  return {
    totalPhotos: eventPhotos.length,
    approvedPhotos: approvedPhotos.length,
    pendingPhotos: pendingPhotos.length,
    totalGuests: Math.max(guestSet.size, eventPhotos.length > 0 ? 12 : 0),
    totalWishes: eventWishes.length,
    totalReactions,
    favoritesCount,
  };
}
