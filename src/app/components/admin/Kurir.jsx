"use client";
import { useState, useEffect, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import TableKurir from "./TableKurir";
import TambahKurir from "./modals/TambahKurir";
import EditKurir from "./modals/EditKurir";
import ToastNotification from "../ToastNotification";

const Kurir = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKurir, setSelectedKurir] = useState(null);
  const [kurirs, setKurirs] = useState([]);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    }
  };

  const fetchKurir = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/couriers`);
      const data = await res.json();
      setKurirs(data);
    } catch (err) {
      console.error("Gagal mengambil data kurir:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchKurir();
  }, []);

  useEffect(() => {
    console.log("Data kurir setelah enrich:", enrichKurirs);
  }, [kurirs, users]);

  const enrichKurirs = useMemo(() => {
    return kurirs.map((kurir) => {
      const user = users.find((u) => String(u.id) === String(kurir.idUser));
      return {
        ...kurir,
        idUser: user?.id || "-",
        namaUser: user?.nama || "-",
      };
    });
  }, [kurirs, users]);

  const handleEditKurir = (kurir) => {
    const user = users.find((u) => String(u.id) === String(kurir.idUser));
    const combinedData = {
      ...kurir,
      id: kurir.id,
      idUser: kurir.idUser,
      nama: user?.nama || "",
      email: user?.email || "",
      password: user?.password || "",
      nomorTelepon: kurir.nomorTelepon || "",
      nomorPolisi: kurir.nomorPolisi || "",
      merkKendaraan: kurir.merkKendaraan || "",
      warnaKendaraan: kurir.warnaKendaraan || "",
    };

    setSelectedKurir(combinedData);
    setIsEditModalOpen(true);
  };

  const handleEdit = async (updatedKurir) => {
    const { id, idUser, nama, email, password, ...kurirFields } = updatedKurir;

    try {
      // Update user data
      const userRes = await fetch(`${apiUrl}/admin/users/${idUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password }),
      });

      if (!userRes.ok) {
        const error = await userRes.json();
        throw new Error(error.message || "Gagal update data user");
      }

      // Update courier data
      const courierRes = await fetch(`${apiUrl}/admin/couriers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...kurirFields,
          idUser,
        }),
      });

      if (!courierRes.ok) {
        const error = await courierRes.json();
        throw new Error(error.message || "Gagal update data kurir");
      }

      // Optimistic update
      setKurirs((prev) =>
        prev.map((k) => (k.id === id ? { ...k, ...kurirFields } : k))
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === idUser ? { ...u, nama, email, password } : u))
      );

      showToast("Data kurir berhasil diperbarui", "success");
      return true;
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message || "Gagal memperbarui data", "error");
      // Rollback dengan fetch ulang
      await fetchKurir();
      await fetchUsers();
      return false;
    }
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

      <TableKurir
        kurirs={enrichKurirs}
        setKurirs={setKurirs}
        onEdit={handleEditKurir}
      />

      <TambahKurir
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={async () => {
          await fetchUsers();
          await fetchKurir();
          showToast("Kurir berhasil ditambahkan", "success");
        }}
      />

      <EditKurir
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedKurir}
        onSubmit={async (updatedKurir) => {
          const success = await handleEdit(updatedKurir);
          if (success) {
            setIsEditModalOpen(false);
          }
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

export default Kurir;
