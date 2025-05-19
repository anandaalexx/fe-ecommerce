"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./BreadCrumb";
import ModalKonfirmasi from "./admin/modals/Konfirmasi";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ role, username, children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [modalLogoutOpen, setModalLogoutOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  return (
    <div>
      <Header username={username} onLogout={() => setModalLogoutOpen(true)} />
      <Sidebar role={role} currentPath={pathname} onMenuSelect={router.push} />
      <main className="ml-64 pt-24 px-6">
        <Breadcrumbs />
        {children}
      </main>

      {/* Modal Logout */}
      <ModalKonfirmasi
        isOpen={modalLogoutOpen}
        onClose={() => setModalLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari akun?"
        confirmText="Keluar"
      />
    </div>
  );
};

export default DashboardLayout;
