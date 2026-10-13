import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { QRCodeCard } from '../components/qr/QRCodeCard';
import { WeddingEvent, EventPrivacy, ModerationMode } from '../types';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

import heroCoupleImg from '../assets/images/hero_wedding_couple_1791659951473.jpg';
import toastImg from '../assets/images/wedding_moment_toast_1791659963751.jpg';
import danceImg from '../assets/images/wedding_moment_dance_1791659975340.jpg';

const COVER_PRESETS = [
  { name: 'Garden Romance', url: heroCoupleImg },
  { name: 'Candlelight', url: toastImg },
  { name: 'Twilight Dance', url: danceImg },
];

export const CreateEvent: React.FC = () => {
  const { navigate } = useRouter();
  const { createEvent } = useWedding();

  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('17:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('Selamat datang! Scan QR code untuk mengabadikan momen indah bersama kami.');
  const [coverImage, setCoverImage] = useState(heroCoupleImg);
  const [privacy, setPrivacy] = useState<EventPrivacy>('PUBLIC');
  const [accessCode, setAccessCode] = useState('');
  const [moderationMode, setModerationMode] = useState<ModerationMode>('AUTO_APPROVE');

  const [createdEvent, setCreatedEvent] = useState<WeddingEvent | null>(null);

  const handleBrideChange = (val: string) => {
    setBrideName(val);
    if (groomName) setTitle(`${val} & ${groomName}'s Wedding`);
  };

  const handleGroomChange = (val: string) => {
    setGroomName(val);
    if (brideName) setTitle(`${brideName} & ${val}'s Wedding`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName || !groomName) return;

    const newEvent = createEvent({
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      title: title.trim() || `${brideName} & ${groomName}'s Wedding`,
      date,
      time,
      location: location.trim() || 'Venue Resepsi',
      description: description.trim(),
      coverImage,
      theme: 'classic-cream',
      privacy,
      accessCode: privacy === 'PRIVATE' ? (accessCode.trim() || 'LOVE2026') : undefined,
      moderationMode,
    });

    setCreatedEvent(newEvent);

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    } catch { /* non-fatal */ }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="dashboard" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-10">
        {createdEvent ? (
          <div className="space-y-8 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Event siap! 🎉</h1>
              <p className="text-sm text-stone-500">
                {createdEvent.brideName} & {createdEvent.groomName} — tamu bisa langsung scan QR dan upload foto.
              </p>
            </div>

            <QRCodeCard event={createdEvent} variant="card" />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate(`/event/${createdEvent.id}`)}
                className="w-full py-3 px-5 rounded-2xl bg-amber-900 hover:bg-amber-800 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buka Halaman Tamu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate(`/dashboard/events/${createdEvent.id}`)}
                className="w-full py-3 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ke Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
            <div className="space-y-1 pb-4 border-b border-stone-200">
              <h1 className="text-2xl font-serif font-bold text-stone-900">Buat Event Pernikahan</h1>
              <p className="text-xs text-stone-500">Isi detail di bawah untuk membuat halaman tamu & QR code.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Couple Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Nama Pengantin Wanita *</label>
                  <input
                    type="text" required value={brideName}
                    onChange={(e) => handleBrideChange(e.target.value)}
                    placeholder="mis. Aulia"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Nama Pengantin Pria *</label>
                  <input
                    type="text" required value={groomName}
                    onChange={(e) => handleGroomChange(e.target.value)}
                    placeholder="mis. Rizky"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Judul Event</label>
                <input
                  type="text" value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="mis. Pernikahan Aulia & Rizky"
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm"
                />
              </div>

              {/* Date, Time, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Tanggal *</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Jam</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Lokasi / Venue</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="mis. The Glasshouse, Bali"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm" />
                </div>
              </div>

              {/* Welcome note */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Pesan Selamat Datang untuk Tamu</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm resize-none" />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Foto Cover</label>
                <div className="grid grid-cols-3 gap-3">
                  {COVER_PRESETS.map((preset) => (
                    <div
                      key={preset.name}
                      onClick={() => setCoverImage(preset.url)}
                      className={`relative rounded-2xl overflow-hidden aspect-video border-2 cursor-pointer transition-all ${
                        coverImage === preset.url
                          ? 'border-stone-900 shadow-md ring-2 ring-stone-900/10'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-stone-950/60 p-1 text-center">
                        <span className="text-[10px] text-white font-medium">{preset.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <label className="block text-xs font-bold text-stone-700">Moderasi Foto</label>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="moderation" checked={moderationMode === 'AUTO_APPROVE'} onChange={() => setModerationMode('AUTO_APPROVE')} />
                      <span>Auto (langsung tampil)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="moderation" checked={moderationMode === 'MANUAL'} onChange={() => setModerationMode('MANUAL')} />
                      <span>Manual (Anda setujui dulu)</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <label className="block text-xs font-bold text-stone-700">Privasi</label>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="privacy" checked={privacy === 'PUBLIC'} onChange={() => setPrivacy('PUBLIC')} />
                      <span>Publik (siapa saja bisa akses)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="privacy" checked={privacy === 'PRIVATE'} onChange={() => setPrivacy('PRIVATE')} />
                      <span>Privat (pakai kode akses)</span>
                    </label>
                  </div>
                  {privacy === 'PRIVATE' && (
                    <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Kode akses (mis. LOVE2026)"
                      className="w-full py-1.5 px-3 text-xs rounded-lg border border-stone-300 font-mono mt-1" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buat Event & Generate QR Code</span>
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
