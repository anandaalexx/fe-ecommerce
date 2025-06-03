"use client";
import React from "react";

const ProductGallery = ({ images, mainImage, setMainImage, onImageClick }) => {
  const displayedImage = mainImage || images?.[0];

  if (!images || images.length === 0) return <p>Tidak ada gambar</p>;

  return (
    <div className="flex flex-col gap-2">
      <img
        src={displayedImage}
        alt="Main"
        className="w-full h-120 object-contain bg-gray-100 rounded-md"
      />
      <div className="flex gap-5">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className={`w-21 h-21 object-cover bg-gray-200 rounded cursor-pointer hover:ring-2 ${
              img === mainImage ? "ring-2 ring-yellow-500" : ""
            }`}
            onClick={() => {
              setMainImage(img);
              if (onImageClick) {
                onImageClick(img); // Kirim balik ke parent
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
