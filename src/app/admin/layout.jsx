"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DashboardLayout from "../components/DashboardLayout";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (!token || role !== "4") {
      router.replace("/");
    } else {
      setIsAuthorized(true);
    }

    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  return isAuthorized ? (
    <DashboardLayout role="admin" username="Admin">
      {children}
    </DashboardLayout>
  ) : null;
};

export default AdminLayout;
