"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Banner from "../components/BannerSection";
import DetailProduk from "../components/DetailProduk";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${apiUrl}/product/`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="pt-38">
        <Banner />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-semibold mb-6">Produk Unggulan</h2>
        <ProductList products={products} />
      </div>
      <Footer />
    </div>
  );
}
