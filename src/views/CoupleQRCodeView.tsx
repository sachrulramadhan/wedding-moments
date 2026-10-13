import React from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { QRCodeCard } from '../components/qr/QRCodeCard';

interface CoupleQRCodeViewProps {
  eventId: string;
}

export const CoupleQRCodeView: React.FC<CoupleQRCodeViewProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const { events, getPhotosForEvent } = useWedding();

  const event = events.find((e) => e.id === eventId) || events[0];
  const pendingPhotosCount = event ? getPhotosForEvent(event.id, true).filter((p) => p.status === 'PENDING').length : 0;

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar variant="dashboard" />
        <div className="flex-1 flex items-center justify-center text-sm text-stone-500">Event tidak ditemukan.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <div className="no-print">
        <Navbar variant="dashboard" eventId={event.id} />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        <div className="no-print space-y-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              Kartu Meja & Poster QR
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Cetak dan letakkan di meja makan tamu agar mereka dapat langsung memindai dan membagikan foto
            </p>
          </div>

          <DashboardNav
            eventId={event.id}
            activeTab="qr"
            pendingCount={pendingPhotosCount}
          />
        </div>

        {/* Poster / Card */}
        <div className="pt-2">
          <QRCodeCard event={event} variant="poster" />
        </div>
      </main>

      <Footer />
    </div>
  );
};
