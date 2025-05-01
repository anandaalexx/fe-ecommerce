"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

const DashboardLayout = ({ role, username }) => {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderContent = () => {
    if (role === "admin") {
      switch (activePage) {
        case "Dashboard":
          return <p>Ini adalah dashboard admin.</p>;
        case "Kelola Pengguna":
          return <p>Admin dapat mengelola pengguna di sini.</p>;
        case "Kelola Kurir":
          return <p>Admin dapat mengelola data kurir di sini.</p>;
        case "Kelola Barang":
          return <p>Admin dapat mengelola barang di sini.</p>;
        case "Kategori":
          return <p>Admin dapat mengelola kategori barang.</p>;
        default:
          return <p>Halaman tidak ditemukan.</p>;
      }
    } else if (role === "seller") {
      switch (activePage) {
        case "Add Product":
          return <p>Form untuk menambah produk baru.</p>;
        case "Product List":
          return <p>Daftar produk milik penjual.</p>;
        case "Orders":
          return <p>Daftar pesanan yang masuk.</p>;
        default:
          return <p>Halaman tidak ditemukan.</p>;
      }
    } else if (role === "courier") {
      switch (activePage) {
        case "Dashboard":
          return <p>Dashboard kurir hari ini.</p>;
        case "Pengiriman Hari Ini":
          return <p>Daftar pengiriman hari ini.</p>;
        case "Riwayat":
          return <p>Riwayat pengiriman oleh kurir.</p>;
        default:
          return <p>Halaman tidak ditemukan.</p>;
      }
    }
  };

  return (
    <div>
      <Header username={username} onLogout={() => alert("Logout")} />
      <Sidebar role={role} onMenuSelect={setActivePage} />
      <main className="ml-64 pt-24 px-6">
        <h1 className="text-2xl font-bold mb-4">{activePage}</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardLayout;
