"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGallery from "../../components/ProductGallery";
import ProductInfo from "../../components/ProductInfo";
import TabsDetail from "../../components/TabDetail";
import ToastNotification from "@/app/components/ToastNotification";
import PopupNotification from "@/app/components/PopupNotification";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          fetch(`${apiUrl}/product/${id}`, {
            credentials: "include",
          }),
          fetch(`${apiUrl}/ulasan/${id}`, {
            credentials: "include",
          }),
        ]);

        const productData = await productRes.json();
        const reviewData = await reviewsRes.json();

        console.log("Data produk:", productData);
        console.log("Data ulasan:", reviewData);

        setProduct(productData);

        if (reviewData.success) {
          console.log(reviewData);
          const mappedReviews = reviewData.data.map((review) => ({
            name: review.nama || "Pengguna Anonim",
            avatar: "/default-avatar.png",
            timeAgo: new Date(review.tanggal).toLocaleDateString("id-ID"),
            rating: review.rating,
            comment: review.komentar,
          }));
          setReviews(mappedReviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Gagal fetch data produk atau review:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const handleImageClick = (clickedImg) => {
    const matchedVariant = product.varianProduk.find((vp) =>
      vp.gambarVarian.some((gv) => gv.url === clickedImg)
    );

    if (matchedVariant) {
      const newSelected = {};
      matchedVariant.nilaiVarian.forEach(({ varian, nilai }) => {
        newSelected[varian] = nilai;
      });

      // Set selectedVariants ke kombinasi dari gambar
      setSelectedVariants(newSelected);

      // Update harga
      setDisplayedPrice(parseInt(matchedVariant.harga));

      // Set mainImage juga (opsional kalau belum diatur sebelumnya)
      setMainImage(clickedImg);
    }
  };

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
        showToast("Produk berhasil ditambahkan ke keranjang", "success");
      } else {
        showToast(data.message || "Gagal menambahkan produk", "error");
      }
    } catch (err) {
      showToast(err.message || "Terjadi kesalahan saat menambahkan ke keranjang", "error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Produk tidak ditemukan</p>;

  return (
    <>
      <Navbar />
      {toast.show && (
        <ToastNotification
          key={toast.message}
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          action={{
            label: "Lihat Keranjang",
            onClick: () => {
              window.location.href = "/keranjang";
            },
          }}
        />
      )}

      <PopupNotification
        show={popup.show}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, show: false })}
      />

      <div className="bg-gray-100 pt-48 pb-12">
        <div className="max-w-7xl bg-white shadow-xl rounded-md overflow-hidden mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery
            images={[
              ...product.gambarUrls.map((g) => g.url),
              ...product.varianProduk.flatMap((v) =>
                v.gambarVarian.map((gv) => gv.url)
              ),
            ]}
            mainImage={mainImage}
            setMainImage={setMainImage}
          />

          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            setMainImage={setMainImage} // ✅ tambahan ini
          />
          
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 mt-10 gap-8">
            <div className="md:col-span-2">
              <ProductGallery product={product} />
              <TabsDetail description={product.deskripsi} reviews={reviews} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
