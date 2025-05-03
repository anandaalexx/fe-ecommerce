"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { MapPinned, SquarePen, Camera } from "lucide-react";

export default function ProfilePage() {
  const [image, setImage] = useState("https://via.placeholder.com/100");
  const [location, setLocation] = useState("");
  const [latLng, setLatLng] = useState(null);

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

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLatLng({ lat, lng });

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setLocation(data.results[0].formatted_address);
      } else {
        setLocation("Alamat tidak ditemukan.");
      }
    } catch (error) {
      setLocation("Gagal mengambil alamat.");
    }
  };

  const handleSave = () => {
    console.log("Disimpan secara lokal:");
    console.log("Image:", image);
    console.log("Alamat:", location);
    alert("Perubahan disimpan secara lokal (belum tersambung ke API)");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Profil Saya</h2>
          <p className="text-sm text-gray-600 mb-6">
            Kelola informasi akun Anda.
          </p>
          <hr className="mb-6" />

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card Kiri: Profil */}
            <div className="bg-white rounded-2xl p-6 shadow-md col-span-1 flex flex-col items-center text-center">
              <div className="relative group">
                <img
                  src="banner1.jpg"
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover shadow mb-4 transition duration-300"
                />
                <div className="w-28 h-28 absolute inset-0 bg-black opacity-0 group-hover:opacity-50 flex justify-center items-center text-white rounded-full transition-opacity duration-300">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center"
                  >
                    <Camera className="ml-3" size={24} />
                    <span>Ubah Gambar</span>
                  </label>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-800">Febriani</h3>
              <p className="text-gray-600 text-sm">@febrinualal</p>
              <p className="text-gray-600 text-sm mb-3">
                febrinualal@gmail.com
              </p>
              <Button onClick={handleSave}>Simpan</Button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md col-span-2 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-gray-800">
                  Informasi Akun
                </h4>
              </div>

              {/* Email */}
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium">
                    febrinualal@gmail.com
                  </p>
                </div>
                <button className="text-gray-800 hover:text-gray-600 cursor-pointer">
                  <SquarePen size={20} />
                </button>
              </div>

              {/* Password */}
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="text-sm text-gray-500">Password</p>
                  <p className="text-gray-800 font-medium">********</p>
                </div>
                <button className="text-gray-800 hover:text-gray-600 cursor-pointer">
                  <SquarePen size={20} />
                </button>
              </div>

              {/* Alamat */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="text-gray-800 font-medium">
                    {location || "Belum dipilih"}
                  </p>
                </div>
                <button className="text-gray-800">
                  <MapPinned size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Peta */}
          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Pin Lokasi di Peta
            </h3>
            <div className="w-full h-64 rounded-xl overflow-hidden border-gray-500">
              <GoogleMap onMapClick={handleMapClick} latLng={latLng} />
            </div>
          </div>

          {/* Tombol */}
          <div className="mt-8 text-right">
            <Button onClick={handleSave}>Simpan Perubahan</Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Komponen Google Maps
function GoogleMap({ onMapClick, latLng }) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: -1.265, lng: 116.831 },
        zoom: 13,
      });

      map.addListener("click", onMapClick);

      if (latLng) {
        new window.google.maps.Marker({
          position: latLng,
          map,
        });
      }
    }
  }, [mapLoaded, latLng]);

  return <div id="map" className="w-full h-full" />;
}
