import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../Button";

const ModalTambahPengguna = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // ini untuk klik di luar modal
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-lg p-6 relative shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()} // ini mencegah modal tertutup saat klik di dalam modal
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Tambah Pengguna</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Nama</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Role</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                  <option>Seller</option>
                  <option>Kurir</option>
                </select>
              </div>
              <div className="text-right">
                <Button>Simpan</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalTambahPengguna;
