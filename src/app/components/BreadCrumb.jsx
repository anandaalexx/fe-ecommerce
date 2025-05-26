"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const labelMap = {
  admin: "Admin",
  pengguna: "Pengguna",
  kurir: "Kurir",
  dashboard: "Dashboard",
  "kelola-pengguna": "Kelola Pengguna",
  "kelola-kurir": "Kelola Kurir",
  "kelola-barang": "Kelola Barang",
  kategori: "Kategori",
  "tambah-produk": "Tambah Produk",
  "list-produk": "List Produk",
  pengiriman: "Pengiriman",
  "harus-diantar": "Harus Diantar",
  tambah: "Tambah",
  edit: "Edit",
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter((part) => part);

  return (
    <nav className="text-sm text-gray-500 mb-4">
      <ol className="flex items-center space-x-2">
        {pathParts.map((part, index) => {
          const href = "/" + pathParts.slice(0, index + 1).join("/");
          const label =
            labelMap[part] ||
            part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <li key={href} className="flex items-center space-x-2">
              <span>/</span>
              <Link href={href} className="hover:underline font-medium">
                {label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
