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
  getGuestSessionId,
  computeEventStats,
  INITIAL_DEMO_EVENT,
} from '../services/storage';

interface WeddingContextType {
  events: WeddingEvent[];
  currentEvent: WeddingEvent | null;
  setCurrentEventId: (id: string | null) => void;
  currentUser: CoupleUser | null;
  guestSessionId: string;
  loginAsCouple: (email?: string, name?: string) => void;
  logout: () => void;
  createEvent: (data: Omit<WeddingEvent, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => WeddingEvent;
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
  moderateWish: (wishId: string, status: 'APPROVED' | 'HIDDEN') => void;
  deleteWish: (wishId: string) => void;

  // Reactions
  toggleReaction: (photoId: string, type: ReactionType) => void;
  hasUserReacted: (photoId: string, type: ReactionType) => boolean;

  // Stats
  getStats: (eventId: string) => EventStats;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<WeddingEvent[]>(loadEvents);
  const [currentEventId, setCurrentEventId] = useState<string | null>(INITIAL_DEMO_EVENT.id);
  const [photos, setPhotos] = useState<Photo[]>(loadPhotos);
  const [wishes, setWishes] = useState<WeddingWish[]>(loadWishes);
  const [reactions, setReactions] = useState<ReactionRecord[]>(loadReactions);
  const [currentUser, setCurrentUser] = useState<CoupleUser | null>(() => {
    const saved = localStorage.getItem('wm_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return {
      id: 'couple_demo_1',
      email: 'aulia.rizky@weddingmoments.love',
      name: 'Aulia & Rizky',
      role: 'COUPLE',
    };
  });

  const guestSessionId = useMemo(() => getGuestSessionId(), []);

  // Sync to storage
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  useEffect(() => {
    savePhotos(photos);
  }, [photos]);

  useEffect(() => {
    saveWishes(wishes);
  }, [wishes]);

  useEffect(() => {
    saveReactions(reactions);
  }, [reactions]);

  const currentEvent = useMemo(() => {
    if (!currentEventId) return events[0] || null;
    return events.find((e) => e.id === currentEventId) || events[0] || null;
  }, [events, currentEventId]);

  const loginAsCouple = useCallback((email = 'aulia.rizky@weddingmoments.love', name = 'Aulia & Rizky') => {
    const user: CoupleUser = {
      id: 'user_' + Date.now().toString(36),
      email,
      name,
      role: 'COUPLE',
    };
    setCurrentUser(user);
    localStorage.setItem('wm_current_user', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('wm_current_user');
  }, []);

  const createEvent = useCallback(
    (data: Omit<WeddingEvent, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
      const slug = `${data.brideName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}-${data.groomName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString(36).slice(-4)}`;
      const newEvent: WeddingEvent = {
        ...data,
        id: slug,
        createdBy: currentUser?.id || 'guest_creator',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

  const getPhotosForEvent = useCallback(
    (eventId: string, includePending = false) => {
      return photos.filter((p) => {
        if (p.eventId !== eventId) return false;
        if (includePending) return true;
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
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl || data.imageUrl,
        guestName: data.guestName?.trim() || 'Joyful Guest',
        message: data.message?.trim() || undefined,
        status: isAutoApprove ? 'APPROVED' : 'PENDING',
        isFavorite: false,
        createdAt: new Date().toISOString(),
        aspectRatio: data.aspectRatio || 1,
        reactions: { heart: 0, love: 0, applause: 0, laugh: 0 },
      };

      setPhotos((prev) => [newPhoto, ...prev]);
      return newPhoto;
    },
    [events]
  );

  const moderatePhoto = useCallback((photoId: string, status: PhotoStatus) => {
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, status } : p)));
  }, []);

  const toggleFavoritePhoto = useCallback((photoId: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, isFavorite: !p.isFavorite } : p)));
  }, []);

  const deletePhoto = useCallback((photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }, []);

  const getWishesForEvent = useCallback(
    (eventId: string, includeHidden = false) => {
      return wishes.filter((w) => {
        if (w.eventId !== eventId) return false;
        if (includeHidden) return true;
        return w.status === 'APPROVED';
      });
    },
    [wishes]
  );

  const addWish = useCallback(
    async (data: { eventId: string; guestName: string; message: string }) => {
      const newWish: WeddingWish = {
        id: 'wish_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        eventId: data.eventId,
        guestName: data.guestName.trim() || 'Anonymous Guest',
        message: data.message.trim(),
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      };
      setWishes((prev) => [newWish, ...prev]);
      return newWish;
    },
    []
  );

  const moderateWish = useCallback((wishId: string, status: 'APPROVED' | 'HIDDEN') => {
    setWishes((prev) => prev.map((w) => (w.id === wishId ? { ...w, status } : w)));
  }, []);

  const deleteWish = useCallback((wishId: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== wishId));
  }, []);

  const hasUserReacted = useCallback(
    (photoId: string, type: ReactionType) => {
      return reactions.some((r) => r.photoId === photoId && r.reactionType === type && r.guestSessionId === guestSessionId);
    },
    [reactions, guestSessionId]
  );

  const toggleReaction = useCallback(
    (photoId: string, type: ReactionType) => {
      const existing = reactions.find(
        (r) => r.photoId === photoId && r.reactionType === type && r.guestSessionId === guestSessionId
      );

      if (existing) {
        // Remove reaction
        setReactions((prev) => prev.filter((r) => r.id !== existing.id));
        setPhotos((prev) =>
          prev.map((p) => {
            if (p.id !== photoId) return p;
            const currentCount = p.reactions[type] || 0;
            return {
              ...p,
              reactions: {
                ...p.reactions,
                [type]: Math.max(0, currentCount - 1),
              },
            };
          })
        );
      } else {
        // Add reaction
        const newRecord: ReactionRecord = {
          id: 'react_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
          photoId,
          reactionType: type,
          guestSessionId,
          createdAt: new Date().toISOString(),
        };
        setReactions((prev) => [newRecord, ...prev]);
        setPhotos((prev) =>
          prev.map((p) => {
            if (p.id !== photoId) return p;
            const currentCount = p.reactions[type] || 0;
            return {
              ...p,
              reactions: {
                ...p.reactions,
                [type]: currentCount + 1,
              },
            };
          })
        );
      }
    },
    [reactions, guestSessionId]
  );

  const getStats = useCallback(
    (eventId: string) => {
      return computeEventStats(eventId, photos, wishes);
    },
    [photos, wishes]
  );

  return (
    <WeddingContext.Provider
      value={{
        events,
        currentEvent,
        setCurrentEventId,
        currentUser,
        guestSessionId,
        loginAsCouple,
        logout,
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
        getStats,
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
