"use client";
import { useState, useRef, useEffect } from "react";
import { FilePenLine, Trash2, Ellipsis } from "lucide-react";
import ModalKonfirmasi from "./modals/Konfirmasi";

const kategoris = [
  { id: 1, nama: "Elektronik" },
  { id: 2, nama: "Pakaian" },
];

const TableKategori = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [kategoriToDelete, setkategoriToDelete] = useState(null);

  const handleDeleteClick = (kategori) => {
    setkategoriToDelete(kategori);
    setIsConfirmOpen(true);
    setOpenDropdownId(null);
  };

  const handleEllipsisClick = (e, kategoriId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setOpenDropdownId(kategoriId);
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

  const handleConfirmDelete = () => {
    console.log("Menghapus kategori:", kategoriToDelete);
  };

  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm relative z-0">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Nama</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {kategoris.map((kategori) => (
              <tr key={kategori.id}>
                <td className="px-6 py-4">{kategori.nama}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => handleEllipsisClick(e, kategori.id)}
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
              const kategori = kategoris.find((u) => u.id === openDropdownId);
              if (kategori) handleDeleteClick(kategori);
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
        message={`Apakah Anda yakin ingin menghapus kategori "${kategoriToDelete?.nama}"?`}
      />
    </>
  );
};

export default TableKategori;
