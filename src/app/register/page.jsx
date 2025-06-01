"use client";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, LockKeyhole } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import SuccessDialog from "../components/SuccessDialog";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!nama || !email || !password || !confirmPassword) {
      setErrorMessage("Semua field harus diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak sama.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password }),
      });

      const data = await response.json();
      console.log("RESPONSE DATA:", data);

      if (response.ok) {
        setShowDialog(true);
      } else {
        setErrorMessage("Email sudah terdaftar. Gunakan Email lain!");
      }
    } catch (error) {
      console.error("Error saat register:", error);
      setErrorMessage("Terjadi kesalahan pada server.");
    } finally {
      setIsLoading(false);
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
            <a
              href="/login"
              className="text-[#EDCF5D] font-light hover:underline"
            >
              Masuk!
            </a>
          </p>

          <form className="mt-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bg-red-100 text-red-700 px-4 py-2 -mt-5 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Nama</label>
              <div className="relative">
                <span className="absolute left-3 top-[50%] transform -translate-y-1/2 ">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 pl-10"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-[50%] transform -translate-y-1/2 ">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 pl-10"
                  required
                />
              </div>
            </div>
            <div className="mt-4 relative">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-[50%] transform -translate-y-1/2 ">
                  <LockKeyhole size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-md p-2 px-10"
                  required
                />
              </div>
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
              <div className="relative">
                <span className="absolute left-3 top-[50%] transform -translate-y-1/2 ">
                  <LockKeyhole size={18} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-md p-2 px-10"
                  required
                />
              </div>
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white font-medium"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-100"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    ></circle>
                    <path
                      className="opacity-100"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                "Daftar"
              )}
            </Button>
            <SuccessDialog
              isOpen={showDialog}
              onClose={() => (window.location.href = "/login")}
              message="Silakan cek email Anda untuk melakukan verifikasi sebelum login."
            />
          </form>
        </div>
      </div>
    </div>
  );
}
