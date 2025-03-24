"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
          <h1 className="text-5xl font-extrabold mb-8 text-center">
            T<span className="text-[#EDCF5D]">K</span>L
            <span className="text-[#EDCF5D]">K</span>
          </h1>
          <h1 className="text-3xl font-bold text-left">Masuk ke akun anda</h1>
          <p className="text-gray-500 mt-2 text-left font-light">
            Belum punya akun?{" "}
            <a href="#" className="text-[#EDCF5D] font-light hover:underline">
              Buat akun!
            </a>
          </p>

          <form className="mt-6">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={type}
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 pr-10"
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

            <button className="w-full bg-[#EDCF5D] text-white py-2 rounded-md mt-6 drop-shadow-lg hover:bg-[rgba(237,207,93,0.8)] cursor-pointer">
              Masuk
            </button>
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
