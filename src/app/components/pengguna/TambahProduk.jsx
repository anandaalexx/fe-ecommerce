"use client";
import { useRef, useState, useEffect } from "react";
import { CloudUpload } from "lucide-react";
import Button from "../Button";
import { useRouter } from "next/navigation";
import VariantModal from "./modals/TambahVarian";

const AddProduct = () => {
  const [images, setImages] = useState(Array(6).fill(null));
  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [parsedVariants, setParsedVariants] = useState([]);
  const [variantCombinations, setVariantCombinations] = useState([]);

  const [showVariantModal, setShowVariantModal] = useState(false);

  const inputRefs = useRef([]);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch(`${apiUrl}/category/view`);
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
      const updatedImages = [...images];
      updatedImages[index] = URL.createObjectURL(files[0]);
      setImages(updatedImages);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
    if (inputRefs.current[index]) {
      inputRefs.current[index].value = "";
    }
  };

  // Simpan data varian dari modal
  const handleSaveVariants = ({ variants, combinations }) => {
    setParsedVariants(variants);
    setVariantCombinations(combinations);
    setShowVariantModal(false);
  };

  console.log("varian:", parsedVariants);
  console.log("variantCombinations:", variantCombinations);

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
        nilai: variant.options,
      }));

      variantCombinations.forEach((combo, index) => {
        console.log(`Combo ${index}:`, combo.nama.split(" / "));
      });

      payload.produkVarian = variantCombinations.map((combo) => ({
        harga: parseInt(combo.harga),
        stok: parseInt(combo.stok),
        nilaiVarian: combo.nama.split(" / ").map((nilai, idx) => ({
          varian: parsedVariants[idx].nama,
          nilai: nilai,
        })),
      }));
    }

    console.log("Payload yang dikirim:", payload);

    try {
      const res = await fetch(`${apiUrl}/product/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Respon error dari server:", res.status, errorText);
        throw new Error("Gagal menambahkan produk");
      }

      const data = await res.json();
      console.log("Produk berhasil ditambahkan:", data);
      router.push("/pengguna/list-produk");
    } catch (err) {
      console.error("Error saat submit:", err.message);
    }
  };

  return (
    <div className="max-w-3xl p-6 items-start">
      {/* Upload Gambar */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center relative bg-gray-100"
          >
            {image ? (
              <>
                <img
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 text-gray-700 w-5 h-5 flex items-center justify-center text-xl hover:text-red-600"
                  type="button"
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <CloudUpload
                  className="absolute bottom-11 text-gray-500"
                  size={24}
                />
                <label className="text-gray-500 absolute text-xs top-13">
                  Upload Gambar
                </label>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, index)}
              className="absolute inset-0 opacity-0 cursor-pointer"
              ref={(el) => (inputRefs.current[index] = el)}
            />
          </div>
        ))}
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
                    <span
                      key={j}
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
