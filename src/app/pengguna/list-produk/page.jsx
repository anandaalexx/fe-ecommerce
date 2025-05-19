"use client";
import { useState, useRef, useEffect } from "react";
import { Eye, Ellipsis } from "lucide-react";

const TableProduk = ({ onView }) => {
  const [produkList, setProdukList] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchProduk() {
      try {
        const res = await fetch(`${apiUrl}/product/`);
        const json = await res.json();

        if (Array.isArray(json)) {
          console.log(json);
          setProdukList(json);
        } else {
          console.error("Format data tidak valid:", json);
        }
      } catch (err) {
        console.error("Gagal fetch produk:", err);
      }
    }

    fetchProduk();
  }, []);

  const handleEllipsisClick = (e, produkId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setOpenDropdownId(produkId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm relative z-0">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Produk</th>
              <th className="px-6 py-3 text-left">Harga</th>
              <th className="px-6 py-3 text-left">Kategori</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {produkList.map((produk) => (
              <tr key={produk.id}>
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={produk.gambarUrl}
                    alt={produk.nama}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span>{produk.nama}</span>
                </td>
                <td className="px-6 py-4">{produk.harga}</td>
                <td className="px-6 py-4">{produk.kategori}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => handleEllipsisClick(e, produk.id)}
                    className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
                  >
                    <Ellipsis size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openDropdownId && (
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 rounded shadow z-50 w-32"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
          }}
        >
          <button
            onClick={() => {
              const produk = produkList.find((p) => p.id === openDropdownId);
              if (produk) onView(produk);
              setOpenDropdownId(null);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-sm cursor-pointer"
          >
            <Eye size={16} /> Lihat
          </button>
        </div>
      )}
    </>
  );
};

export default TableProduk;
