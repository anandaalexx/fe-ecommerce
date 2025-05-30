"use client";
import { useEffect, useState } from "react";

const TableProdukMenunggu = () => {
  const [data, setData] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProdukMenunggu = async () => {
      try {
        const res = await fetch(`${apiUrl}/penjual/produk-menunggu`, {
          method: "GET",
          credentials: "include", // penting agar cookie (misal: JWT) dikirim
        });

        const json = await res.json();
        if (Array.isArray(json)) {
          setData(json);
        } else {
          console.error("Format respons tidak sesuai:", json);
        }
      } catch (err) {
        console.error("Gagal fetch produk menunggu:", err);
      }
    };

    fetchProdukMenunggu();
  }, [apiUrl]);

  return (
    <div className="overflow-x-auto border border-gray-200 rounded shadow-sm mt-4">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-6 py-3 text-left">ID Pengiriman</th>
            <th className="px-6 py-3 text-left">Pembeli</th>
            <th className="px-6 py-3 text-left">Produk</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item.idPengiriman}>
              <td className="px-6 py-4 font-medium">{item.idPengiriman}</td>
              <td className="px-6 py-4">{item.namaPembeli}</td>
              <td className="px-6 py-4">
                <ul className="space-y-1">
                  {item.produk.map((p, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{p.namaProduk}</span> (
                      {p.varian || "-"}) – {p.kuantitas}x – Rp
                      {p.hargaSatuan.toLocaleString()} ={" "}
                      <span className="font-medium text-green-900">
                        Rp{p.total.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-6 text-gray-500">
                Tidak ada produk yang menunggu diproses.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableProdukMenunggu;
