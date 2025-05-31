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
  useEffect(() => {
    if (produk) {
      console.log("Produk data:", produk);
      
      // Deteksi apakah produk memiliki varian atau tidak
      const hasVariants = produk.varianProduk && produk.varianProduk.length > 0 && 
                         produk.varianProduk.some(vp => vp.nilaiVarian && vp.nilaiVarian.length > 0);

      if (hasVariants) {
        // Produk dengan varian
        setEditData({
          namaProduk: produk.nama,
          deskripsi: produk.deskripsi,
          idKategori: produk.idKategori || null,
          berat: produk.berat || 0,
          varian: [],
          // Pastikan semua varian dimuat dengan benar
          produkVarian: produk.varianProduk.map(vp => ({
            id: vp.id,
            harga: vp.harga,
            stok: vp.stok,
            status: vp.status,
            nilaiVarian: vp.nilaiVarian || []
          }))
        });
      } else {
        // Produk tanpa varian - ambil harga dan stok dari varian pertama
        const firstVariant = produk.varianProduk?.[0];
        setEditData({
          namaProduk: produk.nama,
          deskripsi: produk.deskripsi,
          idKategori: produk.idKategori || null,
          berat: produk.berat || 0,
          harga: firstVariant?.harga || 0,
          stok: firstVariant?.stok || 0,
          status: firstVariant?.status || 'stok_tersedia',
          varian: [],
          produkVarian: []
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
      console.log("Data yang akan dikirim:", editData);

      // Deteksi apakah produk memiliki varian yang benar-benar kompleks
      const isRealVariantProduct = editData.produkVarian && 
        editData.produkVarian.length > 0 && 
        editData.produkVarian.some(vp => vp.nilaiVarian && vp.nilaiVarian.length > 0);

      let dataToSend;

      if (isRealVariantProduct) {
        // Produk dengan varian kompleks
        dataToSend = {
          namaProduk: editData.namaProduk,
          deskripsi: editData.deskripsi,
          idKategori: editData.idKategori,
          berat: editData.berat,
          varian: editData.varian || [],
          produkVarian: editData.produkVarian.map(vp => ({
            id: vp.id,
            harga: parseInt(vp.harga) || 0,
            stok: parseInt(vp.stok) || 0,
            status: vp.status || 'stok_tersedia',
            nilaiVarian: vp.nilaiVarian || []
          }))
        };
      } else {
        // Produk tanpa varian atau varian sederhana
        dataToSend = {
          namaProduk: editData.namaProduk,
          deskripsi: editData.deskripsi,
          idKategori: editData.idKategori,
          berat: editData.berat,
          varian: [], // Kosong untuk produk tanpa varian
          produkVarian: [], // Kosong untuk produk tanpa varian
          harga: parseInt(editData.harga) || 0,
          stok: parseInt(editData.stok) || 0,
          status: editData.status || 'stok_tersedia'
        };
      }

      console.log("Formatted data to send:", dataToSend);
      console.log("Is real variant product:", isRealVariantProduct);

      const res = await fetch(`${apiUrl}/admin/products/${produk.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(dataToSend),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Response error dari backend:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log("Response dari backend:", responseData);

      alert("Produk berhasil diupdate!");
      
      if (onUpdate) {
        onUpdate(responseData);
      }
      
      onClose();
    } catch (err) {
      console.error("Update gagal:", err.message);
      alert(`Terjadi kesalahan saat mengupdate produk: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDataChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVarianProdukChange = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      produkVarian: prev.produkVarian.map((vp, i) => 
        i === index ? { ...vp, [field]: value } : vp
      )
    }));
  };

  // Deteksi apakah produk memiliki varian
  const hasVariants = editData.produkVarian && editData.produkVarian.length > 0;
  const isProductWithVariants = hasVariants && editData.produkVarian.some(vp => 
    vp.nilaiVarian && vp.nilaiVarian.length > 0
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
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
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
                    <label className="block text-sm font-medium mb-1">Nama Produk:</label>
                    <input
                      type="text"
                      value={editData.namaProduk || ""}
                      onChange={(e) => handleEditDataChange("namaProduk", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Deskripsi:</label>
                    <textarea
                      value={editData.deskripsi || ""}
                      onChange={(e) => handleEditDataChange("deskripsi", e.target.value)}
                      className="w-full border rounded px-3 py-2 h-20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kategori:</label>
                      <select
                        value={editData.idKategori || ""}
                        onChange={(e) => handleEditDataChange("idKategori", parseInt(e.target.value) || null)}
                        className="w-full border rounded px-3 py-2"
                        disabled={loadingCategories}
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Berat (gram):</label>
                      <input
                        type="number"
                        value={editData.berat || ""}
                        onChange={(e) => handleEditDataChange("berat", parseInt(e.target.value) || 0)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Tampilkan input harga dan stok hanya untuk produk tanpa varian */}
                  {!isProductWithVariants && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Harga:</label>
                        <input
                          type="number"
                          value={editData.harga || ""}
                          onChange={(e) => handleEditDataChange("harga", parseInt(e.target.value) || 0)}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Stok:</label>
                        <input
                          type="number"
                          value={editData.stok || ""}
                          onChange={(e) => handleEditDataChange("stok", parseInt(e.target.value) || 0)}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status:</label>
                        <select
                          value={editData.status || "stok_tersedia"}
                          onChange={(e) => handleEditDataChange("status", e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="stok_tersedia">Stok Tersedia</option>
                          <option value="stok_kosong">Stok Kosong</option>
                          <option value="discontinued">Discontinued</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section Varian Produk */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">
                {isProductWithVariants ? "Varian Produk" : "Detail Produk"}
              </h4>
              
              <div className="space-y-4">
                {isProductWithVariants ? (
                  // Tampilkan SEMUA varian untuk produk dengan varian
                  editData.produkVarian && editData.produkVarian.map((vp, index) => (
                    <div key={vp.id || index} className="border rounded p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <p>
                          <span className="font-medium">SKU:</span> {produk.varianProduk[index]?.sku || 'N/A'}
                        </p>
                        <div>
                          <label className="block text-sm font-medium mb-1">Status:</label>
                          <select
                            value={vp.status || 'stok_tersedia'}
                            onChange={(e) => handleVarianProdukChange(index, "status", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="stok_tersedia">Stok Tersedia</option>
                            <option value="stok_kosong">Stok Kosong</option>
                            <option value="discontinued">Discontinued</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Harga:</label>
                          <input
                            type="number"
                            value={vp.harga || 0}
                            onChange={(e) => handleVarianProdukChange(index, "harga", parseInt(e.target.value) || 0)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Stok:</label>
                          <input
                            type="number"
                            value={vp.stok || 0}
                            onChange={(e) => handleVarianProdukChange(index, "stok", parseInt(e.target.value) || 0)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                      </div>

                      {vp.nilaiVarian && vp.nilaiVarian.length > 0 && (
                        <div>
                          <span className="font-medium">Varian:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {vp.nilaiVarian.map((nv, nvIndex) => (
                              <span
                                key={nvIndex}
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
                  // Tampilkan info untuk produk tanpa varian
                  produk.varianProduk && produk.varianProduk.length > 0 && (
                    <div className="border rounded p-4 space-y-2 bg-gray-50">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">SKU:</span> {produk.varianProduk[0].sku}
                      </p>
                    </div>
                  )
                )}
                
                {(!produk.varianProduk || produk.varianProduk.length === 0) && (
                  <p className="text-gray-500 text-center py-4">
                    Tidak ada data varian produk
                  </p>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalEditProduk;