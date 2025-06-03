import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";

const ModalEditProduk = ({ isOpen, onClose, produk, onUpdate }) => {
  const [editData, setEditData] = useState({});
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isOpen && produk) {
      loadCategories();
      loadVariants();
    }
  }, [isOpen, produk]);

  useEffect(() => {
    if (produk) {
      console.log("Produk data:", produk);

      const hasVariants = produk.varianProduk && produk.varianProduk.length > 0;
      const hasComplexVariants = hasVariants && (
        produk.varianProduk.length > 1 || 
        produk.varianProduk.some(vp => vp.nilaiVarianProduk && vp.nilaiVarianProduk.length > 0)
      );

      console.log("Has variants:", hasVariants);
      console.log("Has complex variants:", hasComplexVariants);

      if (hasComplexVariants) {
        setEditData({
          namaProduk: produk.nama,
          deskripsi: produk.deskripsi,
          idKategori: produk.idKategori || null,
          berat: produk.berat || 0,
          isVariantProduct: true, 
          varian: [],
          produkVarian: produk.varianProduk.map(vp => ({
            id: vp.id,
            harga: vp.harga,
            stok: vp.stok,
            status: vp.status,
            nilaiVarian: vp.nilaiVarianProduk ? vp.nilaiVarianProduk.map(nvp => ({
              idVarian: nvp.varian?.id,
              idNilaiVarian: nvp.nilaiVarian?.id,
              namaVarian: nvp.varian?.nama,
              nilai: nvp.nilaiVarian?.value || nvp.nilaiVarian?.nilai
            })) : [],
          })),
        });
      } else {
        // Produk tanpa varian
        const firstVariant = produk.varianProduk?.[0];
        setEditData({
          namaProduk: produk.nama,
          deskripsi: produk.deskripsi,
          idKategori: produk.idKategori || null,
          berat: produk.berat || 0,
          isVariantProduct: false, 
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

  const loadVariants = async () => {
    if (!produk?.id) {
      console.log("No product ID available");
      return;
    }

    setLoadingVariants(true);
    try {
      console.log("Loading variants for product ID:", produk.id);
      const res = await fetch(`${apiUrl}/admin/products/variant/${produk.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      console.log("Variants API response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Loaded variants data:", data);
        setVariants(data || []);
      } else {
        const errorText = await res.text();
        console.error("Gagal load variants", res.status, errorText);
        
        if (produk.varianProduk && produk.varianProduk.length > 0) {
          const existingVariants = extractVariantsFromProduct(produk);
          console.log("Using existing variants as fallback:", existingVariants);
          setVariants(existingVariants);
        } else {
          setVariants([]);
        }
      }
    } catch (err) {
      console.error("Error loading variants:", err);
      
      if (produk.varianProduk && produk.varianProduk.length > 0) {
        const existingVariants = extractVariantsFromProduct(produk);
        console.log("Using existing variants as fallback after error:", existingVariants);
        setVariants(existingVariants);
      } else {
        setVariants([]);
      }
    } finally {
      setLoadingVariants(false);
    }
  };

  const extractVariantsFromProduct = (productData) => {
    const varianMap = new Map();
    
    if (productData.varianProduk) {
      productData.varianProduk.forEach(vp => {
        if (vp.nilaiVarianProduk) {
          vp.nilaiVarianProduk.forEach(nvp => {
            if (nvp.varian) {
              const varianId = nvp.varian.id;
              const varianNama = nvp.varian.nama;
              
              if (!varianMap.has(varianId)) {
                varianMap.set(varianId, {
                  id: varianId,
                  nama: varianNama,
                  nilaiVarian: []
                });
              }
              
              if (nvp.nilaiVarian) {
                const existingNilai = varianMap.get(varianId).nilaiVarian.find(
                  n => n.id === nvp.nilaiVarian.id
                );
                
                if (!existingNilai) {
                  varianMap.get(varianId).nilaiVarian.push({
                    id: nvp.nilaiVarian.id,
                    nilai: nvp.nilaiVarian.value || nvp.nilaiVarian.nilai
                  });
                }
              }
            }
          });
        }
      });
    }
    
    return Array.from(varianMap.values());
  };
  
  if (!produk) return null;
  
  const handleUpdateProduk = async () => {
  setLoading(true);
    try {
      console.log("Data yang akan dikirim:", editData);

      // PERBAIKAN: Logika penentuan variant product yang lebih tepat
      // Jika ada lebih dari 1 varian, atau ada varian dengan nilaiVarian
      const isRealVariantProduct = editData.produkVarian && editData.produkVarian.length > 0 && (
        editData.produkVarian.length > 1 || 
        editData.produkVarian.some(vp => vp.nilaiVarian && vp.nilaiVarian.length > 0)
      );

      console.log("Is real variant product:", isRealVariantProduct);
      console.log("ProdukVarian length:", editData.produkVarian?.length || 0);
      console.log("Has variants with values:", editData.produkVarian?.some(vp => vp.nilaiVarian && vp.nilaiVarian.length > 0));

      let dataToSend;

      if (isRealVariantProduct) {
        // PERBAIKAN: Validasi setiap varian sebelum dikirim
        const validProdukVarian = editData.produkVarian.filter(vp => {
          const hasValidPrice = vp.harga !== undefined && vp.harga !== null && !isNaN(vp.harga);
          const hasValidStock = vp.stok !== undefined && vp.stok !== null && !isNaN(vp.stok);
          const hasValidId = vp.id !== undefined && vp.id !== null && !isNaN(vp.id);
          
          if (!hasValidPrice || !hasValidStock || !hasValidId) {
            console.warn("Invalid variant found:", vp);
            return false;
          }
          
          return true;
        }).map(vp => ({
          id: parseInt(vp.id), 
          harga: parseInt(vp.harga) || 0,
          stok: parseInt(vp.stok) || 0,
          status: vp.status || 'stok_tersedia',
          nilaiVarian: (vp.nilaiVarian || []).filter(nv => {
            return nv.idVarian && nv.idNilaiVarian;
          }).map(nv => ({
            idVarian: parseInt(nv.idVarian),
            idNilaiVarian: parseInt(nv.idNilaiVarian)
          }))
        }));

        console.log("Valid produk varian:", validProdukVarian);

        // PERBAIKAN: Jangan kirim jika tidak ada varian yang valid
        if (validProdukVarian.length === 0) {
          throw new Error("Tidak ada varian yang valid untuk dikirim. Pastikan setiap varian memiliki ID, harga, dan stok yang valid.");
        }

        dataToSend = {
          namaProduk: editData.namaProduk,
          deskripsi: editData.deskripsi,
          idKategori: editData.idKategori,
          berat: parseInt(editData.berat) || 0,
          varian: editData.varian || [],
          produkVarian: validProdukVarian
        };
      } else {
        // Produk tanpa varian
        dataToSend = {
          namaProduk: editData.namaProduk,
          deskripsi: editData.deskripsi,
          idKategori: editData.idKategori,
          berat: parseInt(editData.berat) || 0,
          varian: [],
          produkVarian: [],
          harga: parseInt(editData.harga) || 0,
          stok: parseInt(editData.stok) || 0,
          status: editData.status || 'stok_tersedia'
        };
      }

      console.log("Final data to send:", JSON.stringify(dataToSend, null, 2));

      const res = await fetch(`${apiUrl}/admin/products/${produk.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const responseText = await res.text();
        console.error("Raw response:", responseText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
          errorData = { message: responseText || `HTTP ${res.status}: ${res.statusText}` };
        }
        
        console.error("Response error dari backend:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log("Response dari backend:", responseData);

      alert("Produk berhasil diupdate!");
      
      if (onUpdate) {
        await onUpdate();
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

  const handleNilaiVarianChange = (varianIndex, nilaiIndex, field, value) => {
    setEditData((prev) => ({
      ...prev,
      produkVarian: prev.produkVarian.map((vp, vpIndex) =>
        vpIndex === varianIndex 
          ? {
              ...vp,
              nilaiVarian: vp.nilaiVarian.map((nv, nvIndex) =>
                nvIndex === nilaiIndex ? { ...nv, [field]: value } : nv
              )
            }
          : vp
      ),
    }));
  };

  const handleAddNilaiVarian = (varianIndex) => {
    setEditData((prev) => ({
      ...prev,
      produkVarian: prev.produkVarian.map((vp, vpIndex) =>
        vpIndex === varianIndex 
          ? {
              ...vp,
              nilaiVarian: [
                ...vp.nilaiVarian,
                { idVarian: null, idNilaiVarian: null, namaVarian: "", nilai: "" }
              ]
            }
          : vp
      ),
    }));
  };

  const handleRemoveNilaiVarian = (varianIndex, nilaiIndex) => {
    setEditData((prev) => ({
      ...prev,
      produkVarian: prev.produkVarian.map((vp, vpIndex) =>
        vpIndex === varianIndex 
          ? {
              ...vp,
              nilaiVarian: vp.nilaiVarian.filter((_, nvIndex) => nvIndex !== nilaiIndex)
            }
          : vp
      ),
    }));
  };

  const handleDeleteVariant = (index) => {
    if (confirm("Apakah Anda yakin ingin menghapus varian ini?")) {
      setEditData((prev) => {
        const newProdukVarian = prev.produkVarian.filter((_, i) => i !== index);
        
        // PERBAIKAN: Jika tidak ada varian tersisa, ubah ke produk non-varian
        const shouldBecomeNonVariant = newProdukVarian.length === 0;
        
        if (shouldBecomeNonVariant) {
          return {
            ...prev,
            isVariantProduct: false,
            produkVarian: [],
            harga: 0,
            stok: 0,
            status: 'stok_tersedia'
          };
        }
        
        return {
          ...prev,
          produkVarian: newProdukVarian
        };
      });
    }
  };

  const handleAddNewVariant = () => {
    const newVariant = {
      id: null,
      harga: 0,
      stok: 0,
      status: 'stok_tersedia',
      nilaiVarian: []
    };
    
    setEditData((prev) => ({
      ...prev,
      isVariantProduct: true, // PERBAIKAN: Set flag saat menambah varian
      produkVarian: [...prev.produkVarian, newVariant]
    }));
  };

  const isProductWithVariants = editData.isVariantProduct && 
    editData.produkVarian && 
    editData.produkVarian.length > 0;

  console.log("Render state:", {
    isVariantProduct: editData.isVariantProduct,
    isProductWithVariants,
    variantsCount: editData.produkVarian?.length || 0,
    loadedVariants: variants.length
  });

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

            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                <div>Debug Info:</div>
                <div>Is Variant Product: {editData.isVariantProduct ? 'Yes' : 'No'}</div>
                <div>Is Product With Variants: {isProductWithVariants ? 'Yes' : 'No'}</div>
                <div>Loaded Available Variants: {variants.length}</div>
                <div>ProdukVarian Count: {editData.produkVarian?.length || 0}</div>
              </div>
            )}

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

                  {/* Input untuk produk tanpa varian */}
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

                  {/* Section untuk produk dengan varian */}
                  {isProductWithVariants && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Varian Produk</h4>
                        <button
                          type="button"
                          onClick={handleAddNewVariant}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          + Tambah Varian
                        </button>
                      </div>
                      
                      {loadingVariants && (
                        <div className="text-center py-4">
                          <div className="text-sm text-gray-500">Loading variants...</div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {editData.produkVarian.map((vp, index) => (
                          <div key={vp.id || `new-${index}`} className="border rounded p-4 space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => handleDeleteVariant(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                              title="Hapus varian"
                            >
                              ×
                            </button>

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

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium">Nilai Varian:</label>
                                <button
                                  type="button"
                                  onClick={() => handleAddNilaiVarian(index)}
                                  className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                                >
                                  + Nilai
                                </button>
                              </div>
                              
                              {vp.nilaiVarian && vp.nilaiVarian.length > 0 ? (
                                vp.nilaiVarian.map((nv, nvIndex) => (
                                  <div key={nvIndex} className="grid grid-cols-3 gap-2 mb-2 items-end">
                                    <div>
                                      <label className="block text-xs text-gray-600">Varian:</label>
                                      <select
                                        value={nv.idVarian || ""}
                                        onChange={(e) => {
                                          const selectedVariant = variants.find(v => v.id === parseInt(e.target.value));
                                          handleNilaiVarianChange(index, nvIndex, "idVarian", parseInt(e.target.value));
                                          handleNilaiVarianChange(index, nvIndex, "namaVarian", selectedVariant?.nama || "");
                                        }}
                                        className="w-full border rounded px-2 py-1 text-sm"
                                      >
                                        <option value="">Pilih Varian</option>
                                        {variants.map(variant => (
                                          <option key={variant.id} value={variant.id}>
                                            {variant.nama}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600">Nilai:</label>
                                      <select
                                        value={nv.idNilaiVarian || ""}
                                        onChange={(e) => {
                                          const selectedVariant = variants.find(v => v.id === nv.idVarian);
                                          const selectedNilai = selectedVariant?.nilaiVarian?.find(n => n.id === parseInt(e.target.value));
                                          handleNilaiVarianChange(index, nvIndex, "idNilaiVarian", parseInt(e.target.value));
                                          handleNilaiVarianChange(index, nvIndex, "nilai", selectedNilai?.nilai || "");
                                        }}
                                        className="w-full border rounded px-2 py-1 text-sm"
                                        disabled={!nv.idVarian}
                                      >
                                        <option value="">Pilih Nilai</option>
                                        {variants.find(v => v.id === nv.idVarian)?.nilaiVarian?.map(nilai => (
                                          <option key={nilai.id} value={nilai.id}>
                                            {nilai.nilai}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveNilaiVarian(index, nvIndex)}
                                      className="bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-600"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm text-gray-500 italic">
                                  Belum ada nilai varian. Klik "+ Nilai" untuk menambah.
                                </div>
                              )}
                            </div>

                            {!vp.id && (
                              <div className="text-sm text-blue-600 font-medium">
                                Varian Baru
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
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalEditProduk;