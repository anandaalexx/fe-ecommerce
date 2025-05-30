"use client";
import { useState, useRef, useEffect } from "react";
import { FilePenLine, Trash2, Ellipsis, ArrowUpDown } from "lucide-react";

const TableKategori = ({ categories, setCategories, onEdit, showToast }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    nama: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  const sortedCategories = [...categories].sort((a, b) => {
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

  // Search & Filter
  const safeToString = (val) => (val ?? "").toString().toLowerCase();

  const filteredCategories = sortedCategories.filter((cat) => {
    const searchMatch = safeToString(cat.nama).includes(search.toLowerCase());

    const filterMatch = Object.entries(filters).every(([key, val]) => {
      if (!val) return true;
      return safeToString(cat[key]).includes(val.toLowerCase());
    });

    return searchMatch && filterMatch;
  });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dropdown Handler
  const handleEllipsisClick = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 8, left: rect.left });
    setOpenDropdownId(id);
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
          placeholder="Cari kategori..."
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
                      className={`${
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
            {paginatedCategories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4">{cat.id}</td>
                <td className="px-6 py-4">{cat.nama}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => handleEllipsisClick(e, cat.id)}
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
          Menampilkan {paginatedCategories.length} dari{" "}
          {filteredCategories.length} kategori
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
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <button
            onClick={() => {
              const cat = categories.find((c) => c.id === openDropdownId);
              if (cat) onEdit(cat);
              setOpenDropdownId(null);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-sm"
          >
            <FilePenLine size={16} /> Edit
          </button>
        </div>
      )}
    </>
  );
};

export default TableKategori;
