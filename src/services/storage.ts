import {
  WeddingEvent,
  Photo,
  WeddingWish,
  ReactionRecord,
  Order,
  PromoCode,
  PackageConfig,
  DigitalAlbum,
  CoupleUser
} from '../types';

import heroCoupleImg from '../assets/images/hero_wedding_couple_1791659951473.jpg';
import toastImg from '../assets/images/wedding_moment_toast_1791659963751.jpg';
import danceImg from '../assets/images/wedding_moment_dance_1791659975340.jpg';
import ringsImg from '../assets/images/wedding_moment_rings_1791659986049.jpg';
import laughterImg from '../assets/images/wedding_moment_laughter_1791659996411.jpg';

export const PACKAGES: PackageConfig[] = [
  {
    id: 'BASIC',
    name: 'Basic',
    price: 99000,
    priceFormatted: 'Rp99.000',
    photoLimit: 500,
    durationDays: 30,
    storageMb: 2048,
    features: [
      '1 Event Pernikahan Digital',
      'QR Code Meja Siap Cetak',
      'Upload Foto Tamu Tanpa Aplikasi',
      'Kamera In-Browser Cepat',
      'Galeri Foto Real-Time',
      'Dinding Ucapan Tamu',
      'Hingga 500 Foto Berkualitas Tinggi',
      'Akses Aktif 30 Hari',
      'Tema Klasik Cream'
    ]
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: 199000,
    priceFormatted: 'Rp199.000',
    photoLimit: 2000,
    durationDays: 90,
    storageMb: 8192,
    isPopular: true,
    features: [
      'Semua Fitur Paket Basic',
      'Hingga 2.000 Foto Berkualitas Penuh',
      'Koleksi Tema Lengkap (7 Tema Elegan)',
      'Moderasi Foto (Auto & Manual Approval)',
      'Tandai Foto Favorit & Filter',
      'Digital Wedding Album Generator',
      'Unduh Seluruh Foto (Zip Archive)',
      'Live Display Mode (Layar Proyektor/TV Resepsi)',
      'Akses Aktif 90 Hari'
    ]
  },
  {
    id: 'ULTIMATE',
    name: 'Ultimate',
    price: 399000,
    priceFormatted: 'Rp399.000',
    photoLimit: 10000,
    durationDays: 365,
    storageMb: 25600,
    features: [
      'Semua Fitur Paket Premium',
      'Penyimpanan Ekstra Besar (Hingga 10.000 Foto)',
      'AI Best Moments Selection',
      'Dukungan Video Pendek Tamu',
      'Custom Branding & Nama Domain Sendiri',
      'Multi-Section Digital Memory Book',
      'Akses Aktif 1 Tahun Penuh',
      'Bantuan Prioritas 24/7'
    ]
  }
];

export const PROMO_CODES: PromoCode[] = [
  { code: 'NIKAHBAHAGIA', discountPercent: 20, active: true, expiresAt: '2026-12-31' },
  { code: 'MOMENTS50', discountPercent: 50, active: true, expiresAt: '2026-12-31' },
  { code: 'SPECIALDAY', discountPercent: 10, active: true, expiresAt: '2026-12-31' }
];

export const INITIAL_DEMO_EVENT: WeddingEvent = {
  id: 'aulia-rizky-2026',
  ownerId: 'couple_demo_1',
  orderId: 'WM-2026-000101',
  brideName: 'Aulia',
  groomName: 'Rizky',
  title: 'Pernikahan Aulia & Rizky',
  date: '2026-12-12',
  time: '16:00',
  location: 'Villa Amanzi, Cliffside Uluwatu, Bali',
  description: 'Selamat datang di momen terindah kami! Scan QR code di meja Anda untuk mengabadikan momen candid sepanjang malam.',
  welcomeMessage: 'Terima kasih telah hadir dan melengkapi kebahagiaan kami.',
  coverImage: heroCoupleImg,
  theme: 'classic-cream',
  privacy: 'PUBLIC',
  moderationMode: 'AUTO_APPROVE',
  status: 'ACTIVE',
  maxPhotos: 2000,
  storageLimitMb: 8192,
  createdBy: 'couple_demo_1',
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-10-10T12:00:00.000Z',
  expiresAt: '2027-01-01T12:00:00.000Z'
};

