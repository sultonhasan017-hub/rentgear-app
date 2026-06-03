"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/base";

export default function SewaBaru() {
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [loading, setLoading] = useState(true);

  // State input data pelanggan
  const [nama, setNama] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [medsos, setMedsos] = useState("");
  const [jaminan, setJaminan] = useState("KTP");
  const [barangTerpilih, setBarangTerpilih] = useState({});

  // Ambil daftar barang siap sewa
  useEffect(() => {
    async function ambilBarang() {
      const { data } = await supabase
        .from("barang")
        .select("*")
        .eq("status", "Tersedia");
      setDaftarBarang(data || []);
      setLoading(false);
    }
    ambilBarang();
  }, []);

  // Fungsi tambah/kurang kuantitas item sewa
  const ubahJumlahBarang = (id, jumlah) => {
    setBarangTerpilih((prev) => {
      const totalBaru = (prev[id] || 0) + jumlah;
      if (totalBaru <= 0) {
        const { [id]: _, ...sisa } = prev;
        return sisa;
      }
      return { ...prev, [id]: totalBaru };
    });
  };

  // Hitung total akumulasi harga sewa
  const hitungTotalHarga = () => {
    return Object.keys(barangTerpilih).reduce((total, id) => {
      const barang = daftarBarang.find((b) => b.id === parseInt(id));
      return total + (barang ? barang.harga * barangTerpilih[id] : 0);
    }, 0);
  };

  // Eksekusi transaksi penyimpanan dan penyelarasan WhatsApp
  const simpanTransaksi = async (e) => {
    e.preventDefault();

    if (Object.keys(barangTerpilih).length === 0) {
      alert("Silakan pilih minimal 1 barang terlebih dahulu!");
      return;
    }

    // Pembersihan nomor pintar
    let nomorBersih = whatsapp.replace(/[^0-9]/g, "");
    if (nomorBersih.startsWith("0")) {
      nomorBersih = "62" + nomorBersih.slice(1);
    }

    let barangNotaObj = {};
    Object.keys(barangTerpilih).forEach((id) => {
      const b = daftarBarang.find((item) => item.id === parseInt(id));
      if (b) barangNotaObj[b.nama] = barangTerpilih[id];
    });

    // Simpan data log transaksi baru
    const { error: errorTransaksi } = await supabase.from("transaksi").insert([
      {
        nama_penyewa: nama,
        whatsapp: nomorBersih,
        medsos: medsos,
        jaminan: jaminan,
        barang_disewa: barangNotaObj,
        total_harga: hitungTotalHarga(),
        status_sewa: "Aktif",
      },
    ]);

    if (errorTransaksi) {
      alert("Gagal menyimpan transaksi ke database!");
      return;
    }

    // Sinkronisasi pengurangan stok disewa di gudang
    for (const id in barangTerpilih) {
      const barangAsli = daftarBarang.find((item) => item.id === parseInt(id));
      if (barangAsli) {
        const jumlahBaru = (barangAsli.stok_disewa || 0) + barangTerpilih[id];
        await supabase
          .from("barang")
          .update({ stok_disewa: jumlahBaru })
          .eq("id", parseInt(id));
      }
    }

    // Penyusunan teks nota formal untuk pelanggan
    let textNota = `Halo ${nama},\n\nBerikut nota sewa alat gunung Anda:\n`;
    Object.entries(barangNotaObj).forEach(([namaBarang, jml]) => {
      textNota += `- ${namaBarang} (${jml}x)\n`;
    });
    textNota += `\nTotal Biaya: Rp ${hitungTotalHarga().toLocaleString("id-ID")}\nJaminan: ${jaminan}\nSosmed: ${medsos}\n\nTerima kasih banyak!`;

    const urlWA = `https://wa.me/${nomorBersih}?text=${encodeURIComponent(textNota)}`;

    alert(
      "Transaksi Berhasil Disimpan! Klik OK untuk mengirim nota via WhatsApp.",
    );
    window.location.href = urlWA;
  };

  return (
    /* Menggunakan layout kontainer mobile-first responsif yang sinkron dengan beranda */
    <div className="app-container">
      <header className="app-header flex items-center gap-4">
        <Link href="/" className="text-xl font-bold">
          ←
        </Link>
        <h1 className="text-xl font-bold">Formulir Sewa Baru</h1>
      </header>

      <main className="app-main space-y-6">
        <form onSubmit={simpanTransaksi} className="space-y-6">
          {/* Bagian 1: Pilih Barang */}
          <div className="form-card">
            <h2 className="form-section-title">1. Pilih Barang</h2>
            {loading ? (
              <p className="text-gray-500 py-2">Memuat daftar barang...</p>
            ) : (
              <div className="space-y-3">
                {daftarBarang.map((b) => (
                  <div
                    key={b.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {b.nama}
                      </p>
                      <p className="text-sm text-green-600 font-semibold">
                        Rp {b.harga.toLocaleString("id-ID")}/hari
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => ubahJumlahBarang(b.id, -1)}
                        className="bg-gray-200 px-3 py-1 rounded text-xl font-bold text-black"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold w-4 text-center text-black">
                        {barangTerpilih[b.id] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => ubahJumlahBarang(b.id, 1)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bagian 2: Data Penyewa */}
          <div className="form-card space-y-4">
            <h2 className="form-section-title">2. Data Penyewa</h2>
            <div>
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="form-input"
                placeholder="Contoh: Budi Santoso"
              />
            </div>
            <div>
              <label className="form-label">No. WhatsApp</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="form-input"
                placeholder="Contoh: 08123456789"
              />
            </div>
            <div>
              <label className="form-label">Media Sosial Penyewa</label>
              <input
                type="text"
                value={medsos}
                onChange={(e) => setMedsos(e.target.value)}
                className="form-input"
                placeholder="Contoh: @budisantoso_99"
              />
            </div>
            <div>
              <label className="form-label">Jenis Jaminan</label>
              <select
                value={jaminan}
                onChange={(e) => setJaminan(e.target.value)}
                className="form-input"
              >
                <option value="KTP">KTP Asli</option>
                <option value="SIM">SIM Asli</option>
                <option value="KK">Kartu Keluarga</option>
              </select>
            </div>
          </div>

          {/* Ringkasan & Tombol Kirim */}
          <div className="summary-box">
            <p className="text-sm opacity-80">Total Estimasi Sewa:</p>
            <p className="text-3xl font-extrabold text-green-400 mt-1">
              Rp {hitungTotalHarga().toLocaleString("id-ID")}
            </p>
          </div>

          <button type="submit" className="btn-submit-transaksi">
            💾 SIMPAN & KIRIM NOTA KE WA
          </button>
        </form>
      </main>
    </div>
  );
}
