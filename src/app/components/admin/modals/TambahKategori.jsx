import { useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../Button";
import Spinner from "../../Spinner";
import ToastNotification from "../../ToastNotification";

const TambahKategori = ({ isOpen, onClose, onSuccess }) => {
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(false);
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

    if (!nama) {
      showToast("Nama kategori harus diisi.", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/category/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
        }),
        credentials: "include",
      });

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        const errorMessage = await response.text();
        console.log(errorMessage);
        throw new Error("Gagal menambahkan kategori");
      }


      setNama("");
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
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
              <h2 className="text-lg font-semibold mb-4">Tambah Kategori</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-1 text-sm font-medium">Nama</label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-"
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
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
};

export default TambahKategori;
