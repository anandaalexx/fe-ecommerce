"use client";
import { useState, useRef, useEffect } from "react";
import { FilePenLine, Trash2, Ellipsis, ArrowUpDown, X } from "lucide-react";
import ModalKonfirmasi from "./modals/Konfirmasi";

const TablePengguna = ({ users, setUsers, onEdit, showToast }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [userToDelete, setUserToDelete] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    nama: "",
    email: "",
    alamat: "",
    role: "",
    saldo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Klik ketiga, reset sorting
        setSortConfig({ key: null, direction: "asc" });
        return;
      }
    }
    setSortConfig({ key, direction });
  };

  // Fungsi untuk sorting data
  const sortedUsers = [...users].sort((a, b) => {
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

  const filteredUsers = sortedUsers.filter((user) => {
    const safeToString = (value) => {
      if (value === null || value === undefined) return "";
      return value.toString().toLowerCase();
    };

    const searchMatch =
      safeToString(user.nama).includes(search.toLowerCase()) ||
      safeToString(user.email).includes(search.toLowerCase()) ||
      safeToString(user.alamat).includes(search.toLowerCase()) ||
      safeToString(user.role).includes(search.toLowerCase());

    const filterMatch = Object.entries(filters).every(([key, val]) => {
      if (!val) return true;
      const userValue = user[key];
      return safeToString(userValue).includes(val.toLowerCase());
    });

    return searchMatch && filterMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
    setOpenDropdownId(null);
  };

  const handleEllipsisClick = (e, userId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setOpenDropdownId(userId);
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
      const res = await fetch(`${apiUrl}/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus pengguna");

      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== userToDelete.id)
      );
      setIsConfirmOpen(false);
      setUserToDelete(null);
      showToast("Pengguna berhasil dihapus", "success");
    } catch (err) {
      console.error("Error saat menghapus user:", err);
      showToast("Gagal menghapus pengguna", "error");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-2">
        <input
          type="text"
          placeholder="Cari pengguna..."
          className="border border-gray-300 shadow-xs rounded px-3 py-1 text-sm w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="text-sm">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm relative z-0">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                { key: "id", label: "ID" },
                { key: "nama", label: "Nama" },
                { key: "email", label: "Email" },
                { key: "alamat", label: "Alamat" },
                { key: "role", label: "Role" },
                { key: "saldo", label: "Saldo" },
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
                          ? "text-[#EDCF5D]"
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
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.nama}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.alamat}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4">{user.saldo}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => handleEllipsisClick(e, user.id)}
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
      <div className="flex justify-between items-center p-3 text-sm">
        <div>
          Menampilkan {paginatedUsers.length} dari {filteredUsers.length}{" "}
          pengguna
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
              const user = users.find((u) => u.id === openDropdownId);
              if (user) onEdit(user);
              setOpenDropdownId(null);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-sm cursor-pointer"
          >
            <FilePenLine size={16} /> Edit
          </button>
          <button
            onClick={() => {
              const user = users.find((u) => u.id === openDropdownId);
              if (user) handleDeleteClick(user);
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
        message={`Apakah Anda yakin ingin menghapus pengguna "${userToDelete?.nama}"?`}
        confirmText="Hapus"
        confirmColor="red"
      />
    </>
  );
};

export default TablePengguna;
