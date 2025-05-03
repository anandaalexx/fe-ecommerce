import { useState } from "react";
import { PlusCircle } from "lucide-react";
import TablePengguna from "./TablePengguna";
import ModalTambahPengguna from "./modals/TambahPengguna";
import ModalEditPengguna from "./modals/EditPengguna";

const Pengguna = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditUser = (user) => {
    setSelectedUser(user);
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
          Tambah Pengguna
        </button>
      </div>

      <TablePengguna onEdit={handleEditUser} />

      <ModalTambahPengguna
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ModalEditPengguna
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedUser}
        onSubmit={(updatedUser) => {
          console.log("User diedit:", updatedUser);
        }}
      />
    </div>
  );
};

export default Pengguna;
