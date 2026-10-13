import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { processImageFile } from '../../services/imageUtils';

interface CameraCaptureProps {
  onCapture: (capturedDataUrl: string, aspectRatio: number) => void;
  onCancel: () => void;
  onFallbackUpload: (file: File) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
  onFallbackUpload,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [capturedRatio, setCapturedRatio] = useState<number>(4 / 3);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [flashActive, setFlashActive] = useState(false);

  // Initialize camera stream
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    setIsInitializing(true);
    setErrorMessage(null);

    // Stop existing stream tracks
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      console.warn('Camera access failed, falling back:', err);
      const name = (err as { name?: string }).name;
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setErrorMessage('Camera access was declined. You can still choose a photo directly from your device.');
      } else {
        setErrorMessage('Camera is currently unavailable on this device. Please select a photo from your gallery.');
      }
    } finally {
      setIsInitializing(false);
    }
  }, [stream]);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const vWidth = video.videoWidth || 1280;
    const vHeight = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    canvas.width = vWidth;
    canvas.height = vHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flash animation
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(vWidth, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, vWidth, vHeight);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const ratio = vWidth / vHeight;
    setCapturedPreview(dataUrl);
    setCapturedRatio(ratio);
  };

  const handleRetake = () => {
    setCapturedPreview(null);
  };

  const handleConfirmCaptured = () => {
    if (capturedPreview) {
      onCapture(capturedPreview, capturedRatio);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFallbackUpload(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Hidden file input fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top action bar */}
      <div className="w-full max-w-lg z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onCancel}
          className="p-2 text-white/80 hover:text-white rounded-full bg-stone-900/40 backdrop-blur-md active:scale-95 transition-all"
          title="Cancel"
        >
          <X className="w-6 h-6" />
        </button>

        <span className="text-white text-xs font-medium uppercase tracking-widest">
          {capturedPreview ? 'Review Moment' : 'Capture Moment'}
        </span>

        {!capturedPreview && !errorMessage && (
          <button
            onClick={toggleCameraFacing}
            className="p-2 text-white/80 hover:text-white rounded-full bg-stone-900/40 backdrop-blur-md active:scale-95 transition-all"
            title="Switch Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
        {(capturedPreview || errorMessage) && <div className="w-10" />}
      </div>

      {/* Shutter flash overlay */}
      {flashActive && <div className="absolute inset-0 z-30 bg-white pointer-events-none transition-opacity" />}

      {/* Viewport / Preview */}
      <div className="relative flex-1 w-full max-w-lg flex items-center justify-center overflow-hidden">
        {errorMessage ? (
          <div className="p-6 text-center text-stone-200 max-w-xs space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-900/40 border border-amber-600/30 flex items-center justify-center mx-auto text-amber-300">
              <AlertCircle className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium leading-relaxed">{errorMessage}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-white text-stone-950 font-semibold text-sm rounded-xl hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Select from Device</span>
            </button>
          </div>
        ) : capturedPreview ? (
          <div className="relative w-full h-full flex items-center justify-center bg-stone-950 p-2">
            <img
              src={capturedPreview}
              alt="Captured preview"
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs tracking-wider uppercase">
                Opening Camera...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom control zone */}
      <div className="w-full max-w-lg z-20 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-around">
        {capturedPreview ? (
          <>
            <button
              onClick={handleRetake}
              className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold tracking-wide transition-all active:scale-95"
            >
              Retake
            </button>
            <button
              onClick={handleConfirmCaptured}
              className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold tracking-wide shadow-lg shadow-amber-900/40 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Use Photo</span>
            </button>
          </>
        ) : errorMessage ? (
          <button
            onClick={onCancel}
            className="text-stone-400 text-xs font-medium hover:text-white"
          >
            Cancel and Return
          </button>
        ) : (
          <>
            {/* Gallery picker button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Upload from device"
            >
              <ImageIcon className="w-6 h-6" />
            </button>

            {/* Big Shutter button */}
            <button
              onClick={handleTakePhoto}
              className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-90 transition-transform cursor-pointer"
              aria-label="Capture photo"
            >
              <div className="w-full h-full bg-white rounded-full hover:bg-stone-200 transition-colors shadow-inner" />
            </button>

            {/* Spacer for balance */}
            <div className="w-12 h-12" />
          </>
        )}
      </div>
    </div>
  );
};
