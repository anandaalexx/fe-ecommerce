"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center p-4 bg-white">
      <img
        src="./404.svg"
        alt="Orang Menjulurkan Lidah"
        className="w-64 h-64 mb-6"
      />
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        404 - Halaman Tidak Ditemukan
      </h1>
      <p className="text-gray-600 mb-6">
        Maaf, halaman atau produk yang kamu cari tidak tersedia atau telah
        dipindahkan.
      </p>
      <button
        onClick={() => router.back()}
        className="text-white px-4 py-2 rounded-lg transition"
        style={{ backgroundColor: "#EDCF5D" }}
      >
        Kembali
      </button>
    </div>
  );
}
