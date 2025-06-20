"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DashboardLayout from "../components/DashboardLayout";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${apiUrl}/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        console.log("Status:", res.status);
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        console.log("User data:", data);
        setUser(data);
        setChecked(true);

        // Bisa redirect berdasarkan role
        if (data.roleId === 4) {
          setIsAuthorized(true);
        } else {
          router.push("/");
        }
      })
      .catch((err) => {
        console.error("Gagal ambil data user:", err);
        setChecked(true);
        router.push("/login");
      });
  }, []);

  if (!checked) {
    return null;
  }

  return isAuthorized ? (
    <DashboardLayout role="admin" username={user?.email || "Admin"}>
      {children}
    </DashboardLayout>
  ) : null;
};

export default AdminLayout;
