"use client";
import { Dialog } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

const ModalEditProduk = ({ isOpen, onClose, produk, onUpdate }) => {
  const [editData, setEditData] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Load categories saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Set data produk saat modal dibuka
  // Ganti di bagian useEffect inisialisasi data
  useEffect(() => {
    if (produk) {
      console.log("Detail produk:", produk); // Debugging

      const hasVariants = produk.varianProduk?.length > 0;
      const isVariantProduct =
        hasVariants &&
        produk.varianProduk.some(
          (vp) => vp.nilaiVarianProduk?.length > 0 || vp.nilaiVarian?.length > 0
        );

      if (isVariantProduct) {
        setEditData({
          namaProduk: produk.nama,
          deskripsi: produk.deskripsi,
          idKategori: produk.idKategori,
          berat: produk.berat,
          produkVarian: produk.varianProduk.map((vp) => ({
            id: vp.id,
            harga: vp.harga,
            stok: vp.stok,
            status: vp.status,
            nilaiVarian: vp.nilaiVarianProduk || vp.nilaiVarian || [],
          })),
        });
      } else {
        const firstVariant = produk.varianProduk?.[0];
        setEditData({
          namaProduk: produk.nama,
          deskripsi: produk.deskripsi,
          idKategori: produk.idKategori,
          berat: produk.berat,
          harga: firstVariant?.harga,
          stok: firstVariant?.stok,
          status: firstVariant?.status,
          produkVarian: [],
        });
      }
    }
  }, [produk]);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch(`${apiUrl}/category/view`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error("Gagal load categories");
        setCategories([
          { id: 1, nama: "Elektronik" },
          { id: 2, nama: "Fashion" },
          { id: 3, nama: "Makanan" },
          { id: 4, nama: "Kesehatan" },
        ]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([
        { id: 1, nama: "Elektronik" },
        { id: 2, nama: "Fashion" },
        { id: 3, nama: "Makanan" },
        { id: 4, nama: "Kesehatan" },
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  if (!produk) return null;

  const handleUpdateProduk = async () => {
    setLoading(true);
    try {
      const dataToSend = {
        namaProduk: editData.namaProduk,
        deskripsi: editData.deskripsi,
        idKategori: editData.idKategori,
        berat: editData.berat,
      };

      if (isProductWithVariants) {
        dataToSend.produkVarian = editData.produkVarian.map((vp) => ({
          id: vp.id,
          harga: parseInt(vp.harga),
          stok: parseInt(vp.stok),
          status: vp.status,
        }));
      } else {
        dataToSend.harga = parseInt(editData.harga);
        dataToSend.stok = parseInt(editData.stok);
        dataToSend.status = editData.status;
      }

      const res = await fetch(`${apiUrl}/admin/products/${produk.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error(await res.text());

      const updatedProduct = await res.json();
      onUpdate(updatedProduct);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      alert("Gagal mengupdate produk: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDataChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVarianProdukChange = (index, field, value) => {
    setEditData((prev) => ({
      ...prev,
      produkVarian: prev.produkVarian.map((vp, i) =>
        i === index ? { ...vp, [field]: value } : vp
      ),
    }));
  };

  // Deteksi apakah produk memiliki varian
  const hasVariants = editData.produkVarian && editData.produkVarian.length > 0;
  const isProductWithVariants =
    hasVariants &&
    editData.produkVarian.some(
      (vp) => vp.nilaiVarian && vp.nilaiVarian.length > 0
    );

  return (
    <Dialog as={Fragment} open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <Dialog.Panel className="bg-white max-w-4xl w-full rounded-lg shadow-xl">
          <div className="p-6 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-semibold mb-4 flex items-center justify-between">
              Edit Produk
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProduk}
                  className="bg-[#EDCF5D] text-white px-4 py-2 rounded hover:brightness-110 transition-colors text-sm cursor-pointer font-medium"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm cursor-pointer font-medium"
                  disabled={loading}
                >
                  Batal
                </button>
              </div>
            </Dialog.Title>

            <div className="flex gap-4">
              <img
                src="/iphone1.png"
                alt={produk.nama}
                className="w-32 h-32 object-cover rounded"
              />
              <div className="flex-1">
                <div className="space-y-3">
                  <div>
                    <label className="block text-md font-medium mb-1">
                      Nama Produk:
                    </label>
                    <input
                      type="text"
                      value={editData.namaProduk || ""}
                      onChange={(e) =>
                        handleEditDataChange("namaProduk", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-md font-medium mb-1">
                      Deskripsi:
                    </label>
                    <textarea
                      value={editData.deskripsi || ""}
                      onChange={(e) =>
                        handleEditDataChange("deskripsi", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2 h-20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-md font-medium mb-1">
                        Kategori:
                      </label>
                      <select
                        value={editData.idKategori || ""}
                        onChange={(e) =>
                          handleEditDataChange(
                            "idKategori",
                            parseInt(e.target.value) || null
                          )
                        }
                        className="w-full border rounded px-3 py-2"
                        disabled={loadingCategories}
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-md font-medium mb-1">
                        Berat (gram):
                      </label>
                      <input
                        type="number"
                        value={editData.berat || ""}
                        onChange={(e) =>
                          handleEditDataChange(
                            "berat",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Tampilkan input harga dan stok hanya untuk produk tanpa varian */}
                  {!isProductWithVariants && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Harga:
                        </label>
                        <input
                          type="number"
                          value={editData.harga || ""}
                          onChange={(e) =>
                            handleEditDataChange(
                              "harga",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Stok:
                        </label>
                        <input
                          type="number"
                          value={editData.stok || ""}
                          onChange={(e) =>
                            handleEditDataChange(
                              "stok",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Status:
                        </label>
                        <select
                          value={editData.status || "stok_tersedia"}
                          onChange={(e) =>
                            handleEditDataChange("status", e.target.value)
                          }
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="stok_tersedia">Stok Tersedia</option>
                          <option value="stok_kosong">Stok Kosong</option>
                          <option value="discontinued">Discontinued</option>
                        </select>
                      </div>
                    </div>
                  )}
                  {isProductWithVariants && (
                    <div>
                      <label className="block text-md font-semibold mt-4 mb-2">
                        Varian Produk:
                      </label>
                      <div className="space-y-4">
                        {editData.produkVarian.map((vp, index) => (
                          <div
                            key={vp.id || index}
                            className="border p-4 rounded-md shadow-sm bg-gray-50"
                          >
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Harga
                                </label>
                                <input
                                  type="number"
                                  value={vp.harga || ""}
                                  onChange={(e) =>
                                    handleVarianProdukChange(
                                      index,
                                      "harga",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border rounded px-2 py-1"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Stok
                                </label>
                                <input
                                  type="number"
                                  value={vp.stok || ""}
                                  onChange={(e) =>
                                    handleVarianProdukChange(
                                      index,
                                      "stok",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border rounded px-2 py-1"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Status
                                </label>
                                <select
                                  value={vp.status || "stok_tersedia"}
                                  onChange={(e) =>
                                    handleVarianProdukChange(
                                      index,
                                      "status",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border rounded px-2 py-1"
                                >
                                  <option value="stok_tersedia">
                                    Stok Tersedia
                                  </option>
                                  <option value="stok_habis">Stok Habis</option>
                                </select>
                              </div>
                            </div>

                            {/* Tampilkan nilaiVarian */}
                            {vp.nilaiVarian && vp.nilaiVarian.length > 0 && (
                              <div className="mt-3">
                                <label className="block text-sm font-medium mb-1">
                                  Nilai Varian:
                                </label>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                  {vp.nilaiVarian.map((nv, i) => (
                                    <li key={i}>{nv}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section Varian Produk */}
            {/* Section Varian Produk */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Varian Produk</h4>
              // Ganti bagian render varian dengan ini:
              {isProductWithVariants ? (
                <div className="space-y-4">
                  {editData.produkVarian?.map((vp, index) => (
                    <div
                      key={vp.id || index}
                      className="border rounded p-4 space-y-2"
                    >
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Harga
                          </label>
                          <input
                            type="number"
                            value={vp.harga || 0}
                            onChange={(e) =>
                              handleVarianProdukChange(
                                index,
                                "harga",
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Stok
                          </label>
                          <input
                            type="number"
                            value={vp.stok || 0}
                            onChange={(e) =>
                              handleVarianProdukChange(
                                index,
                                "stok",
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Status
                          </label>
                          <select
                            value={vp.status || "stok_tersedia"}
                            onChange={(e) =>
                              handleVarianProdukChange(
                                index,
                                "status",
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="stok_tersedia">Stok Tersedia</option>
                            <option value="stok_kosong">Stok Kosong</option>
                            <option value="discontinued">Discontinued</option>
                          </select>
                        </div>
                      </div>

                      {vp.nilaiVarian?.length > 0 && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium mb-1">
                            Varian
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {vp.nilaiVarian.map((nv, nvIndex) => (
                              <span
                                key={nvIndex}
                                className="bg-gray-100 px-2 py-1 rounded text-sm"
                              >
                                {typeof nv === "object"
                                  ? `${nv.varian}: ${nv.nilai}`
                                  : nv}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded p-4 bg-gray-50">
                  <p className="text-gray-600">
                    Produk ini tidak memiliki varian
                  </p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalEditProduk;
