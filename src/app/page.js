"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/base";
import { getCookie, deleteCookie } from "cookies-next";

export default function Home() {
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Kembalikan state roleUser agar nilainya sinkron saat proses render pertama
  const [roleUser, setRoleUser] = useState("");

  useEffect(() => {
    // 2. Baca data cookie HANYA di dalam useEffect (Sisi Client/HP) agar server tidak bingung
    const statusLogin = getCookie("user_logged_in");
    const peranUser = getCookie("user_role") || "";

    // Jika belum login, usir seketika
    if (statusLogin !== "true" || !peranUser) {
      window.location.href = "/login";
      return;
    }

    // Set nilai ke state secara aman
    setRoleUser(peranUser);

    // Ambil data barang dari database
    async function ambilData() {
      const { data } = await supabase.from("barang").select("*");
      setDaftarBarang(data || []);
      setLoading(false);
    }
    ambilData();
  }, []); // Kosongkan dependency array agar fungsi ini dipanggil tepat satu kali

  // Fungsi untuk proses keluar akun (Logout)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    deleteCookie("user_logged_in");
    deleteCookie("user_role");
    alert("Anda telah keluar dari sistem.");
    window.location.href = "/login";
  };

  return (
    <div className="app-container">
      {/* HEADER ATAS + TOMBOL LOGOUT */}
      <header className="app-header flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">RENT GEAR</h1>
          <p className="text-sm opacity-90">
            Jabatan:{" "}
            <span className="font-extrabold underline">
              {roleUser || "Memuat..."}
            </span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-700 text-white font-bold border border-red-500 px-3 py-1.5 rounded-xl text-xs shadow active:scale-95 transition-all cursor-pointer"
        >
          🚪 Keluar
        </button>
      </header>

      <main className="app-main">
        {/* MENU NAVIGASI TOMBOL KOTAK BESAR (SISTEM MULTI-USER) */}
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

            {/* HANYA SUPER ADMIN YANG BISA MELIHAT DUA MENU DI BAWAH INI */}
            {roleUser === "Super Admin" && (
              <>
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
              </>
            )}
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
