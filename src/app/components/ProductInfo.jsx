"use client";
import React, { useState } from "react";
import Button from "./Button";

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-bold">{product.brand}</p>
      <h2 className="text-4xl font-bold">{product.name}</h2>

      {/* Rating dan Jumlah Review (Dummy) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-[#EDCF5D] text-2xl">
          {/* Bintang Dummy */}
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span className="text-[#A4A4A4]">★</span>
        </div>
        {/* Jumlah review dummy */}
        <span className="text-xl text-[#A4A4A4]">|</span>
        <span className="text-xl mt-1 text-[#A4A4A4]"> 120 review</span>
      </div>

      {/* Harga */}
      <p className="text-4xl font-bold text-gray-800">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      {/* Pilihan Warna */}
      <div>
        <h4 className="text-lg font-semibold mb-1">Warna</h4>
        <div className="flex gap-2">
          {product.colors.map((color, index) => (
            <div
              key={index}
              className="w-8 h-10 rounded bg-gray-200 cursor-pointer"
            ></div>
          ))}
        </div>
      </div>

      {/* Pilihan Penyimpanan */}
      <div>
        <h4 className="text-lg font-semibold mb-1">Penyimpanan</h4>
        <div className="flex gap-2 flex-wrap">
          {product.storages.map((storage, index) => (
            <button
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-md text-md font-medium"
            >
              {storage}
            </button>
          ))}
        </div>
      </div>

      {/* Kuantitas */}
      <div>
        <h4 className="text-lg font-semibold mb-1">Kuantitas</h4>
        <div className="flex items-center bg-gray-200 rounded-md overflow-hidden w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-gray-600 hover:bg-gray-300 cursor-pointer"
          >
            -
          </button>
          <span className="px-6 py-2 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-300 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* Tombol Tambah ke Keranjang */}
      <Button>Tambah ke keranjang</Button>
    </div>
  );
};

export default ProductInfo;
