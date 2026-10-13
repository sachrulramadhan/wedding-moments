import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Heart, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface GuestWishesProps {
  eventId: string;
}

export const GuestWishes: React.FC<GuestWishesProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const { events, getWishesForEvent, addWish } = useWedding();

  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const event = events.find((e) => e.id === eventId) || events[0];
  const wishes = getWishesForEvent(event?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !event) return;

    setSubmitting(true);
    try {
      await addWish({
        eventId: event.id,
        guestName: guestName.trim() || 'Sahabat & Kerabat',
        message: message.trim(),
      });

      setSentSuccess(true);
      setMessage('');
      setGuestName('');

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // non-fatal
      }

      setTimeout(() => setSentSuccess(false), 3500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="guest" eventName={`${event?.brideName} & ${event?.groomName}`} eventId={event?.id} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="pb-3 border-b border-stone-200">
          <button
            onClick={() => navigate(`/event/${event?.id}`)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 mb-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Ucapan & Doa
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Kirimkan doa dan ucapan terbaik untuk kedua mempelai
          </p>
        </div>

        {/* Wish Form */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-600/30" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Tulis Ucapan Selamat</h2>
              <p className="text-xs text-stone-500">Pesan akan langsung muncul di dinding ucapan</p>
            </div>
          </div>

          {sentSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ucapan Anda berhasil dikirim! ❤️</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nama Anda <span className="text-stone-400 font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="mis. Budi Santoso & Keluarga"
                className="w-full py-2 px-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Pesan & Doa *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Selamat menempuh hidup baru, semoga bahagia selalu..."
                rows={3}
                required
                className="w-full py-2 px-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm resize-none"
                maxLength={400}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="py-2.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-medium text-xs tracking-wide shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Ucapan</span>
            </button>
          </form>
        </div>

        {/* Wishes List */}
        <div className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Daftar Ucapan ({wishes.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {wishes.map((wish) => {
              const formattedDate = new Date(wish.createdAt).toLocaleDateString('id-ID', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={wish.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-2.5"
                >
                  <p className="text-xs sm:text-sm font-serif italic text-stone-800 leading-relaxed">
                    "{wish.message}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                    <span className="font-semibold text-stone-900">{wish.guestName}</span>
                    <span className="font-mono text-[11px] tabular-nums text-stone-400">{formattedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
