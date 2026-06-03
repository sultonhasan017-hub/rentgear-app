"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../utils/base";

export default function Pengembalian() {
  const [daftarTransaksi, setDaftarTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transaksiTerpilih, setTransaksiTerpilih] = useState(null);

  // State untuk input denda manual ramah orang tua
  const [denda, setDenda] = useState("0");
  const [catatanDenda, setCatatanDenda] = useState("");

  // Ambil data transaksi aktif
  useEffect(() => {
    async function ambilTransaksi() {
      const { data } = await supabase
        .from("transaksi")
        .select("*")
        .eq("status_sewa", "Aktif");
      setDaftarTransaksi(data || []);
      setLoading(false);
    }
    ambilTransaksi();
  }, []);

  // Fungsi memproses pengembalian alat dan sinkronisasi stok balik ke rak
  const prosesKembali = async (e) => {
    e.preventDefault();
    if (!transaksiTerpilih) return;

    // 1. UPDATE STATUS TRANSAKSI JADI SELESAI
    const { error: errorTransaksi } = await supabase
      .from("transaksi")
      .update({
        status_sewa: "Selesai",
        denda: parseInt(denda) || 0,
        catatan_denda: catatanDenda,
      })
      .eq("id", transaksiTerpilih.id);

    if (errorTransaksi) {
      alert("Gagal memproses pengembalian di database!");
      return;
    }

    // 2. KEMBALIKAN STOK BARANG KE KATALOG
    const { data: semuaBarang } = await supabase.from("barang").select("*");

    if (semuaBarang && transaksiTerpilih.barang_disewa) {
      for (const [namaBarang, jumlahKembali] of Object.entries(
        transaksiTerpilih.barang_disewa,
      )) {
        const barangAsli = semuaBarang.find((b) => b.nama === namaBarang);
        if (barangAsli) {
          let jumlahDisewaBaru = (barangAsli.stok_disewa || 0) - jumlahKembali;
          if (jumlahDisewaBaru < 0) jumlahDisewaBaru = 0;

          await supabase
            .from("barang")
            .update({ stok_disewa: jumlahDisewaBaru })
            .eq("id", barangAsli.id);
        }
      }
    }

    alert(
      "Pengembalian Berhasil Diproses! Stok barang telah kembali ketersediaannya.",
    );
    window.location.reload();
  };

  return (
    /* Menggunakan pembungkus responsif mobile-first global */
    <div className="app-container">
      <header className="app-header flex items-center gap-4">
        <Link href="/" className="text-xl font-bold">
          ←
        </Link>
        <h1 className="text-xl font-bold">Proses Pengembalian</h1>
      </header>

      <main className="app-main">
        {/* JIKA BELUM MEMILIH TRANSAKSI: Tampilkan Daftar Pelanggan Aktif */}
        {!transaksiTerpilih ? (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Pilih Penyewa Aktif:
            </h2>
            {loading ? (
              <p className="text-center py-4 text-black">
                Memuat data penyewa...
              </p>
            ) : daftarTransaksi.length === 0 ? (
              <p className="text-center py-10 text-gray-500 text-lg font-medium">
                Tidak ada sewaan aktif saat ini.
              </p>
            ) : (
              daftarTransaksi.map((t) => (
                <div key={t.id} className="stok-card">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {t.nama_penyewa}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Daftar Barang:</p>
                    <ul className="text-sm font-semibold text-gray-800 list-disc list-inside pl-1">
                      {t.barang_disewa &&
                      typeof t.barang_disewa === "object" ? (
                        Object.entries(t.barang_disewa).map(
                          ([nama, jumlah]) => (
                            <li key={nama}>
                              {nama} ({jumlah}x)
                            </li>
                          ),
                        )
                      ) : (
                        <li>Gagal memuat daftar barang</li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={() => setTransaksiTerpilih(t)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded-lg shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Proses
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          /* JIKA SUDAH MEMILIH TRANSAKSI: Tampilkan Formulir Denda Manual */
          <form onSubmit={prosesKembali} className="form-card space-y-5">
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-500">Nama Penyewa:</p>
              <p className="text-2xl font-bold text-gray-900">
                {transaksiTerpilih.nama_penyewa}
              </p>
            </div>

            <div>
              <label className="form-label">Masukkan Denda Manual (Rp)</label>
              <input
                type="number"
                value={denda}
                onChange={(e) => setDenda(e.target.value)}
                className="form-input font-bold text-xl"
                placeholder="Isi 0 jika tidak ada denda"
              />
              <p className="text-xs text-gray-500 mt-1">
                *Isi manual jika alat robek kena badai, kotor, atau telat.
              </p>
            </div>

            <div>
              <label className="form-label">Catatan / Alasan Denda</label>
              <textarea
                value={catatanDenda}
                onChange={(e) => setCatatanDenda(e.target.value)}
                className="form-input h-24 text-base resize-none"
                placeholder="Contoh: Flysheet robek sedikit terkena angin badai di puncak gunung."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTransaksiTerpilih(null)}
                className="w-1/3 bg-gray-200 text-gray-800 font-bold py-4 rounded-xl text-lg active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                SELESAIKAN SEWA
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
