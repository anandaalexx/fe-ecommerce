import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";

const ModalEditProduk = ({ isOpen, onClose, produk }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    kategori: "",
    penjual: "",
    harga: 0,
    berat: 0,
    varianProduk: [],
  });
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch(`${apiUrl}/category/view`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Gagal ambil kategori");
        setKategoriList(data);
      } catch (error) {
        console.error("Error fetch kategori:", error);
      }
    };

    fetchKategori();
  }, []);

  useEffect(() => {
    if (produk) {
      console.log("Produk diterima di modal:", produk);
      console.log("Varian produk awal:", produk.varianProduk);
      produk.varianProduk?.forEach((vp, i) => {
        console.log(`nilaiVarian varian ke-${i}:`, vp.nilaiVarian);
      });

      const hargaNumber = Number(produk.harga.replace(/[^0-9]/g, ""));

      setFormData({
        nama: produk.nama || "",
        deskripsi: produk.deskripsi || "",
        kategori: Number(produk.kategori) || "",
        penjual: produk.penjual || "",
        harga: hargaNumber || 0,
        berat: produk.berat || 0,
        varianProduk: produk.varianProduk
          ? produk.varianProduk.map((vp) => ({
              ...vp,
              harga: Number(vp.harga),
              stok: Number(vp.stok),
              nilaiVarian: Array.isArray(vp.nilaiVarian) ? vp.nilaiVarian : [],
            }))
          : [],
      });
    }
  }, [produk]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "harga" || name === "berat") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleVarianChange = (index, field, value) => {
    const updatedVarian = [...formData.varianProduk];
    if (field === "harga" || field === "stok") {
      updatedVarian[index][field] = Number(value);
    } else {
      updatedVarian[index][field] = value;
    }
    setFormData({ ...formData, varianProduk: updatedVarian });
  };

  const handleNilaiVarianChange = (varianIndex, nilaiIndex, field, value) => {
    console.log("handleNilaiVarianChange dipanggil:", {
      varianIndex,
      nilaiIndex,
      field,
      value,
    });

    const updatedVarian = [...formData.varianProduk];
    if (!Array.isArray(updatedVarian[varianIndex].nilaiVarian)) {
      updatedVarian[varianIndex].nilaiVarian = [];
    }
    const updatedNilaiVarian = [...updatedVarian[varianIndex].nilaiVarian];
    updatedNilaiVarian[nilaiIndex] = {
      ...updatedNilaiVarian[nilaiIndex],
      [field]: value,
    };
    updatedVarian[varianIndex].nilaiVarian = updatedNilaiVarian;
    setFormData({ ...formData, varianProduk: updatedVarian });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("formData.varianProduk sebelum submit:", formData.varianProduk);

    // Mapping data ke format backend
    const payload = {
      namaProduk: formData.nama,
      deskripsi: formData.deskripsi,
      idKategori: Number(formData.kategori),
      berat: formData.berat,
      harga: formData.harga,
      stok: formData.varianProduk.reduce((acc, vp) => acc + vp.stok, 0),
      produkVarian: formData.varianProduk.map((vp) => ({
        id: vp.id,
        sku: vp.sku,
        harga: vp.harga,
        stok: vp.stok,
        status: vp.status,
        nilaiVarian: vp.nilaiVarian.map((nv) => ({
          varian: nv.varian,
          nilai: nv.nilai,
        })),
      })),
    };

    console.log("Payload yang akan dikirim:", payload);

    try {
      const response = await fetch(`${apiUrl}/admin/products/${produk.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data");
      }

      const data = await response.json();
      console.log("Update sukses:", data);
      onClose(); // tutup modal kalau berhasil
    } catch (error) {
      console.error("Error saat update produk:", error);
      alert("Gagal menyimpan produk, coba lagi.");
    }
  };

  return (
    <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
          <Dialog.Title className="text-xl font-bold mb-6 text-center text-gray-800">
            Edit Detail Produk
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... semua input tetap sama seperti sebelumnya ... */}

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Produk
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows={3}
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {kategoriList.map((kategori) => (
                  <option key={kategori.id} value={kategori.id}>
                    {kategori.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Penjual */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Penjual
              </label>
              <input
                type="text"
                name="penjual"
                value={formData.penjual}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Harga */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Harga (Rp)
              </label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                min={0}
              />
            </div>

            {/* Berat */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Berat (gram)
              </label>
              <input
                type="number"
                name="berat"
                value={formData.berat}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                min={0}
              />
            </div>

            {/* Varian Produk */}
            <div>
              <h4 className="text-base font-semibold mb-2 text-gray-800">
                Varian Produk
              </h4>
              {formData.varianProduk.map((vp, index) => (
                <div
                  key={vp.id || index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={vp.sku}
                        onChange={(e) =>
                          handleVarianChange(index, "sku", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Harga
                      </label>
                      <input
                        type="number"
                        value={vp.harga}
                        onChange={(e) =>
                          handleVarianChange(index, "harga", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Stok
                      </label>
                      <input
                        type="number"
                        value={vp.stok}
                        onChange={(e) =>
                          handleVarianChange(index, "stok", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        value={vp.status}
                        onChange={(e) =>
                          handleVarianChange(index, "status", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="stok_tersedia">Stok Tersedia</option>
                        <option value="stok_habis">Stok Habis</option>
                        <option value="nonaktif">Nonaktif</option>
                      </select>
                    </div>
                  </div>

                  {/* Nilai Varian */}
                  <div>
                    <h5 className="font-semibold mb-2 text-gray-700 text-sm">
                      Nilai Varian
                    </h5>
                    {vp.nilaiVarian.map((nv, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-2 gap-4 mb-3 text-sm"
                      >
                        <div>
                          <label className="block font-medium text-gray-600">
                            Varian
                          </label>
                          <input
                            type="text"
                            value={nv.varian}
                            onChange={(e) =>
                              handleNilaiVarianChange(
                                index,
                                idx,
                                "varian",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-600">
                            Nilai
                          </label>
                          <input
                            type="text"
                            value={nv.nilai}
                            onChange={(e) =>
                              handleNilaiVarianChange(
                                index,
                                idx,
                                "nilai",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-5 py-2 text-sm font-medium text-white bg-[#EDCF5D] rounded hover:brightness-110 cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalEditProduk;
