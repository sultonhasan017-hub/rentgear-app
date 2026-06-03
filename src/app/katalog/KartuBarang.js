export default function KartuBarang({ item, onUbahTotal, onUbahKondisi }) {
  // Rumus hitung sisa barang di rak
  const sisaToko =
    item.stok_total -
    (item.stok_disewa || 0) -
    (item.stok_dicuci || 0) -
    (item.stok_rusak || 0);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4 text-black">
      <div>
        <h3 className="text-xl font-bold text-gray-900">{item.nama}</h3>
        <p className="text-base text-green-600 font-extrabold mt-0.5">
          Rp {item.harga.toLocaleString("id-ID")}/hari
        </p>
      </div>

      {/* Kontrol Total Stok */}
      <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-200">
        <span className="text-sm font-bold text-gray-700">
          Total Stok Toko:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUbahTotal(item.id, "kurang")}
            className="bg-gray-200 px-3 py-1 rounded-lg font-bold text-xl active:scale-90 transition-all cursor-pointer"
          >
            -
          </button>
          <span className="font-extrabold text-xl w-8 text-center">
            {item.stok_total}
          </span>
          <button
            onClick={() => onUbahTotal(item.id, "tambah")}
            className="bg-gray-200 px-3 py-1 rounded-lg font-bold text-xl active:scale-90 transition-all cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* Sisa di Rak */}
      <div className="bg-green-50 p-2.5 rounded-lg text-center border border-green-200">
        <p className="text-base text-green-800 font-bold">
          🟢 Sisa Siap Sewa di Rak:{" "}
          <span className="text-xl font-black">{sisaToko}</span> unit
        </p>
      </div>

      {/* Rincian Kondisi */}
      <div className="space-y-3 pt-3 border-t border-gray-100 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-600">🏃 Sedang Disewa Out:</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-bold text-base w-16 text-center">
            {item.stok_disewa || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-600">🧼 Sedang Dicuci:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUbahKondisi(item.id, "stok_dicuci", "kurang")}
              className="bg-gray-200 px-2 py-0.5 rounded font-bold active:scale-90 transition-all cursor-pointer"
            >
              -
            </button>
            <span className="font-bold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-base w-16 text-center">
              {item.stok_dicuci || 0}
            </span>
            <button
              onClick={() => onUbahKondisi(item.id, "stok_dicuci", "tambah")}
              className="bg-gray-200 px-2 py-0.5 rounded font-bold active:scale-90 transition-all cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-600">🛠️ Rusak/Reparasi:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUbahKondisi(item.id, "stok_rusak", "kurang")}
              className="bg-gray-200 px-2 py-0.5 rounded font-bold active:scale-90 transition-all cursor-pointer"
            >
              -
            </button>
            <span className="font-bold bg-red-100 text-red-800 px-3 py-1 rounded-md text-base w-16 text-center">
              {item.stok_rusak || 0}
            </span>
            <button
              onClick={() => onUbahKondisi(item.id, "stok_rusak", "tambah")}
              className="bg-gray-200 px-2 py-0.5 rounded font-bold active:scale-90 transition-all cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
