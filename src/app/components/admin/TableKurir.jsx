"use client";
import { useState, useRef, useEffect } from "react";
import { FilePenLine, Trash2, Ellipsis } from "lucide-react";
import ModalKonfirmasi from "./modals/Konfirmasi";

const TableKurir = ({ kurirs, setKurirs, onEdit }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [kurirToDelete, setkurirToDelete] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleDeleteClick = (kurir) => {
    setkurirToDelete(kurir);
    setIsConfirmOpen(true);
    setOpenDropdownId(null);
  };

  const handleEllipsisClick = (e, kurirId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setOpenDropdownId(kurirId);
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
      const res = await fetch(`${apiUrl}/admin/couriers/${kurirToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus kurir");

      setKurirs((prevKurir) =>
        prevKurir.filter((k) => k.id !== kurirToDelete.id)
      );
      setIsConfirmOpen(false);
      setkurirToDelete(null);
    } catch (err) {
      console.error("Error saat menghapus kurir:", err);
    }
  };

  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm relative z-0">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Nama Kurir</th>
              <th className="px-6 py-3 text-left">Nomor Telepon</th>
              <th className="px-6 py-3 text-left">Nomor Polisi</th>
              <th className="px-6 py-3 text-left">Kendaraan</th>
              <th className="px-6 py-3 text-left">Warna Kendaraan</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {kurirs.map((kurir) => (
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
              const kurir = kurirs.find((u) => u.id === openDropdownId);
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
        message={`Apakah Anda yakin ingin menghapus kurir "${kurirToDelete?.namaUser}"?`}
      />
    </>
  );
};

export default TableKurir;
