import Image from "next/image";
import Navbar from "./components/Navbar";
import DetailProduk from "./components/DetailProduk";

export default function Home() {
  return (
    <div>
      <Navbar />
      <DetailProduk />
    </div>
  );
}
