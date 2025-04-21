"use client";
import { useState } from "react";
import { Eye, EyeOff, Mail, LockKeyhole } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/Button";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");

  const handleToggle = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    if (value.length === 0) {
      setType("password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg flex overflow-hidden max-w-4xl w-full h-[600px]">
        {/* Sisi Kiri - Form Login */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-left">Masuk ke akun anda</h1>
          <p className="text-gray-500 mt-2 text-left font-light">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-[#EDCF5D] font-light hover:underline"
            >
              Buat akun!
            </a>
          </p>

          <form className="mt-6">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-[50%] transform -translate-y-1/2 ">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-2 pl-10"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-[50%] transform -translate-y-1/2 ">
                  <LockKeyhole size={18} />
                </span>
                <input
                  type={type}
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-md p-2 px-10"
                />
                {password.length > 0 && (
                  <span
                    className="absolute right-3 top-[55%] transform -translate-y-1/2 cursor-pointer text-black hover:text-gray-900"
                    onClick={handleToggle}
                  >
                    {type === "password" ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </span>
                )}
              </div>
              <a
                href="#"
                className="text-[#EDCF5D] text-sm font-light float-right mt-1 hover:underline"
              >
                Lupa password?
              </a>
            </div>

            <Button>Masuk</Button>
          </form>
        </div>

        {/* Sisi Kanan - Gambar */}
        <div className="w-1/2 bg-[rgba(237,207,93,0.15)] flex items-center justify-center">
          <img
            src="shopkuning.svg"
            alt="Login Illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
