import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../Button";
import ToastNotification from "../../ToastNotification";

const TambahKurir = ({ isOpen, onClose, onSuccess }) => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [nomorPolisi, setNomorPolisi] = useState("");
  const [merkKendaraan, setMerkKendaraan] = useState("");
  const [warnaKendaraan, setWarnaKendaraan] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama || !email || !password) {
      showToast("Nama, email, dan password harus diisi.", "warning");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/couriers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          email,
          password,
          nomorTelepon,
          nomorPolisi,
          merkKendaraan,
          warnaKendaraan,
        }),
      });

      console.log(response);

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error message:", errorMessage);
        throw new Error("Gagal menambahkan pengguna");
      }

      setNama("");
      setEmail("");
      setPassword("");
      setNomorTelepon("");
      setNomorPolisi("");
      setMerkKendaraan("");
      setWarnaKendaraan("");
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
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
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={nomorTelepon}
                  onChange={(e) => setNomorTelepon(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Nomor Polisi
                </label>
                <input
                  type="text"
                  value={nomorPolisi}
                  onChange={(e) => setNomorPolisi(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Merk Kendaraan
                </label>
                <input
                  type="text"
                  value={merkKendaraan}
                  onChange={(e) => setMerkKendaraan(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Warna Kendaraan
                </label>
                <input
                  type="text"
                  value={warnaKendaraan}
                  onChange={(e) => setWarnaKendaraan(e.target.value)}
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
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </AnimatePresence>
  );
};

export default TambahKurir;
