"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGallery from "../../components/ProductGallery";
import ProductInfo from "../../components/ProductInfo";
import TabsDetail from "../../components/TabDetail";
import ToastNotification from "@/app/components/ToastNotification";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
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

  const handleAddToCart = async (variantId, jumlah) => {
    try {
      if (!variantId) throw new Error("Varian produk tidak valid");

      const response = await fetch(`${apiUrl}/cart/add/${variantId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jumlah }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotificationMessage(
          data.message || "Produk berhasil ditambahkan ke keranjang!"
        );
        setShowNotification(true);
      } else {
        throw new Error(data.message || "Gagal menambahkan ke keranjang");
      }
    } catch (err) {
      setNotificationMessage(
        err.message || "Terjadi kesalahan saat menambahkan ke keranjang."
      );
      setShowNotification(true);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Produk tidak ditemukan</p>;

  return (
    <>
      <Navbar />
      {showNotification && (
        <ToastNotification
          key={notificationMessage}
          message={notificationMessage}
          show={showNotification}
          onClose={() => setShowNotification(false)}
          action={{
            label: "Lihat Keranjang",
            onClick: () => {
              window.location.href = "/keranjang";
            },
          }}
        />
      )}

      <div className="bg-gray-100 pt-48 pb-12">
        <div className="max-w-7xl bg-white shadow-xl rounded-md overflow-hidden mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={product.images || []} />
          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
          />

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
