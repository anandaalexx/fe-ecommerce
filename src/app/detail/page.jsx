"use client";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import TabsDetail from "../components/TabDetail";
import ReviewList from "../components/ReviewList";
import RatingSummary from "../components/RatingSummary";
import Navbar from "../components/Navbar";

const ProductDetailPage = ({ params }) => {
  const dummyProduct = {
    name: "IPhone 18 Pro Max",
    brand: "Tokoloko",
    price: 70000,
    colors: ["white", "black", "blue"],
    storages: ["8/256", "8/512"],
    images: [
      "iphone1.png",
      "iphone2.jpg",
      "iphone3.png",
      "iphone2.jpg",
      "iphone1.png",
    ],
    description: "Lorem ipsum deskripsi produk...",
    specification: "Lorem ipsum spesifikasi produk...",
    ratingSummary: {
      average: 4.0,
      total: 30,
      ratings: [
        { star: 5, count: 21 },
        { star: 4, count: 5 },
        { star: 3, count: 3 },
        { star: 2, count: 1 },
        { star: 1, count: 0 },
      ],
    },
    reviews: [
      {
        name: "Christian Felix",
        timeAgo: "2h yang lalu",
        rating: 5,
        comment: "Sangat bagus",
        avatar: "person.jpg",
      },
      {
        name: "Febriani",
        timeAgo: "4h yang lalu",
        rating: 5,
        comment: "Sangat baik",
        avatar: "person2.jpg",
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl bg-white shadow-xl rounded-md overflow-hidden mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={dummyProduct.images} />
          <ProductInfo product={dummyProduct} />

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 mt-10 gap-8">
            <div className="md:col-span-2">
              <TabsDetail
                description={dummyProduct.description}
                specification={dummyProduct.specification}
              />
              <ReviewList reviews={dummyProduct.reviews} />
            </div>
            <RatingSummary summary={dummyProduct.ratingSummary} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;