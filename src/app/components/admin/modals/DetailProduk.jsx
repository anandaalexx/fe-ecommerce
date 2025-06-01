"use client";
import { Dialog } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ModalEditProduk from "./EditProduk";

const ModalDetailProduk = ({ isOpen, onClose, produk }) => {
  const [produkState, setProdukState] = useState(null);
  const [stokTambah, setStokTambah] = useState({});
  const [stokInputVisible, setStokInputVisible] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    setProdukState(produk);
  }, [produk]);

  if (!produkState) return null;

  const handleTambahStok = async (idVarianProduk) => {
    const jumlahTambah = parseInt(stokTambah[idVarianProduk] || 0);

    if (isNaN(jumlahTambah) || jumlahTambah <= 0) {
      alert("Masukkan jumlah stok yang valid!");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/product/add-stock/${idVarianProduk}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jumlahTambah }),
      });

      if (!res.ok) throw new Error("Gagal menambah stok");

      alert("Stok berhasil ditambahkan!");

      // Update stok di state
      setProdukState((prev) => ({
        ...prev,
        varianProduk: prev.varianProduk.map((vp) =>
          vp.id === idVarianProduk
            ? { ...vp, stok: vp.stok + jumlahTambah }
            : vp
        ),
      }));

      setStokTambah((prev) => ({ ...prev, [idVarianProduk]: "" }));
      setStokInputVisible((prev) => ({ ...prev, [idVarianProduk]: false }));
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambah stok");
    }
  };

  const handleUpdateProduk = (updatedProduk) => {
    setProdukState(updatedProduk);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Dialog as={Fragment} open={isOpen} onClose={onClose}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Dialog.Panel className="bg-white max-w-4xl w-full rounded-lg shadow-xl">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-semibold mb-4 flex items-center justify-between">
                Detail Produk
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-[#EDCF5D] text-white px-4 py-2 rounded hover:brightness-110 cursor-pointer transition-colors text-sm"
                >
                  Edit Produk
                </button>
              </Dialog.Title>

              <div className="flex gap-4">
                <img
                  src="/iphone1.png"
                  alt={produkState.namaProduk}
                  className="w-32 h-32 object-cover rounded"
                />
                <div className="flex-1">
                  <p>
                    <span className="font-medium">Nama:</span>{" "}
                    {produkState.namaProduk}
                  </p>
                  <p>
                    <span className="font-medium">Deskripsi:</span>{" "}
                    {produkState.deskripsi}
                  </p>
                  <p>
                    <span className="font-medium">Kategori:</span>{" "}
                    {produkState.kategori.nama}
                  </p>
                  <p>
                    <span className="font-medium">Penjual:</span>{" "}
                    {produkState.penjual.storeName}
                  </p>
                  <p>
                    <span className="font-medium">Harga:</span>{" "}
                    {produkState.varianProduk.harga}
                  </p>
                </div>
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

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal Edit Produk */}
      {isEditModalOpen && (
        <ModalEditProduk
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          produk={produkState}
          onUpdate={handleUpdateProduk}
        />
      )}
    </>
  );
};

export default ModalDetailProduk;
