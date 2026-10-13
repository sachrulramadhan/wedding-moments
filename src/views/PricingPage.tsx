import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { PackageTier } from '../types';

export const PricingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { packages } = useWedding();
  const [billingCycle, setBillingCycle] = useState<'per_event'>('per_event');

  const handleSelectPackage = (pkgId: PackageTier) => {
    navigate(`/checkout?pkg=${pkgId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="public" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-widest text-amber-900 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block">
            Paket Digital Wedding Moments
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Pilihan Paket Pernikahan
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Satu kali bayar per acara pernikahan. Tanpa biaya tersembunyi, langsung aktif dengan QR code siap cetak.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between relative ${
                pkg.isPopular
                  ? 'border-stone-900 shadow-xl ring-2 ring-stone-900/10'
                  : 'border-stone-200/90 shadow-sm hover:shadow-md'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-900 text-amber-100 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Paling Diminati</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">{pkg.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                      {pkg.priceFormatted}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">/ acara</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Akses aktif {pkg.durationDays} hari · Kapasitas {pkg.photoLimit.toLocaleString()} foto
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2.5">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                    Fitur Termasuk:
                  </span>
                  <ul className="space-y-2 text-xs text-stone-700">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100">
                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 ${
                    pkg.isPopular
                      ? 'bg-stone-900 hover:bg-stone-800 text-white'
                      : 'bg-amber-900/10 hover:bg-amber-900 text-amber-950 hover:text-white border border-amber-900/20'
                  }`}
                >
                  <span>Pilih Paket {pkg.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="max-w-3xl mx-auto p-5 bg-white rounded-2xl border border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Garansi Keamanan & Privasi 100%</h4>
              <p className="text-[11px] text-stone-500">Foto tersimpan aman di cloud berkecepatan tinggi dengan proteksi privasi.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/event/aulia-rizky-2026')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-4 shrink-0 cursor-pointer"
          >
            Lihat Demo Langsung →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
