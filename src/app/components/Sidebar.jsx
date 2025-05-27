import {
  PlusCircle,
  House,
  UserRound,
  Truck,
  List,
  Package,
  Send,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import Spinner from "./Spinner";

const menuByRole = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: <House size={20} /> },
    {
      label: "Kelola Pengguna",
      path: "/admin/kelola-pengguna",
      icon: <UserRound size={20} />,
    },
    {
      label: "Kelola Kurir",
      path: "/admin/kelola-kurir",
      icon: <Truck size={20} />,
    },
    {
      label: "Kelola Barang",
      path: "/admin/kelola-barang",
      icon: <Package size={20} />,
    },
    { label: "Kategori", path: "/admin/kategori", icon: <List size={20} /> },
  ],
  seller: [
    {
      label: "Dashboard",
      path: "/pengguna",
      icon: <House size={20} />,
    },
    {
      label: "Tambah Produk",
      path: "/pengguna/tambah-produk",
      icon: <PlusCircle size={20} />,
    },
    {
      label: "List Produk",
      path: "/pengguna/list-produk",
      icon: <List size={20} />,
    },
    {
      label: "Penjualan Saya",
      path: "/pengguna/list-penjualan",
      icon: <List size={20} />,
    },
  ],
  courier: [
    {
      label: "Dashboard",
      path: "/kurir",
      icon: <House size={20} />,
    },
    {
      label: "Pengiriman",
      path: "/courier/pengiriman",
      icon: <Send size={20} />,
    },
    {
      label: "Harus Diantar",
      path: "/courier/harus-diantar",
      icon: <Truck size={20} />,
    },
  ],
};

const Sidebar = ({ role = "seller" }) => {
  const menu = menuByRole[role] || [];
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (path) => {
    startTransition(() => {
      router.push(path);
    });
  };

  return (
    <>
      {isPending && <Spinner />}
      <aside className="w-64 bg-white border-r border-gray-200 pt-20 pb-8 fixed top-0 left-0 h-full z-10">
        <nav className="space-y-2">
          {menu.map((item, i) => (
            <div
              key={i}
              onClick={() => handleClick(item.path)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
                pathname === item.path
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
    </>
  );
};

export default Sidebar;
