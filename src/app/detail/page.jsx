"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function DetailProduk() {
  const [kuantitas, setKuantitas] = useState(1);

  const produk = {
    toko: "Tokoloko",
    nama: "iPhone 18 Pro Max",
    harga: 70000,
    rating: 4,
    ulasan: 30,
    warnaOpsi: ["#FF0000", "#00FF00", "#0000FF", "#000000", "#FFFFFF"],
    penyimpananOpsi: ["8/256", "8/256", "8/256", "8/256", "8/256"],
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 py-6 px-12 bg-white shadow-md rounded-lg flex gap-32">
      {/* Gambar Produk */}
      <div className="flex flex-col gap-4 w-1/2">
        <div className="bg-gray-300 w-full h-96 rounded-lg"></div>
        <div className="flex gap-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 w-24 h-24 rounded-md mx-1"
            ></div>
          ))}
        </div>
      </div>

      {/* Detail Produk */}
      <div className="w-1/2 ">
        <h2 className="text-lg font-semibold">{produk.toko}</h2>
        <h1 className="text-2xl font-bold">{produk.nama}</h1>
        <div className="flex items-center gap-1 text-[#EDCF5D] mt-2">
          {"⭐".repeat(produk.rating)}{" "}
          <span className="text-gray-500">({produk.ulasan} Ulasan)</span>
        </div>
        <p className="text-3xl font-bold mt-6">
          Rp {produk.harga.toLocaleString()}
        </p>

        {/* Pilihan Warna */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold">Warna</h3>
          <div className="flex gap-2 mt-2">
            {produk.warnaOpsi.map((warna, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-md border"
                style={{ backgroundColor: warna }}
              ></div>
            ))}
          </div>
        </div>

        {/* Pilihan Penyimpanan */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold">Penyimpanan</h3>
          <div className="flex gap-2 mt-2">
            {produk.penyimpananOpsi.map((opsi, index) => (
              <button
                key={index}
                className="border px-4 py-2 rounded-md bg-gray-100"
              >
                {opsi}
              </button>
            ))}
          </div>
        </div>

        {/* Kuantitas */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold">Kuantitas</h3>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setKuantitas(Math.max(1, kuantitas - 1))}
              className="px-3 pb-1 border rounded-md"
            >
              -
            </button>
            <span>{kuantitas}</span>
            <button
              onClick={() => setKuantitas(kuantitas + 1)}
              className="px-3 pb-1 border rounded-md"
            >
              +
            </button>
          </div>
        </div>

        {/* Tombol Tambah ke Keranjang */}
        <button className="w-full bg-[#EDCF5D] text-white py-3 mt-6 flex items-center justify-center gap-2 cursor-pointer rounded-md shadow-md hover:bg-[rgba(237,207,93,0.8)]">
          <ShoppingCart /> Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}
