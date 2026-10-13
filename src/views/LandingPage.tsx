import React from 'react';
import { useRouter } from '../router/Router';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { QrCode, Camera, Heart, ShieldCheck, Download, Users, ArrowRight, Eye, Sparkles, Check, ChevronDown } from 'lucide-react';
import { PACKAGES } from '../services/storage';

import heroCoupleImg from '../assets/images/hero_wedding_couple_1791659951473.jpg';
import toastImg from '../assets/images/wedding_moment_toast_1791659963751.jpg';
import danceImg from '../assets/images/wedding_moment_dance_1791659975340.jpg';
import ringsImg from '../assets/images/wedding_moment_rings_1791659986049.jpg';
import laughterImg from '../assets/images/wedding_moment_laughter_1791659996411.jpg';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="public" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden px-4 sm:px-8 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200/60 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Digital Wedding Memory SaaS Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-stone-900 leading-[1.08] text-balance">
              Every Guest. Every Moment. <br />
              <span className="italic font-normal text-amber-950">One Beautiful Memory.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              Abadikan setiap momen tulus yang tidak sempat Anda lihat di pelaminan. Tamu cukup scan QR code di meja untuk mengambil foto, menulis ucapan, dan membangun galeri pernikahan Anda secara real-time.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigate('/pricing')}
                className="px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mulai Buat Pernikahan Anda</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/event/aulia-rizky-2026')}
                className="px-7 py-3.5 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm rounded-full border border-stone-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-800" />
                <span>Lihat Live Demo Tamu</span>
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-stone-500">
              <span className="flex items-center gap-1">✓ Tanpa Unduh Aplikasi</span>
              <span className="flex items-center gap-1">✓ Tamu Tanpa Perlu Login</span>
              <span className="flex items-center gap-1">✓ QR Code & Live Display Siap Pakai</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 bg-stone-100 group">
              <img
                src={heroCoupleImg}
                alt="Foto Pengantin"
                className="w-full h-[440px] sm:h-[500px] object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold">Featured Celebration</span>
                <h3 className="text-2xl font-serif font-bold">Aulia & Rizky</h3>
                <p className="text-xs text-stone-300 font-serif italic mt-0.5">12 Desember 2026 · Cliffside Villa, Bali</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate('/event/aulia-rizky-2026')}
                    className="text-xs font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Pengalaman Tamu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate('/event/aulia-rizky-2026/live')}
                    className="text-xs font-semibold bg-amber-900/80 hover:bg-amber-900 px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Live TV Wall</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-8 bg-white border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">Cara Kerja Praktis</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Mudah untuk Tamu. Bahagia untuk Pengantin.
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
              Tidak perlu kamera sekali pakai yang mahal untuk dicuci. Jadikan setiap smartphone tamu sebagai lensa pernikahan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                icon: <QrCode className="w-8 h-8 text-stone-800" />,
                title: 'Pilih Paket & Dapatkan QR',
                desc: 'Pilih paket, selesaikan pembayaran, dan download kartu QR meja yang elegan untuk dicetak di meja resepsi.'
              },
              {
                step: '2',
                icon: <Camera className="w-8 h-8 text-amber-800" />,
                title: 'Tamu Scan & Ambil Foto',
                desc: 'Tamu arahkan kamera HP ke QR Code. Halaman terbuka instan di Safari/Chrome tanpa login atau kata sandi.'
              },
              {
                step: '3',
                icon: <Heart className="w-8 h-8 text-rose-600" />,
                title: 'Album Live & Digital Book',
                desc: 'Foto mengalir real-time ke galeri pengantin & layar live proyektor. Kurasi menjadi digital album dalam 1 klik.'
              }
            ].map((item) => (
              <div key={item.step} className="bg-stone-50 p-6 rounded-3xl border border-stone-200/80 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-900 text-stone-50 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">{item.desc}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-center mt-auto">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section on Landing */}
      <section id="pricing" className="py-20 px-4 sm:px-8 bg-stone-50 border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">Harga Transparan</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Pilihan Paket Wedding Moments
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Sekali bayar untuk seluruh acara pernikahan Anda. Tanpa langganan bulanan yang membingungkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border flex flex-col justify-between relative ${
                  pkg.isPopular ? 'border-stone-900 shadow-xl ring-2 ring-stone-900/10' : 'border-stone-200/90 shadow-sm'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-900 text-amber-100 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Paling Favorit
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900">{pkg.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-serif font-bold text-stone-900">{pkg.priceFormatted}</span>
                      <span className="text-xs text-stone-500 font-medium">/ acara</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">Akses {pkg.durationDays} hari · s/d {pkg.photoLimit.toLocaleString()} foto</p>
                  </div>

                  <ul className="space-y-2 text-xs text-stone-700 pt-3 border-t border-stone-100">
                    {pkg.features.slice(0, 5).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-100">
                  <button
                    onClick={() => navigate(`/checkout?pkg=${pkg.id}`)}
                    className={`w-full py-3.5 rounded-2xl font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      pkg.isPopular ? 'bg-stone-900 hover:bg-stone-800 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    <span>Beli Paket {pkg.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="py-16 px-4 sm:px-8 bg-white border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">Koleksi Momen Nyata</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                Dari Sudut Pandang Tamu
              </h2>
            </div>
            <button
              onClick={() => navigate('/event/aulia-rizky-2026/gallery')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-stone-950 underline underline-offset-4 cursor-pointer"
            >
              Lihat galeri demo lengkap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { img: toastImg, guest: 'Maya & Dimas', caption: '"Cheers to both of you!"' },
              { img: laughterImg, guest: 'Clara & Bridesmaids', caption: '"Senyum bahagia Aulia"' },
              { img: ringsImg, guest: 'Tari (Adik Pengantin)', caption: '"Momen haru janji suci"' },
              { img: danceImg, guest: 'Aditya Pratama', caption: '"Dansa pertama yang magis"' }
            ].map((item) => (
              <div key={item.guest} className="rounded-2xl overflow-hidden border border-stone-200 group relative">
                <img src={item.img} alt={item.guest} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <span className="text-xs font-semibold">{item.guest}</span>
                  <span className="text-[11px] text-stone-300 font-serif italic">{item.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-8 bg-stone-900 text-stone-100 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Siap Abadikan Setiap Momen Bahagia Anda?
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Daftarkan pernikahan Anda, pasang kartu QR di meja resepsi, dan nikmati ribuan foto otentik dari para tamu tercinta.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-100 text-amber-950 hover:bg-white font-semibold text-sm rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Lihat Paket & Mulai
            </button>
            <button
              onClick={() => navigate('/event/aulia-rizky-2026')}
              className="w-full sm:w-auto px-8 py-3.5 bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 font-semibold text-sm rounded-full transition-all cursor-pointer"
            >
              Coba Live Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
