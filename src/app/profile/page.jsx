"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { MapPinned, SquarePen, Camera } from "lucide-react";
import dynamic from "next/dynamic";
import ToastNotification from "../components/ToastNotification";

export default function ProfilePage() {
  const [image, setImage] = useState("https://via.placeholder.com/100");
  const [location, setLocation] = useState("");
  const [latLng, setLatLng] = useState(null);
  const [alamat, setAlamat] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };
  const [isEditing, setIsEditing] = useState({
    nama: false,
    email: false,
    password: false,
    alamat: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    desa: "",
    jalan: "",
    detail: "",
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeForm, setUpgradeForm] = useState({
    storeName: "",
    storeDescription: "",
  });

  async function getCoordinates(text) {
    try {
      console.log("Text yang dikirim:", text);
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          text
        )}&format=json&apiKey=1064d268f41d487191c502c672dab3bd`
      );

      const data = await res.json();
      console.log("Hasil fetch Geoapify:", data);

      // Cek jika hasilnya tidak kosong
      if (data?.results && data.results.length > 0) {
        const { lat, lon } = data.results[0];
        console.log("Koordinat ditemukan:", lat, lon);
        return { lat, lon };
      } else {
        console.warn("Data tidak ditemukan di respons Geoapify.");
        return null;
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      return null;
    }
  }

  // Import MapPicker secara dinamis hanya di sisi client
  const MapPicker = dynamic(() => import("../components/MapPicker"), {
    ssr: false,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  const handleUpgradeToSeller = async () => {
    try {
      const response = await fetch(`${apiUrl}/user/upgrade-to-seller`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(upgradeForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upgrade error:", errorText);
        showToast("Gagal upgrade ke seller", "error");
        return;
      }

      showToast("Berhasil upgrade ke seller!", "success");
      setShowUpgradeModal(false);
      setRole("seller");
    } catch (err) {
      console.error("Error:", err);
      showToast("Terjadi kesalahan saat upgrade.", "error");
    }
  };

  const handleSave = async () => {
    try {
      const dataToUpdate = {
        nama,
        alamat,
        email,
      };

      if (password.trim() !== "") {
        dataToUpdate.password = password;
      }

      const response = await fetch(`${apiUrl}/user/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToUpdate),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan");
      }

      if (responseData.data) {
        setNama(responseData.data.nama ?? nama);
        setEmail(responseData.data.email ?? email);
        setAlamat(responseData.data.alamat ?? alamat);
      }

      setIsEditing({
        nama: false,
        email: false,
        password: false,
        alamat: false,
      });

      showToast("Perubahan berhasil disimpan", "success");
    } catch (error) {
      console.error("Error:", error);
      showToast("Gagal menyimpan perubahan", "error");
    }
  };

  const [suggestions, setSuggestions] = useState([]);

  const handleAutocompleteChange = async (e) => {
    const text = e.target.value;
    setForm((prev) => ({ ...prev, autocomplete: text }));

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      // Dapatkan koordinat kecamatan dan kabupaten
      const namaKecamatan = kecamatanList.find(
        (k) => String(k.kode_kecamatan) === String(form.kecamatan)
      )?.nama_kecamatan;

      const namaKabupaten = kabupatenList.find(
        (k) => String(k.kode_kabupaten) === String(form.kabupaten)
      )?.nama_kabupaten;

      console.log("Kecamatan: ", namaKecamatan);
      console.log("Kabupaten: ", namaKabupaten);

      if (!namaKecamatan || !namaKabupaten) return;

      const coords = await getCoordinates(`${namaKecamatan}, ${namaKabupaten}`);
      console.log("Koordinat Kecamatan dan Kabupaten:", coords);

      if (!coords) return;

      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          text
        )}&filter=circle:${coords.lon},${
          coords.lat
        },10000&format=json&apiKey=1064d268f41d487191c502c672dab3bd`
      );
      const data = await res.json();
      console.log("Hasil Autocomplete:", data);
      setSuggestions(data.results || []);
    } catch (err) {
      console.error("Autocomplete fetch error:", err);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      jalan: `${suggestion.street || ""} ${suggestion.housenumber || ""}`,
      autocomplete: suggestion.formatted,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    }));
    setSuggestions([]);
  };

  useEffect(() => {
    fetch("../api/wilayah/provinsi")
      .then((res) => res.json())
      .then((data) => setProvinsiList(data))
      .catch((err) => console.error("Failed to fetch provinsi: ", err));
  }, []);

  useEffect(() => {
    if (form.provinsi) {
      fetch(`/api/wilayah/kabupaten?kode_provinsi=${form.provinsi}`)
        .then((res) => res.json())
        .then((data) => setKabupatenList(data))
        .catch((err) => console.error("Failed to fetch kabupaten: ", err));
    }
  }, [form.provinsi]);

  useEffect(() => {
    if (form.kabupaten) {
      fetch(`/api/wilayah/kecamatan?kode_kabupaten=${form.kabupaten}`)
        .then((res) => res.json())
        .then((data) => setKecamatanList(data))
        .catch((err) => console.error("Failed to fetch kecamatan: ", err));
    }
  }, [form.kabupaten]);
  useEffect(() => {
    if (form.kecamatan) {
      fetch(`/api/wilayah/desa?kode_kecamatan=${form.kecamatan}`)
        .then((res) => res.json())
        .then((data) => setDesaList(data))
        .catch((err) => console.error("Failed to fetch desa: ", err));
    }
  }, [form.kecamatan]);

  useEffect(() => {
    if (form.kecamatan) {
      const namaKecamatan = kecamatanList.find(
        (k) => String(k.kode_kecamatan) === String(form.kecamatan)
      )?.nama_kecamatan;

      const namaKabupaten = kabupatenList.find(
        (k) => String(k.kode_kabupaten) === String(form.kabupaten)
      )?.nama_kabupaten;

      if (namaKecamatan && namaKabupaten) {
        getCoordinates(`${namaKecamatan}, ${namaKabupaten}`).then((coords) => {
          if (coords) {
            setForm((prev) => ({
              ...prev,
              latitude: coords.lat,
              longitude: coords.lon,
            }));
          }
        });
      }
    }
  }, [form.kecamatan]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data profil");
        }

        const data = await response.json();
        // console.log("Profile data:", data);
        setNama(data.nama);
        setEmail(data.email);
        setAlamat(data.alamat);
        setRole(data.role?.namaRole);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProfile();
  }, [apiUrl]);

  const getInitials = (nama) => {
    if (!nama) return "";
    const words = nama.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Jika memilih kabupaten atau kecamatan, perbarui posisi map
    if (name === "kabupaten" || name === "kecamatan") {
      const namaKecamatan = kecamatanList.find(
        (k) => String(k.kode_kecamatan) === String(value)
      )?.nama_kecamatan;

      const namaKabupaten = kabupatenList.find(
        (k) => String(k.kode_kabupaten) === String(value)
      )?.nama_kabupaten;

      if (namaKecamatan && namaKabupaten) {
        const coords = await getCoordinates(
          `${namaKecamatan}, ${namaKabupaten}`
        );
        if (coords) {
          setForm((prev) => ({
            ...prev,
            latitude: coords.lat,
            longitude: coords.lon,
          }));
        }
      }
    }
  };

  const handleSubmitAlamat = async () => {
    if (
      !form.nama ||
      !form.telepon ||
      !form.provinsi ||
      !form.kabupaten ||
      !form.kecamatan ||
      !form.desa ||
      !form.jalan ||
      !form.detail ||
      form.latitude === null ||
      form.longitude === null
    ) {
      showToast("Mohon lengkapi semua data!", "warning");
      return;
    }

    const namaProvinsi =
      provinsiList.find(
        (p) => Number(p.kode_provinsi) === Number(form.provinsi)
      )?.nama_provinsi || "";
    const namaKabupaten =
      kabupatenList.find(
        (k) => Number(k.kode_kabupaten) === Number(form.kabupaten)
      )?.nama_kabupaten || "";
    const namaKecamatan =
      kecamatanList.find(
        (k) => Number(k.kode_kecamatan) === Number(form.kecamatan)
      )?.nama_kecamatan || "";
    const namaDesa =
      desaList.find((d) => Number(d.kode_desa) === Number(form.desa))
        ?.nama_desa || "";

    const alamatBaru = `${form.nama}, ${form.telepon}, ${form.jalan}, ${form.detail}, Desa ${namaDesa}, Kecamatan ${namaKecamatan}, Kabupaten ${namaKabupaten}, Provinsi ${namaProvinsi}`;

    // ✅ Tampilkan koordinat yang akan dikirim
    console.log("Latitude yang dikirim:", form.latitude);
    console.log("Longitude yang dikirim:", form.longitude);
    // Simpan ke backend
    try {
      const res = await fetch(`${apiUrl}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Tambahkan Authorization jika perlu
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          alamat: alamatBaru,
          latitude: Number(form.latitude.toFixed(7)),
          longitude: Number(form.longitude.toFixed(7)),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text(); // 👈 lihat isi respons error
        console.error("Respon error dari server:", res.status, errorText);
        throw new Error("Gagal mengupdate alamat");
      }

      setAlamat(alamatBaru);
      setShowModal(false);
      showToast("Alamat berhasil diperbarui!", "success");
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan saat menyimpan alamat", "error");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data profil");
        }

        const data = await response.json();
        // console.log("Profile data:", data);
        setNama(data.nama);
        setEmail(data.email);
        setAlamat(data.alamat);
        setRole(data.role?.namaRole);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProfile();
  }, [apiUrl]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 pt-48">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Profil Saya</h2>
          <p className="text-sm text-gray-600 mb-6">
            Kelola informasi akun Anda.
          </p>
          <hr className="mb-6 text-gray-200" />

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card Kiri: Profil */}
            <div className="bg-white rounded-2xl p-6 shadow-md col-span-1 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full flex bg-[#EDCF5D]/30 items-center justify-center text-3xl font-bold border border-[#EDCF5D]/120 mb-4 relative group transition duration-300">
                {getInitials(nama)}
              </div>

              {isEditing.nama ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <h3 className="text-xl font-bold text-gray-800">{nama}</h3>
                  <button
                    onClick={() =>
                      setIsEditing((prev) => ({ ...prev, nama: true }))
                    }
                    className="text-gray-800 hover:text-gray-600 cursor-pointer"
                  >
                    <SquarePen size={14} />
                  </button>
                </div>
              )}
              <p className="text-gray-600 text-sm mb-3">{email}</p>
              <Button onClick={() => setShowUpgradeModal(true)}>
                Mulai Berjualan
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md col-span-2 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-gray-800">
                  Informasi Akun
                </h4>
              </div>

              {/* Email */}
              <div className="flex justify-between items-center border-b border-gray-500 pb-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {isEditing.email ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-800 font-medium focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-800 font-medium">{email}</p>
                  )}
                </div>
                <button
                  className="text-gray-800 hover:text-gray-600 ml-4"
                  onClick={() =>
                    setIsEditing((prev) => ({ ...prev, email: !prev.email }))
                  }
                >
                  <SquarePen size={16} className="cursor-pointer" />
                </button>
              </div>

              {/* Password */}
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="text-sm text-gray-500">Password</p>
                  {isEditing.password ? (
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-800 font-medium"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">********</p>
                  )}
                </div>
                <button
                  className="text-gray-800 hover:text-gray-600 ml-4"
                  onClick={() =>
                    setIsEditing((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                >
                  <SquarePen size={16} className="cursor-pointer" />
                </button>
              </div>

              {/* Alamat */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="text-gray-800 font-medium">
                    {location || alamat || "Belum dipilih"}
                  </p>
                </div>
                <button
                  className="text-gray-800"
                  onClick={() => setShowModal(true)}
                >
                  <MapPinned size={16} className="cursor-pointer" />
                </button>
              </div>
            </div>
          </div>

          {/* Peta */}
          {/* <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Pin Lokasi di Peta
            </h3>
            <div className="w-full h-64 rounded-xl overflow-hidden border-gray-500">
              <GoogleMap onMapClick={handleMapClick} latLng={latLng} />
            </div>
          </div> */}

          {/* Tombol */}
          <div className="mt-8 text-right">
            <Button onClick={handleSave} className="-px-6">
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-999 overflow-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Alamat</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                name="nama"
                placeholder="Nama Lengkap"
                className="border p-2 rounded"
                onChange={handleChange}
                value={form.nama}
              />
              <input
                name="telepon"
                placeholder="Nomor Telepon"
                className="border p-2 rounded"
                onChange={handleChange}
                value={form.telepon}
              />
              <select
                name="provinsi"
                className="border p-2 rounded"
                onChange={handleChange}
                value={form.provinsi}
              >
                <option>Pilih Provinsi</option>
                {provinsiList.map((prov) => (
                  <option key={prov.kode_provinsi} value={prov.kode_provinsi}>
                    {prov.nama_provinsi}
                  </option>
                ))}
              </select>
              <select
                name="kabupaten"
                className="border p-2 rounded"
                onChange={handleChange}
                value={form.kabupaten}
              >
                <option>Pilih Kabupaten</option>
                {kabupatenList.map((kab) => (
                  <option key={kab.kode_kabupaten} value={kab.kode_kabupaten}>
                    {kab.nama_kabupaten}
                  </option>
                ))}
              </select>

              <select
                name="kecamatan"
                className="border p-2 rounded"
                onChange={handleChange}
                value={form.kecamatan}
              >
                <option>Pilih Kecamatan</option>
                {kecamatanList.map((kec) => (
                  <option key={kec.kode_kecamatan} value={kec.kode_kecamatan}>
                    {kec.nama_kecamatan}
                  </option>
                ))}
              </select>

              <select
                name="desa"
                className="border p-2 rounded"
                onChange={handleChange}
                value={form.desa}
              >
                <option>Pilih Desa</option>
                {desaList.map((des) => (
                  <option key={des.kode_desa} value={des.kode_desa}>
                    {des.nama_desa}
                  </option>
                ))}
              </select>

              <input
                name="jalan"
                type="text"
                className="border p-2 rounded"
                placeholder="Cari Alamat (contoh: Perumahan Grand City)"
                value={form.autocomplete || ""}
                onChange={handleAutocompleteChange}
              />
              {suggestions.length > 0 && (
                <ul className="bg-white border rounded shadow max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion.formatted}
                    </li>
                  ))}
                </ul>
              )}

              <input
                name="detail"
                placeholder="Detail Lainnya"
                className="border p-2 rounded"
                onChange={handleChange}
                value={form.detail}
              />

              <MapPicker
                initialPosition={{
                  lat: form.latitude || -1.2399,
                  lon: form.longitude || 116.8527,
                }}
                onLocationChange={(coords) => {
                  setForm((prev) => ({
                    ...prev,
                    latitude: coords.lat,
                    longitude: coords.lon,
                  }));
                }}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitAlamat}
                className="px-4 py-2 bg-[#EDCF5D] hover:brightness-110 cursor-pointer text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Upgrade ke Seller</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Nama Toko"
                value={upgradeForm.storeName}
                onChange={(e) =>
                  setUpgradeForm((prev) => ({
                    ...prev,
                    storeName: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-sm px-3 py-2 mb-3"
              />
              <textarea
                placeholder="Deskripsi Toko"
                value={upgradeForm.storeDescription}
                onChange={(e) =>
                  setUpgradeForm((prev) => ({
                    ...prev,
                    storeDescription: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-sm px-3 py-2 mb-3"
              />
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setShowUpgradeModal(false)}>
                  Batal
                </Button>
                <Button onClick={handleUpgradeToSeller}>Upgrade</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <Footer />
    </>
  );
}

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
