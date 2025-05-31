"use client";

import PesananCard from "../components/PesananCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pesanan = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl pt-[200px] p-6 space-y-4 mx-auto">
        <h2 className="font-medium text-lg">Detail Pesanan Anda</h2>
        <PesananCard />
      </main>
      <Footer />
    </>
  );
};

export default pesanan;
