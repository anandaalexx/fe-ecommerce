"use client";
import { useState } from "react";
import { Star } from "lucide-react";

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  idUser, 
  idProduk, 
  idDetailTransaksi, 
  namaProduk, 
  transactionId 
}) => {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async () => {
    if (!rating || !komentar.trim()) {
      alert("Mohon beri rating dan komentar");
      return;
    }

    if (komentar.trim().length < 10) {
      alert("Komentar minimal 10 karakter");
      return;
    }

    setLoading(true);
    const reviewData = {
      idUser,
      idProduk,
      idDetailTransaksi,
      rating,
      komentar: komentar.trim()
    };

    console.log("Data yang akan dikirim:", reviewData);

    try {
      const res = await fetch(`${apiUrl}/ulasan/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal mengirim ulasan");
      }

      const result = await res.json();
      console.log("Success response:", result);
      alert("Ulasan berhasil dikirim!");

      setRating(0);
      setKomentar("");
      
      // Pass both transactionId and idProduk to onSuccess
      if (onSuccess) {
        onSuccess(transactionId, idProduk);
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Beri Rating & Ulasan
        </h2>
        
        <p className="text-sm text-gray-600">
          Produk: <span className="font-medium">{namaProduk}</span>
        </p>

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

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            type="button"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 hover:brightness-105 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#c6c6c6] font-medium rounded transition duration-200"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDCF5D] text-white hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a] font-medium rounded transition duration-200"
          >
            {loading ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;