// app/not-found.jsx
"use client";

import Link from "next/link";

export default function NotFound() {
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
        Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="text-white px-4 py-2 rounded-lg transition"
        style={{ backgroundColor: "#EDCF5D" }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
