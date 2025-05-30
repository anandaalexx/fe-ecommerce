"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Store,
  CircleUserRound,
  Wallet,
  LogOut,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Logo from "./Logo.jsx";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/category/view`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };

    getCategories();
  }, [apiUrl]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Gagal fetch user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };

    getUser();
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".akun-dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <nav className="fixed w-full z-50 border-b border-gray-300 bg-white">
      {/* Navbar Atas */}
      <div className="text-center text-sm py-2 px-4 font-medium border-b border-gray-300">
        <p>
          Bergabung bersama kami |{" "}
          <a
            href="/profile"
            className="cursor-pointer hover:underline text-[#EDCF5D] transition-all duration-300"
          >
            Mulai berjualan
          </a>
        </p>
      </div>

      {/* Navbar Tengah */}
      <div className="flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Logo />

        {/* Search Bar */}
        <div className="relative flex-1 mx-8 max-w-lg group transition-all duration-300">
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full pl-10 pr-4 py-2 outline-none ring-1 ring-gray-300 focus:ring-[#EDCF5D] focus:ring-opacity-50 rounded-md bg-gray-100 text-gray-700"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* Ikon dan Profil */}
        <div className="flex items-center gap-6">
          {/* Toko Saya */}
          {user?.role === 2 && (
            <div
              className="flex flex-col items-center text-sm cursor-pointer transition-all duration-300 hover:text-[#EDCF5D]"
              onClick={() => router.push("/pengguna")}
            >
              <Store size={24} />
              <span className="mt-1">Toko Saya</span>
            </div>
          )}

          {/* Keranjang */}
          <div
            className="flex flex-col items-center text-sm cursor-pointer transition-all duration-300 hover:text-[#EDCF5D]"
            onClick={() => router.push("/keranjang")}
          >
            <ShoppingCart size={24} />
            <span className="mt-1">Keranjang</span>
          </div>

          {/* Akun dengan Dropdown */}
          <div className="relative akun-dropdown">
            <div
              className="flex flex-col items-center text-sm cursor-pointer transition-all duration-300 hover:text-[#EDCF5D]"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <CircleUserRound size={24} />
              <span className="mt-1">Akun</span>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-25 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    router.push("/profile");
                  }}
                  className="w-full flex items-center justify-between text-sm px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span>Profil</span>
                  <Eye size={16} />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between text-sm px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span>Logout</span>
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navbar Bawah */}
      <div className="flex justify-between items-center py-3 border-t border-gray-300 text-sm">
        <div className="flex font-medium text-md justify-left gap-6 flex-1 px-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <span
                key={cat.id}
                className="cursor-pointer relative hover:text-[#EDCF5D] transition-all duration-300"
                onClick={() => router.push(`/home/kategori/${cat.id}`)}
              >
                {cat.nama}
              </span>
            ))
          ) : (
            <span className="text-gray-400">Memuat kategori...</span>
          )}
        </div>

        {/* Saldo */}
        <div className="px-6 font-semibold flex items-center gap-2 text-lg cursor-pointer">
          <Wallet size={20} />
          <span>
            {user ? `Rp ${Number(user.saldo).toLocaleString("id-ID")}` : "Rp 0"}
          </span>
        </div>
      </div>
    </nav>
  );
}
