import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { PackageTier } from '../types';
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles, CreditCard, QrCode } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { navigate } = useRouter();
  const { packages, promoCodes, createOrder } = useWedding();

  const searchParams = new URLSearchParams(window.location.search || '');
  const initialPkg = (searchParams.get('pkg') as PackageTier) || 'PREMIUM';

  const [selectedPackageId, setSelectedPackageId] = useState<PackageTier>(initialPkg);
  const [customerName, setCustomerName] = useState('Rizky & Aulia');
  const [customerEmail, setCustomerEmail] = useState('aulia.rizky@weddingmoments.love');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('081234567890');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('QRIS Instant');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessOrder, setIsSuccessOrder] = useState<any | null>(null);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId) || packages[1];
  const finalPrice = Math.max(0, selectedPkg.price - promoDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const found = promoCodes.find((p) => p.code === promoCodeInput.trim().toUpperCase() && p.active);
    if (found) {
      const discount = Math.round((selectedPkg.price * found.discountPercent) / 100);
      setPromoDiscount(discount);
      setAppliedPromo(found.code);
    } else {
      alert('Kode promo tidak valid atau telah kedaluwarsa.');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate instant payment verification
    setTimeout(() => {
      const order = createOrder({
        packageId: selectedPackageId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerWhatsapp: customerWhatsapp.trim(),
        paymentMethod,
        promoCode: appliedPromo || undefined
      });

      setIsProcessing(false);
      setIsSuccessOrder(order);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="public" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-14">
        {isSuccessOrder ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl text-center space-y-6 max-w-xl mx-auto animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-emerald-800 font-bold">
                Pembayaran Berhasil!
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Selamat Datang di Wedding Moments
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                Nomor Pesanan: <span className="font-mono font-bold text-stone-800">{isSuccessOrder.orderNumber}</span>
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Paket:</span>
                <span className="font-semibold text-stone-900">{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Dibayar:</span>
                <span className="font-semibold text-stone-900">Rp{isSuccessOrder.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Nama Akun:</span>
                <span className="font-semibold text-stone-900">{isSuccessOrder.customerName}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard/events/create')}
              className="w-full py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Mulai Buat Event Pernikahan Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-serif font-bold text-stone-900">Checkout Pemesanan</h1>
              <p className="text-xs sm:text-sm text-stone-500">Lengkapi data untuk mengaktifkan paket digital wedding Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Form Left */}
              <form onSubmit={handleCheckoutSubmit} className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">1. Pilih Paket</h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    {packages.map((pkg) => (
                      <button
                        type="button"
                        key={pkg.id}
                        onClick={() => {
                          setSelectedPackageId(pkg.id);
                          setPromoDiscount(0);
                          setAppliedPromo(null);
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          selectedPackageId === pkg.id
                            ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                        }`}
                      >
                        <span className="block text-xs font-bold">{pkg.name}</span>
                        <span className="block text-[10px] opacity-80 mt-0.5">{pkg.priceFormatted}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">2. Data Pemesan</h3>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Nama Pasangan / Pemesan *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="mis. Rizky & Aulia"
                      className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Email Aktif *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">No. WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      placeholder="081234567890"
                      className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">3. Metode Pembayaran</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['QRIS Instant', 'Virtual Account BCA/Mandiri'].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                          paymentMethod === m
                            ? 'border-stone-900 bg-stone-50 font-semibold text-stone-900'
                            : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-amber-900" />
                        <span>{m}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-amber-900 hover:bg-amber-800 disabled:bg-stone-400 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  {isProcessing ? (
                    <span>Memproses Pembayaran...</span>
                  ) : (
                    <>
                      <span>Bayar Sekarang (Rp{finalPrice.toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Order Summary Right */}
              <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Ringkasan Pesanan</h3>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-900">Paket {selectedPkg.name}</span>
                    <span className="font-bold text-stone-900">{selectedPkg.priceFormatted}</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Kapasitas {selectedPkg.photoLimit.toLocaleString()} foto · {selectedPkg.durationDays} hari akses aktif
                  </p>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between items-center text-xs text-emerald-700 font-semibold pt-2 border-t border-stone-200">
                      <span>Promo ({appliedPromo}):</span>
                      <span>-Rp{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Pembayaran:</span>
                    <span>Rp{finalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Promo form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Kode promo (mis. NIKAHBAHAGIA)"
                    className="flex-1 py-2 px-3 text-xs uppercase font-mono rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900"
                  />
                  <button
                    type="submit"
                    className="py-2 px-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Terapkan
                  </button>
                </form>

                <div className="text-[11px] text-stone-500 space-y-1">
                  <p className="flex items-center gap-1.5 text-stone-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Garansi aktivasi otomatis dalam 1 detik</span>
                  </p>
                  <p>Setelah pembayaran selesai, Anda akan langsung diarahkan untuk membuat event & mengunduh QR code meja.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
