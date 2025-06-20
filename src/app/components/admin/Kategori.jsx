"use client";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import TableKategori from "./TableKategori";
import TambahKategori from "./modals/TambahKategori";
import ToastNotification from "../ToastNotification";

const Kategori = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/category/view`, {
        credentials: "include",
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDCF5D] active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a] text-white font-medium rounded hover:brightness-110 transition duration-200 cursor-pointer"
        >
          <PlusCircle size={18} />
          Tambah Kategori
        </button>
      </div>

      <TableKategori categories={categories} setCategories={setCategories} />

      <TambahKategori
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCategories}
        showToast={showToast}
      />

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Kategori;
