"use client";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import TableKurir from "./TableKurir";
import TambahKurir from "./modals/TambahKurir";
import EditKurir from "./modals/EditKurir";

const Kurir = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKurir, setSelectedKurir] = useState(null);

  const handleEditKurir = (kurir) => {
    setSelectedKurir(kurir);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDCF5D] active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a] text-white font-medium rounded hover:brightness-110 transition duration-200 cursor-pointer"
        >
          <PlusCircle size={18} />
          Tambah Kurir
        </button>
      </div>

      <TableKurir onEdit={handleEditKurir} />

      <TambahKurir isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <EditKurir
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedKurir}
        onSubmit={(updatedKurir) => {
          console.log("Kurir diedit:", updatedKurir);
        }}
      />
    </div>
  );
};

export default Kurir;
