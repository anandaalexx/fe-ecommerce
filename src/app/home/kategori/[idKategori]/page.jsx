"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import DetailProduk from "../../../components/DetailProduk";
import ProductList from "../../../components/ProductList";
import Footer from "../../../components/Footer";

export default function Home() {
  const params = useParams();
  const idKategori = params?.idKategori;
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/category/view`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("❌ Gagal mengambil kategori:", error);
      }
    };

    getCategories();
  }, [apiUrl]);

  useEffect(() => {
    if (!idKategori) return;
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/product/category/${idKategori}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [idKategori, apiUrl]);

  useEffect(() => {
    if (!idKategori || categories.length === 0) return;

    const selectedCategory = categories.find(
      (cat) => String(cat.id) === String(idKategori)
    );
    if (selectedCategory) {
      setCategoryName(selectedCategory.nama);
    }
  }, [idKategori, categories]);

  return (
    <div>
      <Navbar />
      <div className="pt-38"></div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-semibold mb-6">{categoryName}</h2>
        {loading ? (
          <p>Memuat data produk...</p>
        ) : error ? (
          <p className="text-red-600">❌ {error}</p>
        ) : products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p>Tidak ada produk ditemukan.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
