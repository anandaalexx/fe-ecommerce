import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

const ModalEditKategori = ({ isOpen, onClose, kategori, onSuccess }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [nama, setNama] = useState("");

  useEffect(() => {
    if (kategori) {
      setNama(kategori.nama || "");
    }
  }, [kategori]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/category/edit/${kategori.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ nama }),
      });

      if (!response.ok) throw new Error("Gagal mengupdate kategori");

      const result = await response.json();
      console.log("Kategori berhasil diupdate:", result);
      onClose();
      onSuccess(); // refresh list kategori
    } catch (err) {
      console.error("Error saat mengupdate kategori:", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <Dialog.Title className="text-lg font-semibold text-center mb-4">
            Edit Kategori
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Kategori
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#EDCF5D] text-white rounded hover:brightness-110"
              >
                Simpan
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalEditKategori;
