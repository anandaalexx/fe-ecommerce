// File: app/checkout/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { MapPin } from "lucide-react";

const orders = [
  {
    id: 1,
    name: "IPhone 16 Pro Max",
    image: "/iPhone16.png",
    color: "Grey",
    size: "8/256",
    quantity: 2,
    price: 40000000,
  },
];

export default function CheckoutPage() {
  const [alamat, setAlamat] = useState(
    "Kos Dalam Ningrat, Jl. Sei Wain RT 033 Karang Joang, Balikpapan Utara-Balikpapan. (Dekat Masjid Nurul Hidayah) (Kost gedung warna hijau, pagar hitam)"
  );
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

  const totalHarga = orders.reduce((sum, item) => sum + item.price, 0);
  const ongkosKirim = 120000;
  const totalTagihan = ongkosKirim + totalHarga;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAlamat = () => {
    const alamatBaru = `${form.nama}, ${form.telepon}, ${form.jalan}, ${form.detail}, Desa ${form.desa}, Kecamatan ${form.kecamatan}, Kabupaten ${form.kabupaten}, Provinsi ${form.provinsi}`;
    setAlamat(alamatBaru);
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-44">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-lg p-4 shadow-lg bg-white">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Alamat Pengiriman
                </h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm text-blue-600 underline"
                >
                  Edit
                </button>
              </div>
              <hr className="my-3 text-[#A4A4A4]" />
              <p className="text-sm font-medium mt-2">{alamat}</p>
            </div>

            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-5 shadow-md bg-white flex gap-5 items-start hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={order.image}
                  alt={order.name}
                  className="w-28 h-28 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-lg text-gray-800">
                      {order.name}
                    </h4>
                    <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-medium">
                      x{order.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Warna <span className="font-medium">{order.color}</span> |
                    Size <span className="font-medium">{order.size}</span>
                  </p>
                  <p className="text-lg font-bold text-[#EDCF5D] mt-9">
                    Rp {order.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-4 shadow-xl h-fit bg-white">
            <h2 className="font-semibold text-lg mb-4">Ringkasan Pesanan</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Total Harga</span>
              <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Total Ongkos Kirim</span>
              <span>Rp {ongkosKirim.toLocaleString("id-ID")}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-semibold text-base mb-4">
              <span>Total Tagihan</span>
              <span className="text-black">
                Rp {totalTagihan.toLocaleString("id-ID")}
              </span>
            </div>
            <Button>Bayar Sekarang</Button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h3 className="text-xl font-semibold mb-4">Edit Alamat</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                name="nama"
                placeholder="Nama Lengkap"
                className="border p-2 rounded"
                onChange={handleChange}
              />
              <input
                name="telepon"
                placeholder="Nomor Telepon"
                className="border p-2 rounded"
                onChange={handleChange}
              />
              <select
                name="provinsi"
                className="border p-2 rounded"
                onChange={handleChange}
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
                placeholder="Nama Jalan, Gedung, No. Rumah"
                className="border p-2 rounded"
                onChange={handleChange}
              />
              <input
                name="detail"
                placeholder="Detail Lainnya"
                className="border p-2 rounded"
                onChange={handleChange}
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
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
