import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { CameraCapture } from '../components/camera/CameraCapture';
import { processImageFile, validateImageFile } from '../../src/services/imageUtils';
import { Camera, Image as ImageIcon, Heart, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface GuestUploadProps {
  eventId: string;
}

type UploadState = 'idle' | 'processing' | 'uploading' | 'success' | 'error';

export const GuestUpload: React.FC<GuestUploadProps> = ({ eventId }) => {
  const { navigate } = useRouter();
  const { events, addPhoto } = useWedding();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isCameraModeInitial = window.location.search.includes('mode=camera');

  const [showCamera, setShowCamera] = useState<boolean>(isCameraModeInitial);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const event = events.find((e) => e.id === eventId) || events[0];

  useEffect(() => {
    if (isCameraModeInitial && !photoDataUrl) setShowCamera(true);
  }, [isCameraModeInitial, photoDataUrl]);

  const handleCameraCapture = async (capturedDataUrl: string, ratio: number) => {
    setShowCamera(false);
    setUploadState('processing');
    try {
      const res = await fetch(capturedDataUrl);
      const blob = await res.blob();
      const processed = await processImageFile(blob);
      setPhotoDataUrl(processed.imageUrl);
      setThumbnailDataUrl(processed.thumbnailUrl);
      setAspectRatio(processed.aspectRatio);
      setUploadState('idle');
    } catch {
      setPhotoDataUrl(capturedDataUrl);
      setThumbnailDataUrl(capturedDataUrl);
      setAspectRatio(ratio);
      setUploadState('idle');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Format file tidak valid.');
      setUploadState('error');
      return;
    }
    setUploadState('processing');
    setErrorMessage(null);
    try {
      const processed = await processImageFile(file);
      setPhotoDataUrl(processed.imageUrl);
      setThumbnailDataUrl(processed.thumbnailUrl);
      setAspectRatio(processed.aspectRatio);
      setUploadState('idle');
    } catch {
      setErrorMessage('Gagal memproses foto. Coba foto lain.');
      setUploadState('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoDataUrl || !event) return;
    setUploadState('uploading');
    setErrorMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
      await addPhoto({
        eventId: event.id,
        imageUrl: photoDataUrl,
        thumbnailUrl: thumbnailDataUrl || photoDataUrl,
        guestName: guestName.trim() || undefined,
        message: message.trim() || undefined,
        aspectRatio,
      });
      setUploadState('success');
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#78350f', '#f59e0b', '#fbbf24', '#f43f5e'] });
      } catch { /* non-fatal */ }
    } catch {
      setErrorMessage('Gagal menyimpan foto. Coba lagi.');
      setUploadState('error');
    }
  };

  const resetForAnother = () => {
    setPhotoDataUrl(null);
    setThumbnailDataUrl(null);
    setMessage('');
    setGuestName('');
    setUploadState('idle');
    setErrorMessage(null);
    setShowCamera(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="guest" eventName={`${event?.brideName} & ${event?.groomName}`} eventId={event?.id} />

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={() => setShowCamera(false)}
          onFallbackUpload={async (file) => {
            setShowCamera(false);
            const processed = await processImageFile(file);
            setPhotoDataUrl(processed.imageUrl);
            setThumbnailDataUrl(processed.thumbnailUrl);
            setAspectRatio(processed.aspectRatio);
          }}
        />
      )}

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/jpg" className="hidden" onChange={handleFileSelect} />

      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <div className="mb-4">
          <button onClick={() => navigate(`/event/${event?.id}`)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        {uploadState === 'success' ? (
          <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">Foto Terkirim! ❤️</h2>
              <p className="text-xs text-stone-500 mt-1">Terima kasih sudah mengabadikan momen ini.</p>
            </div>
            {photoDataUrl && (
              <div className="w-28 h-28 rounded-2xl overflow-hidden mx-auto border-2 border-stone-200 shadow-sm">
                <img src={photoDataUrl} alt="Foto yang dikirim" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-2">
              <button onClick={() => navigate(`/event/${event?.id}/gallery`)} className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm cursor-pointer">
                Lihat Galeri
              </button>
              <button onClick={resetForAnother} className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm cursor-pointer">
                Kirim Foto Lagi 📷
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5">
            <div className="text-center">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                {event?.brideName} & {event?.groomName}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Bagikan foto momen indah ini</p>
            </div>

            {!photoDataUrl ? (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center space-y-4 bg-stone-50/50">
                  <Camera className="w-10 h-10 text-amber-900 mx-auto" />
                  <p className="text-xs text-stone-500">JPG, PNG, atau WEBP maks. 25MB</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setShowCamera(true)} className="py-3 px-4 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                      <Camera className="w-4 h-4" />
                      Buka Kamera
                    </button>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                      <ImageIcon className="w-4 h-4" />
                      Pilih Foto
                    </button>
                  </div>
                </div>
                {uploadState === 'processing' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-stone-500 py-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-800" />
                    <span>Memproses foto...</span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-stone-900 max-h-72 flex items-center justify-center border border-stone-200">
                  <img src={photoDataUrl} alt="Preview" className="max-h-72 w-auto object-contain mx-auto" />
                  <button
                    type="button"
                    onClick={() => { setPhotoDataUrl(null); setThumbnailDataUrl(null); }}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-xs font-semibold hover:bg-stone-900 cursor-pointer"
                  >
                    Ganti Foto
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Nama <span className="text-stone-400 font-normal">(opsional)</span></label>
                  <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)}
                    placeholder="mis. Reza & Santi" maxLength={60}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm bg-stone-50/50" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Pesan <span className="text-stone-400 font-normal">(opsional)</span></label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tulis cerita di balik foto ini..." rows={3} maxLength={280}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 text-sm bg-stone-50/50 resize-none" />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploadState === 'uploading' || uploadState === 'processing'}
                  className="w-full py-4 rounded-2xl bg-amber-900 hover:bg-amber-800 disabled:bg-stone-400 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {uploadState === 'uploading' ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /><span>Mengirim...</span></>
                  ) : (
                    <><Heart className="w-4 h-4 fill-white" /><span>Kirim Foto ❤️</span></>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
