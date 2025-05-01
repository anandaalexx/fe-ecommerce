"use client";
import { useState } from "react";
import { CloudUpload } from "lucide-react";
import Button from "../Button";

const AddProduct = () => {
  const [images, setImages] = useState(Array(6).fill(null)); // Untuk menyimpan gambar produk
  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [spesifikasi, setSpesifikasi] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState("");

  const handleImageChange = (e, index) => {
    const files = e.target.files;
    if (files && files[0]) {
      const updatedImages = [...images];
      updatedImages[index] = URL.createObjectURL(files[0]);
      setImages(updatedImages);
    }
  };

  const handleSubmit = () => {
    // Lakukan proses submit produk (misalnya kirim ke server)
    console.log({
      images,
      namaProduk,
      deskripsi,
      spesifikasi,
      kategori,
      harga,
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
              <img
                src={image}
                alt={`Product Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <CloudUpload
                  className="absolute transform -translate-y-1/2 text-gray-500"
                  size={24}
                />
                <label className="text-gray-500 absolute text-xs transform top-13 -translate-y-1/24">
                  Upload Gambar
                </label>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, index)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Input Nama Produk */}
      <div className="mb-4">
        <label
          htmlFor="namaProduk"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nama Produk
        </label>
        <input
          type="text"
          id="namaProduk"
          value={namaProduk}
          onChange={(e) => setNamaProduk(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Masukkan nama produk"
        />
      </div>

      {/* Input Deskripsi */}
      <div className="mb-4">
        <label
          htmlFor="deskripsi"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Masukkan deskripsi produk"
          rows={4}
        />
      </div>

      {/* Input Spesifikasi */}
      <div className="mb-4">
        <label
          htmlFor="spesifikasi"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Spesifikasi Barang
        </label>
        <textarea
          id="spesifikasi"
          value={spesifikasi}
          onChange={(e) => setSpesifikasi(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Kurang, variasi, stok, spseifikasi dihapus"
          rows={4}
        />
      </div>

      {/* Input Kategori dan Harga */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Input Kategori */}
        <div>
          <label
            htmlFor="kategori"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kategori
          </label>
          <input
            type="text"
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Masukkan kategori produk"
          />
        </div>

        {/* Input Harga */}
        <div>
          <label
            htmlFor="harga"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Harga
          </label>
          <input
            type="number"
            id="harga"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Masukkan harga produk"
          />
        </div>
      </div>

      {/* Tombol Add */}
      <div className="flex justify-center">
        <Button onClick={handleSubmit}>Tambah Produk</Button>
      </div>
    </div>
  );
};

export default AddProduct;
