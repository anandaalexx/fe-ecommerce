"use client";
import React from "react";
import ProductCard from "./CardProduk";

const ProductList = ({ products }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
