"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import ProductList from "../../components/ProductList";
import Footer from "../../components/Footer";

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get("keyword")?.trim().toLowerCase() || "";
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!keyword.trim()) return;
    
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/product`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Gagal memuat produk");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  useEffect(() => {
    if (!keyword) {
      setFilteredProducts(products);
      return;
    }
    // filter products yang mengandung keyword di nama atau deskripsi (ubah sesuai data kamu)
    const filtered = products.filter((product) => {
      return (
        product.nama?.toLowerCase().includes(keyword) ||
        product.deskripsi?.toLowerCase().includes(keyword)
      );
    });
    setFilteredProducts(filtered);
  }, [keyword, products]);

  return (
    <div>
      <Navbar />
      <div className="pt-48"></div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-semibold mb-6">
          Hasil pencarian:{" "}
          <span className="italic text-blue-600">"{keyword}"</span>
        </h2>

        {loading ? (
          <p>Memuat data produk...</p>
        ) : error ? (
          <p className="text-red-600">❌ {error}</p>
        ) : filteredProducts.length > 0 ? (
          <ProductList products={filteredProducts} />
        ) : (
          <p>Tidak ada produk ditemukan untuk kata kunci tersebut.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
