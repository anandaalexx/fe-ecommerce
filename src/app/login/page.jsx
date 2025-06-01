"use client";
import { useState } from "react";
import { Eye, EyeOff, Mail, LockKeyhole } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleToggle = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Email dan password tidak boleh kosong!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const { user } = data;

        switch (user.roleId) {
          case 4:
            router.push("/admin");
            break;
          case 3:
            router.push("/kurir");
            break;
          case 2:
            router.push("/home");
            break;
          default:
            router.push("/home");
            break;
        }
      } else {
        setErrorMessage("Email atau password salah!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Terjadi kesalahan saat login!");
    } finally {
      setIsLoading(false); // selesai loading (tetap false walau gagal atau sukses)
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

          <form className="mt-6" onSubmit={handleSubmit}>
            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-[50%] transform -translate-y-1/2 ">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
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
                "Masuk"
              )}
            </Button>
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
