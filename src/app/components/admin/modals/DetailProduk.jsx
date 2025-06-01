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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Kategori</p>
                  <p className="font-medium text-gray-800">{produk.kategori}</p>
                </div>
                <div>
                  <p className="text-gray-500">Penjual</p>
                  <p className="font-medium text-gray-800">{produk.penjual}</p>
                </div>
                <div>
                  <p className="text-gray-500">Harga</p>
                  <p className="text-lg font-medium">
                    {produk.harga.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Berat</p>
                  <p className="font-medium text-gray-800">
                    {produk.berat} gram
                  </p>
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
