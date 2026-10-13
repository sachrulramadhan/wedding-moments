import React from 'react';
import { useRouter } from '../router/Router';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { QrCode, Camera, Heart, ShieldCheck, Download, Users, ArrowRight, Eye } from 'lucide-react';

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

      {/* Hero */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden px-4 sm:px-8 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-stone-900 leading-[1.08] text-balance">
              Abadikan Setiap Momen<br />
              <span className="italic font-normal text-amber-950">Pernikahan Anda.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              Tamu scan QR code → langsung buka kamera → foto masuk ke album pernikahan Anda secara real-time. Tanpa instal aplikasi.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigate('/dashboard/events/create')}
                className="px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buat Event Pernikahan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/event/aulia-rizky-2026')}
                className="px-7 py-3.5 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm rounded-full border border-stone-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-800" />
                <span>Lihat Demo</span>
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
              <span>✓ Gratis</span>
              <span>✓ Tanpa login tamu</span>
              <span>✓ QR siap cetak</span>
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
                <h3 className="text-2xl font-serif font-bold">Aulia & Rizky</h3>
                <p className="text-xs text-stone-300 font-serif italic mt-0.5">12 Desember 2026 · Cliffside Villa, Bali</p>
                <div className="mt-3">
                  <button
                    onClick={() => navigate('/event/aulia-rizky-2026')}
                    className="text-xs font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer w-fit"
                  >
                    <span>Buka Halaman Tamu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-8 bg-white border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">Cara Kerja</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: <QrCode className="w-8 h-8 text-stone-800" />, title: 'Buat & Cetak QR', desc: 'Buat event dalam 1 menit, unduh QR code, cetak di kartu meja.' },
              { step: '2', icon: <Camera className="w-8 h-8 text-amber-800" />, title: 'Tamu Scan & Foto', desc: 'Tamu arahkan kamera ke QR → langsung buka di browser, tanpa daftar akun.' },
              { step: '3', icon: <Heart className="w-8 h-8 text-rose-600" />, title: 'Album Langsung Terisi', desc: 'Foto masuk ke galeri real-time. Kelola, favoritkan, dan unduh semua foto.' },
            ].map((item) => (
              <div key={item.step} className="bg-stone-50 p-6 rounded-3xl border border-stone-200/80 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-900 text-stone-50 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">{item.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed mt-1">{item.desc}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-center mt-auto">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-8 bg-stone-50 border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">Fitur Utama</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Camera className="w-5 h-5" />, title: 'Kamera In-Browser', desc: 'Tamu foto langsung dari browser, tanpa unduh apapun.' },
              { icon: <ShieldCheck className="w-5 h-5" />, title: 'Moderasi Foto', desc: 'Pilih auto-approve atau tinjau manual sebelum foto tampil.' },
              { icon: <Heart className="w-5 h-5" />, title: 'Dinding Ucapan', desc: 'Tamu tinggalkan ucapan selamat yang bisa dibaca kapan saja.' },
              { icon: <Download className="w-5 h-5" />, title: 'Unduh Semua Foto', desc: 'Simpan foto resolusi asli ke komputer atau cloud.' },
              { icon: <span className="text-base">❤️</span>, title: 'Reaksi Tamu', desc: 'Tamu beri reaksi ❤️ 😍 👏 tanpa perlu login.' },
              { icon: <Users className="w-5 h-5" />, title: 'Kontrol Privasi', desc: 'Publik atau privat dengan kode akses khusus tamu.' },
            ].map((f) => (
              <div key={f.title} className="bg-white p-5 rounded-2xl border border-stone-200/80 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center">{f.icon}</div>
                <h4 className="text-sm font-bold text-stone-900">{f.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 px-4 sm:px-8 bg-white border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">Galeri Langsung</h2>
            <button
              onClick={() => navigate('/event/aulia-rizky-2026/gallery')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-stone-950 underline underline-offset-4 cursor-pointer"
            >
              Lihat semua foto <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { img: toastImg, guest: 'Maya & Dimas', caption: '"Cheers!"' },
              { img: laughterImg, guest: 'Clara & Bridesmaids', caption: '"Pengantin cantik!"' },
              { img: ringsImg, guest: 'Tari', caption: '"Cincin & janji suci"' },
              { img: danceImg, guest: 'Aditya', caption: '"First dance!"' },
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

      {/* CTA */}
      <section className="py-16 px-4 sm:px-8 bg-stone-900 text-stone-100 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Siap buat album foto pernikahan digital?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/dashboard/events/create')}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-100 text-amber-950 hover:bg-white font-semibold text-sm rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Buat Event Sekarang
            </button>
            <button
              onClick={() => navigate('/event/aulia-rizky-2026')}
              className="w-full sm:w-auto px-8 py-3.5 bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 font-semibold text-sm rounded-full transition-all cursor-pointer"
            >
              Lihat Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
