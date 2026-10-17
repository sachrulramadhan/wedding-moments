import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  WeddingEvent,
  Photo,
  WeddingWish,
  ReactionRecord,
  CoupleUser,
  PhotoStatus,
  ReactionType,
  EventStats,
  Order,
  PackageTier,
  DigitalAlbum,
  PromoCode
} from '../types';
import {
  loadEvents,
  saveEvents,
  loadPhotos,
  savePhotos,
  loadWishes,
  saveWishes,
  loadReactions,
  saveReactions,
  loadOrders,
  saveOrders,
  loadAlbums,
  saveAlbums,
  loadCurrentUser,
  saveCurrentUser,
  getGuestSessionId,
  PACKAGES,
  PROMO_CODES,
  INITIAL_DEMO_EVENT
} from '../services/storage';

interface CreateOrderData {
  packageId: PackageTier;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  paymentMethod: string;
  promoCode?: string;
}

interface WeddingContextType {
  // Auth & User
  currentUser: CoupleUser | null;
  guestSessionId: string;
  loginAsCouple: (email?: string, name?: string, role?: 'COUPLE' | 'ADMIN') => void;
  logout: () => void;

  // Packages & Orders
  packages: typeof PACKAGES;
  orders: Order[];
  promoCodes: PromoCode[];
  createOrder: (data: CreateOrderData) => Order;
  verifyPayment: (orderId: string) => Order;

  // Events
  events: WeddingEvent[];
  currentEvent: WeddingEvent | null;
  setCurrentEventId: (id: string | null) => void;
  createEvent: (data: Omit<WeddingEvent, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'expiresAt' | 'status' | 'maxPhotos' | 'storageLimitMb' | 'ownerId'>) => WeddingEvent;
  registerEvent: (event: WeddingEvent) => void;
  updateEvent: (eventId: string, partial: Partial<WeddingEvent>) => void;
  deleteEvent: (eventId: string) => void;

  // Photos
  photos: Photo[];
  getPhotosForEvent: (eventId: string, includePending?: boolean) => Photo[];
  addPhoto: (data: {
    eventId: string;
    imageUrl: string;
    thumbnailUrl?: string;
    guestName?: string;
    message?: string;
    aspectRatio?: number;
  }) => Promise<Photo>;
  moderatePhoto: (photoId: string, status: PhotoStatus) => void;
  toggleFavoritePhoto: (photoId: string) => void;
  deletePhoto: (photoId: string) => void;

  // Wishes
  wishes: WeddingWish[];
  getWishesForEvent: (eventId: string, includeHidden?: boolean) => WeddingWish[];
  addWish: (data: {
    eventId: string;
    guestName: string;
    message: string;
  }) => Promise<WeddingWish>;
  moderateWish: (wishId: string, status: 'APPROVED' | 'HIDDEN' | 'DELETED') => void;
  deleteWish: (wishId: string) => void;

  // Reactions
  toggleReaction: (photoId: string, type: ReactionType) => void;
  hasUserReacted: (photoId: string, type: ReactionType) => boolean;

  // Digital Album
  albums: DigitalAlbum[];
  getAlbumForEvent: (eventId: string) => DigitalAlbum | undefined;
  saveDigitalAlbum: (album: DigitalAlbum) => void;

  // Stats
  getStats: (eventId: string) => EventStats;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<WeddingEvent[]>(loadEvents);
  const [currentEventId, setCurrentEventId] = useState<string | null>(() => {
    const ev = loadEvents();
    return ev[0]?.id || INITIAL_DEMO_EVENT.id;
  });
  const [photos, setPhotos] = useState<Photo[]>(loadPhotos);
  const [wishes, setWishes] = useState<WeddingWish[]>(loadWishes);
  const [reactions, setReactions] = useState<ReactionRecord[]>(loadReactions);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [albums, setAlbums] = useState<DigitalAlbum[]>(loadAlbums);
  const [currentUser, setCurrentUser] = useState<CoupleUser | null>(loadCurrentUser);

  const guestSessionId = useMemo(() => getGuestSessionId(), []);

  // Save side-effects
  useEffect(() => saveEvents(events), [events]);
  useEffect(() => savePhotos(photos), [photos]);
  useEffect(() => saveWishes(wishes), [wishes]);
  useEffect(() => saveReactions(reactions), [reactions]);
  useEffect(() => saveOrders(orders), [orders]);
  useEffect(() => saveAlbums(albums), [albums]);
  useEffect(() => saveCurrentUser(currentUser), [currentUser]);

  const currentEvent = useMemo(() => {
    if (!currentEventId) return events[0] || null;
    return events.find((e) => e.id === currentEventId) || events[0] || null;
  }, [events, currentEventId]);

