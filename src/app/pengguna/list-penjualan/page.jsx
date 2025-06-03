"use client";
import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react"; // Pastikan ikon ini terimpor
import ModalKonfirmasi from "@/app/components/admin/modals/Konfirmasi";
import ModalRequestPickup from "@/app/components/pengguna/modals/RequestPickup";
import ModalCetakLabel from "@/app/components/pengguna/modals/CetakLabel";

const statusTabs = [
  { label: "Menunggu Penjual", value: "menunggu_penjual" },
  { label: "Diproses Penjual", value: "diproses_penjual" },
  { label: "Menunggu Kurir", value: "menunggu_kurir" },
  { label: "Dikirim", value: "dikirim" },
  { label: "Sampai Ditujuan", value: "sampai_di_tujuan" },
  { label: "Dikomplain", value: "dikomplain" },
  { label: "Dikirim Balik", value: "dikirim_balik" },
];

const TableListPenjualan = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("menunggu_penjual");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [modalAksiOpen, setModalAksiOpen] = useState(false);
  const [modalPickupOpen, setModalPickupOpen] = useState(false);
  const [selectedOrderNo, setSelectedOrderNo] = useState(null);
  const [selectedIdPengiriman, setSelectedIdPengiriman] = useState(null);
  const [modalCetakOpen, setModalCetakOpen] = useState(false);
  const [modalKomplainOpen, setModalKomplainOpen] = useState(false);
  const [selectedKomplainId, setSelectedKomplainId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [status, apiUrl]);

  const handleSetujuiKomplain = async (idPengiriman) => {
    try {
      const res = await fetch(
        `${apiUrl}/pengiriman/complain/setujui/${idPengiriman}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Gagal menyetujui komplain");

      alert("Komplain telah disetujui.");
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyetujui komplain.");
    }
  };

  // Fungsi untuk menangani pengurutan
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Fungsi untuk mengurutkan data
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Filter data berdasarkan pencarian
  const filteredData = sortedData.filter((item) => {
    const lowerSearch = search.toLowerCase();
    return (
      item.namaPembeli.toLowerCase().includes(lowerSearch) ||
      item.orderNo?.toLowerCase().includes(lowerSearch) ||
      item.idPengiriman?.toString().toLowerCase().includes(lowerSearch) ||
      item.produk.some((p) => p.namaProduk.toLowerCase().includes(lowerSearch))
    );
  });

  // Menghitung total halaman untuk pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Menentukan data yang ditampilkan pada halaman saat ini
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCetakLabel = async (orderNo, page) => {
    try {
      const res = await fetch(
        `${apiUrl}/komship/print-label?order_no=${orderNo}&page=${page}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Gagal mendapatkan label");

      const result = await res.json();
      console.log(result);
      const base64String = result?.base64;

      if (!base64String) throw new Error("Label tidak ditemukan");

      // Decode dan tampilkan sebagai PDF
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length)
        .fill()
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Gagal mencetak label");
    }
  };

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

  return (
    <div className="mt-4">
      {/* Search Bar di luar tabel */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari pembeli atau produk...."
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Update pencarian saat user mengetik
          className="border border-gray-200 px-3 py-2 text-sm rounded"
        />
        <div className="text-sm">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>
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
                <th
                  className="px-6 py-3 text-left cursor-pointer"
                  onClick={() => requestSort("idPengiriman")}
                >
                  <div className="flex items-center gap-2">
                    <span>ID Pengiriman</span>
                    {sortConfig.key === "idPengiriman" && (
                      <ArrowUpDown
                        size={12}
                        className={`${
                          sortConfig.direction === "asc"
                            ? "text-yellow-500 transform rotate-180"
                            : "text-gray-500"
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left cursor-pointer"
                  onClick={() => requestSort("orderNo")}
                >
                  <div className="flex items-center gap-2">
                    <span>Nomor Order Komship</span>
                    {sortConfig.key === "orderNo" && (
                      <ArrowUpDown
                        size={12}
                        className={`${
                          sortConfig.direction === "asc"
                            ? "text-yellow-500 transform rotate-180"
                            : "text-gray-500"
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left cursor-pointer"
                  onClick={() => requestSort("namaPembeli")}
                >
                  <div className="flex items-center gap-2">
                    <span>Pembeli</span>
                    {sortConfig.key === "namaPembeli" && (
                      <ArrowUpDown
                        size={12}
                        className={`${
                          sortConfig.direction === "asc"
                            ? "text-yellow-500 transform rotate-180"
                            : "text-gray-500"
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left cursor-pointer"
                  onClick={() => requestSort("produk")}
                >
                  <div className="flex items-center gap-2">
                    <span>Produk</span>
                    {sortConfig.key === "produk" && (
                      <ArrowUpDown
                        size={12}
                        className={`${
                          sortConfig.direction === "asc"
                            ? "text-yellow-500 transform rotate-180"
                            : "text-gray-500"
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedData.map((item) => (
                <tr key={item.idPengiriman}>
                  <td className="px-6 py-4">{item.idPengiriman}</td>
                  <td className="px-6 py-4">{item.orderNo || "-"}</td>
                  <td className="px-6 py-4">{item.namaPembeli}</td>
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
                        className="bg-[#EDCF5D] hover:brightness-110 text-white text-sm px-3 py-1 rounded cursor-pointer"
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

                    {status === "menunggu_kurir" && item.orderNo && (
                      <button
                        onClick={() => {
                          setSelectedOrderNo(item.orderNo);
                          setModalCetakOpen(true);
                        }}
                        className="bg-[#EDCF5D] cursor-pointer hover:brightness-110 text-white text-sm px-3 py-2 font-medium rounded mt-2"
                      >
                        Cetak Label
                      </button>
                    )}
                    {status === "dikomplain" && (
                      <button
                        onClick={() => {
                          setSelectedKomplainId(item.idPengiriman);
                          setModalKomplainOpen(true);
                        }}
                        className="bg-red-500 hover:brightness-110 text-white text-sm px-3 py-1 rounded"
                      >
                        Setujui Komplain
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
      </div>

      <div className="flex justify-between items-center p-3 text-sm mt-4">
        <div>
          Menampilkan {paginatedData.length} dari {filteredData.length} produk
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>

      <ModalKonfirmasi
        isOpen={modalKomplainOpen}
        onClose={() => setModalKomplainOpen(false)}
        onConfirm={() => {
          if (selectedKomplainId) {
            handleSetujuiKomplain(selectedKomplainId);
            setModalKomplainOpen(false);
          }
        }}
        title="Setujui Komplain"
        message="Apakah Anda yakin ingin menyetujui permintaan komplain ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Setujui"
      />

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

      <ModalCetakLabel
        open={modalCetakOpen}
        onClose={() => setModalCetakOpen(false)}
        onSubmit={handleCetakLabel}
        orderNo={selectedOrderNo}
      />
    </div>
  );
};

export default TableListPenjualan;
