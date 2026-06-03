export default function FormTambah({
  onSubmit,
  nama,
  setNama,
  harga,
  setHarga,
  stok,
  setStok,
}) {
  return (
    <form onSubmit={onSubmit} className="form-card space-y-4 text-black">
      <h2 className="text-lg font-bold text-gray-800">
        Tambah Alat Gunung Baru
      </h2>

      <div>
        <label className="form-label">Nama Alat</label>
        <input
          type="text"
          required
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="form-input"
          placeholder="Contoh: Hammock"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="form-label">Harga Sewa / Hari</label>
          <input
            type="number"
            required
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            className="form-input"
            placeholder="20000"
          />
        </div>
        <div>
          <label className="form-label">Stok Awal Toko</label>
          <input
            type="number"
            required
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            className="form-input"
            placeholder="5"
          />
        </div>
      </div>

      <button type="submit" className="btn-submit-transaksi py-3 text-lg">
        💾 SIMPAN ALAT BARU
      </button>
    </form>
  );
}
