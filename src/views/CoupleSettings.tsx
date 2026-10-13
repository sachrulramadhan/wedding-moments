import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { EventPrivacy, ModerationMode } from '../types';
import { Save, CheckCircle2, Trash2 } from 'lucide-react';

interface CoupleSettingsProps {
  eventId: string;
}

export const CoupleSettings: React.FC<CoupleSettingsProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const { events, updateEvent, deleteEvent, getPhotosForEvent } = useWedding();

  const event = events.find((e) => e.id === eventId) || events[0];
  const pendingPhotosCount = event ? getPhotosForEvent(event.id, true).filter((p) => p.status === 'PENDING').length : 0;

  const [brideName, setBrideName] = useState(event?.brideName || '');
  const [groomName, setGroomName] = useState(event?.groomName || '');
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(event?.date || '');
  const [time, setTime] = useState(event?.time || '');
  const [location, setLocation] = useState(event?.location || '');
  const [description, setDescription] = useState(event?.description || '');
  const [privacy, setPrivacy] = useState<EventPrivacy>(event?.privacy || 'PUBLIC');
  const [accessCode, setAccessCode] = useState(event?.accessCode || '');
  const [moderationMode, setModerationMode] = useState<ModerationMode>(event?.moderationMode || 'AUTO_APPROVE');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    updateEvent(event.id, {
      brideName,
      groomName,
      title,
      date,
      time,
      location,
      description,
      privacy,
      accessCode: privacy === 'PRIVATE' ? accessCode : undefined,
      moderationMode,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus event ${event?.title}? Tindakan ini tidak dapat dibatalkan.`)) {
      if (event) {
        deleteEvent(event.id);
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="dashboard" eventId={event?.id} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="pb-1">
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Pengaturan Event
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Atur informasi pernikahan, moderasi foto, dan privasi akses
          </p>
        </div>

        {/* Dashboard Nav */}
        {event && (
          <DashboardNav
            eventId={event.id}
            activeTab="settings"
            pendingCount={pendingPhotosCount}
          />
        )}

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nama Pengantin Wanita
              </label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nama Pengantin Pria
              </label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Judul Event
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Waktu
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Lokasi / Venue
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Pesan Selamat Datang
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 resize-none"
            />
          </div>

          {/* Moderation & Privacy Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
              <span className="block text-xs font-bold text-stone-800">
                Moderasi Foto
              </span>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="moderation"
                    checked={moderationMode === 'AUTO_APPROVE'}
                    onChange={() => setModerationMode('AUTO_APPROVE')}
                    className="text-stone-900"
                  />
                  <span>Otomatis (Langsung tampil di galeri)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="moderation"
                    checked={moderationMode === 'MANUAL'}
                    onChange={() => setModerationMode('MANUAL')}
                    className="text-stone-900"
                  />
                  <span>Manual (Disetujui terlebih dahulu)</span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
              <span className="block text-xs font-bold text-stone-800">
                Privasi Event
              </span>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={privacy === 'PUBLIC'}
                    onChange={() => setPrivacy('PUBLIC')}
                  />
                  <span>Publik (Semua tamu dapat akses)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={privacy === 'PRIVATE'}
                    onChange={() => setPrivacy('PRIVATE')}
                  />
                  <span>Privat (Wajib kode PIN)</span>
                </label>
              </div>

              {privacy === 'PRIVATE' && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Kode akses (mis. LOVE2026)"
                    className="w-full py-1.5 px-3 text-xs rounded-xl border border-stone-300 font-mono tracking-wider"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Event</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};
