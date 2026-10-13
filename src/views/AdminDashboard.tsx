import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useWedding } from '../context/WeddingContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  Users,
  CreditCard,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Tag,
  Shield,
  Search,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { navigate } = useRouter();
  const { orders, events, packages, promoCodes } = useWedding();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'events' | 'packages' | 'promos'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.amount : 0), 0);
  const totalPaidOrders = orders.filter((o) => o.paymentStatus === 'PAID').length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar variant="dashboard" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-stone-900 text-white px-2 py-0.5 rounded font-bold">
                SAAS ADMIN PORTAL
              </span>
              <span className="text-xs text-stone-500">Platform Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Wedding Moments Operations
            </h1>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold px-4 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer"
          >
            Kembali ke Dashboard Pasangan →
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200 text-xs font-semibold scrollbar-none">
          {[
            { id: 'overview', label: 'Ringkasan Platform' },
            { id: 'orders', label: `Pesanan (${orders.length})` },
            { id: 'events', label: `Events (${events.length})` },
            { id: 'packages', label: `Konfigurasi Paket (${packages.length})` },
            { id: 'promos', label: `Promo Codes (${promoCodes.length})` }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === t.id ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-[11px] font-medium text-stone-500 uppercase">Total Revenue</span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  Rp{totalRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold">{totalPaidOrders} Transaksi Sukses</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-[11px] font-medium text-stone-500 uppercase">Active Events</span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  {events.length}
                </div>
                <p className="text-[11px] text-stone-500">Pernikahan Terdaftar</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-[11px] font-medium text-stone-500 uppercase">Pelanggan Aktif</span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  {orders.length}
                </div>
                <p className="text-[11px] text-stone-500">Pasangan Pengantin</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-[11px] font-medium text-stone-500 uppercase">Conversion Rate</span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
                  98.4%
                </div>
                <p className="text-[11px] text-stone-500">Checkout to Paid</p>
              </div>
            </div>

            {/* Quick list recent orders */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Transaksi Terbaru</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-stone-400 font-mono uppercase border-b border-stone-100">
                    <tr>
                      <th className="pb-2">Order ID</th>
                      <th className="pb-2">Nama Pasangan</th>
                      <th className="pb-2">Paket</th>
                      <th className="pb-2">Metode</th>
                      <th className="pb-2">Jumlah</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="py-2.5 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                        <td className="py-2.5">{o.customerName}</td>
                        <td className="py-2.5 font-semibold text-amber-900">{o.packageId}</td>
                        <td className="py-2.5">{o.paymentMethod}</td>
                        <td className="py-2.5 font-bold">Rp{o.amount.toLocaleString()}</td>
                        <td className="py-2.5">
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            {o.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Semua Pesanan Paket</h3>
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-stone-900">{o.orderNumber}</span>
                    <h4 className="font-bold text-sm text-stone-900 mt-0.5">{o.customerName} ({o.customerEmail})</h4>
                    <p className="text-stone-500 mt-0.5">WhatsApp: {o.customerWhatsapp} · Paket: {o.packageId}</p>
                  </div>
                  <div className="text-right sm:self-center">
                    <span className="text-base font-bold text-stone-900 block">Rp{o.amount.toLocaleString()}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold text-[10px] inline-block mt-1">
                      {o.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: PACKAGES */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
                <span className="text-[10px] font-mono uppercase bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                  {pkg.id}
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900">{pkg.name}</h3>
                <div className="text-2xl font-serif font-bold text-stone-900">{pkg.priceFormatted}</div>
                <p className="text-xs text-stone-500">Limit: {pkg.photoLimit.toLocaleString()} foto · {pkg.durationDays} hari</p>
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  {pkg.features.map((f, i) => (
                    <div key={i}>• {f}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: PROMOS */}
        {activeTab === 'promos' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Kode Diskon / Promo Aktif</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {promoCodes.map((p) => (
                <div key={p.code} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-1">
                  <span className="font-mono font-bold text-sm text-stone-900">{p.code}</span>
                  <p className="text-emerald-700 font-bold">Diskon {p.discountPercent}%</p>
                  <p className="text-stone-400 text-[10px]">Kedaluwarsa: {p.expiresAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
