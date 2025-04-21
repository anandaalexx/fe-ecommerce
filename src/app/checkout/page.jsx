"use client";
import React from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { MapPin } from "lucide-react"; // Import icon MapPin

// Data dummy
const orders = [
  {
    id: 1,
    name: "IPhone 16 Pro Max",
    image: "/iPhone16.png",
    color: "Grey",
    size: "8/256",
    quantity: 2,
    price: 40000000,
  },
  {
    id: 2,
    name: "IPhone 16 Pro Max",
    image: "/iPhone16.png",
    color: "Grey",
    size: "8/256",
    quantity: 2,
    price: 40000000,
  },
];

export default function CheckoutPage() {
  const totalHarga = orders.reduce((sum, item) => sum + item.price, 0);
  const ongkosKirim = 120000;
  const totalTagihan = ongkosKirim;

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kiri */}
          <div className="md:col-span-2 space-y-4">
            {/* Alamat */}
            <div className="rounded-lg p-4 shadow-lg bg-white">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Alamat Pengiriman
              </h2>
              <hr className="my-3 text-[#A4A4A4]" />
              <p className="text-sm font-medium mt-2">
                Kos Dalam Ningrat, Jl. Sei Wain RT 033 Karang Joang, Balikpapan
                Utara-Balikpapan. (Dekat Masjid Nurul Hidayah) (Kost gedung
                warna hijau, pagar hitam)
              </p>
            </div>

            {/* Pesanan */}
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-5 shadow-md bg-white flex gap-5 items-start hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={order.image}
                  alt={order.name}
                  className="w-28 h-28 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-lg text-gray-800">
                      {order.name}
                    </h4>
                    <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-medium">
                      x{order.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Warna <span className="font-medium">{order.color}</span>{" "}
                    &nbsp;|&nbsp; Size{" "}
                    <span className="font-medium">{order.size}</span>
                  </p>
                  <p className="text-lg font-bold text-[#EDCF5D] mt-9">
                    Rp {order.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan */}
          <div className="rounded-lg p-4 shadow-xl h-fit bg-white">
            <h2 className="font-semibold text-lg mb-4">Ringkasan Pesanan</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Total Harga</span>
              <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Total Ongkos Kirim</span>
              <span>Rp {ongkosKirim.toLocaleString("id-ID")}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-semibold text-base mb-4">
              <span>Total Tagihan</span>
              <span className="text-black">
                Rp {totalTagihan.toLocaleString("id-ID")}
              </span>
            </div>
            <Button>Bayar Sekarang</Button>
          </div>
        </div>
      </div>
    </>
  );
}
