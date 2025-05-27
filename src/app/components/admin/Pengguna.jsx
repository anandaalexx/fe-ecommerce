"use client";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import TablePengguna from "./TablePengguna";
import ModalTambahPengguna from "./modals/TambahPengguna";
import ModalEditPengguna from "./modals/EditPengguna";
import ToastNotification from "../ToastNotification";

const Pengguna = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Gagal mengambil data users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEdit = async (updatedUser) => {
    const res = await fetch(`${apiUrl}/admin/users/${updatedUser.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Gagal mengedit pengguna");
      return;
    }

    await fetchUsers();
    showToast("Pengguna berhasil diperbarui", "success");
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

      <TablePengguna
        users={users}
        setUsers={setUsers}
        onEdit={handleEditUser}
        showToast={showToast}
      />

      <ModalTambahPengguna
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchUsers();
          showToast("Pengguna berhasil ditambahkan", "success");
        }}
      />

      <ModalEditPengguna
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedUser}
        onSubmit={async (updatedUser) => {
          await handleEdit(updatedUser);
          showToast("Pengguna berhasil diperbarui", "success");
          setIsEditModalOpen(false);
        }}
      />

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Pengguna;
