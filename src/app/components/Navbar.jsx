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
    <nav className="w-full border-b border-gray-300">
      {/* Navbar Atas */}
      <div className="text-center text-sm py-2 px-4 font-semibold border-b border-gray-300">
        <p>
          Bergabung bersama kami |{" "}
          <a href="" className="cursor-pointer hover:underline text-[#EDCF5D]">
            Mulai berjualan
          </a>
        </p>
      </div>

      {/* Navbar Tengah */}
      <div className="flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Logo />

        {/* Search Bar */}
        <div className="relative flex-1 mx-8 max-w-lg">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-gray-100"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* Ikon dan Profil */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center text-sm cursor-pointer">
            <Store size={24} />
            <span>Toko Anda</span>
          </div>
          <div className="flex flex-col items-center text-sm cursor-pointer">
            <ShoppingCart size={24} />
            <span>Keranjang</span>
          </div>
          <div className="flex flex-col items-center text-sm cursor-pointer">
            <CircleUserRound size={24} />
            <span>Akun</span>
          </div>
        </div>
      </div>

      {/* Navbar Bawah */}
      <div className="flex justify-between items-center py-3 border-t border-gray-300 text-sm">
        {/* Menu di Tengah */}
        <div className="flex justify-center gap-6 flex-1">
          <span className="cursor-pointer">Menu</span>
          <span className="cursor-pointer">Menu</span>
          <span className="cursor-pointer">Menu</span>
          <span className="cursor-pointer">Menu</span>
          <span className="cursor-pointer">Menu</span>
          <span className="cursor-pointer">Menu</span>
        </div>

        {/* Saldo Elektronik */}
        <div className="px-6 font-bold flex items-center gap-2">
          <Wallet size={20} />
          <span className="">Rp 150.000</span>
        </div>
      </div>
    </nav>
  );
}
