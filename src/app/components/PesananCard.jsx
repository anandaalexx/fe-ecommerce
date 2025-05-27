"use client";
import { useEffect, useState } from "react";
import ReviewModal from "./ReviewModal";

const PesananCard = () => {
  const [daftarPesanan, setDaftarPesanan] = useState([]);
  const [reviewOpenRow, setReviewOpenRow] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const userId = 1; // ganti sesuai dengan user yang sedang login

  useEffect(() => {
    fetch(`${apiUrl}/transaksi/user`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((trx) => ({
          id: `#TRX-${trx.idTransaksi}`,
          jumlah: trx.produk.length,
          total: trx.totalHarga,
          status: trx.statusPengiriman || "menunggu penjual",
          barangSesuai: true, // tambahkan logika asli jika ada
        }));
        setDaftarPesanan(formatted);
      });
  }, []);

  const ubahStatusPesanan = (id, statusBaru) => {
    const update = daftarPesanan.map((p) =>
      p.id === id && p.status === "sampai di tujuan"
        ? { ...p, status: statusBaru }
        : p
    );
    setDaftarPesanan(update);
  };

  const handleKirimReview = ({ rating, review }) => {
    console.log("Review dikirim:", rating, review);
    setReviewOpenRow(null);
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-6 py-3 text-left">No Pesanan</th>
            <th className="px-6 py-3 text-left">Jumlah Barang</th>
            <th className="px-6 py-3 text-left">Total</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftarPesanan.map((order, index) => (
            <tr key={order.id}>
              <td className="px-6 py-4">{order.id}</td>
              <td className="px-6 py-4">{order.jumlah}</td>
              <td className="px-6 py-4">
                Rp {order.total.toLocaleString("id-ID")}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "sedang dikirim"
                      ? "bg-yellow-200 text-yellow-800"
                      : order.status === "diterima pembeli"
                      ? "bg-green-300 text-green-900"
                      : order.status === "sampai di tujuan"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center space-y-2">
                {order.status === "sampai di tujuan" && (
                  <button
                    onClick={() =>
                      ubahStatusPesanan(order.id, "diterima pembeli")
                    }
                    className="w-full px-4 py-2 bg-[#EDCF5D] hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a] rounded text-white font-medium"
                  >
                    Diterima
                  </button>
                )}
                {order.status === "diterima pembeli" && (
                  <button
                    onClick={() => setReviewOpenRow(index)}
                    disabled={!order.barangSesuai}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded font-medium transition duration-200 ${
                      order.barangSesuai
                        ? "bg-[#EDCF5D] text-white hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Beri Ulasan
                  </button>
                )}
                {reviewOpenRow === index && (
                  <ReviewModal
                    isOpen={true}
                    onClose={() => setReviewOpenRow(null)}
                    onSubmit={handleKirimReview}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PesananCard;
