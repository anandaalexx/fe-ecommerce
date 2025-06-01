"use client";
import React from "react";
import Link from "next/link";
import CardProduk from "./CardProduk";

const ProductList = ({ products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <CardProduk product={product} />
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