export const INITIAL_DEMO_PHOTOS: Photo[] = [
  {
    id: 'photo-1',
    eventId: 'aulia-rizky-2026',
    guestSessionId: 'guest_maya_dimas',
    imageUrl: toastImg,
    thumbnailUrl: toastImg,
    guestName: 'Maya & Dimas',
    message: 'Untuk cinta yang abadi dan tawa yang tak pernah habis! Selamat Aulia & Rizky! 🥂',
    status: 'APPROVED',
    isFavorite: true,
    createdAt: '2026-12-12T19:42:00.000Z',
    aspectRatio: 4 / 3,
    reactions: { heart: 32, love: 24, applause: 41, laugh: 6 }
  },
  {
    id: 'photo-2',
    eventId: 'aulia-rizky-2026',
    guestSessionId: 'guest_clara_bm',
    imageUrl: laughterImg,
    thumbnailUrl: laughterImg,
    guestName: 'Clara & The Bridesmaids',
    message: 'Aulia cantik banget hari ini, Mas Rizky beruntung banget! Bahagia selalu kalian berdua!',
    status: 'APPROVED',
    isFavorite: true,
    createdAt: '2026-12-12T17:15:00.000Z',
    aspectRatio: 4 / 3,
    reactions: { heart: 49, love: 38, applause: 22, laugh: 9 }
  },
  {
    id: 'photo-3',
    eventId: 'aulia-rizky-2026',
    guestSessionId: 'guest_tari_sister',
    imageUrl: ringsImg,
    thumbnailUrl: ringsImg,
    guestName: 'Tari (Adik Pengantin)',
    message: 'Janji suci yang bikin semua orang terharu sampai meneteskan air mata bahagia.',
    status: 'APPROVED',
    isFavorite: false,
    createdAt: '2026-12-12T16:45:00.000Z',
    aspectRatio: 1,
    reactions: { heart: 42, love: 29, applause: 25, laugh: 3 }
  },
  {
    id: 'photo-4',
    eventId: 'aulia-rizky-2026',
    guestSessionId: 'guest_aditya_p',
    imageUrl: danceImg,
    thumbnailUrl: danceImg,
    guestName: 'Aditya Pratama',
    message: 'Akhirnya tarian dansa pertama berhasil dengan sempurna! Romantis abis.',
    status: 'APPROVED',
    isFavorite: true,
    createdAt: '2026-12-12T20:30:00.000Z',
    aspectRatio: 4 / 3,
    reactions: { heart: 58, love: 45, applause: 68, laugh: 31 }
  },
  {
    id: 'photo-5',
    eventId: 'aulia-rizky-2026',
    guestSessionId: 'guest_jessica_kevin',
    imageUrl: heroCoupleImg,
    thumbnailUrl: heroCoupleImg,
    guestName: 'Jessica & Kevin',
    message: 'Golden hour sunset di Uluwatu benar-benar magis. Pasangan paling serasi!',
    status: 'APPROVED',
    isFavorite: true,
    createdAt: '2026-12-12T17:40:00.000Z',
    aspectRatio: 16 / 9,
    reactions: { heart: 74, love: 53, applause: 44, laugh: 4 }
  }
];

export const INITIAL_DEMO_WISHES: WeddingWish[] = [
  {
    id: 'wish-1',
    eventId: 'aulia-rizky-2026',
    guestName: 'Om Budi & Tante Sarah',
    message: 'Semoga rumah tangga kalian selalu dipenuhi berkah, saling menyayangi hingga akhir hayat. Selamat menempuh hidup baru!',
    status: 'APPROVED',
    createdAt: '2026-12-12T16:10:00.000Z'
  },
  {
    id: 'wish-2',
    eventId: 'aulia-rizky-2026',
    guestName: 'Farhan (Teman Kuliah Rizky)',
    message: 'Dari begadang nugas bareng sampai hari ini lu nikahin wanita impian lu. Proud of you brother!',
    status: 'APPROVED',
    createdAt: '2026-12-12T17:50:00.000Z'
  },
  {
    id: 'wish-3',
    eventId: 'aulia-rizky-2026',
    guestName: 'Natasha Wijaya',
    message: 'Pernikahan paling indah dan berkesan yang pernah kudatangi. Selamat berpetualang bersama selamanya!',
    status: 'APPROVED',
    createdAt: '2026-12-12T18:22:00.000Z'
  }
];

