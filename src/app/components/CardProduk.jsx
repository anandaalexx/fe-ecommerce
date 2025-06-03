"use client";
import { Heart } from "lucide-react";
import React from "react";

const CardProduk = ({ product }) => {
  return (
    <div className="w-full flex flex-col items-start gap-2 cursor-pointer group">
      {/* Gambar Produk dengan Icon */}
      <div className="w-full h-52 bg-gray-500/10 rounded-lg relative p-4">
        <img
          src={
            product.gambarUrls?.[0]?.url ||
            product.varianProduk?.[0]?.gambarVarian?.[0]?.url ||
            "/no-pictures.png"
          }
          alt={product.nama}
          className="w-full h-40 object-contain transition-transform group-hover:scale-110"
        />
      </div>

      {/* Nama Produk */}
      <h3 className="text-gray-900 font-medium text-lg leading-tight truncate w-full">
        {product.nama}
      </h3>

      {/* Deskripsi Singkat */}
      <p className="text-gray-500/70 text-xs leading-tight truncate w-full">
        {product.deskripsi}
      </p>

      {/* Harga & Tombol */}
      <div className="flex justify-between items-center w-full mt-1">
        <span className="text-md font-medium text-gray-900">
          Rp {product.hargaTerendah.toLocaleString("id-ID")}
        </span>
        <button className="px-3 py-1 text-sm font-light border border-gray-500/20 rounded-full text-gray-500 hover:bg-slate-50 transition cursor cursor-pointer">
          Beli
        </button>
      </div>
    </div>
  );
};

export default CardProduk;
