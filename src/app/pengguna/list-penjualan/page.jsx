"use client";
import { useEffect, useState } from "react";
import ModalKonfirmasi from "@/app/components/admin/modals/Konfirmasi";
import ModalRequestPickup from "@/app/components/pengguna/modals/RequestPickup";
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const statusTabs = [
  { label: "Menunggu Penjual", value: "menunggu_penjual" },
  { label: "Diproses Penjual", value: "diproses_penjual" },
  { label: "Menunggu Kurir", value: "menunggu_kurir" },
  { label: "Dikirim", value: "dikirim" },
  { label: "Sampai Ditujuan", value: "sampai_ditujuan" },
];

const TableListPenjualan = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("menunggu_penjual");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [modalAksiOpen, setModalAksiOpen] = useState(false);
  const [modalPickupOpen, setModalPickupOpen] = useState(false);
  const [selectedOrderNo, setSelectedOrderNo] = useState(null);
  const [selectedIdPengiriman, setSelectedIdPengiriman] = useState(null);

  const handleUpdateStatus = async (idPengiriman) => {
    try {
      const res = await fetch(
        `${apiUrl}/product/statPengiriman/${idPengiriman}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Gagal update status");

      const updated = await res.json();
      alert(
        `Status berhasil diperbarui menjadi ${updated.status.replaceAll(
          "_",
          " "
        )}`
      );
      // Refresh data setelah update
      // Refresh data ulang sesuai status tab aktif
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memperbarui status");
    }
  };

  const handleRequestPickup = async (payload, idPengiriman) => {
    try {
      const res = await fetch(`${apiUrl}/komship/pickup/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal melakukan request pickup");

      const result = await res.json();
      const awb = result?.data?.[0]?.awb;

      if (!awb) throw new Error("AWB tidak ditemukan dalam response");

      // Update resi/awb ke tabel pengiriman
      const updateResi = await fetch(
        `${apiUrl}/product/update-resi/${idPengiriman}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resi: awb }),
          credentials: "include",
        }
      );

      if (!updateResi.ok) throw new Error("Gagal menyimpan resi");

      // Update status pengiriman
      await handleUpdateStatus(idPengiriman);

      alert("Pickup berhasil dikirim ke Komship dan resi disimpan");
      setModalPickupOpen(false);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat request pickup atau menyimpan data");
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/penjual/produk-status?status=${status}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status, apiUrl]);

  return (
    <div className="mt-4">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2 font-medium ${
              status === tab.value
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">ID Pengiriman</th>
              <th className="px-6 py-3 text-left">Nomor Order Komship</th>
              <th className="px-6 py-3 text-left">Pembeli</th>
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
                <td className="px-6 py-4">
                  <ul className="space-y-1">
                    {item.produk.map((p, i) => (
                      <li key={i}>
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
                <td className="px-6 py-4">
                  {status === "menunggu_penjual" && (
                    <button
                      onClick={() => {
                        setSelectedIdPengiriman(item.idPengiriman);
                        setModalAksiOpen(true);
                      }}
                      className="bg-[#EDCF5D] hover:brightness-110 text-white text-sm px-3 py-1 rounded"
                    >
                      Proses Pesanan
                    </button>
                  )}

                  {status === "diproses_penjual" && item.orderNo && (
                    <button
                      onClick={() => {
                        setSelectedIdPengiriman(item.idPengiriman);
                        setSelectedOrderNo(item.orderNo);
                        setModalPickupOpen(true); // tampilkan modal khusus request pickup
                      }}
                      className="bg-[#EDCF5D] hover:brightness-110 text-white text-sm px-3 py-1 rounded"
                    >
                      Request Pickup
                    </button>
                  )}

                  {status === "diproses_penjual" && !item.orderNo && (
                    <button
                      onClick={() => {
                        setSelectedIdPengiriman(item.idPengiriman);
                        setModalAksiOpen(true); // tampilkan modal konfirmasi biasa
                      }}
                      className="bg-[#EDCF5D] hover:brightness-110 text-white text-sm px-3 py-1 rounded"
                    >
                      Request Pickup
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  Tidak ada data penjualan untuk status ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ModalKonfirmasi
        isOpen={modalAksiOpen}
        onClose={() => setModalAksiOpen(false)}
        onConfirm={() => {
          if (selectedIdPengiriman) {
            handleUpdateStatus(selectedIdPengiriman);
            setModalAksiOpen(false);
          }
        }}
        title="Konfirmasi Proses Pesanan"
        message="Apakah Anda yakin ingin memperbarui status pengiriman ini?"
        confirmText="Yakin"
        confirmColor="yellow"
      />

      <ModalRequestPickup
        isOpen={modalPickupOpen}
        onClose={() => setModalPickupOpen(false)}
        onSubmit={(payload) =>
          handleRequestPickup(payload, selectedIdPengiriman)
        }
        orderNo={selectedOrderNo}
      />
    </div>
  );
};

export default TableListPenjualan;
