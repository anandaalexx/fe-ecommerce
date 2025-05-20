"use client";
import { useState, useEffect, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import TableKurir from "./TableKurir";
import TambahKurir from "./modals/TambahKurir";
import EditKurir from "./modals/EditKurir";

const Kurir = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKurir, setSelectedKurir] = useState(null);
  const [kurirs, setKurirs] = useState([]);
  const [users, setUsers] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      nama: user?.nama || "",
      email: user?.email || "",
      password: user?.password || "",
    };

    setSelectedKurir(combinedData);
    setIsEditModalOpen(true);
  };

  const handleEdit = async (updatedKurir) => {
    const { idUser, nama, email, password, ...kurirFields } = updatedKurir;

    await fetch(`${apiUrl}/admin/users/${idUser}`, {
      method: "PUT",
      body: JSON.stringify({ nama, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    await fetch(`${apiUrl}/admin/couriers/${updatedKurir.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...kurirFields, idUser }),
      headers: { "Content-Type": "application/json" },
    });

    await fetchKurir();
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
        }}
      />

      <EditKurir
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedKurir}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default Kurir;
