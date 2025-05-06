import {
  Search,
  ShoppingCart,
  Store,
  CircleUserRound,
  Wallet,
} from "lucide-react";

import Logo from "./Logo.jsx";

export default function Navbar() {
  return (
    <nav className="fixed z-9999 w-full border-b border-gray-300 bg-white">
      {/* Navbar Atas */}
      <div className="text-center text-sm py-2 px-4 font-medium border-b border-gray-300">
        <p>
          Bergabung bersama kami |{" "}
          <a
            href=""
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
          {[
            { icon: <Store size={24} />, label: "Toko Anda" },
            { icon: <ShoppingCart size={24} />, label: "Keranjang" },
            { icon: <CircleUserRound size={24} />, label: "Akun" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-sm cursor-pointer transition-all duration-300 hover:text-[#EDCF5D]"
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navbar Bawah */}
      <div className="flex justify-between items-center py-3 border-t border-gray-300 text-sm">
        {/* Menu di Tengah */}
        <div className="flex font-medium text-md justify-left gap-6 flex-1 px-6">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="cursor-pointer relative hover:text-[#EDCF5D] transition-all duration-300"
            >
              Menu
            </span>
          ))}
        </div>

        {/* Saldo Elektronik */}
        <div className="px-6 font-semibold flex items-center gap-2 text-lg cursor-pointer">
          <Wallet size={20} />
          <span>Rp 150.000</span>
        </div>
      </div>
    </nav>
  );
}
