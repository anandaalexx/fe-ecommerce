"use client";

import PesananCard from "../components/PesananCard";
import Navbar from "../components/Navbar";

const pesanan = () => {
  return (
    <>
      <Navbar />
      <main className="pt-[200px] p-6 space-y-4">
        <PesananCard />
      </main>
    </>
  );
};

export default pesanan;