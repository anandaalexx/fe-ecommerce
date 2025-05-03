"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";
import AdminDashboard from "./admin/Dashboard";
import KelolaPengguna from "./admin/Pengguna";
import KelolaBarang from "./admin/Barang";
import KelolaKurir from "./admin/Kurir";
import TambahProduk from "./pengguna/TambahProduk";
import Kategori from "./admin/Kategori";
import KurirDashboard from "./kurir/Dashboard";
import Pengiriman from "./kurir/Pengiriman";
import HarusDiantar from "./kurir/HarusDiantar";

const DashboardLayout = ({ role, username }) => {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderContent = () => {
    if (role === "admin") {
      switch (activePage) {
        case "Dashboard":
          return <AdminDashboard onNavigate={setActivePage} />;
        case "Kelola Pengguna":
          return <KelolaPengguna />;
        case "Kelola Kurir":
          return <KelolaKurir />;
        case "Kelola Barang":
          return <KelolaBarang />;
        case "Kategori":
          return <Kategori />;
        default:
          return <p>Halaman tidak ditemukan.</p>;
      }
    } else if (role === "seller") {
      switch (activePage) {
        case "Dashboard":
          return <p>Form untuk menambah produk baru.</p>;
        case "Tambah Produk":
          return <TambahProduk />;
        case "List Produk":
          return <p>Daftar pesanan yang masuk.</p>;
        default:
          return <p>Halaman tidak ditemukan.</p>;
      }
    } else if (role === "courier") {
      switch (activePage) {
        case "Dashboard":
          return <KurirDashboard />;
        case "Pengiriman":
          return <Pengiriman />;
        case "Harus Diantar":
          return <HarusDiantar />;
        default:
          return <p>Halaman tidak ditemukan.</p>;
      }
    }
  };

  return (
    <div>
      <Header username={username} onLogout={() => alert("Logout")} />
      <Sidebar
        role={role}
        activePage={activePage}
        onMenuSelect={setActivePage}
      />
      <main className="ml-64 pt-24 px-6">
        <h1 className="text-2xl font-bold mb-4">{activePage}</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardLayout;
