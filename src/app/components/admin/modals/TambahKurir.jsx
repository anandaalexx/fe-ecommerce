import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../Button";

const TambahKurir = ({ isOpen, onClose, onSuccess }) => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [latitude, setLatitude] = useState(null);   
  const [longitude, setLongitude] = useState(null); 
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [nomorPolisi, setNomorPolisi] = useState("");
  const [merkKendaraan, setMerkKendaraan] = useState("");
  const [warnaKendaraan, setWarnaKendaraan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Reset form ketika modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setNama("");
      setEmail("");
      setPassword("");
      setNomorTelepon("");
      setNomorPolisi("");
      setMerkKendaraan("");
      setWarnaKendaraan("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama || !email || !password) {
      showToast("Nama, email, dan password harus diisi.", "warning");
      return;
    }

    setIsLoading(true);

    try {
      
      console.log("Data dikirim ke backend:", {
      userData: {
        nama,
        email,
        password,
        alamat: null,
        latitude: null,
        longitude: null,
      },
      kurirData: {
        nomorTelepon,
        nomorPolisi,
        merkKendaraan,
        warnaKendaraan,
      },
    });

    const response = await fetch(`${apiUrl}/admin/couriers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userData: {
          nama,
          email,
          password,
          alamat: null,
          latitude: null,
          longitude: null,
        },
        kurirData: {
          nomorTelepon,
          nomorPolisi,
          merkKendaraan,
          warnaKendaraan,
        },
      }),
    });

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Gagal menambahkan kurir");
      }

      // Reset form
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
      console.error("Error adding kurir:", err);
      showToast(err.message || "Gagal menambahkan kurir", "error");
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Tambah Kurir</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                  placeholder="contoh@gmail.com"
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Harus menggunakan email Gmail</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                  disabled={isLoading}
                  required
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <div className="text-right">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TambahKurir;