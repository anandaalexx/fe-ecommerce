"use client";
import { useState, useRef, useEffect } from "react";
import { Eye, Trash2, Ellipsis, ArrowUpDown } from "lucide-react";
import ModalKonfirmasi from "../admin/modals/Konfirmasi";
import ModalDetailProduk from "@/app/components/pengguna/modals/DetailProduk";

const TableProduk = ({ produkList, setProdukList }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [produkToDelete, setProdukToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    nama: "",
    kategori: "",
    harga: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") direction = "desc";
      else return setSortConfig({ key: null, direction: "asc" });
    }
    setSortConfig({ key, direction });
  };

  const sortedProduk = [...produkList].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredProduk = sortedProduk.filter((produk) => {
    const safeToString = (val) =>
      val === null || val === undefined ? "" : val.toString().toLowerCase();

    const searchMatch =
      safeToString(produk.nama).includes(search.toLowerCase()) ||
      safeToString(produk.kategori).includes(search.toLowerCase());

    const filterMatch = Object.entries(filters).every(([key, val]) => {
      if (!val) return true;
      return safeToString(produk[key]).includes(val.toLowerCase());
    });

    return searchMatch && filterMatch;
  });

  const totalPages = Math.ceil(filteredProduk.length / itemsPerPage);
  const paginatedProduk = filteredProduk.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEllipsisClick = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 8, left: rect.left });
    setOpenDropdownId(id);
  };

  const handleDeleteClick = (produk) => {
    setProdukToDelete(produk);
    setIsConfirmOpen(true);
    setOpenDropdownId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${apiUrl}/produk/${produkToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus produk");

      setProdukList((prev) => prev.filter((p) => p.id !== produkToDelete.id));
      showToast("Produk berhasil dihapus", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus produk", "error");
    } finally {
      setIsConfirmOpen(false);
      setProdukToDelete(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center p-2">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-200 px-3 py-1 text-sm w-64 rounded"
        />
        <div className="text-sm">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {[
                  { key: "id", label: "ID" },
                  { key: "nama", label: "Nama" },
                  { key: "kategori", label: "Kategori" },
                  { key: "harga", label: "Harga" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      <ArrowUpDown
                        size={12}
                        className={`${
                          sortConfig.key === col.key
                            ? "text-yellow-500"
                            : "text-black"
                        }`}
                      />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedProduk.map((produk) => (
                <tr key={produk.id}>
                  <td className="px-6 py-4">{produk.id}</td>
                  <td className="px-6 py-4">{produk.nama}</td>
                  <td className="px-6 py-4">{produk.kategori}</td>
                  <td className="px-6 py-4">{produk.harga}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => handleEllipsisClick(e, produk.id)}
                      className="hover:bg-gray-100 p-2 rounded-full"
                    >
                      <Ellipsis size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center p-3 text-sm">
        <div>
          Menampilkan {paginatedProduk.length} dari {filteredProduk.length}{" "}
          produk
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

      {openDropdownId && (
        <div
          ref={dropdownRef}
          className="fixed bg-white border rounded shadow z-50 w-32"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <button
            onClick={() => {
              const produk = produkList.find((p) => p.id === openDropdownId);
              if (produk)
                showToast("Lihat detail belum diimplementasi", "warning");
              setOpenDropdownId(null);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-sm"
          >
            <Eye size={16} /> Detail
          </button>
          <button
            onClick={() => {
              const produk = produkList.find((p) => p.id === openDropdownId);
              if (produk) handleDeleteClick(produk);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-sm text-red-600"
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
        message={`Yakin ingin menghapus produk "${produkToDelete?.nama}"?`}
        confirmText="Hapus"
        confirmColor="red"
      />
    </>
  );
};

export default TableProduk;
