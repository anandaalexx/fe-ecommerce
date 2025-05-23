"use client";
import { useState, useRef, useEffect } from "react";
import { Eye, Trash2, Ellipsis } from "lucide-react";
import ModalKonfirmasi from "../../components/admin/modals/Konfirmasi";
import ModalDetailProduk from "@/app/components/pengguna/modals/DetailProduk";

const TableProduk = () => {
  const [produkList, setProdukList] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsConfirmOpen(true);
    setOpenDropdownId(null);
  };

  useEffect(() => {
    async function fetchProduk() {
      try {
        const res = await fetch(`${apiUrl}/product/`, {
          method: "GET",
          credentials: "include",
        });
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

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/product/delete/${productToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      console.log(res);
      if (!res.ok) throw new Error("Gagal menghapus produk");

      setProdukList((prevProducts) =>
        prevProducts.filter((u) => u.id !== productToDelete.id)
      );
      setIsConfirmOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error saat menghapus produk:", err);
    }
  };

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
              if (produk) handleViewProduct(produk);
              setOpenDropdownId(null);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-sm cursor-pointer"
          >
            <Eye size={16} /> Detail
          </button>
          <button
            onClick={() => {
              const product = produkList.find((u) => u.id === openDropdownId);
              if (product) handleDeleteClick(product);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-sm text-red-600 cursor-pointer"
          >
            <Trash2 size={16} /> Hapus
          </button>
        </div>
      )}
      <ModalKonfirmasi
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus pengguna "${productToDelete?.nama}"?`}
        confirmText="Hapus"
      />
      <ModalDetailProduk
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        produk={selectedProduct}
      />
    </>
  );
};

export default TableProduk;
