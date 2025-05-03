"use client";
import React, { useState } from "react";
import {
  PlusCircle,
  House,
  UserRound,
  Truck,
  List,
  Package,
  CheckSquare,
  Send,
} from "lucide-react";

const menuByRole = {
  admin: [
    { label: "Dashboard", icon: <House size={20} /> },
    { label: "Kelola Pengguna", icon: <UserRound size={20} /> },
    { label: "Kelola Kurir", icon: <Truck size={20} /> },
    { label: "Kelola Barang", icon: <Package size={20} /> },
    { label: "Kategori", icon: <List size={20} /> },
  ],
  seller: [
    { label: "Dashboard", icon: <House size={20} /> },
    { label: "Tambah Produk", icon: <PlusCircle size={20} /> },
    { label: "List Produk", icon: <List size={20} /> },
  ],
  courier: [
    { label: "Dashboard", icon: <House size={20} /> },
    { label: "Pengiriman", icon: <Send size={20} /> },
    { label: "Harus Diantar", icon: <Truck size={20} /> },
  ],
};

const Sidebar = ({ role = "seller", activePage, onMenuSelect }) => {
  const menu = menuByRole[role] || [];

  const handleClick = (label) => {
    if (onMenuSelect) onMenuSelect(label);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 pt-20 pb-8 fixed top-0 left-0 h-full z-10">
      <nav className="space-y-2">
        {menu.map((item, i) => (
          <div
            key={i}
            onClick={() => handleClick(item.label)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
              activePage === item.label
                ? "bg-[#f0e6c0] border-r-5 border-[#EDCF5D] text-[#0f172a] font-medium"
                : "text-[#0f172a] hover:bg-[#f0e6c0]"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
