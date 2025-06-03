"use client";
import { Dialog } from "@headlessui/react";

const ModalDetailProduk = ({ isOpen, onClose, produk }) => {
  if (!produk) return null;

  return (
    <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
          <Dialog.Title className="text-xl font-bold mb-6 text-center text-gray-800">
            Detail Produk
          </Dialog.Title>

          {/* Header: Gambar + Informasi */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Gambar Produk */}
            <div className="flex-shrink-0 self-center md:self-start">
              <img
                src="/iphone1.png"
                alt={produk.nama}
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Informasi Produk */}
            <div className="flex-1 space-y-4 text-sm">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {produk.nama}
                </h2>
                <p className="text-gray-600 mt-1">{produk.deskripsi}</p>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Varian Produk</h4>
                <div className="space-y-4">
                  {produkState.varianProduk &&
                  produkState.varianProduk.length > 0 ? (
                    produkState.varianProduk.map((vp) => (
                      <div key={vp.id} className="border rounded p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <p>
                            <span className="font-medium">SKU:</span> {vp.sku}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>{" "}
                            {vp.status}
                          </p>
                        </div>

                        <p>
                          <span className="font-medium">Harga:</span> Rp{" "}
                          {vp.harga?.toLocaleString()}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Stok:</span> 
                          {vp.stok}
                          {!stokInputVisible[vp.id] ? (
                            <button
                              onClick={() =>
                                setStokInputVisible({
                                  ...stokInputVisible,
                                  [vp.id]: true,
                                })
                              }
                              className="bg-[#EDCF5D] text-white px-3 py-1 rounded hover:brightness-110 text-sm cursor-pointer"
                            >
                              Tambah Stok
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                className="border px-2 py-1 rounded w-20"
                                placeholder="Jumlah"
                                value={stokTambah[vp.id] || ""}
                                onChange={(e) =>
                                  setStokTambah({
                                    ...stokTambah,
                                    [vp.id]: e.target.value,
                                  })
                                }
                              />
                              <button
                                onClick={() => handleTambahStok(vp.id)}
                                className="bg-[#EDCF5D] text-white px-2 py-1 rounded hover:brightness-110 text-sm cursor-pointer"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() =>
                                  setStokInputVisible((prev) => ({
                                    ...prev,
                                    [vp.id]: false,
                                  }))
                                }
                                className="text-gray-500 hover:text-gray-700 px-2 py-1 text-sm rounded border border-gray-200 cursor-pointer"
                              >
                                Batal
                              </button>
                            </div>
                          )}
                        </div>

                        {vp.nilaiVarian && vp.nilaiVarian.length > 0 && (
                          <div>
                            <span className="font-medium">Varian:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {vp.nilaiVarian.map((nv, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 px-2 py-1 rounded text-sm"
                                >
                                  {nv.varian}: {nv.nilai}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Tidak ada varian produk
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Varian Produk */}
          {produk.varianProduk?.length > 0 && (
            <div>
              <h4 className="text-base font-semibold mb-4 text-gray-800">
                Varian Produk
              </h4>
              <div className="space-y-4">
                {produk.varianProduk.map((vp) => (
                  <div
                    key={vp.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">SKU</span>
                        <p className="font-medium">{vp.sku}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Harga</span>
                        <p className="font-medium">
                          Rp {vp.harga.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Stok</span>
                        <p className="font-medium">{vp.stok}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status</span>
                        <span
                          className={`block mt-1 px-2 py-0.5 text-xs font-semibold rounded ${
                            vp.status === "aktif"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {vp.status}
                        </span>
                      </div>
                    </div>

                    {/* Nilai Varian */}
                    {vp.nilaiVarian?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">
                          Varian:
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {vp.nilaiVarian.map((nv, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                            >
                              {nv.varian}: {nv.nilai}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tombol Tutup */}
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm mr-3 cursor-pointer font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose(); // Tutup modal detail
                // Pastikan Anda set modal edit dari luar
                if (typeof window !== "undefined") {
                  const event = new CustomEvent("openEditModal", {
                    detail: produk,
                  });
                  window.dispatchEvent(event);
                }
              }}
              className="px-5 py-2 text-sm cursor-pointer font-medium text-white bg-[#EDCF5D] rounded hover:brightness-110"
            >
              Edit
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalDetailProduk;
