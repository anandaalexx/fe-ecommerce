"use client";
import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import Button from "../Button";

const AddProduct = () => {
  const [images, setImages] = useState(Array(6).fill(null));
  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [variantName, setVariantName] = useState(""); // contoh: Warna, Ukuran
  const [variantOptions, setVariantOptions] = useState([]); // list jenis varian
  const [variantInput, setVariantInput] = useState(""); // input untuk menambah opsi varian\
  const inputRefs = useRef([]);

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

  const handleRemoveVariantOption = (index) => {
    const updatedOptions = variantOptions.filter((_, i) => i !== index);
    setVariantOptions(updatedOptions);
  };

  const handleAddVariantOption = () => {
    if (variantInput.trim()) {
      setVariantOptions([...variantOptions, variantInput.trim()]);
      setVariantInput("");
    }
  };

  const handleSubmit = () => {
    console.log({
      images,
      namaProduk,
      deskripsi,
      kategori,
      harga,
      stok,
      variant: {
        name: variantName,
        options: variantOptions,
      },
    });
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
                <CloudUpload className="absolute text-gray-500" size={24} />
                <label className="text-gray-500 absolute text-xs top-10">
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

      {/* Varian */}
      <div className="mb-4">
        <label className="block text-md font-medium text-gray-700 mb-2">
          Nama Varian (contoh: Warna, Ukuran)
        </label>
        <input
          type="text"
          value={variantName}
          onChange={(e) => setVariantName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-sm mb-2"
          placeholder="Masukkan nama varian"
        />

        <div className="flex mb-2">
          <input
            type="text"
            value={variantInput}
            onChange={(e) => setVariantInput(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-sm mr-2"
            placeholder="Tambahkan jenis varian (contoh: Merah, XL)"
          />
          <button
            type="button"
            onClick={handleAddVariantOption}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDCF5D] active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a] text-white font-medium rounded hover:brightness-110 transition duration-200 cursor-pointer"
          >
            Tambah
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {variantOptions.map((option, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {option}
              <button
                onClick={() => handleRemoveVariantOption(idx)}
                className="text-gray-700 hover:text-red-700 text-sm cursor-pointer"
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Kategori, Harga, dan Stok */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <input
            type="text"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-sm"
            placeholder="Masukkan kategori"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Harga
          </label>
          <input
            type="number"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-sm"
            placeholder="Masukkan harga"
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
            className="w-full p-3 border border-gray-300 rounded-sm"
            placeholder="Masukkan stok"
          />
        </div>
      </div>

      {/* Tombol Tambah */}
      <div className="flex justify-center">
        <Button onClick={handleSubmit} className="font-medium">
          Tambah Produk
        </Button>
      </div>
    </div>
  );
};

export default AddProduct;
