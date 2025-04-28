"use client";
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="w-40 bg-white shadow-md rounded-md overflow-hidden hover:scale-105 hover:ring-2 hover:ring-[#EDCF5D] transition-transform duration-300 cursor-pointer">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-36 object-contain p-2"
      />
      <div className="p-2">
        <p className="text-gray-600 text-sm">{product.brand}</p>
        <h3 className="text-gray-800 text-base font-semibold mt-1 truncate">
          {product.name}
        </h3>
        <p className="text-[#EDCF5D] font-bold mt-1 text-md">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
