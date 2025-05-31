"use client";
import { useState, useRef, useEffect } from "react";
import { FilePenLine, Trash2, Ellipsis, ArrowUpDown } from "lucide-react";
import ModalKonfirmasi from "./modals/Konfirmasi";

const TableKurir = ({ kurirs, setKurirs, onEdit, showToast }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [kurirToDelete, setKurirToDelete] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    nama: "",
    kendaraan: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
      if (sortConfig.direction === "desc") {
        setSortConfig({ key: null, direction: "asc" });
        return;
      }
    }
    setSortConfig({ key, direction });
  };

  const safeToString = (value) => {
    if (value === null || value === undefined) return "";
    return value.toString().toLowerCase();
  };

  const sortedKurirs = [...kurirs].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredKurirs = sortedKurirs.filter((kurir) => {
    const searchMatch =
      safeToString(kurir.nama).includes(search) ||
      safeToString(kurir.kendaraan).includes(search) ||
      safeToString(kurir.status).includes(search);

    const filterMatch = Object.entries(filters).every(([key, val]) => {
      if (!val) return true;
      return safeToString(kurir[key]).includes(val.toLowerCase());
    });

    return searchMatch && filterMatch;
  });

  const totalPages = Math.ceil(filteredKurirs.length / itemsPerPage);
  const paginatedKurirs = filteredKurirs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (kurir) => {
    setKurirToDelete(kurir);
    setIsConfirmOpen(true);
    setOpenDropdownId(null);
  };

  const handleEllipsisClick = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 8, left: rect.left });
    setOpenDropdownId(id);
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
      const res = await fetch(`${apiUrl}/admin/kurirs/${kurirToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus kurir");

      setKurirs((prev) => prev.filter((k) => k.id !== kurirToDelete.id));
      showToast("Kurir berhasil dihapus", "success");
      setIsConfirmOpen(false);
      setKurirToDelete(null);
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus kurir", "error");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-2">
        <input
          type="text"
          placeholder="Cari kurir..."
          className="border border-gray-300 shadow-xs rounded px-3 py-1 text-sm w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value.toLowerCase());
            setCurrentPage(1);
          }}
        />
        <div className="text-sm">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm relative z-0">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700">
              <tr>
                {[
                  { key: "id", label: "ID" },
                  { key: "namaUser", label: "Nama Kurir" },
                  { key: "nomorTelepon", label: "Nomor Telepon" },
                  { key: "nomorPolisi", label: "Nomor Polisi" },
                  { key: "merkKendaraan", label: "Kendaraan" },
                  { key: "warnaKendaraan", label: "Warna Kendaraan" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left hover:bg-gray-200 cursor-pointer"
                    onClick={() => requestSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      <ArrowUpDown
                        size={12}
                        className={`font-bold ${
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
              {paginatedKurirs.map((kurir) => (
                <tr key={kurir.id}>
                  <td className="px-6 py-4">{kurir.id}</td>
                  <td className="px-6 py-4">{kurir.namaUser}</td>
                  <td className="px-6 py-4">{kurir.nomorTelepon}</td>
                  <td className="px-6 py-4">{kurir.nomorPolisi}</td>
                  <td className="px-6 py-4">{kurir.merkKendaraan}</td>
                  <td className="px-6 py-4">{kurir.warnaKendaraan}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => handleEllipsisClick(e, kurir.id)}
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
      </div>

      <div className="flex justify-between items-center p-3 text-sm">
        <div>
          Menampilkan {paginatedKurirs.length} dari {filteredKurirs.length}{" "}
          kurir
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
              const kurir = kurirs.find((k) => k.id === openDropdownId);
              if (kurir) onEdit(kurir);
              setOpenDropdownId(null);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-sm cursor-pointer"
          >
            <FilePenLine size={16} /> Edit
          </button>
          <button
            onClick={() => {
              const kurir = kurirs.find((k) => k.id === openDropdownId);
              if (kurir) handleDeleteClick(kurir);
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
        message={`Apakah Anda yakin ingin menghapus kurir "${kurirToDelete?.nama}"?`}
        confirmText="Hapus"
        confirmColor="red"
      />
    </>
  );
};

export default TableKurir;
