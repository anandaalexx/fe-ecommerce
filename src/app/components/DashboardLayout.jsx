"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./BreadCrumb";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ role, username, children }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div>
      <Header username={username} onLogout={() => alert("Logout")} />
      <Sidebar role={role} currentPath={pathname} onMenuSelect={router.push} />
      <main className="ml-64 pt-24 px-6">
        <Breadcrumbs />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
