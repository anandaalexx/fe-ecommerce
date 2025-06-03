import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Button from "../../Button";
import ToastNotification from "../../../components/ToastNotification";

const ModalEditPengguna = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [form, setForm] = useState({
    id: "",
    nama: "",
    email: "",
    alamat: "",
    saldo: "",
    roleId: 1,
  });
  const [roles, setRoles] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Menyinkronkan data form dengan initialData ketika modal dibuka
  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id || "",
        nama: initialData.nama || "",
        email: initialData.email || "",
        alamat: initialData.alamat || "",
        saldo:
          initialData.saldo !== undefined ? initialData.saldo.toString() : "",
        roleId: initialData.roleId || 1,
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!apiUrl) return;
      try {
        const res = await fetch(`${apiUrl}/admin/role`);
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("Gagal mengambil role:", err);
      }
    };
    fetchRoles();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "saldo" && Number(value) < 0) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "saldo" || name === "roleId" ? Number(value) : value,
    }));
  };

  // Menangani pengiriman form untuk mengupdate pengguna
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, nama, email, alamat, roleId, saldo } = form;
      const saldoNumber = saldo === "" ? 0 : parseFloat(saldo);

      const res = await fetch(`${apiUrl}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          email,
          alamat,
          roleId,
          saldo: saldoNumber,
        }),
      });

      // Tangani error dari response
      if (!res.ok) {
        let errorMessage = "Gagal mengupdate pengguna";

        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const text = await res.text();
          if (text.includes("<!DOCTYPE html")) {
            errorMessage = "Terjadi kesalahan di server";
          } else {
            errorMessage = text || errorMessage;
          }
        }

        throw new Error(errorMessage);
      }

      // Jika sukses
      const updatedUser = await res.json();
      showToast("Pengguna berhasil diperbarui!", "success");
      onSubmit(updatedUser);
      onClose();

    } catch (err) {
      console.error("Error saat mengupdate user:", err);
      showToast(err.message || "Terjadi kesalahan saat menyimpan", "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-lg p-6 relative shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Pengguna</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Role</label>
                <select
                  name="roleId"
                  value={form.roleId}
                  onChange={handleChange}
                  disabled={initialData?.roleId === 3}
                  className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D] capitalize ${
                    initialData?.roleId === 3
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.namaRole}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Saldo</label>
                <input
                  type="number"
                  name="saldo"
                  value={form.saldo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div className="text-right">
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          {toast.show && (
            <ToastNotification
              type={toast.type}
              message={toast.message}
              onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
          )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalEditPengguna;
