"use client";
import { useState } from "react";
import { Star } from "lucide-react";

// Komponen Modal Komplain
const KomplainModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Ajukan Komplain</h2>
        <p className="text-gray-600 text-sm">
          Apakah Anda yakin ingin mengajukan komplain terhadap produk ini?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 hover:brightness-105 rounded font-medium transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white hover:brightness-110 rounded font-medium transition"
          >
            Ya, Komplain
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen Modal Ulasan
const ReviewModal = ({
  isOpen,
  onClose,
  onSuccess,
  idUser,
  idProduk,
  idDetailTransaksi,
  namaProduk,
  onKomplain,
  onConfirmKomplain,
  data,
}) => {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [komplainOpen, setKomplainOpen] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleKomplainClick = () => {
    setKomplainOpen(true);
    if (onKomplain && data) {
      // Kamu bisa sesuaikan `data` ini sesuai kebutuhan (misal berisi `id`, `idTransaksi`, dsb.)
      onKomplain({ id: data.idTransaksi });
    }
  };
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async () => {
    if (!rating || !komentar.trim()) {
      showToast("Mohon beri rating dan komentar", "warning");
      return;
    }
    if (komentar.trim().length < 10) {
      showToast("Komentar minimal 10 karakter", "warning");
      return;
    }

    setLoading(true);
    const reviewData = {
      idUser,
      idProduk,
      idDetailTransaksi,
      rating,
      komentar: komentar.trim(),
    };

    try {
      const res = await fetch(`${apiUrl}/ulasan/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal mengirim ulasan");
      }

      const result = await res.json();
      console.log("Success response:", result);
      showToast("Ulasan berhasil dikirim!", "success");

      setRating(0);
      setKomentar("");

      if (onSuccess) {
        onSuccess(idDetailTransaksi);
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Submit error:", err);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmKomplain = async () => {
    try {
      if (onConfirmKomplain) {
        await onConfirmKomplain(data); // kirim data terkait komplain
      }
      alert("Komplain berhasil diajukan!");
    } catch (err) {
      alert("Gagal mengajukan komplain.");
      console.error(err);
    } finally {
      setKomplainOpen(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Beri Rating & Ulasan
          </h2>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <Star
                  key={index}
                  className={`w-7 h-7 cursor-pointer transition-colors ${
                    rating >= starValue ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                  fill={(hover || rating) >= starValue ? "#EDCF5D" : "none"}
                />
              );
            })}
          </div>

          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm text-gray-700"
            rows="4"
            placeholder="Tulis ulasan kamu di sini (min. 10 karakter)"
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
          />

          <div className="flex justify-between">
            <div className="">
              <button
                onClick={handleKomplainClick}
                className="font-medium px-4 py-2 text-white bg-red-600 hover:underline"
              >
                Komplain
              </button>
            </div>
            <div className="gap-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 mr-3 text-gray-700 hover:brightness-105 rounded font-medium transition"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-[#EDCF5D] text-white hover:brightness-110 rounded font-medium transition"
              >
                {loading ? "Mengirim..." : "Kirim Ulasan"}
              </button>
            </div>
          </div>
          <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
      </div>

      {/* Modal Komplain */}
      <KomplainModal
        isOpen={komplainOpen}
        onClose={() => setKomplainOpen(false)}
        onConfirm={handleConfirmKomplain}
      />
    </>
  );
};

export default ReviewModal;
