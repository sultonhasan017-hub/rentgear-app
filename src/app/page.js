"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/base";

export default function Home() {
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function ambilData() {
      const { data } = await supabase.from("barang").select("*");
      setDaftarBarang(data || []);
      setLoading(false);
    }
    ambilData();
  }, []);

  return (
    /* Menggunakan kelas kustom dari globals.css */
    <div className="app-container">
      <header className="app-header">
        <h1 className="text-2xl font-bold tracking-wide">RENT GEAR</h1>
        <p className="text-sm opacity-90">Sistem Pengelola Alat Gunung</p>
      </header>

      <main className="app-main">
        {/* MENU NAVIGASI TOMBOL KOTAK BESAR */}
        <div>
          <h2 className="section-title">Menu Utama:</h2>
          <div className="menu-grid">
            <button
              onClick={() => (window.location.href = "/sewa-baru")}
              className="btn-menu-green"
            >
              <span className="text-3xl">➕</span> Catat Sewa
            </button>
            <button
              onClick={() => (window.location.href = "/pengembalian")}
              className="btn-menu-red"
            >
              <span className="text-3xl">🔄</span> Kembali Alat
            </button>
            <button
              onClick={() => (window.location.href = "/katalog")}
              className="btn-menu-blue"
            >
              <span className="text-3xl">📦</span> Atur Katalog
            </button>
            <button
              onClick={() => (window.location.href = "/laporan")}
              className="btn-menu-dark"
            >
              <span className="text-3xl">📊</span> Keuangan
            </button>
          </div>
        </div>

        {/* RINGKASAN STOK REALTIME */}
        <div>
          <h2 className="section-title">Sisa Stok Siap Sewa Hari Ini:</h2>
          {loading ? (
            <p className="text-gray-500 font-medium text-center py-4">
              Memuat data...
            </p>
          ) : (
            <div className="space-y-2">
              {daftarBarang.map((item) => {
                const sisaAkurat =
                  item.stok_total -
                  (item.stok_disewa || 0) -
                  (item.stok_dicuci || 0) -
                  (item.stok_rusak || 0);

                return (
                  <div key={item.id} className="stok-card">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {item.nama}
                      </p>
                      <p className="text-sm text-gray-500">
                        Di Rak:{" "}
                        <span className="font-bold text-green-700 text-base">
                          {sisaAkurat}
                        </span>{" "}
                        dari {item.stok_total} unit
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        sisaAkurat > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sisaAkurat > 0 ? "Tersedia" : "Habis"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
