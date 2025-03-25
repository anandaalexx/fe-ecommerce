"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../components/Logo";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value === "") {
      setShowPassword(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value === "") {
      setShowConfirmPassword(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Card Wrapper */}
      <div className="bg-white shadow-lg rounded-lg flex overflow-hidden max-w-4xl w-full h-[600px]">
        <div className="w-1/2 bg-[rgba(237,207,93,0.15)] flex items-center justify-center">
          <img
            src="registerkuning.svg"
            alt="Login Illustration"
            className="max-w-full h-auto"
          />
        </div>

        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-left">
            Bergabung bersama kami
          </h1>
          <p className="text-gray-500 mt-2 text-left font-light">
            Sudah punya akun?{" "}
            <a href="#" className="text-[#EDCF5D] font-light hover:underline">
              Masuk!
            </a>
          </p>

          <form className="mt-6">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>
            <div className="mt-4 relative">
              <label className="block text-sm font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-md p-2 mt-1 pr-10"
              />
              {password.length > 0 && (
                <span
                  className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer text-black hover:text-gray-900"
                  onClick={handlePasswordToggle}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </span>
              )}
            </div>
            <div className="mt-4 relative">
              <label className="block text-sm font-medium">
                Konfirmasi Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-md p-2 mt-1 pr-10"
              />
              {confirmPassword.length > 0 && (
                <span
                  className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer text-black hover:text-gray-900"
                  onClick={handleConfirmPasswordToggle}
                >
                  {showConfirmPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </span>
              )}
            </div>

            <button className="w-full bg-[#EDCF5D] drop-shadow-lg text-white py-2 rounded-md mt-6 hover:bg-[rgba(237,207,93,0.8)] cursor-pointer">
              Daftar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
