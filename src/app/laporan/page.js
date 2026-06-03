"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/base";

export default function Laporan() {
  const [semuaRiwayat, setSemuaRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk filter bulan & tahun (Default: Bulan & Tahun Sekarang)
  const tanggalSekarang = new Date();
  const [bulanPilihan, setBulanPilihan] = useState(
    tanggalSekarang.getMonth() + 1,
  );
  const [tahunPilihan, setTahunPilihan] = useState(
    tanggalSekarang.getFullYear(),
  );

  // 1. Ambil data dari Supabase HANYA SATU KALI saat halaman dibuka
  useEffect(() => {
    async function ambilLaporan() {
      const { data } = await supabase
        .from("transaksi")
        .select("*")
        .eq("status_sewa", "Selesai")
        .order("created_at", { ascending: false });

      setSemuaRiwayat(data || []);
      setLoading(false);
    }
    ambilLaporan();
  }, []);

  // 2. JALUR OPTIMAL: Saring data langsung di variabel tanpa memicu useEffect kedua (Anti-Eror)
  const riwayatFilter = semuaRiwayat.filter((item) => {
    const tglItem = new Date(item.created_at);
    const bulanMatch = tglItem.getMonth() + 1 === parseInt(bulanPilihan);
    const tahunMatch = tglItem.getFullYear() === parseInt(tahunPilihan);
    return bulanMatch && tahunMatch;
  });

  // Hitung total kalkulasi rekap bulanan langsung dari hasil saringan
  let rekapSewa = 0;
  let rekapDenda = 0;
  riwayatFilter.forEach((item) => {
    rekapSewa += item.total_harga || 0;
    rekapDenda += item.denda || 0;
  });
  const totalTransaksi = riwayatFilter.length;

  const picuCetak = () => {
    window.print();
  };

  const daftarBulan = [
    { nama: "Januari", nilai: 1 },
    { nama: "Februari", nilai: 2 },
    { nama: "Maret", nilai: 3 },
    { nama: "April", nilai: 4 },
    { nama: "Mei", nilai: 5 },
    { nama: "Juni", nilai: 6 },
    { nama: "Juli", nilai: 7 },
    { nama: "Agustus", nilai: 8 },
    { nama: "September", nilai: 9 },
    { nama: "Oktober", nilai: 10 },
    { nama: "November", nilai: 11 },
    { nama: "Desember", nilai: 12 },
  ];

  return (
    /* Menggunakan kontainer mobile-first responsif terpadu */
    <div className="app-container">
      {/* HEADER ATAS (Sembunyi saat diprint melalui utility 'print:hidden') */}
      <header className="app-header flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">
            ←
          </Link>
          <h1 className="text-xl font-bold">Laporan Keuangan</h1>
        </div>
        <button
          onClick={picuCetak}
          className="bg-white text-green-700 font-bold px-3 py-1.5 rounded-lg text-sm shadow-md active:scale-95 transition-all cursor-pointer"
        >
          🖨️ Cetak / PDF
        </button>
      </header>

      <main className="app-main">
        {/* AREA PENCETAKAN (Hanya muncul saat kertas diprint) */}
        <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase text-black">
            REKAPITULASI BULANAN RENT GEAR
          </h1>
          <p className="text-sm text-black mt-1">
            Laporan Omzet Resmi Penyewaan Alat Outdoor
          </p>
          <p className="text-base font-bold text-black mt-2">
            Periode:{" "}
            {daftarBulan.find((b) => b.nilai === parseInt(bulanPilihan))?.nama}{" "}
            {tahunPilihan}
          </p>
        </div>

        {/* 📋 PILIHAN FILTER BULANAN (Sembunyi saat diprint) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-2 gap-2 print:hidden">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Pilih Bulan
            </label>
            <select
              value={bulanPilihan}
              onChange={(e) => setBulanPilihan(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg text-base bg-white text-black"
            >
              {daftarBulan.map((b) => (
                <option key={b.nilai} value={b.nilai}>
                  {b.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Pilih Tahun
            </label>
            <select
              value={tahunPilihan}
              onChange={(e) => setTahunPilihan(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg text-base bg-white text-black"
            >
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>

        {/* 📊 KOTAK DASHBOARD REKAP (Otomatis beradaptasi warna saat diprint) */}
        <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg space-y-3 print:bg-white print:text-black print:border print:border-black print:shadow-none">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400 print:text-black">
            Total Pendapatan Bersih Periode Ini
          </p>
          <p className="text-center text-3xl font-extrabold text-green-400 print:text-black print:text-2xl">
            Rp {(rekapSewa + rekapDenda).toLocaleString("id-ID")}
          </p>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800 text-center text-xs print:border-black">
            <div>
              <p className="text-gray-400 print:text-black">Uang Sewa</p>
              <p className="font-bold text-sm text-white print:text-black">
                Rp {rekapSewa.toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-gray-400 print:text-black">Uang Denda</p>
              <p className="font-bold text-sm text-yellow-400 print:text-black">
                Rp {rekapDenda.toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-gray-400 print:text-black">Transaksi</p>
              <p className="font-bold text-sm text-white print:text-black">
                {totalTransaksi} Kali
              </p>
            </div>
          </div>
        </div>

        {/* 📜 DETAIL RIWAYAT TRANSAKSI */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800 print:text-base print:font-bold print:mt-4">
            Rincian Daftar Transaksi Selesai:
          </h2>

          {loading ? (
            <p className="text-center py-4 text-gray-500">Memuat data...</p>
          ) : riwayatFilter.length === 0 ? (
            <p className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-xl bg-white">
              Tidak ada data transaksi sukses pada periode bulan ini.
            </p>
          ) : (
            riwayatFilter.map((r) => (
              <div
                key={r.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-1 print:shadow-none print:border-b print:rounded-none print:p-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-900 text-lg print:text-sm">
                      {r.nama_penyewa}
                    </span>
                    <p className="text-xs text-gray-400 print:text-gray-600">
                      {new Date(r.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-bold text-base print:text-sm">
                      +Rp{" "}
                      {((r.total_harga || 0) + (r.denda || 0)).toLocaleString(
                        "id-ID",
                      )}
                    </span>
                    <p className="text-xs text-gray-400 print:hidden">
                      WA: {r.whatsapp}
                    </p>
                  </div>
                </div>

                {r.denda > 0 && (
                  <div className="bg-red-50 p-2 rounded mt-1.5 text-xs text-red-900 border border-red-100 print:bg-white print:text-black print:border-none print:p-0">
                    <span className="font-bold">⚠️ Denda (Manual):</span> Rp{" "}
                    {r.denda.toLocaleString("id-ID")} |{" "}
                    <span className="italic">
                      Alasan: {r.catatan_denda || "-"}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
