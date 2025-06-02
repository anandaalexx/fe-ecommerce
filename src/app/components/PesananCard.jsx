"use client";
import { useEffect, useState } from "react";
import ReviewModal from "./ReviewModal";

const PesananCard = () => {
  const [daftarPesanan, setDaftarPesanan] = useState([]);
  const [reviewProduk, setReviewProduk] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());
  const [modalReviewData, setModalReviewData] = useState(null);
  // modalReviewData = { order, item }

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleKomplain = async (item) => {
    try {
      const fullId = item.id; // contoh: "TRX-12345"
      if (!fullId) {
        alert("ID transaksi tidak ditemukan.");
        return;
      }

      const idTransaksiNumber = Number(fullId.match(/\d+/)[0]);

      if (isNaN(idTransaksiNumber)) {
        alert("Format ID transaksi tidak valid.");
        return;
      }

      const res = await fetch(`${apiUrl}/pengiriman/complain`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idTransaksi: idTransaksiNumber,
          statusTujuan: "dikomplain",
        }),
      });

      if (!res.ok) throw new Error("Gagal update status ke 'dikomplain'.");

      await fetchPesanan();
      alert("Status pesanan telah dikomplain.");
    } catch (err) {
      console.error("Gagal komplain pesanan:", err);
      alert("Terjadi kesalahan saat mengirim komplain.");
    }
  };

  const handleSampai = async (item) => {
    try {
      const fullId = item.id; // contoh: "TRX-12345"
      if (!fullId) {
        alert("ID transaksi tidak ditemukan.");
        return;
      }
      // Ambil angka setelah "TRX-"
      const idTransaksiNumber = Number(fullId.match(/\d+/)[0]);
      console.log(idTransaksiNumber);

      if (isNaN(idTransaksiNumber)) {
        alert("Format ID transaksi tidak valid.");
        return;
      }

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
              status: "received",
            }),
          }
        );

        if (!injectRes.ok) throw new Error("Inject order gagal.");
      }

      // 2. Kirim hanya idPengiriman, karena idKurir akan diambil dari token di server
      const res1 = await fetch(`${apiUrl}/pengiriman/received`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idTransaksi: idTransaksiNumber,
          statusTujuan: "diterima_pembeli",
        }),
      });

      if (!res1.ok) throw new Error("Gagal update status pengiriman.");

      // 3. Refresh data
      await fetchPesanan();
      alert("Pesanan berhasil diambil.");
    } catch (err) {
      console.error("Gagal ambil pesanan:", err);
      alert("Terjadi kesalahan saat ambil pesanan.");
    }
  };

  const fetchPesanan = async () => {
    try {
      const res = await fetch(`${apiUrl}/transaksi/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log("Data dari backend:", data);

      if (!data || !Array.isArray(data.transaksi)) {
        console.error("Data transaksi tidak valid:", data);
        return;
      }

      const formatted = data.transaksi.map((trx) => ({
        id: `#TRX-${trx.idTransaksi}`,
        jumlah: trx.produk.length,
        total: parseInt(trx.totalHarga),
        status: trx.statusPengiriman?.replace(/_/g, " ") || "menunggu penjual",
        barangSesuai: true,
        produk: trx.produk,
        idPengiriman: trx.idPengiriman,
        orderNo: trx.orderNo,
        resi: trx.resi,
      }));

      setDaftarPesanan(formatted);
      fetchExistingReviews(formatted);
    } catch (err) {
      console.error("Gagal memuat data transaksi:", err);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchExistingReviews = async (orders) => {
    try {
      const res = await fetch(`${apiUrl}/ulasan/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const reviewData = await res.json();
        const reviewedSet = new Set();

        if (reviewData && Array.isArray(reviewData.ulasan)) {
          reviewData.ulasan.forEach((review) => {
            if (review.idDetailTransaksi) {
              reviewedSet.add(review.idDetailTransaksi);
            }
          });
        }

        setReviewedProducts(reviewedSet);
      }
    } catch (err) {
      console.error("Gagal memuat data ulasan:", err);
    }
  };

  const handleOpenReview = (order, item) => {
    setModalReviewData({ order, item });
    console.log("Data produk untuk review:", item);
    console.log("idUser:", item.idUser);
    console.log("idProduk:", item.idProduk);
    console.log("idDetailTransaksi:", item.idDetailTransaksi);

    if (!item.idUser || !item.idProduk || !item.idDetailTransaksi) {
      console.error("Data tidak lengkap:", {
        idUser: item.idUser,
        idProduk: item.idProduk,
        idDetailTransaksi: item.idDetailTransaksi,
      });
      alert(
        "Data tidak lengkap. idUser, idProduk, idDetailTransaksi wajib diisi."
      );
      return;
    }

    setReviewProduk({
      idUser: item.idUser,
      idProduk: item.idProduk,
      idDetailTransaksi: item.idDetailTransaksi,
      namaProduk: item.namaProduk,
    });
  };

  const handleCloseReview = () => {
    setReviewProduk(null);
  };

  const handleReviewSuccess = (idDetailTransaksi) => {
    setReviewedProducts((prev) => new Set([...prev, idDetailTransaksi]));
    handleCloseReview();
  };

  const isProductReviewed = (idDetailTransaksi) => {
    return reviewedProducts.has(idDetailTransaksi);
  };

  return (
    <div className="max-w-7xl mx-auto border border-gray-200 rounded shadow-sm">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-6 py-3 text-left">No Pesanan</th>
            <th className="px-6 py-3 text-left">Produk Pesanan</th>
            <th className="px-6 py-3 text-left">Jumlah Produk</th>
            <th className="px-6 py-3 text-left">Total</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftarPesanan.map((order) => (
            <tr key={order.id} className="border-b border-gray-200">
              <td className="px-6 py-4">{order.id}</td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  {order.produk.map((item, i) => (
                    <div key={i} className="border-b border-gray-200 pb-1">
                      <div className="font-medium">{item.namaProduk}</div>

                      {item.varian && item.varian.length > 0 && (
                        <ul className="ml-4 text-sm text-gray-600 list-disc">
                          {item.varian.map((v, j) => (
                            <li key={j}>
                              {v.namaVarian}: {v.nilai}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="text-sm text-gray-700">
                        Jumlah: {item.jumlah}
                      </div>
                      <div className="text-sm text-gray-700">
                        Harga Satuan: Rp{" "}
                        {parseInt(item.hargaSatuan).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              </td>

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
                    onClick={() => handleSampai(order)}
                    className="w-full px-4 py-2 bg-[#EDCF5D] hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a] rounded text-white font-medium"
                  >
                    Diterima
                  </button>
                )}

                {order.status === "diterima pembeli" &&
                  order.produk.map((item, i) => {
                    const alreadyReviewed = isProductReviewed(
                      item.idDetailTransaksi
                    );

                    return (
                      <button
                        key={i}
                        onClick={() => handleOpenReview(order, item)}
                        disabled={!order.barangSesuai || alreadyReviewed}
                        className={`w-full inline-flex items-center justify-center gap-2 py-2 rounded font-medium transition duration-200 mt-1 ${
                          alreadyReviewed
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : order.barangSesuai
                            ? "bg-[#EDCF5D] text-white hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        {alreadyReviewed
                          ? "Sudah Diulas"
                          : `Beri Ulasan untuk ${item.namaProduk}`}
                      </button>
                    );
                  })}

                {/* Tambahkan tombol komplain per order di sini */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reviewProduk && (
        <ReviewModal
          isOpen={true}
          onClose={() => {
            setModalReviewData(null);
            setReviewProduk(null);
          }}
          onSuccess={handleReviewSuccess}
          onConfirmKomplain={() => handleKomplain(modalReviewData.order)}
          idUser={reviewProduk.idUser}
          idProduk={reviewProduk.idProduk}
          idDetailTransaksi={reviewProduk.idDetailTransaksi}
          namaProduk={reviewProduk.namaProduk}
        />
      )}
    </div>
  );
};

export default PesananCard;
