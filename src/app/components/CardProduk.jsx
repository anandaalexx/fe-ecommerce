"use client";
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="w-52 bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-48 h-48 object-contain"
      />
      <div className="p-2">
        {" "}
        {/* Kurangi padding menjadi p-2 */}
        {/* Product Brand */}
        <p className="text-gray-1200 text-lg">{product.brand}</p>{" "}
        {/* Ukuran teks lebih kecil */}
        {/* Product Name */}
        <h3 className="text-xl font-semibold mt-2">{product.name}</h3>{" "}
        {/* Ukuran teks lebih kecil */}
        {/* Product Rating */}
        <div className="flex items-center mt-2 text-lg">
          {" "}
          {/* Ukuran teks lebih kecil */}
          <span className="text-yellow-500">★</span>
          <span className="ml-1 text-gray-700">{product.rating}</span>
          <span className="ml-2 text-gray-500">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
