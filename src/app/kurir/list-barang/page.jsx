"use client";
import { useEffect, useState } from "react";

const statusTabs = [
  { label: "Menunggu Kurir", value: "menunggu_kurir" },
  { label: "Dikirim", value: "sedang_dikirim" },
  { label: "Sampai Ditujuan", value: "sampai_di_tujuan" },
  { label: "Diterima Pembeli", value: "diterima_pembeli" },
  { label: "Dikomplain", value: "dikomplain" },
];

const TableListPengirimanKurir = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("menunggu_kurir");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleAmbilPesanan = async (item) => {
    try {
      // 1. Kirim ke endpoint inject-order (jika perlu)
      if (item.orderNo && item.resi) {
        const injectRes = await fetch(
          `${apiUrl}/komship/callback/inject-order`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_no: item.orderNo,
              cnote: item.resi,
              status: "sent",
            }),
          }
        );

        if (!injectRes.ok) throw new Error("Inject order gagal.");
      }

      // 2. Kirim hanya idPengiriman, karena idKurir akan diambil dari token di server
      const res1 = await fetch(`${apiUrl}/kurir/orderStatus/take-order`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idPengiriman: item.idPengiriman,
        }),
      });

      if (!res1.ok) throw new Error("Gagal update status pengiriman.");

      // 3. Refresh data
      await fetchData();
      alert("Pesanan berhasil diambil.");
    } catch (err) {
      console.error("Gagal ambil pesanan:", err);
      alert("Terjadi kesalahan saat ambil pesanan.");
    }
  };

  const handleSelesaiPengiriman = async (item) => {
    try {
      const res = await fetch(`${apiUrl}/kurir/orderStatus/finish-order`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idPengiriman: item.idPengiriman,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyelesaikan pengiriman.");

      await fetchData();
      alert("Pengiriman selesai dan status diperbarui.");
    } catch (err) {
      console.error("Gagal update:", err);
      alert("Terjadi kesalahan saat update status.");
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/kurir/orderStatus/pengiriman?status=${status}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
      console.log("Inidata woi", data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("Inidata woi", data);
  }, [status, apiUrl]);

  return (
    <div className="mt-4">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-4">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2 font-medium text-sm cursor-pointer hover:text-[#EDCF5D] ${
              status === tab.value
                ? "border-b-2 bg-[#EDCF5D]/10 text-[#EDCF5D]"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">ID Pengiriman</th>
                <th className="px-6 py-3 text-left">Nomor Order</th>
                <th className="px-6 py-3 text-left">Pembeli</th>
                <th className="px-6 py-3 text-left">Toko</th>
                {/* 👈 Tambahkan ini */}
                <th className="px-6 py-3 text-left">Produk</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.idPengiriman}>
                  <td className="px-6 py-4">{item.idPengiriman}</td>
                  <td className="px-6 py-4">{item.orderNo || "-"}</td>
                  <td className="px-6 py-4">{item.namaPembeli}</td>
                  <td className="px-6 py-4">{item.namaToko || "-"}</td>

                  {/* 👈 Tambahkan ini */}
                  <td className="px-6 py-4">
                    <ul className="space-y-1">
                      {item.produk.map((p, i) => (
                        <li key={i}>
                          <span className="font-semibold">{p.namaProduk}</span>{" "}
                          ({p.varian || "-"}) – {p.kuantitas}x – Rp
                          {p.hargaSatuan.toLocaleString()} ={" "}
                          <span className="font-medium text-green-900">
                            Rp{p.total.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  {/* 👇 Kolom aksi hanya ditampilkan untuk status "menunggu_kurir" */}
                  {status === "menunggu_kurir" && (
                    <td className="px-6 py-4">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                        onClick={() => handleAmbilPesanan(item)}
                      >
                        Ambil Pesanan
                      </button>
                    </td>
                  )}

                  {status === "sedang_dikirim" && (
                    <td className="px-6 py-4">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                        onClick={() => handleSelesaiPengiriman(item)}
                      >
                        Selesaikan Pengiriman
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    Tidak ada data pengiriman untuk status ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableListPengirimanKurir;
