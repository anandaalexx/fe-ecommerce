"use client";
import { Dialog } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ToastNotification from "../../ToastNotification";

const ModalDetailProduk = ({ isOpen, onClose, produk }) => {
  const [produkState, setProdukState] = useState(null);
  const [stokTambah, setStokTambah] = useState({});
  const [stokInputVisible, setStokInputVisible] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    setProdukState(produk);
  }, [produk]);

  if (!produkState) return null;

  const handleTambahStok = async (idVarianProduk) => {
    const jumlahTambah = parseInt(stokTambah[idVarianProduk] || 0);

    if (isNaN(jumlahTambah) || jumlahTambah <= 0) {
      showToast("Masukkan jumlah stok yang valid!", "warning");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:2000/api/product/add-stock/${idVarianProduk}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ jumlahTambah }),
        }
      );

      if (!res.ok) throw new Error("Gagal menambah stok");

      showToast("Stok berhasil ditambahkan!", "success");

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
      showToast("Terjadi kesalahan saat menambah stok", "error");
    }
  };

  return (
    <Dialog as="div" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <Dialog.Panel className="bg-white max-w-2xl w-full rounded-lg shadow-xl">
          <div className="p-6 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Detail Produk
            </Dialog.Title>

            <div className="flex gap-4">
              <img
                src="/iphone1.png"
                alt={produkState.nama}
                className="w-32 h-32 object-cover rounded"
              />
              <div>
                <p>
                  <span className="font-medium">Nama:</span> {produkState.nama}
                </p>
                <p>
                  <span className="font-medium">Deskripsi:</span>{" "}
                  {produkState.deskripsi}
                </p>
                <p>
                  <span className="font-medium">Kategori:</span>{" "}
                  {produkState.kategori}
                </p>
                <p>
                  <span className="font-medium">Penjual:</span>{" "}
                  {produkState.penjual}
                </p>
                <p>
                  <span className="font-medium">Harga:</span>{" "}
                  {produkState.harga}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Informasi Tambahan</h4>
              <div className="space-y-4">
                {produkState.varianProduk.map((vp) => (
                  <div key={vp.id} className="border rounded p-3 space-y-1">
                    <p>
                      <span className="font-medium">SKU:</span> {vp.sku}
                    </p>
                    <p>
                      <span className="font-medium">Harga:</span> Rp{" "}
                      {vp.harga.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Stok:</span> {vp.stok}
                      {!stokInputVisible[vp.id] ? (
                        <button
                          onClick={() =>
                            setStokInputVisible({
                              ...stokInputVisible,
                              [vp.id]: true,
                            })
                          }
                          className="bg-[#EDCF5D] text-white px-2 py-1 rounded hover:brightness-110 text-xs cursor-pointer"
                        >
                          Tambah +
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            className="border px-2 py-1 rounded w-21"
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
                            className="bg-[#EDCF5D] text-white px-2 py-1 rounded hover:brightness-110 text-xs cursor-pointer"
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
                            className="text-gray-500 hover:text-gray-700 px-2 py-1 text-xs rounded border border-gray-200 cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      )}
                    </div>

                    <p>
                      <span className="font-medium">Status:</span> {vp.status}
                    </p>

                    {vp.nilaiVarian.length > 0 && (
                      <p>
                        <span className="font-medium">Varian:</span>{" "}
                        {vp.nilaiVarian
                          .map((nv) => `${nv.varian}: ${nv.nilai}`)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </Dialog>
  );
};

export default ModalDetailProduk;
