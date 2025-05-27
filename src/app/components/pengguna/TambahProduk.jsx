"use client";
import { useRef, useState, useEffect } from "react";
import { CloudUpload } from "lucide-react";
import Button from "../Button";
import { useRouter } from "next/navigation";
import VariantModal from "./modals/TambahVarian";

const AddProduct = () => {
  const [images, setImages] = useState([{ preview: null, file: null }]);
  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [parsedVariants, setParsedVariants] = useState([]);
  const [variantCombinations, setVariantCombinations] = useState([]);
  const [pendingUploads, setPendingUploads] = useState([]);

  const [showVariantModal, setShowVariantModal] = useState(false);

  const inputRefs = useRef([]);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch(`${apiUrl}/category/view`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setKategoriList(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchKategori();
  }, [apiUrl]);

  const handleImageChange = (e, index) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      const updatedImages = [...images];
      updatedImages[index] = { preview, file };
      setImages(updatedImages);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = { preview: null, file: null };
    setImages(updatedImages);
    if (inputRefs.current[index]) {
      inputRefs.current[index].value = "";
    }
  };

  const getAllPreviewImages = () => {
    const mainImages = images.filter((img) => img.preview !== null);
    const variantImages = pendingUploads.map((item) => ({
      preview: URL.createObjectURL(item.file),
      label: `${item.variantNama}: ${item.optionNama}`,
    }));
    return [...mainImages, ...variantImages];
  };

  // Simpan data varian dari modal
  const handleSaveVariants = ({ variants, combinations, pendingUploads }) => {
    setParsedVariants(variants);
    setVariantCombinations(combinations);
    setPendingUploads(pendingUploads);
    setShowVariantModal(false);
  };

  const handleSubmit = async () => {

    if (!namaProduk || !deskripsi || !kategori) {
      alert("Nama produk, deskripsi, dan kategori wajib diisi!");
      return;
    }

    // Validasi untuk produk tanpa varian
    if (parsedVariants.length === 0 && (!harga || !stok)) {
      alert("Harga dan stok wajib diisi untuk produk tanpa varian!");
      return;
    }

    // Validasi untuk produk dengan varian
    if (parsedVariants.length > 0) {
      const incompleteCombinations = variantCombinations.some(
        (combo) => !combo.harga || !combo.stok
      );

      if (incompleteCombinations) {
        alert("Semua kombinasi varian harus memiliki harga dan stok!");
        return;
      }
    }

    // Siapkan payload dasar
    const payload = {
      namaProduk,
      deskripsi,
      idKategori: parseInt(kategori),
    };

    // Jika tidak ada varian, tambahkan harga dan stok langsung
    if (parsedVariants.length === 0) {
      payload.harga = parseInt(harga);
      payload.stok = parseInt(stok);
    } else {
      // Jika ada varian, siapkan struktur varian
      payload.varian = parsedVariants.map((variant) => ({
        nama: variant.nama,
        nilai: variant.options.map(option => option.nama), // ← Ambil hanya .nama saja
      }));

      variantCombinations.forEach((combo, index) => {
      });

      payload.produkVarian = variantCombinations.map((combo) => ({
        harga: parseInt(combo.harga),
        stok: parseInt(combo.stok),
        nilaiVarian: combo.nilai.map((nilaiObj, idx) => ({
          varian: parsedVariants[idx].nama,
          nilai: nilaiObj.nama, // ← karena kamu sudah simpan object {nama, gambar}
        }))
      }));
    }

    try {
      // 1. Tambahkan produk terlebih dahulu
      const res = await fetch(`${apiUrl}/product/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Respon error dari server:", res.status, errorText);
        throw new Error("Gagal menambahkan produk");
      }

      const data = await res.json();

      const idProdukBaru = data.data.produk.id;
      const varianProduk = data.data.produk.varianProduk; 

      // 2. Upload gambar jika ada
      if (images.length > 0) {
        for (const image of images) {
          const formData = new FormData();
          formData.append("image", image.file); // ← dari state images
          formData.append("idProduk", idProdukBaru);

          try {
            const uploadRes = await fetch(`${apiUrl}/foto-produk`, {
              method: "POST",
              body: formData,
              credentials: "include", // opsional kalau butuh cookie login
            });

            if (!uploadRes.ok) {
              const errText = await uploadRes.text();
              console.error("Gagal upload gambar:", errText);
            } else {
              const uploadData = await uploadRes.json();
            }
          } catch (uploadErr) {
            console.error("Error saat upload gambar:", uploadErr.message);
          }
        }
      }

      // 3. Upload gambar varian produk jika ada
      if (pendingUploads && pendingUploads.length > 0) {
        for (let i = 0; i < pendingUploads.length; i++) {
          const item = pendingUploads[i];
          const formData = new FormData();

          const idVarianProduk = varianProduk[i]?.id; // Ambil ID varian dari respons

          if (!idVarianProduk) {
            console.warn(`ID varian tidak ditemukan untuk upload index ke-${i}`);
            continue;
          }

          formData.append("image", item.file);
          formData.append("idVarianProduk", idVarianProduk);

          try {
            const resVarianUpload = await fetch(`${apiUrl}/foto-varian-produk`, {
              method: "POST",
              body: formData,
              credentials: "include",
            });

            if (!resVarianUpload.ok) {
              const errText = await resVarianUpload.text();
              console.error("Gagal upload foto varian:", errText);
            } else {
              const varianData = await resVarianUpload.json();
            }
          } catch (err) {
            console.error("Error upload gambar varian:", err.message);
          }
        }
      }

      // 3. Redirect setelah selesai semua
      router.push("/pengguna/list-produk");

    } catch (err) {
      console.error("Error saat submit:", err.message);
    }
  };

  return (
    <div className="max-w-3xl p-6 items-start">
      {/* Upload Gambar */}
      {/* Upload Gambar & Preview Semua (Produk + Varian) */}
      <div className="flex gap-4 flex-wrap mb-6">
        {[...images, ...pendingUploads.map((item) => ({
          preview: URL.createObjectURL(item.file),
          file: item.file,
          label: `${item.variantNama}: ${item.optionNama}`,
          isVariant: true,
        }))].map((image, index) => (
          <div
            key={index}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center relative bg-gray-100"
          >
            {image.preview ? (
              <>
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                {!image.isVariant && (
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 text-gray-700 w-5 h-5 flex items-center justify-center text-xl hover:text-red-600"
                    type="button"
                  >
                    ×
                  </button>
                )}
                {image.label && (
                  <div className="absolute bottom-0 w-full text-[10px] text-center bg-black bg-opacity-50 text-white px-1 py-[1px] truncate">
                    {image.label}
                  </div>
                )}
              </>
            ) : (
              <>
                <CloudUpload className="text-gray-500" size={24} />
                <label className="absolute text-xs bottom-2 text-gray-500">
                  Upload
                </label>
              </>
            )}
            {!image.isVariant && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                ref={(el) => (inputRefs.current[index] = el)}
              />
            )}
          </div>
        ))}

        {/* Tombol Tambah Gambar */}
        <button
          type="button"
          onClick={() => setImages([...images, { preview: null, file: null }])}
          className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 text-3xl font-bold hover:bg-gray-200 transition"
        >
          +
        </button>
      </div>

      {/* Nama Produk */}
      <div className="mb-4">
        <label className="block text-md font-medium text-gray-700 mb-2">
          Nama Produk
        </label>
        <input
          type="text"
          value={namaProduk}
          onChange={(e) => setNamaProduk(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-sm"
          placeholder="Masukkan nama produk"
        />
      </div>

      {/* Deskripsi */}
      <div className="mb-4">
        <label className="block text-md font-medium text-gray-700 mb-2">
          Deskripsi
        </label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-sm"
          placeholder="Masukkan deskripsi produk"
          rows={4}
        />
      </div>

      {/* Varian Produk */}
      <div className="mb-6">
        <label className="block text-md font-medium text-gray-700 mb-2">
          Varian Produk
        </label>
        <button
          type="button"
          onClick={() => setShowVariantModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDCF5D] active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a] text-white font-medium rounded hover:brightness-110 transition duration-200 cursor-pointer"
        >
          Tambah Varian
        </button>

        {/* Ringkasan Varian */}
        {parsedVariants.length > 0 && (
          <div className="mt-4 space-y-2">
            {parsedVariants.map((variant, i) => (
              <div key={i} className="border border-gray-300 rounded-md p-3">
                <p className="font-medium text-sm text-gray-800">
                  {variant.nama}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {variant.options.map((opt, j) => (
                    <span key={j} className="bg-gray-200 text-sm px-2 py-1 rounded">
                      {opt.nama}   {/* Render properti nama dari objek */}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {pendingUploads.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">Gambar untuk Varian:</p>
          <div className="grid grid-cols-3 gap-4">
            {pendingUploads.map((item, index) => (
              <div key={index} className="border p-2 rounded-md shadow-sm">
                <img
                  src={URL.createObjectURL(item.file)}
                  alt={`${item.optionNama}-${index}`}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="text-sm text-gray-700">
                  <strong>{item.variantNama}:</strong> {item.optionNama}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Kategori, Harga, dan Stok */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">
            Kategori
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full p-3 border border-gray-300 roundedappearance-none bg-white"
          >
            <option value="">Pilih Kategori</option>
            {kategoriList.map((cat) => (
              <option
                key={cat.id || cat._id}
                value={cat.id || cat._id} // Gunakan ID sebagai value
              >
                {cat.name || cat.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Harga
          </label>
          <input
            type="number"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-sm disabled:cursor-not-allowed"
            placeholder="Masukkan harga"
            disabled={parsedVariants.length > 0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stok
          </label>
          <input
            type="number"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-sm disabled:cursor-not-allowed"
            placeholder="Masukkan stok"
            disabled={parsedVariants.length > 0}
          />
        </div>
      </div>

      {/* Tombol Tambah Produk */}
      <div className="flex justify-center">
        <Button onClick={handleSubmit} className="font-medium">
          Tambah Produk
        </Button>
      </div>

      <VariantModal
        show={showVariantModal}
        onClose={() => setShowVariantModal(false)}
        onSave={handleSaveVariants}
        initialVariants={parsedVariants}
      />
    </div>
  );
};

export default AddProduct;
