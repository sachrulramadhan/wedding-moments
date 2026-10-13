import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { DigitalAlbum } from '../types';
import { BookOpen, Plus, Share2, Download, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

interface CoupleAlbumManageProps {
  eventId: string;
}

export const CoupleAlbumManage: React.FC<CoupleAlbumManageProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const { events, getPhotosForEvent, getAlbumForEvent, saveDigitalAlbum } = useWedding();

  const event = events.find((e) => e.id === eventId) || events[0];
  const allPhotos = event ? getPhotosForEvent(event.id, false) : [];
  const existingAlbum = event ? getAlbumForEvent(event.id) : undefined;

  const [albumTitle, setAlbumTitle] = useState(
    existingAlbum?.title || `Our Wedding Album — ${event?.brideName || ''} & ${event?.groomName || ''}`
  );
  const [albumSubtitle, setAlbumSubtitle] = useState(
    existingAlbum?.subtitle || 'Momen Terbaik yang Diabadikan oleh Para Tamu Tercinta'
  );
  const [sections, setSections] = useState(
    existingAlbum?.sections || [
      { id: 'sec-1', title: 'Akad & Janji Suci', photoIds: allPhotos.slice(0, 2).map((p) => p.id) },
      { id: 'sec-2', title: 'Resepsi & Kegembiraan', photoIds: allPhotos.slice(2, 5).map((p) => p.id) }
    ]
  );
  const [isCopied, setIsCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAlbum = () => {
    if (!event) return;
    const album: DigitalAlbum = {
      id: existingAlbum?.id || `album-${event.id}`,
      eventId: event.id,
      title: albumTitle,
      subtitle: albumSubtitle,
      coverPhotoId: allPhotos[0]?.id,
      theme: event.theme,
      isPublic: true,
      sections,
      createdAt: existingAlbum?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveDigitalAlbum(album);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#/album/album-${event?.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="dashboard" eventId={event?.id} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              Digital Wedding Memory Book
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Kurasi foto-foto terbaik dari para tamu menjadi album kenangan digital interaktif
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-600" />
              <span>{isCopied ? 'Link Disalin!' : 'Bagikan Album'}</span>
            </button>
            <button
              onClick={() => navigate(`/album/album-${event?.id}`)}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Lihat Tampilan Album</span>
            </button>
          </div>
        </div>

        {event && <DashboardNav eventId={event.id} activeTab="album" />}

        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Album digital berhasil diperbarui!</span>
          </div>
        )}

        {/* Album Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Detail Sampul Album</h3>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Judul Album</label>
                <input
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Subjudul / Catatan Kenangan</label>
                <input
                  type="text"
                  value={albumSubtitle}
                  onChange={(e) => setAlbumSubtitle(e.target.value)}
                  className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Bagian Album ({sections.length})</h3>
                <button
                  onClick={() =>
                    setSections((prev) => [
                      ...prev,
                      { id: `sec-${Date.now()}`, title: 'Bab Baru (mis. Bersama Keluarga)', photoIds: [] }
                    ])
                  }
                  className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Bab Album</span>
                </button>
              </div>

              {sections.map((sec, idx) => (
                <div key={sec.id} className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, title: val } : s)));
                      }}
                      className="font-serif font-bold text-stone-900 text-base focus:outline-none border-b border-dashed border-stone-300 pb-0.5"
                    />
                    <span className="text-[11px] text-stone-400 font-medium">{sec.photoIds.length} Foto Dipilih</span>
                  </div>

                  {/* Photo selector inside this section */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                    {allPhotos.map((photo) => {
                      const isSelected = sec.photoIds.includes(photo.id);
                      return (
                        <div
                          key={photo.id}
                          onClick={() => {
                            setSections((prev) =>
                              prev.map((s, i) => {
                                if (i !== idx) return s;
                                const has = s.photoIds.includes(photo.id);
                                return {
                                  ...s,
                                  photoIds: has ? s.photoIds.filter((id) => id !== photo.id) : [...s.photoIds, photo.id]
                                };
                              })
                            );
                          }}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-amber-900 ring-2 ring-amber-900/20 scale-95'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.guestName} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-amber-900 text-white rounded-full p-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveAlbum}
              className="py-3 px-6 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
            >
              Simpan Album Digital
            </button>
          </div>

          {/* Right Preview */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Preview Buku Kenangan</h3>
            <div className="bg-stone-900 rounded-2xl p-6 text-white text-center space-y-3 shadow-md">
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold block">Digital Album</span>
              <h4 className="text-xl font-serif font-bold">{albumTitle}</h4>
              <p className="text-xs text-stone-300 font-serif italic">{albumSubtitle}</p>
              <div className="pt-2 flex justify-center">
                <span className="text-[10px] bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  {sections.reduce((acc, s) => acc + s.photoIds.length, 0)} Foto Terpilih
                </span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Tamu dan kerabat dapat membuka link album ini di smartphone mereka seperti membalik halaman buku pernikahan digital yang mewah.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
