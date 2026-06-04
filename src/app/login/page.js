"use client";
import { useState } from "react";
import { supabase } from "../../utils/base";
import { setCookie } from "cookies-next";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailBersih = email.trim();

      // 1. Proses Autentikasi ke Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: emailBersih,
          password,
        });

      if (authError) {
        alert(`Gagal Masuk Autentikasi: ${authError.message}`);
        return;
      }

      const userUid = authData.user?.id?.trim().toLowerCase();

      // CETAK PELACAK 1: Pastikan UID terambil dengan benar di konsol browser
      console.log("UID Pengguna Berhasil Login:", userUid);

      // 2. Ambil data ROLE dari tabel profil
      const { data: profilData, error: profilError } = await supabase
        .from("profil")
        .select("role")
        .eq("id_user", userUid)
        .maybeSingle();

      // CETAK PELACAK 2: Melihat apakah ada pesan eror tersembunyi dari database
      if (profilError) {
        console.error("Eror Database Supabase Saat Ambil Profil:", profilError);
        alert(`Eror Sistem Database: ${profilError.message}`);
        return;
      }

      // CETAK PELACAK 3: Melihat hasil data yang berhasil ditarik
      console.log("Hasil Data Profil dari Supabase:", profilData);

      if (!profilData) {
        alert(
          `Gagal Cocok! UID Anda (${userUid}) tidak ditemukan di tabel 'profil' Supabase. Silakan cek kembali baris data di database Anda.`,
        );
        return;
      }

      let roleFix = profilData.role.trim();
      if (roleFix.toLowerCase() === "super admin") roleFix = "Super Admin";
      if (roleFix.toLowerCase() === "admin") roleFix = "Admin";

      setCookie("user_role", roleFix, { maxAge: 60 * 60 * 24 * 7 });
      setCookie("user_logged_in", "true", { maxAge: 60 * 60 * 24 * 7 });

      alert(`Selamat datang! Anda masuk sebagai ${roleFix}`);
      window.location.href = "/";
    } catch (err) {
      console.error("Sistem Hancur/Crash:", err);
      alert("Terjadi kesalahan sistem internal, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container justify-center bg-gray-50">
      <div className="form-card mx-4 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-green-700 tracking-wide">
            RENT GEAR
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Silakan masuk ke sistem pengelola
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="form-label">Email Pengguna</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="form-label">Kata Sandi (Password)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="******"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit-transaksi mt-2"
          >
            {loading ? "Memverifikasi..." : "🔑 MASUK SEKARANG"}
          </button>
        </form>
      </div>
    </div>
  );
}
