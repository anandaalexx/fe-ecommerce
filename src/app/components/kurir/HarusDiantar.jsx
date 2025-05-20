"use client";
import { useState } from "react";

const pengirimanDiproses = [
  {
    id: 1,
    tanggal: "2025-05-03",
    status: "Sedang Dikirim",
    pembeli: "John Doe",
    produk: [
      {
        nama: "Laptop",
        jumlah: 1,
        harga: 5000000,
        penjual: "Toko Elektronik A",
      },
      { nama: "Mouse", jumlah: 2, harga: 150000, penjual: "Toko Elektronik A" },
    ],
  },
  {
    id: 2,
    tanggal: "2025-05-04",
    status: "Dikirim Balik",
    pembeli: "Jane Smith",
    produk: [
      { nama: "Kamera", jumlah: 1, harga: 3500000, penjual: "Toko Kamera B" },
    ],
  },
];

const statusOptions = [
  { value: "Sedang Dikirim", label: "Sedang Dikirim", color: "bg-yellow-500" },
  { value: "Dikirim Balik", label: "Dikirim Balik", color: "bg-red-500" },
  { value: "Sampai Tujuan", label: "Sampai Tujuan", color: "bg-green-500" },
];

const getBgColorByStatus = (status) => {
  const found = statusOptions.find((s) => s.value === status);
  return found ? found.color : "bg-gray-300";
};

const HarusDiantar = () => {
  const [pengiriman, setPengiriman] = useState(pengirimanDiproses);

  const handleStatusChange = (id, newStatus) => {
    const updated = pengiriman.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setPengiriman(updated);
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm relative z-0">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-6 py-3 text-left">Tanggal Pengiriman</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Pembeli</th>
            <th className="px-6 py-3 text-left">Produk</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {pengiriman.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4">{item.tanggal}</td>
              <td className="px-6 py-4">
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  className={`px-4 py-2 rounded-md text-white ${getBgColorByStatus(
                    item.status
                  )}`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4">{item.pembeli}</td>
              <td className="px-6 py-4">
                <ul>
                  {item.produk.map((produk, index) => (
                    <li key={index}>
                      {produk.nama} - {produk.jumlah} x Rp{produk.harga} (
                      {produk.penjual})
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-6 py-4 text-center">
                <button className="hover:bg-gray-100 p-2 rounded-full cursor-pointer">
                  Proses
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HarusDiantar;
