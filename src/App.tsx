import React from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { WeddingProvider, useWedding } from './context/WeddingContext';

import { LandingPage } from './views/LandingPage';
import { PricingPage } from './views/PricingPage';
import { CheckoutPage } from './views/CheckoutPage';
import { GuestEventHome } from './views/GuestEventHome';
import { GuestUpload } from './views/GuestUpload';
import { GuestGallery } from './views/GuestGallery';
import { GuestWishes } from './views/GuestWishes';
import { LiveDisplay } from './views/LiveDisplay';
import { PublicAlbumView } from './views/PublicAlbumView';

import { CoupleLogin } from './views/CoupleLogin';
import { CoupleDashboard } from './views/CoupleDashboard';
import { CoupleEvents } from './views/CoupleEvents';
import { CreateEvent } from './views/CreateEvent';
import { CoupleGalleryManage } from './views/CoupleGalleryManage';
import { CoupleWishesManage } from './views/CoupleWishesManage';
import { CoupleSettings } from './views/CoupleSettings';
import { CoupleQRCodeView } from './views/CoupleQRCodeView';
import { CoupleAlbumManage } from './views/CoupleAlbumManage';
import { AdminDashboard } from './views/AdminDashboard';

const RouteDispatcher: React.FC = () => {
  const { path, params } = useRouter();
  const { events, currentEvent } = useWedding();

  const activeEventId = params.eventId || currentEvent?.id || events[0]?.id || 'aulia-rizky-2026';

  // 1. PUBLIC COMMERCIAL SAAS ROUTES
  if (path === '/' || path === '') {
    return <LandingPage />;
  }

  if (path === '/pricing' || path === '/pricing/') {
    return <PricingPage />;
  }

  if (path.startsWith('/checkout')) {
    return <CheckoutPage />;
  }

  // Live wedding TV / Projector Display (/event/:eventId/live)
  if (path.startsWith('/event/') && path.endsWith('/live')) {
    return <LiveDisplay eventId={activeEventId} />;
  }

  // Public Album showcase (/album/:albumId)
  if (path.startsWith('/album/')) {
    const albumId = path.replace('/album/', '').split('?')[0];
    return <PublicAlbumView albumId={albumId} />;
  }

  // Guest upload route (/event/:eventId/upload)
  if (path.startsWith('/event/') && path.endsWith('/upload')) {
    return <GuestUpload eventId={activeEventId} />;
  }

  // Guest gallery route (/event/:eventId/gallery)
  if (path.startsWith('/event/') && path.endsWith('/gallery')) {
    return <GuestGallery eventId={activeEventId} />;
  }

  // Guest wishes route (/event/:eventId/wishes)
  if (path.startsWith('/event/') && path.endsWith('/wishes')) {
    return <GuestWishes eventId={activeEventId} />;
  }

  // Guest event home (/event/:eventId)
  if (path.startsWith('/event/')) {
    return <GuestEventHome eventId={activeEventId} />;
  }

  // 2. ADMIN PORTAL ROUTE
  if (path === '/admin' || path.startsWith('/admin')) {
    return <AdminDashboard />;
  }

  // 3. COUPLE PORTAL ROUTES
  if (path === '/login') {
    return <CoupleLogin />;
  }

  if (path === '/dashboard/events/create') {
    return <CreateEvent />;
  }

  if (path === '/dashboard/events' || path === '/dashboard/events/') {
    return <CoupleEvents />;
  }

  // Couple Album creator
  if (path.startsWith('/dashboard/events/') && path.endsWith('/album')) {
    return <CoupleAlbumManage eventId={activeEventId} />;
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
