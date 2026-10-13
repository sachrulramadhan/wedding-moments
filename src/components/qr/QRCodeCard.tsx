import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useRouter } from '../../router/Router';
import {
  Download,
  Printer,
  Share2,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Settings2,
  Globe,
  Info,
  X,
  RefreshCw,
  Sparkles,
  Camera,
  Heart
} from 'lucide-react';
import { WeddingEvent } from '../../types';
import { getEventShareableUrl, getPublicBaseUrl, saveCustomBaseUrl } from '../../services/urlUtils';
import { GuestEventHome } from '../../views/GuestEventHome';

interface QRCodeCardProps {
  event: WeddingEvent;
  variant?: 'card' | 'poster';
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ event, variant = 'card' }) => {
  const { navigate } = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [useHashRouting, setUseHashRouting] = useState(true);
  const [showUrlSettings, setShowUrlSettings] = useState(false);
  const [showPhoneSimulator, setShowPhoneSimulator] = useState(false);
  const [customBaseUrl, setCustomBaseUrl] = useState(() => getPublicBaseUrl());

  // Generate resolved event URL
  const [eventUrl, setEventUrl] = useState(() => getEventShareableUrl(event, useHashRouting));

  // Update whenever event or configuration changes
  useEffect(() => {
    const resolved = getEventShareableUrl(event, useHashRouting);
    setEventUrl(resolved);
  }, [event, useHashRouting]);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      eventUrl,
      {
        width: variant === 'poster' ? 360 : 260,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#1c1917', // stone-900
          light: '#ffffff',
        },
      },
      (err) => {
        if (err) console.error('QR code generation error:', err);
        else if (canvasRef.current) {
          setQrDataUrl(canvasRef.current.toDataURL('image/png'));
        }
      }
    );
  }, [eventUrl, variant]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `${event.brideName.toLowerCase()}-${event.groomName.toLowerCase()}-wedding-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Scan QR atau buka tautan ini untuk mengabadikan momen pernikahan ${event.brideName} & ${event.groomName}:`,
          url: eventUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomBaseUrl(customBaseUrl);
    const updated = getEventShareableUrl(event, useHashRouting);
    setEventUrl(updated);
    setShowUrlSettings(false);
  };

  const handleResetUrl = () => {
    saveCustomBaseUrl(null);
    const reset = getPublicBaseUrl();
    setCustomBaseUrl(reset);
    const updated = getEventShareableUrl(event, useHashRouting);
    setEventUrl(updated);
  };

  const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 text-center max-w-md mx-auto print:border-none print:shadow-none ${variant === 'poster' ? 'max-w-xl p-10' : ''}`}>
      {/* Printable Poster Header */}
      <div className="space-y-1.5 mb-5">
        <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold block">
          Digital Wedding Album
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {event.brideName} & {event.groomName}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-serif italic">
          {formattedDate} · {event.location}
        </p>
      </div>

      {/* QR Code Canvas Frame */}
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 inline-block mx-auto my-2 shadow-inner">
        <canvas ref={canvasRef} className="max-w-full rounded-xl mx-auto shadow-xs" />
      </div>

      <div className="mt-3 mb-4 space-y-1">
        <p className="text-sm font-bold text-stone-900">
          Pindai untuk Mengabadikan Momen
        </p>
        <p className="text-xs text-stone-500 max-w-xs mx-auto">
          Buka kamera smartphone dan arahkan ke QR code. Tanpa instal aplikasi & tanpa login akun.
        </p>
      </div>

      {/* Testing Notice Box */}
      <div className="no-print my-3 p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-left text-xs space-y-1.5 text-amber-950">
        <div className="flex items-center gap-1.5 font-bold text-[11px]">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Petunjuk Scan QR & Pengujian:</span>
        </div>
        <p className="text-[11px] text-amber-900 leading-relaxed">
          • <strong>Scan pakai HP:</strong> Pastikan HP terhubung ke <strong>Wi-Fi yang sama</strong> dengan laptop/komputer ini.<br />
          • <strong>Tanpa HP:</strong> Anda bisa langsung klik <strong>📱 Simulasi Layar Smartphone</strong> atau <strong>Buka Halaman Tamu</strong> di bawah.
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="no-print space-y-2.5 pt-1">
        {/* Direct in-app guest view button (Zero 403 error) */}
        <button
          onClick={() => navigate(`/event/${event.id}`)}
          className="w-full py-3 px-4 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 text-amber-200" />
          <span>Buka Halaman Tamu (Dalam Aplikasi)</span>
        </button>

        {/* Smartphone simulator button */}
        <button
          onClick={() => setShowPhoneSimulator(true)}
          className="w-full py-2.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-amber-300" />
          <span>📱 Simulasi Layar Smartphone Tamu</span>
        </button>

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1">
          <button
            onClick={handleDownloadQR}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Unduh QR (PNG)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Cetak Kartu Meja</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-600" />
            <span>Bagikan</span>
          </button>

          <button
            onClick={handleCopyLink}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Link</span>
              </>
            )}
          </button>
        </div>

        {/* Display URL text */}
        <div className="pt-1 text-stone-400 text-[10px] sm:text-[11px] truncate select-all font-mono bg-stone-50 py-1.5 px-2.5 rounded-lg border border-stone-100">
          {eventUrl}
        </div>

        {/* Collapsible URL Configuration settings */}
        <div className="pt-1 text-left">
          <button
            type="button"
            onClick={() => setShowUrlSettings(!showUrlSettings)}
            className="text-[11px] text-stone-500 hover:text-stone-800 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <Settings2 className="w-3 h-3" />
            <span>{showUrlSettings ? 'Tutup Pengaturan Domain' : 'Ubah Domain / Tunnel Publik QR'}</span>
          </button>

          {showUrlSettings && (
            <form onSubmit={handleApplyCustomUrl} className="mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2.5 animate-in fade-in duration-150">
              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-700 tracking-wider mb-1">
                  Custom Domain / Tunnel URL
                </label>
                <input
                  type="url"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="https://wedding-moments.love atau https://ngrok..."
                  className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-stone-300 font-mono bg-white"
                  required
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Masukkan domain publik atau tunnel jika ingin menguji scan dari hp fisik secara langsung.
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="submit"
                  className="py-1 px-3 bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Terapkan ke QR
                </button>
                <button
                  type="button"
                  onClick={handleResetUrl}
                  className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Interactive Smartphone Guest Simulator Modal */}
      {showPhoneSimulator && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowPhoneSimulator(false)}
        >
          <div
            className="relative w-full max-w-[390px] h-[780px] max-h-[92vh] bg-stone-100 rounded-[48px] border-[10px] border-stone-900 shadow-2xl overflow-hidden flex flex-col text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Phone speaker/camera notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-stone-900 rounded-b-2xl w-36 mx-auto z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-stone-800 mr-2" />
              <div className="w-12 h-1 bg-stone-700 rounded-full" />
            </div>

            {/* Top Close Button for the Modal */}
            <div className="absolute top-3 right-4 z-50">
              <button
                onClick={() => setShowPhoneSimulator(false)}
                className="p-1 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer"
                title="Tutup Simulasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Simulator Screen */}
            <div className="flex-1 overflow-y-auto pt-6 scrollbar-none bg-stone-50">
              <GuestEventHome eventId={event.id} />
            </div>

            {/* Phone bottom home indicator bar */}
            <div className="h-4 bg-stone-50 flex items-center justify-center shrink-0">
              <div className="w-32 h-1 bg-stone-400 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
