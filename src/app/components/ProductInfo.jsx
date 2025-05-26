"use client";
import React, { useState, useEffect } from "react";
import Button from "./Button";

const ProductInfo = ({ product, onAddToCart, quantity, setQuantity }) => {
  const [selectedVariants, setSelectedVariants] = useState({});
  const [displayedPrice, setDisplayedPrice] = useState(null);

  // Mengelompokkan nilai varian
  const variantMap = {};
  product.varianProduk.forEach((vp) => {
    vp.nilaiVarian.forEach(({ varian, nilai }) => {
      if (!variantMap[varian]) {
        variantMap[varian] = new Set();
      }
      variantMap[varian].add(nilai);
    });
  });

  // SET HARGA LANGSUNG jika tidak ada varian
  useEffect(() => {
    if (
      product.varianProduk.length === 1 &&
      product.varianProduk[0].nilaiVarian.length === 0
    ) {
      setDisplayedPrice(parseInt(product.varianProduk[0].harga));
    }
  }, [product]);

  const handleVariantClick = (varianName, nilai) => {
    const currentSelected = selectedVariants[varianName];

    // Toggle: jika diklik lagi, maka hapus pilihan
    const updatedVariants = { ...selectedVariants };
    if (currentSelected === nilai) {
      delete updatedVariants[varianName];
    } else {
      updatedVariants[varianName] = nilai;
    }

    setSelectedVariants(updatedVariants);

    const totalVariantTypes = Object.keys(variantMap).length;
    const isAllVariantsSelected =
      Object.keys(updatedVariants).length === totalVariantTypes;

    if (isAllVariantsSelected) {
      const matched = product.varianProduk.find((vp) =>
        vp.nilaiVarian.every(
          ({ varian, nilai }) => updatedVariants[varian] === nilai
        )
      );

      if (matched) {
        setDisplayedPrice(parseInt(matched.harga));
      } else {
        setDisplayedPrice("Varian tidak tersedia");
      }
    } else {
      setDisplayedPrice(null); // Reset harga jika tidak semua varian dipilih
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-bold">{product.penjual}</p>
      <h2 className="text-4xl font-bold">{product.nama}</h2>

      {/* Harga */}
      <p className="text-4xl font-bold text-gray-800">
        {displayedPrice === null
          ? "Pilih varian"
          : typeof displayedPrice === "string"
          ? displayedPrice
          : `Rp ${displayedPrice.toLocaleString("id-ID")}`}
      </p>

      {/* Pilihan Varian */}
      {Object.keys(variantMap).length > 0 &&
        Object.entries(variantMap).map(([varianName, nilaiSet]) => (
          <div key={varianName}>
            <h4 className="text-lg font-semibold mb-1 capitalize">
              {varianName}
            </h4>
            <div className="flex gap-2 flex-wrap">
              {[...nilaiSet].map((nilai) => (
                <button
                  key={nilai}
                  onClick={() => handleVariantClick(varianName, nilai)}
                  className={`px-3 py-1 rounded-md text-md font-medium border cursor-pointer ${
                    selectedVariants[varianName] === nilai
                      ? "bg-[#EDCF5D] text-white border-gray-300"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {nilai}
                </button>
              ))}
            </div>
          </div>
        ))}

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
      <Button
        disabled={typeof displayedPrice !== "number"}
        onClick={() => {
          const totalVariantTypes = Object.keys(variantMap).length;
          const isAllVariantsSelected =
            Object.keys(selectedVariants).length === totalVariantTypes;

          let matchedVariant = null;

          if (isAllVariantsSelected) {
            matchedVariant = product.varianProduk.find((vp) =>
              vp.nilaiVarian.every(
                ({ varian, nilai }) => selectedVariants[varian] === nilai
              )
            );
          } else if (
            product.varianProduk.length === 1 &&
            product.varianProduk[0].nilaiVarian.length === 0
          ) {
            matchedVariant = product.varianProduk[0];
          }

          if (matchedVariant) {
            onAddToCart(matchedVariant.id, quantity);
          }
        }}
      >
        Tambah ke keranjang
      </Button>
    </div>
  );
};

export default ProductInfo;
