import React from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { WeddingProvider, useWedding } from './context/WeddingContext';

import { LandingPage } from './views/LandingPage';
import { GuestEventHome } from './views/GuestEventHome';
import { GuestUpload } from './views/GuestUpload';
import { GuestGallery } from './views/GuestGallery';
import { GuestWishes } from './views/GuestWishes';

import { CoupleLogin } from './views/CoupleLogin';
import { CoupleDashboard } from './views/CoupleDashboard';
import { CoupleEvents } from './views/CoupleEvents';
import { CreateEvent } from './views/CreateEvent';
import { CoupleGalleryManage } from './views/CoupleGalleryManage';
import { CoupleWishesManage } from './views/CoupleWishesManage';
import { CoupleSettings } from './views/CoupleSettings';
import { CoupleQRCodeView } from './views/CoupleQRCodeView';

const RouteDispatcher: React.FC = () => {
  const { path, params } = useRouter();
  const { events, currentEvent } = useWedding();

  const activeEventId = params.eventId || currentEvent?.id || events[0]?.id || 'aulia-rizky-2026';

  // 1. PUBLIC ROUTES
  if (path === '/' || path === '') {
    return <LandingPage />;
  }

  // Guest upload route
  if (path.startsWith('/event/') && path.endsWith('/upload')) {
    return <GuestUpload eventId={activeEventId} />;
  }

  // Guest gallery route
  if (path.startsWith('/event/') && path.endsWith('/gallery')) {
    return <GuestGallery eventId={activeEventId} />;
  }

  // Guest wishes route
  if (path.startsWith('/event/') && path.endsWith('/wishes')) {
    return <GuestWishes eventId={activeEventId} />;
  }

  // Guest event home (/event/:eventId)
  if (path.startsWith('/event/')) {
    return <GuestEventHome eventId={activeEventId} />;
  }

  // 2. COUPLE PORTAL ROUTES
  if (path === '/login') {
    return <CoupleLogin />;
  }

  if (path === '/dashboard/events/create') {
    return <CreateEvent />;
  }

  if (path === '/dashboard/events' || path === '/dashboard/events/') {
    return <CoupleEvents />;
  }

  if (path.startsWith('/dashboard/events/') && path.endsWith('/gallery')) {
    return <CoupleGalleryManage eventId={activeEventId} />;
  }

  if (path.startsWith('/dashboard/events/') && path.endsWith('/wishes')) {
    return <CoupleWishesManage eventId={activeEventId} />;
  }

  if (path.startsWith('/dashboard/events/') && path.endsWith('/settings')) {
    return <CoupleSettings eventId={activeEventId} />;
  }

  if (path.startsWith('/dashboard/events/') && path.endsWith('/qr')) {
    return <CoupleQRCodeView eventId={activeEventId} />;
  }

  if (path.startsWith('/dashboard/events/')) {
    return <CoupleDashboard />;
  }

  if (path === '/dashboard' || path === '/dashboard/') {
    return <CoupleDashboard />;
  }

  // Fallback to landing page
  return <LandingPage />;
};

export default function App() {
  return (
    <RouterProvider>
      <WeddingProvider>
        <RouteDispatcher />
      </WeddingProvider>
    </RouterProvider>
  );
}
