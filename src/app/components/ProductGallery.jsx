"use client";
import React, { useState } from "react";

const ProductGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-2">
      <img
        src={mainImage}
        alt="Main"
        className="w-full h-120 object-contain bg-gray-100 rounded-md"
      />
      <div className="flex gap-5">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className="w-21 h-21 object-cover bg-gray-200 rounded cursor-pointer hover:ring-2 hover:ring-yellow-400"
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
