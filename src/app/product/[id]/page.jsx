"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGallery from "../../components/ProductGallery";
import ProductInfo from "../../components/ProductInfo";
import TabsDetail from "../../components/TabDetail";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${apiUrl}/product/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Gagal fetch produk:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      console.log("Product data:", product);
      const selectedVarian = product?.varianProduk?.[0];

      if (!selectedVarian?.id) {
        throw new Error("Varian produk tidak valid");
      }

      const response = await fetch(`${apiUrl}/cart/add/${selectedVarian.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jumlah: 1 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menambahkan ke keranjang");
      }
      if (response.ok) {
        throw new Error("Berhasil menambahkan ke keranjang");
      }

      setNotificationMessage(
        data.message || "Produk berhasil ditambahkan ke keranjang!"
      );
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error("Error details:", err);
      setNotificationMessage(
        err.message || "Terjadi kesalahan saat menambahkan ke keranjang."
      );
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Produk tidak ditemukan</p>;

  return (
    <>
      <Navbar />
      {showNotification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {notificationMessage}
        </div>
      )}
      <div className="bg-gray-100 pt-48 pb-12">
        <div className="max-w-7xl bg-white shadow-xl rounded-md overflow-hidden mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={product.images || []} />
          <ProductInfo product={product} onAddToCart={handleAddToCart} />

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 mt-10 gap-8">
            <div className="md:col-span-2">
              <TabsDetail description={product.deskripsi} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
