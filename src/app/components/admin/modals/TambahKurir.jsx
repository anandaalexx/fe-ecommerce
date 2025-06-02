import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../Button";

const TambahKurir = ({ isOpen, onClose, onSuccess, showToast }) => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    nomorTelepon: "",
    nomorPolisi: "",
    merkKendaraan: "",
    warnaKendaraan: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.email || !formData.password) {
      showToast("Nama, email, dan password harus diisi.", "warning");
      return;
    }

    const requestBody = {
      userData: {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        alamat: "", // Add default value or include in form
        latitude: null,
        longitude: null,
      },
      kurirData: {
        nomorTelepon: formData.nomorTelepon,
        nomorPolisi: formData.nomorPolisi,
        merkKendaraan: formData.merkKendaraan,
        warnaKendaraan: formData.warnaKendaraan,
      },
    };

    try {
      const response = await fetch(`${apiUrl}/admin/couriers`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambahkan kurir");
      }

      // Reset form
      setFormData({
        nama: "",
        email: "",
        password: "",
        nomorTelepon: "",
        nomorPolisi: "",
        merkKendaraan: "",
        warnaKendaraan: "",
      });

      showToast("Kurir berhasil ditambahkan!", "success");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error:", err);
      showToast(
        err.message || "Terjadi kesalahan saat menambahkan kurir",
        "error"
      );
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
            <h2 className="text-lg font-semibold mb-4">Tambah Kurir</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-sm font-medium">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="nomorTelepon"
                  value={formData.nomorTelepon}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Nomor Polisi
                </label>
                <input
                  type="text"
                  name="nomorPolisi"
                  value={formData.nomorPolisi}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Merk Kendaraan
                </label>
                <input
                  type="text"
                  name="merkKendaraan"
                  value={formData.merkKendaraan}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Warna Kendaraan
                </label>
                <input
                  type="text"
                  name="warnaKendaraan"
                  value={formData.warnaKendaraan}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div className="text-right">
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TambahKurir;
