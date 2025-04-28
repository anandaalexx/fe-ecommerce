"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

export default function ProfilePage() {
  const [image, setImage] = useState("https://via.placeholder.com/100");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
          {/* Sidebar */}
          <aside className="md:w-1/4 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4">
              <img
                src={image}
                alt="Profile"
                className="w-14 h-14 rounded-full shadow"
              />
              <div>
                <div className="text-base font-semibold text-gray-800">
                  febrianulalal
                </div>
                <Button>Ubah Profil</Button>
              </div>
            </div>
          </aside>

          {/* Konten Utama */}
          <main className="flex-1 bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Profil Saya
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Kelola informasi profil Anda untuk mengontrol, melindungi, dan
              mengamankan akun.
            </p>
            <hr className="border-t border-gray-300 mb-6" />

            {/* Informasi dan Foto Profil */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Info User */}
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Username
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    febrianulalal
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    fe********@gmail.com{" "}
                    <a
                      href="#"
                      className="text-yellow-500 hover:underline ml-2"
                    >
                      Ubah
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Password
                  </label>
                  <p className="text-sm text-gray-900">
                    ********{" "}
                    <a
                      href="#"
                      className="text-yellow-500 hover:underline ml-2"
                    >
                      Ubah
                    </a>
                  </p>
                </div>
              </div>

              {/* Upload Foto */}
              <div className="flex flex-col items-center">
                <img
                  src={image}
                  alt="Profile"
                  className="w-28 h-28 rounded-full border shadow-md object-cover transition-all duration-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileInput"
                  onChange={handleImageChange}
                />
                <Button>Pilih Gambar</Button>
                <p className="text-xs text-gray-500 mt-1">
                  Maks. 1 MB | .JPEG, .PNG
                </p>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="mt-8">
              <Button>Simpan Perubahan</Button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
