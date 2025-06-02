"use client";
import { useState, useEffect } from "react";
import TableProduk from "./TableBarang";

const Barang = () => {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchProduk() {
      try {
        const res = await fetch(`${apiUrl}/product/`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Gagal mengambil data produk");

        const data = await res.json();
        console.log("Data produk dari API:", data);

        if (Array.isArray(data)) {
          // Normalisasi data kategori
          const normalizedData = data.map((produk) => ({
            ...produk,
            kategori:
              typeof produk.kategori === "object"
                ? produk.kategori?.nama || "Tidak ada kategori"
                : produk.kategori || "Tidak ada kategori",
          }));

          setProdukList(normalizedData);
        } else {
          throw new Error("Format data tidak valid");
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduk();
  }, [apiUrl]);

  if (loading) return <div className="p-6">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <TableProduk produkList={produkList} setProdukList={setProdukList} />
    </div>
  );
};

export default Barang;
