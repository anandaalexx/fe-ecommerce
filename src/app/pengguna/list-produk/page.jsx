"use client";
import { useState, useRef, useEffect } from "react";
import { Eye, Trash2, Ellipsis, ArrowUpDown } from "lucide-react";
import ModalKonfirmasi from "../../components/admin/modals/Konfirmasi";
import ModalDetailProduk from "@/app/components/pengguna/modals/DetailProduk";

const TableProduk = () => {
  const [produkList, setProdukList] = useState([]);
  const [search, setSearch] = useState(""); // Baris 9: Pencarian
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Baris 11: Sorting configuration
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
    console.log("Selected product:", product);
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

        console.log("Data produk:", json);

        if (Array.isArray(json)) {
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

  // Menambahkan fungsi sorting untuk setiap kolom
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
    const valA = a[sortConfig.key].toString().toLowerCase();
    const valB = b[sortConfig.key].toString().toLowerCase();
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Filter produk berdasarkan pencarian
  const filteredProduk = sortedProduk.filter((produk) => {
    return (
      produk.nama.toLowerCase().includes(search.toLowerCase()) ||
      produk.kategori.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Menghitung total halaman untuk pagination
  const totalPages = Math.ceil(filteredProduk.length / itemsPerPage);

  // Menentukan produk yang ditampilkan pada halaman saat ini
  const paginatedProduk = filteredProduk.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Update pencarian saat user mengetik
          className="border border-gray-200 px-3 py-2 text-sm rounded"
        />
        <div className="text-sm">
          Halaman {currentPage} dari {totalPages}{" "}
          {/* Menampilkan halaman saat ini */}
        </div>
      </div>

      <div
        className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm relative z-0"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead
            className="bg-gray-100 text-gray-700 sticky top-0 z-10"
            style={{
              position: "sticky",
              zIndex: 10,
            }}
          >
            <tr>
              <th
                className="px-6 py-3 text-left cursor-pointer"
                onClick={() => requestSort("id")}
              >
                <div className="flex items-center gap-2">
                  <span>Produk</span>
                  <ArrowUpDown
                    size={12}
                    className={`${
                      sortConfig.key === "produk"
                        ? "text-yellow-500"
                        : "text-black"
                    }`}
                  />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer"
                onClick={() => requestSort("harga")}
              >
                <div className="flex items-center gap-2">
                  <span>Harga</span>
                  <ArrowUpDown
                    size={12}
                    className={`${
                      sortConfig.key === "harga"
                        ? "text-yellow-500"
                        : "text-black"
                    }`}
                  />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer"
                onClick={() => requestSort("kategori")}
              >
                <div className="flex items-center gap-2">
                  <span>Kategori</span>
                  <ArrowUpDown
                    size={12}
                    className={`${
                      sortConfig.key === "kategori"
                        ? "text-yellow-500"
                        : "text-black"
                    }`}
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedProduk.map((produk) => (
              <tr key={produk.id}>
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={produk.gambarUrls?.[0]?.url || "/no-pictures.png"}
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

      {/* Pagination */}
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
        confirmColor="red"
      />
      <ModalDetailProduk
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        produk={selectedProduct}
      />
    </div>
  );
};

export default TableProduk;
