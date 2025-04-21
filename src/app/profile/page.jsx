"use client";
import { useState } from "react";

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
      {/* Konten Halaman */}
      <div className="flex flex-col md:flex-row min-h-screen bg-white p-6 gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4 bg-white p-6 border-b md:border-b-0 md:border-r border-gray-300">
          <div className="flex items-center space-x-3">
            <img src={image} alt="Profile" className="w-12 h-12 rounded-full" />
            <div>
              <div className="text-base font-semibold">febrianulalal</div>
              <button className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                ✏️ <span>Ubah Profil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Konten Profil */}
        <div className="w-full md:max-w-3xl bg-white p-6 md:p-8 rounded-lg shadow-xl">
          <h2 className="text-lg font-semibold mb-4 text-left">Profil Saya</h2>
          <p className="text-sm text-gray-600 mb-6 text-left">
            Kelola informasi profil Anda untuk mengontrol, melindungi, dan
            mengamankan akun.
          </p>
          <hr className="border-t border-gray-400 mb-6" />

          {/* Kontainer Profil */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Data Profil */}
            <div className="flex-1 space-y-4 text-left w-full border-b md:border-b-0 md:border-r border-gray-300 pb-4 md:pb-0 md:pr-8">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <label className="w-full md:w-1/4 text-sm text-gray-700">
                  Username
                </label>
                <p className="text-sm text-gray-900">febrianulalal</p>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <label className="w-full md:w-1/4 text-sm text-gray-700">
                  Email
                </label>
                <p className="text-sm text-gray-900">
                  fe********@gmail.com{" "}
                  <a href="#" className="text-[#D9B84E]">
                    Ubah
                  </a>
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <label className="w-full md:w-1/4 text-sm text-gray-700">
                  Password
                </label>
                <p className="text-sm text-gray-900">
                  ********{" "}
                  <a href="#" className="text-[#D9B84E]">
                    Ubah
                  </a>
                </p>
              </div>
            </div>

            {/* Foto Profil */}
            <div className="flex flex-col items-center">
              <img
                src={image}
                alt="Profile"
                className="w-24 h-24 rounded-full border mb-2"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="fileInput"
                onChange={handleImageChange}
              />
              <label
                htmlFor="fileInput"
                className="bg-[#D9B84E] text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-yellow-600"
              >
                Pilih Gambar
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Maks. 1 MB | .JPEG, .PNG
              </p>
            </div>
          </div>

          {/* Tombol Simpan Perubahan */}
          <div className="mt-6 text-left">
            <button className="bg-[#D9B84E] text-white px-6 py-2 rounded hover:bg-yellow-600">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
