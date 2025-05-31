"use client";
import { useEffect, useState } from "react";
import ReviewModal from "./ReviewModal";

const PesananCard = () => {
  const [daftarPesanan, setDaftarPesanan] = useState([]);
  const [reviewProduk, setReviewProduk] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
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
          status:
            trx.statusPengiriman?.replace(/_/g, " ") || "menunggu penjual",
          barangSesuai: true,
          produk: trx.produk,
        }));

        setDaftarPesanan(formatted);
        fetchExistingReviews(formatted);
      } catch (err) {
        console.error("Gagal memuat data transaksi:", err);
      }
    };

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

  const ubahStatusPesanan = (id, statusBaru) => {
    const update = daftarPesanan.map((p) =>
      p.id === id && p.status === "sampai di tujuan"
        ? { ...p, status: statusBaru }
        : p
    );
    setDaftarPesanan(update);
  };

  const handleOpenReview = (produk) => {
    console.log("Data produk untuk review:", produk);
    console.log("idUser:", produk.idUser);
    console.log("idProduk:", produk.idProduk);
    console.log("idDetailTransaksi:", produk.idDetailTransaksi);

    if (!produk.idUser || !produk.idProduk || !produk.idDetailTransaksi) {
      console.error("Data tidak lengkap:", {
        idUser: produk.idUser,
        idProduk: produk.idProduk,
        idDetailTransaksi: produk.idDetailTransaksi,
      });
      alert(
        "Data tidak lengkap. idUser, idProduk, idDetailTransaksi wajib diisi."
      );
      return;
    }

    setReviewProduk({
      idUser: produk.idUser,
      idProduk: produk.idProduk,
      idDetailTransaksi: produk.idDetailTransaksi,
      namaProduk: produk.namaProduk,
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
          {daftarPesanan.map((order, index) => (
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
                    onClick={() =>
                      ubahStatusPesanan(order.id, "diterima pembeli")
                    }
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
                        onClick={() => handleOpenReview(item)}
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reviewProduk && (
        <ReviewModal
          isOpen={true}
          onClose={handleCloseReview}
          onSuccess={handleReviewSuccess}
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