export const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'WM-2026-000101',
    userId: 'couple_demo_1',
    packageId: 'PREMIUM',
    amount: 199000,
    discount: 0,
    paymentMethod: 'QRIS / Bank Transfer',
    paymentStatus: 'PAID',
    customerName: 'Aulia & Rizky',
    customerEmail: 'aulia.rizky@weddingmoments.love',
    customerWhatsapp: '081234567890',
    createdAt: '2026-09-01T09:30:00.000Z',
    paidAt: '2026-09-01T09:32:00.000Z'
  }
];

export const INITIAL_DEMO_ALBUM: DigitalAlbum = {
  id: 'album-aulia-rizky',
  eventId: 'aulia-rizky-2026',
  title: 'Our Wedding Moments — Aulia & Rizky',
  subtitle: 'Kumpulan Momen Tulus dari Mata Para Sahabat & Keluarga',
  coverPhotoId: 'photo-5',
  theme: 'classic-cream',
  isPublic: true,
  sections: [
    {
      id: 'sec-ceremony',
      title: 'Akad & Janji Suci',
      description: 'Momen khidmat saat ikrar pernikahan diucapkan di hadapan keluarga tercinta.',
      photoIds: ['photo-3', 'photo-5']
    },
    {
      id: 'sec-reception',
      title: 'Resepsi & Kegembiraan',
      description: 'Malam penuh tawa, dansa, dan kehangatan bersama sahabat.',
      photoIds: ['photo-1', 'photo-2', 'photo-4']
    }
  ],
  createdAt: '2026-12-13T09:00:00.000Z',
  updatedAt: '2026-12-13T12:00:00.000Z'
};

const STORAGE_KEYS = {
  EVENTS: 'wm_events_v3',
  PHOTOS: 'wm_photos_v3',
  WISHES: 'wm_wishes_v3',
  REACTIONS: 'wm_reactions_v3',
  ORDERS: 'wm_orders_v3',
  ALBUMS: 'wm_albums_v3',
  GUEST_SESSION: 'wm_guest_session_v3',
  CURRENT_USER: 'wm_current_user_v3'
};

export function getGuestSessionId(): string {
  let id = localStorage.getItem(STORAGE_KEYS.GUEST_SESSION);
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEYS.GUEST_SESSION, id);
  }
  return id;
}

export function loadEvents(): WeddingEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      saveEvents([INITIAL_DEMO_EVENT]);
      return [INITIAL_DEMO_EVENT];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [INITIAL_DEMO_EVENT];
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
      savePhotos(INITIAL_DEMO_PHOTOS);
      return INITIAL_DEMO_PHOTOS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_PHOTOS;
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
      saveWishes(INITIAL_DEMO_WISHES);
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
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReactions(records: ReactionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save reactions:', err);
  }
}

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      saveOrders(INITIAL_DEMO_ORDERS);
      return INITIAL_DEMO_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
}

export function loadAlbums(): DigitalAlbum[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALBUMS);
    if (!raw) {
      saveAlbums([INITIAL_DEMO_ALBUM]);
      return [INITIAL_DEMO_ALBUM];
    }
    return JSON.parse(raw);
  } catch {
    return [INITIAL_DEMO_ALBUM];
  }
}

export function saveAlbums(albums: DigitalAlbum[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
  } catch (err) {
    console.error('Failed to save albums:', err);
  }
}

export function loadCurrentUser(): CoupleUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    id: 'couple_demo_1',
    email: 'aulia.rizky@weddingmoments.love',
    name: 'Aulia & Rizky',
    role: 'COUPLE',
    packageId: 'PREMIUM',
    activeEventId: 'aulia-rizky-2026'
  };
}

export function saveCurrentUser(user: CoupleUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (err) {
    console.error('Failed to save current user:', err);
  }
}
