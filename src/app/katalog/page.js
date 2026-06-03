"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/base";
import FormTambah from "./FormTambah";
import KartuBarang from "./KartuBarang";

export default function Katalog() {
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tampilkanForm, setTampilkanForm] = useState(false);

  // State untuk input data baru
  const [namaBaru, setNamaBaru] = useState("");
  const [hargaBaru, setHargaBaru] = useState("");
  const [stokBaru, setStokBaru] = useState("");

  const ambilData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("barang")
      .select("*")
      .order("nama", { ascending: true });
    setDaftarBarang(data || []);
    setLoading(false);
  };

  useEffect(() => {
    ambilData();
  }, []);

  const handleTambahBarang = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("barang").insert([
      {
        nama: namaBaru,
        harga: parseInt(hargaBaru),
        stok_total: parseInt(stokBaru),
        stok_disewa: 0,
        stok_dicuci: 0,
        stok_rusak: 0,
        status: "Tersedia",
      },
    ]);
    if (!error) {
      alert("Berhasil menambah barang!");
      setNamaBaru("");
      setHargaBaru("");
      setStokBaru("");
      setTampilkanForm(false);
      ambilData();
    }
  };

  const handleUbahTotalStok = async (id, operasi) => {
    const b = daftarBarang.find((x) => x.id === id);
    if (!b) return;
    let totalBaru = operasi === "tambah" ? b.stok_total + 1 : b.stok_total - 1;
    if (totalBaru < b.stok_disewa + b.stok_dicuci + b.stok_rusak)
      return alert("Stok tidak bisa dikurangi!");
    await supabase
      .from("barang")
      .update({ stok_total: totalBaru })
      .eq("id", id);
    ambilData();
  };

  const handleUbahStokKondisi = async (id, kolom, operasi) => {
    const b = daftarBarang.find((x) => x.id === id);
    if (!b) return;
    let nilaiBaru =
      operasi === "tambah" ? (b[kolom] || 0) + 1 : (b[kolom] || 0) - 1;
    const sisa = b.stok_total - b.stok_disewa - b.stok_dicuci - b.stok_rusak;
    if (nilaiBaru < 0 || (operasi === "tambah" && sisa <= 0)) return;
    await supabase
      .from("barang")
      .update({ [kolom]: nilaiBaru })
      .eq("id", id);
    ambilData();
  };

  return (
    /* Menggunakan kontainer mobile-first responsif terpadu */
    <div className="app-container">
      <header className="app-header flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">
            ←
          </Link>
          <h1 className="text-xl font-bold">Manajemen Katalog</h1>
        </div>
        <button
          onClick={() => setTampilkanForm(!tampilkanForm)}
          className="bg-white text-green-700 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md active:scale-95 transition-all cursor-pointer"
        >
          {tampilkanForm ? "Batal" : "➕ Alat Baru"}
        </button>
      </header>

      <main className="app-main">
        {tampilkanForm && (
          <FormTambah
            onSubmit={handleTambahBarang}
            nama={namaBaru}
            setNama={setNamaBaru}
            harga={hargaBaru}
            setHarga={setHargaBaru}
            stok={stokBaru}
            setStok={setStokBaru}
          />
        )}

        {loading ? (
          <p className="text-center text-gray-500 py-10 text-lg font-medium">
            Memuat katalog...
          </p>
        ) : (
          daftarBarang.map((item) => (
            <KartuBarang
              key={item.id}
              item={item}
              onUbahTotal={handleUbahTotalStok}
              onUbahKondisi={handleUbahStokKondisi}
            />
          ))
        )}
      </main>
    </div>
  );
}
