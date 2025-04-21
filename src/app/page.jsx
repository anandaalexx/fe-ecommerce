import Image from "next/image";
import Navbar from "./components/Navbar";
import Banner from "./components/BannerSection";
import DetailProduk from "./components/DetailProduk";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Banner />
    </div>
  );
}
