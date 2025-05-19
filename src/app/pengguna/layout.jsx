"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DashboardLayout from "../components/DashboardLayout";

const PenggunaLayout = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    console.log("TOKEN:", token);
    console.log("ROLE:", role);

    if (!token || role !== "2") {
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
    <DashboardLayout role="seller" username="Tokoloko">
      {children}
    </DashboardLayout>
  ) : null;
};

export default PenggunaLayout;
