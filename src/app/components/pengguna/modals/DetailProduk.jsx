"use client";
import { Dialog } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ToastNotification from "../../ToastNotification";

const ModalDetailProduk = ({ isOpen, onClose, produk }) => {
  const [produkState, setProdukState] = useState(null);
  const [stokTambah, setStokTambah] = useState({});
  const [stokInputVisible, setStokInputVisible] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [newVariantImages, setNewVariantImages] = useState({});
  const [isUploading, setIsUploading] = useState(false);
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
    console.log("Isi produkState:", produk);
    
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
      alert("Terjadi kesalahan saat menambah stok");
    }
  };

  const handleHapusGambarProduk = async (idx) => {
    const foto = produkState.gambarUrls[idx];
    if (!foto) return;
    console.log("id foto", foto.id);

    try {
      await fetch(`http://localhost:2000/api/foto-produk/${foto.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      setProdukState((prev) => ({
        ...prev,
        gambarUrls: prev.gambarUrls.filter((_, i) => i !== idx),
      }));
    } catch (err) {
      console.error('Gagal menghapus gambar produk:', err);
    }
  };

  const handleHapusGambarVarian = async (idVarian, idx) => {
    const varian = produkState.varianProduk.find(v => v.id === idVarian);
    const foto = varian?.gambarVarian[idx];
    if (!foto) return;

    try {
      await fetch(`http://localhost:2000/api/foto-varian-produk/${foto.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      setProdukState((prev) => ({
        ...prev,
        varianProduk: prev.varianProduk.map((vp) =>
          vp.id === idVarian
            ? {
                ...vp,
                gambarVarian: vp.gambarVarian.filter((_, i) => i !== idx),
              }
            : vp
        ),
      }));
    } catch (err) {
      console.error('Gagal menghapus gambar varian:', err);
    }
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...newImages];
    updatedImages[index] = {
      preview: URL.createObjectURL(file),
      file,
    };

    setNewImages(updatedImages);
  };

  const handleTambahGambarVarian = (e, varianId, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...(newVariantImages[varianId] || [])];
    updatedImages[index] = {
      preview: URL.createObjectURL(file),
      file,
    };

    setNewVariantImages((prev) => ({
      ...prev,
      [varianId]: updatedImages,
    }));
  };

  const handleRemoveImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handleHapusGambarBaruVarian = (varianId, index) => {
    setNewVariantImages((prev) => {
      const updated = { ...prev };
      updated[varianId] = [...updated[varianId]];
      updated[varianId].splice(index, 1);
      if (updated[varianId].length === 0) delete updated[varianId];
      return updated;
    });
  };

  const uploadImagesToServer = async () => {
    if (!produkState?.id) {
      alert('ID produk tidak tersedia!');
      return;
    }

    setIsUploading(true);

    const idProduk = produkState.id;

    // 🔹 1. Upload gambar produk utama
    for (let i = 0; i < newImages.length; i++) {
      const image = newImages[i];
      if (!image.file) continue;

      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('idProduk', idProduk);

      try {
        const res = await fetch('http://localhost:2000/api/foto-produk', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload gagal');

        console.log('✅ Produk: Berhasil upload:', data);
      } catch (err) {
        console.error(`❌ Produk: Gagal upload gambar ke-${i + 1}:`, err.message);
      }
    }

    // 🔹 2. Upload gambar untuk tiap varian
    for (const [varianId, images] of Object.entries(newVariantImages)) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (!image?.file) continue;

        const formData = new FormData();
        formData.append('image', image.file);
        formData.append('idVarianProduk', varianId); // sesuai controller kamu

        try {
          const res = await fetch('http://localhost:2000/api/foto-varian-produk', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Upload varian gagal');

          console.log(`✅ Varian ${varianId}: Berhasil upload:`, data);
        } catch (err) {
          console.error(`❌ Varian ${varianId}: Gagal upload ke-${i + 1}:`, err.message);
        }
      }
    }

    setIsUploading(false);
    window.location.reload();
  };

  return (
    <Dialog as="div" open={isOpen} onClose={onClose}>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Dialog.Panel className="bg-white max-w-2xl w-full rounded-lg shadow-xl">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold mb-4">Detail Produk</Dialog.Title>

          {/* Gambar Produk */}
          <div className="flex gap-4 overflow-x-auto p-2">
            {produkState.gambarUrls.map((gambar, idx) => (
              <div key={gambar.id || idx} className="relative w-32 h-32 flex-shrink-0">
                <img src={gambar.url} alt={`Gambar ${idx + 1}`} className="w-full h-full object-cover rounded border" />
                <button
                  onClick={() => handleHapusGambarProduk(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}

            {newImages.map((image, index) => (
              <div key={index} className="relative w-32 h-32 flex-shrink-0 bg-gray-100 border-2 border-dashed rounded">
                {image.preview ? (
                  <>
                    <img src={image.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute top-1 right-1 text-white bg-red-500 w-5 h-5 flex items-center justify-center rounded-full text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <>
                    <span className="absolute bottom-2 w-full text-center text-xs text-gray-500">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setNewImages([...newImages, { preview: null, file: null }])}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex-shrink-0 flex items-center justify-center text-gray-500 text-3xl font-bold hover:bg-gray-200"
            >
              +
            </button>
          </div>

          {/* Informasi Produk */}
          <div className="mt-4 grid gap-y-1 gap-x-2" style={{ gridTemplateColumns: "max-content max-content 1fr" }}>
            <div className="contents"><span className="font-medium">Nama</span><span>:</span><span>{produkState.nama}</span></div>
            <div className="contents"><span className="font-medium">Deskripsi</span><span>:</span><span className="whitespace-pre-line">{produkState.deskripsi}</span></div>
            <div className="contents"><span className="font-medium">Berat</span><span>:</span><span>{produkState.berat}</span></div>
            <div className="contents"><span className="font-medium">Kategori</span><span>:</span><span>{produkState.kategori}</span></div>
            <div className="contents"><span className="font-medium">Penjual</span><span>:</span><span>{produkState.penjual}</span></div>
            <div className="contents"><span className="font-medium">Harga</span><span>:</span><span>{produkState.harga}</span></div>
          </div>

          {/* Varian Produk */}
          <div className="space-y-4">
            {produkState.varianProduk.map((vp) => (
              <div key={vp.id} className="border rounded p-3 space-y-2">
                
                {/* Gambar lama dan baru varian + upload */}
                {vp.nilaiVarian?.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {/* Gambar lama */}
                    {vp.gambarVarian?.length > 0 &&
                      vp.gambarVarian.map((gambar, idx) => (
                        <div key={`lama-${gambar.id || idx}`} className="relative w-20 h-20 flex-shrink-0">
                          <img src={gambar.url} alt={`Varian ${vp.sku} - ${idx + 1}`} className="w-full h-full object-cover rounded border" />
                          <button
                            onClick={() => handleHapusGambarVarian(vp.id, idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                    {/* Gambar baru */}
                    {(newVariantImages[vp.id] || []).map((image, index) => (
                      <div key={index} className="w-20 h-20 relative border-2 border-dashed rounded bg-gray-100 flex-shrink-0">
                        {image.preview ? (
                          <>
                            <img src={image.preview} alt="" className="w-full h-full object-cover rounded" />
                            <button
                              onClick={() => handleHapusGambarBaruVarian(vp.id, index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <label className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleTambahGambarVarian(e, vp.id, index)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </label>
                        )}
                      </div>
                    ))}

                    {/* Tombol tambah hanya jika belum ada gambar lama maupun baru */}
                    {vp.gambarVarian.length === 0 &&
                      !(newVariantImages[vp.id]?.some(img => img && img.file)) &&
                      (newVariantImages[vp.id]?.length || 0) < 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setNewVariantImages((prev) => ({
                              ...prev,
                              [vp.id]: [{ preview: null, file: null }],
                            }))
                          }
                          className="w-20 h-20 border-2 border-dashed text-xl text-gray-400 rounded flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      )}
                  </div>
                )}

                {/* Informasi SKU, harga, stok, dll */}
                <p><span className="font-medium">SKU:</span> {vp.sku}</p>
                <p><span className="font-medium">Harga:</span> Rp {parseInt(vp.harga).toLocaleString()}</p>
                <p><span className="font-medium">Status:</span> {vp.status}</p>

                {vp.nilaiVarian?.length > 0 && (
                  <p>
                    <span className="font-medium">Varian:</span>{" "}
                    {vp.nilaiVarian.map((nv) => `${nv.varian}: ${nv.nilai}`).join(", ")}
                  </p>
                )}

                {/* Input tambah stok */}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Stok:</span> {vp.stok}
                  {!stokInputVisible[vp.id] ? (
                    <button
                      onClick={() => setStokInputVisible({ ...stokInputVisible, [vp.id]: true })}
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
                        onChange={(e) => setStokTambah({ ...stokTambah, [vp.id]: e.target.value })}
                      />
                      <button
                        onClick={() => handleTambahStok(vp.id)}
                        className="bg-[#EDCF5D] text-white px-2 py-1 rounded hover:brightness-110 text-xs cursor-pointer"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setStokInputVisible((prev) => ({ ...prev, [vp.id]: false }))}
                        className="text-gray-500 hover:text-gray-700 px-2 py-1 text-xs rounded border border-gray-200 cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Tombol Aksi */}
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Tutup</button>

            {(newImages.some(img => img && img.file) || Object.values(newVariantImages).some(arr => arr.some(img => img && img.file))) && (
              <button
                onClick={uploadImagesToServer}
                className="px-4 py-2 bg-[#EDCF5D] text-white rounded hover:brightness-110"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  "Simpan"
                )}
              </button>
            )}
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