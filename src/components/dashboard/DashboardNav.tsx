import React from 'react';
import { useRouter } from '../../router/Router';
import { LayoutDashboard, Image as ImageIcon, Heart, QrCode, Settings, ExternalLink, BookOpen, Tv } from 'lucide-react';

interface DashboardNavProps {
  eventId: string;
  activeTab: 'overview' | 'gallery' | 'wishes' | 'qr' | 'settings' | 'album';
  pendingCount?: number;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({ eventId, activeTab, pendingCount = 0 }) => {
  const { navigate } = useRouter();

  const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: <LayoutDashboard className="w-3.5 h-3.5" />, path: `/dashboard/events/${eventId}` },
    { id: 'gallery', label: 'Galeri', icon: <ImageIcon className="w-3.5 h-3.5" />, path: `/dashboard/events/${eventId}/gallery`, badge: pendingCount },
    { id: 'wishes', label: 'Ucapan', icon: <Heart className="w-3.5 h-3.5" />, path: `/dashboard/events/${eventId}/wishes` },
    { id: 'qr', label: 'Kartu QR', icon: <QrCode className="w-3.5 h-3.5" />, path: `/dashboard/events/${eventId}/qr` },
    { id: 'album', label: 'Buku Kenangan (Album)', icon: <BookOpen className="w-3.5 h-3.5" />, path: `/dashboard/events/${eventId}/album` },
    { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-3.5 h-3.5" />, path: `/dashboard/events/${eventId}/settings` },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => navigate(tab.path)}
          className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-xs font-semibold ${
            activeTab === tab.id
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge && tab.badge > 0 ? (
            <span className="bg-amber-400 text-amber-950 px-1.5 rounded-full text-[10px] font-bold">{tab.badge}</span>
          ) : null}
        </button>
      ))}

      <div className="ml-auto pl-2 flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => navigate(`/event/${eventId}/live`)}
          className="px-2.5 py-1.5 rounded-lg border border-amber-900/30 bg-amber-50 text-amber-950 hover:bg-amber-100 flex items-center gap-1 text-[11px] whitespace-nowrap cursor-pointer font-medium"
          title="Layar Proyektor Live Resepsi"
        >
          <Tv className="w-3 h-3 text-amber-900" />
          <span>Live TV Wall</span>
        </button>
        <button
          onClick={() => navigate(`/event/${eventId}`)}
          className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 flex items-center gap-1 text-[11px] whitespace-nowrap cursor-pointer"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Halaman Tamu</span>
        </button>
      </div>
    </div>
  );
};
