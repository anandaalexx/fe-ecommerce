import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../Button";

const ModalTambahPengguna = ({ isOpen, onClose, onSuccess, showToast }) => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [roleId, setRoleId] = useState(1);
  const [saldo, setSaldo] = useState("");
  const [roles, setRoles] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchRoles = async () => {
    if (!apiUrl) return;
    try {
      const res = await fetch(`${apiUrl}/admin/role`);
      const data = await res.json();
      console.log("Data roles:", data);
      setRoles(data);
    } catch (err) {
      console.error("Gagal mengambil role:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const saldoNumber = saldo === "" ? 0 : parseFloat(saldo);

    if (!nama || !email || !password) {
      showToast("Nama, email, dan password harus diisi.", "warning");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          email,
          password,
          alamat,
          roleId,
          saldo: saldoNumber,
        }),
      });

      console.log(response);

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error message:", errorMessage);
        console.log(roleId);
        throw new Error("Gagal menambahkan pengguna");
      }

      showToast("Berhasil menambahkan pengguna", "success");

      // Reset form & tutup modal
      setNama("");
      setEmail("");
      setPassword("");
      setAlamat("");
      setRoleId(1);
      setSaldo("");
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
            <h2 className="text-lg font-semibold mb-4">Tambah Pengguna</h2>
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
                  type="text"
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
                  autoComplete="off"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Alamat</label>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Role</label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#EDCF5D] capitalize"
                >
                  {roles.map((role) => {
                    // Add validation for role.id
                    if (!role.id) {
                      console.error("Role with missing id:", role);
                      return null; // Skip rendering this option
                    }
                    return (
                      <option
                        key={role.id}
                        value={role.id}
                        className="capitalize"
                      >
                        {role.namaRole}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Saldo</label>
                <input
                  type="number"
                  value={saldo}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSaldo(value === "" ? "" : value);
                  }}
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

export default ModalTambahPengguna;