  // Auth
  const loginAsCouple = useCallback((email = 'aulia.rizky@weddingmoments.love', name = 'Aulia & Rizky', role: 'COUPLE' | 'ADMIN' = 'COUPLE') => {
    const user: CoupleUser = {
      id: 'user_' + Date.now().toString(36),
      email,
      name,
      role,
      packageId: 'PREMIUM',
      activeEventId: currentEventId || 'aulia-rizky-2026'
    };
    setCurrentUser(user);
  }, [currentEventId]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // Orders & Payment
  const createOrder = useCallback((data: CreateOrderData): Order => {
    const pkg = PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[1];
    let discount = 0;
    if (data.promoCode && data.promoCode.trim()) {
      const codeUpper = data.promoCode.trim().toUpperCase();
      const promo = PROMO_CODES.find((p) => p.code === codeUpper && p.active);
      if (promo) {
        discount = Math.round((pkg.price * promo.discountPercent) / 100);
      }
    }
    const finalAmount = Math.max(0, pkg.price - discount);
    const orderNumber = `WM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: 'ord_' + Date.now().toString(36),
      orderNumber,
      userId: currentUser?.id || 'guest_user',
      packageId: data.packageId,
      amount: finalAmount,
      promoCode: data.promoCode,
      discount,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'PAID', // Seamless simulation
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerWhatsapp: data.customerWhatsapp,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update current user package
    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, packageId: data.packageId } : null);
    } else {
      setCurrentUser({
        id: 'user_' + Date.now().toString(36),
        email: data.customerEmail,
        name: data.customerName,
        role: 'COUPLE',
        packageId: data.packageId
      });
    }

    return newOrder;
  }, [currentUser]);

  const verifyPayment = useCallback((orderId: string): Order => {
    let updated: Order | undefined;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.orderNumber === orderId) {
          updated = { ...o, paymentStatus: 'PAID', paidAt: new Date().toISOString() };
          return updated;
        }
        return o;
      })
    );
    return updated || orders[0];
  }, [orders]);

  // Events
  const createEvent = useCallback(
    (data: Omit<WeddingEvent, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'expiresAt' | 'status' | 'maxPhotos' | 'storageLimitMb' | 'ownerId'>) => {
      const slug = `${data.brideName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}-${data.groomName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString(36).slice(-4)}`;
      const pkg = PACKAGES.find((p) => p.id === currentUser?.packageId) || PACKAGES[1];
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + pkg.durationDays);

      const newEvent: WeddingEvent = {
        ...data,
        id: slug,
        ownerId: currentUser?.id || 'couple_demo_1',
        status: 'ACTIVE',
        maxPhotos: pkg.photoLimit,
        storageLimitMb: pkg.storageMb,
        createdBy: currentUser?.id || 'guest_creator',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: expiry.toISOString()
      };

      setEvents((prev) => [newEvent, ...prev]);
      setCurrentEventId(newEvent.id);
      return newEvent;
    },
    [currentUser]
  );

  const registerEvent = useCallback((event: WeddingEvent) => {
    setEvents((prev) => {
      if (prev.some((e) => e.id === event.id)) return prev;
      return [event, ...prev];
    });
  }, []);

  const updateEvent = useCallback((eventId: string, partial: Partial<WeddingEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, ...partial, updatedAt: new Date().toISOString() } : e))
    );
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setPhotos((prev) => prev.filter((p) => p.eventId !== eventId));
    setWishes((prev) => prev.filter((w) => w.eventId !== eventId));
  }, []);

  // Photos
  const getPhotosForEvent = useCallback(
    (eventId: string, includePending = false) => {
      return photos.filter((p) => {
        if (p.eventId !== eventId) return false;
        if (includePending) return p.status !== 'DELETED';
        return p.status === 'APPROVED';
      });
    },
    [photos]
  );

  const addPhoto = useCallback(
    async (data: {
      eventId: string;
      imageUrl: string;
      thumbnailUrl?: string;
      guestName?: string;
      message?: string;
      aspectRatio?: number;
    }) => {
      const targetEvent = events.find((e) => e.id === data.eventId);
      const isAutoApprove = targetEvent ? targetEvent.moderationMode === 'AUTO_APPROVE' : true;

      const newPhoto: Photo = {
        id: 'photo_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        eventId: data.eventId,
        guestSessionId,
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl || data.imageUrl,
        guestName: data.guestName?.trim() || 'Tamu Undangan',
        message: data.message?.trim() || undefined,
        status: isAutoApprove ? 'APPROVED' : 'PENDING',
        isFavorite: false,
        aspectRatio: data.aspectRatio || 1,
        reactions: { heart: 0, love: 0, applause: 0, laugh: 0 },
        createdAt: new Date().toISOString()
      };

      setPhotos((prev) => [newPhoto, ...prev]);
      return newPhoto;
    },
    [events, guestSessionId]
  );

  const moderatePhoto = useCallback((photoId: string, status: PhotoStatus) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, status, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const toggleFavoritePhoto = useCallback((photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  }, []);

  const deletePhoto = useCallback((photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }, []);

  // Wishes
  const getWishesForEvent = useCallback(
    (eventId: string, includeHidden = false) => {
      return wishes.filter((w) => {
        if (w.eventId !== eventId) return false;
        if (includeHidden) return w.status !== 'DELETED';
        return w.status === 'APPROVED';
      });
    },
    [wishes]
  );

  const addWish = useCallback(
    async (data: { eventId: string; guestName: string; message: string }) => {
      const newWish: WeddingWish = {
        id: 'wish_' + Date.now().toString(36),
        eventId: data.eventId,
        guestName: data.guestName.trim() || 'Sahabat & Kerabat',
        message: data.message.trim(),
        status: 'APPROVED',
        createdAt: new Date().toISOString()
      };
      setWishes((prev) => [newWish, ...prev]);
      return newWish;
    },
    []
  );

  const moderateWish = useCallback((wishId: string, status: 'APPROVED' | 'HIDDEN' | 'DELETED') => {
    setWishes((prev) => prev.map((w) => (w.id === wishId ? { ...w, status } : w)));
  }, []);

  const deleteWish = useCallback((wishId: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== wishId));
  }, []);

  // Reactions
  const hasUserReacted = useCallback(
    (photoId: string, type: ReactionType) => {
      return reactions.some(
        (r) => r.photoId === photoId && r.reactionType === type && r.guestSessionId === guestSessionId
      );
    },
    [reactions, guestSessionId]
  );

  const toggleReaction = useCallback(
    (photoId: string, type: ReactionType) => {
      const existing = reactions.find(
        (r) => r.photoId === photoId && r.reactionType === type && r.guestSessionId === guestSessionId
      );

      if (existing) {
        setReactions((prev) => prev.filter((r) => r.id !== existing.id));
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photoId
              ? {
                  ...p,
                  reactions: {
                    ...p.reactions,
                    [type]: Math.max(0, (p.reactions[type] || 0) - 1)
                  }
                }
              : p
          )
        );
      } else {
        const newRecord: ReactionRecord = {
          id: 'rx_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          photoId,
          reactionType: type,
          guestSessionId,
          createdAt: new Date().toISOString()
        };
        setReactions((prev) => [...prev, newRecord]);
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photoId
              ? {
                  ...p,
                  reactions: {
                    ...p.reactions,
                    [type]: (p.reactions[type] || 0) + 1
                  }
                }
              : p
          )
        );
      }
    },
    [reactions, guestSessionId]
  );

  // Digital Album
  const getAlbumForEvent = useCallback(
    (eventId: string) => albums.find((a) => a.eventId === eventId),
    [albums]
  );

  const saveDigitalAlbum = useCallback((album: DigitalAlbum) => {
    setAlbums((prev) => {
      const idx = prev.findIndex((a) => a.id === album.id || a.eventId === album.eventId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = album;
        return copy;
      }
      return [...prev, album];
    });
  }, []);

  // Stats
  const getStats = useCallback(
    (eventId: string): EventStats => {
      const evPhotos = photos.filter((p) => p.eventId === eventId && p.status !== 'DELETED');
      const approved = evPhotos.filter((p) => p.status === 'APPROVED');
      const pending = evPhotos.filter((p) => p.status === 'PENDING');
      const rejected = evPhotos.filter((p) => p.status === 'REJECTED');
      const favorites = approved.filter((p) => p.isFavorite).length;

      const evWishes = wishes.filter((w) => w.eventId === eventId && w.status !== 'DELETED');

      const guestSet = new Set<string>();
      evPhotos.forEach((p) => p.guestName && guestSet.add(p.guestName));
      evWishes.forEach((w) => w.guestName && guestSet.add(w.guestName));

      const totalReactions = approved.reduce(
        (sum, p) => sum + (p.reactions?.heart || 0) + (p.reactions?.love || 0) + (p.reactions?.applause || 0) + (p.reactions?.laugh || 0),
        0
      );

      // Estimate storage: ~1.2MB per photo
      const storageUsedMb = Math.round(evPhotos.length * 1.2);

      return {
        totalPhotos: evPhotos.length,
        approvedPhotos: approved.length,
        pendingPhotos: pending.length,
        rejectedPhotos: rejected.length,
        totalGuests: Math.max(guestSet.size, evPhotos.length > 0 ? 1 : 0),
        totalWishes: evWishes.length,
        totalReactions,
        favoritesCount: favorites,
        storageUsedMb
      };
    },
    [photos, wishes]
  );

  return (
    <WeddingContext.Provider
      value={{
        currentUser,
        guestSessionId,
        loginAsCouple,
        logout,
        packages: PACKAGES,
        orders,
        promoCodes: PROMO_CODES,
        createOrder,
        verifyPayment,
        events,
        currentEvent,
        setCurrentEventId,
        createEvent,
        registerEvent,
        updateEvent,
        deleteEvent,
        photos,
        getPhotosForEvent,
        addPhoto,
        moderatePhoto,
        toggleFavoritePhoto,
        deletePhoto,
        wishes,
        getWishesForEvent,
        addWish,
        moderateWish,
        deleteWish,
        toggleReaction,
        hasUserReacted,
        albums,
        getAlbumForEvent,
        saveDigitalAlbum,
        getStats
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
