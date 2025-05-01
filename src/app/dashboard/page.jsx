import Image from "next/image";
import Navbar from "../components/Navbar";
import Banner from "../components/BannerSection";
import DetailProduk from "../components/DetailProduk";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

const dummyProducts = [
  {
    id: 1,
    image: "iPhone16.png",
    name: "Produk 1",
    brand: "Brand A",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 2,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 3,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 4,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 5,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 6,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 7,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 8,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 9,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 10,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 11,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 12,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 13,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
  {
    id: 14,
    image: "iPhone16.png",
    name: "Produk 2",
    brand: "Brand B",
    description: "Brand A",
    price: 20000000,
  },
];

export default function Home() {
  return (
    <div>
      <Navbar />
      <Banner />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-6">Produk Unggulan</h2>
        <ProductList products={dummyProducts} />
      </div>
      <Footer />
    </div>
  );
}