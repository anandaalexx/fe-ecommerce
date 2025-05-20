"use client";
import { useState, useRef, useEffect } from "react";
import { FilePenLine, Trash2, Ellipsis } from "lucide-react";
import ModalKonfirmasi from "../admin/modals/Konfirmasi";

// Dummy data untuk pengiriman
const pengirimans = [
  {
    id: 1,
    tanggal: "2025-05-03",
    status: "Siap Diantar",
    pembeli: "John Doe",
    produk: [
      {
        nama: "Laptop",
        jumlah: 1,
        harga: 5000000,
        penjual: "Toko Elektronik A",
      },
      { nama: "Mouse", jumlah: 2, harga: 150000, penjual: "Toko Elektronik A" },
    ],
  },
  {
    id: 2,
    tanggal: "2025-05-04",
    status: "Siap Diantar",
    pembeli: "Jane Smith",
    produk: [
      { nama: "Kamera", jumlah: 1, harga: 3500000, penjual: "Toko Kamera B" },
    ],
  },
  {
    id: 3,
    tanggal: "2025-05-05",
    status: "Siap Diantar",
    pembeli: "Michael Johnson",
    produk: [
      {
        nama: "Smartphone",
        jumlah: 1,
        harga: 7000000,
        penjual: "Toko Gadget C",
      },
      { nama: "Headphone", jumlah: 1, harga: 500000, penjual: "Toko Gadget C" },
    ],
  },
];

const Pengiriman = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pengirimanToProcess, setPengirimanToProcess] = useState(null);

  const handleSelectPengiriman = (pengiriman) => {
    setPengirimanToProcess(pengiriman);
    console.log("Pengiriman yang dipilih:", pengiriman);
  };

  const handleEllipsisClick = (e, pengirimanId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setOpenDropdownId(pengirimanId);
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

  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm relative z-0">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Tanggal Pengiriman</th>
              <th className="px-6 py-3 text-left">Status Pengiriman</th>
              <th className="px-6 py-3 text-left">Pembeli</th>
              <th className="px-6 py-3 text-left">Produk</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {pengirimans.map((pengiriman) => (
              <tr key={pengiriman.id}>
                <td className="px-6 py-4">{pengiriman.tanggal}</td>
                <td className="px-6 py-4">{pengiriman.status}</td>
                <td className="px-6 py-4">{pengiriman.pembeli}</td>
                <td className="px-6 py-4">
                  <ul>
                    {pengiriman.produk.map((produk, index) => (
                      <li key={index}>
                        {produk.nama} - {produk.jumlah} x Rp{produk.harga} (
                        {produk.penjual})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleSelectPengiriman(pengiriman)}
                    className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
                  >
                    Pilih
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pengirimanToProcess && (
        <ModalKonfirmasi
          isOpen={true}
          onClose={() => setPengirimanToProcess(null)}
          onConfirm={() =>
            console.log("Pengiriman diproses:", pengirimanToProcess)
          }
          title="Konfirmasi Pilih Pengiriman"
          message={`Apakah Anda yakin ingin memproses pengiriman untuk pembeli "${pengirimanToProcess.pembeli}"?`}
        />
      )}
    </>
  );
};

export default Pengiriman;
