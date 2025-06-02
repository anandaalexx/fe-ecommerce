// File: app/checkout/page.jsx
"use client";
import React, { useState, useEffect, use } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { MapPin, SquarePen } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { includes } from "lodash";
import { useSearchParams } from "next/navigation";
import ModalKonfirmasi from "../components/admin/modals/Konfirmasi";

// Import MapPicker secara dinamis hanya di sisi client
const MapPicker = dynamic(() => import("../components/MapPicker"), {
  ssr: false,
});

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState([]);
  const [preCheckoutInfo, setPreCheckoutInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [preCheckoutInfoKomship, setPreCheckoutInfoKomship] = useState(null);
  const router = useRouter();
  const [groupedItems, setGroupedItems] = useState([]);
  const [selectedKurir, setSelectedKurir] = useState({});
  const [finalCheckoutData, setFinalCheckoutData] = useState([]);
  const [alamatPembeli, setAlamatPembeli] = useState([]);

  function isSameKota(alamatPenjual, alamatBuyer, targetKota = "balikpapan") {
    console.log(
      "alamatPenjual:",
      alamatPenjual,
      "alamatPembeli:",
      alamatBuyer
    );
    if (!alamatPenjual || !alamatPembeli) return false;
    const lowerPenjual = alamatPenjual.toLowerCase();
    const lowerPembeli = alamatPembeli.toLowerCase();
    return (
      lowerPenjual.includes(targetKota) && lowerPembeli.includes(targetKota)
    );
  }

  useEffect(() => {
    const itemsParam = searchParams.get("items");

    if (!itemsParam) return;

    try {
      const decoded = decodeURIComponent(itemsParam);
      const idList = JSON.parse(decoded); // hasilnya array of idDetailKeranjang
      fetchDetailProduk(idList);
      fetchPreCheckout(idList);
      fetchPreCheckoutKomship(idList);
    } catch (error) {
      console.error("Gagal decode / parse items:", error);
    }
  }, [searchParams]);

  const fetchDetailProduk = async (idList) => {
    try {
      const res = await fetch(`${apiUrl}/checkout/selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idDetailKeranjang: idList }),
      });

      if (!res.ok) throw new Error("Gagal ambil detail produk");

      const data = await res.json();
      setItems(data.transformed); // kalau ini yang kamu gunakan untuk tampilan daftar produk
      setAlamatPembeli(data.alamatPembeli);

      // Kelompokkan berdasarkan toko
      const grouped = data.transformed.reduce((acc, item) => {
        const existing = acc.find((g) => g.namaToko === item.namaToko);
        if (existing) {
          existing.items.push(item);
        } else {
          acc.push({
            sellerId: item.idPenjual,
            namaToko: item.namaToko,
            namaPenjual: item.namaPenjual,
            alamatPenjual: item.alamatPenjual,
            items: [item],
          });
        }
        return acc;
      }, []);
      console.log("Data Selected:", grouped);
      setGroupedItems(grouped);
    } catch (err) {
      console.error("Fetch gagal:", err);
    }
  };

  const fetchPreCheckout = async (idList) => {
    try {
      const res = await fetch(`${apiUrl}/pre-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idDetailKeranjang: idList }),
      });

      if (!res.ok) throw new Error("Gagal ambil info precheckout");

      const data = await res.json();
      console.log("Data Pre-checkout:", data);
      setPreCheckoutInfo(data);
      // ⬅️ simpan hasil precheckout
    } catch (err) {
      console.error("Fetch precheckout gagal:", err);
    }
  };

  const fetchPreCheckoutKomship = async (idList) => {
    try {
      const res = await fetch(`${apiUrl}/komship/ongkir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idDetailKeranjang: idList }),
      });

      if (!res.ok) throw new Error("Gagal ambil info precheckout");

      const data = await res.json();
      console.log("Data Pre-checkout Info Komship:", data);
      setPreCheckoutInfoKomship(data);
      // ⬅️ simpan hasil precheckout
    } catch (err) {
      console.error("Fetch precheckout gagal:", err);
    }
  };

  const getOpsiKurirBySeller = (sellerId, alamatPembeli) => {
    // Cari group seller berdasarkan sellerId
    const groupSeller = groupedItems.find(
      (g) => String(g.sellerId) === String(sellerId)
    );
    if (!groupSeller) return [];

    // Cek apakah alamat seller dan pembeli sama-sama balikpapan
    const bisaKurirInternal = isSameKota(
      groupSeller.alamatPenjual,
      alamatPembeli,
      "balikpapan"
    );

    // Kurir internal dari preCheckoutInfo (default) jika bisaKurirInternal true
    let opsiKurirInternal = [];
    if (bisaKurirInternal && preCheckoutInfo?.perToko) {
      const toko = preCheckoutInfo.perToko.find(
        (t) => String(t.sellerId) === String(sellerId)
      );
      if (toko) {
        opsiKurirInternal = [
          {
            shipping_name: "Kurir Internal",
            shipping_cost: toko.ongkir,
            service_name: "internal",
            jenisKurir: "TokoLoko",
          },
        ];
      }
    }

    // Kurir Komship dari preCheckoutInfoKomship (sama seperti sebelumnya)
    let opsiKurirKomship = [];
    if (preCheckoutInfoKomship && Array.isArray(preCheckoutInfoKomship)) {
      const data = preCheckoutInfoKomship.find(
        (d) => String(d.sellerId) === String(sellerId)
      );
      if (data && data.detail) {
        const {
          calculate_reguler = [],
          calculate_instant = [],
          calculate_cargo = [],
        } = data.detail;

        const filterNinja = (item) =>
          item.shipping_name?.toLowerCase().includes("ninja");

        opsiKurirKomship = [
          ...calculate_reguler.filter(filterNinja).map((item) => ({
            ...item,
            type: "reguler",
            jenisKurir: "komship",
          })),
          ...calculate_instant.filter(filterNinja).map((item) => ({
            ...item,
            type: "instant",
            jenisKurir: "komship",
          })),
          ...calculate_cargo
            .filter(filterNinja)
            .map((item) => ({ ...item, type: "cargo", jenisKurir: "komship" })),
        ];
      }
    }

    return [...opsiKurirInternal, ...opsiKurirKomship];
  };

  const handleCheckout = async () => {
    try {
      console.log("ITEMS:", items);
      const idList = items.map((item) => item.idDetailKeranjang); // Pastikan field-nya benar

      console.log("Body yang dikirim:", {
        idDetailKeranjang: idList,
        finalGroupedData: finalCheckoutData,
      });

      const res = await fetch(`${apiUrl}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          idDetailKeranjang: idList,
          finalGroupedData: finalCheckoutData, // sesuaikan nama ini dengan di controller
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Checkout gagal:", res.status, errorText);
        alert("Gagal melakukan checkout");
        return;
      }

      const data = await res.json();
      router.push("/pesanan");
    } catch (error) {
      console.error("Terjadi kesalahan saat checkout:", error);
      alert("Terjadi kesalahan saat checkout");
    }
  };

  const calculateTotal = () => {
    let totalOngkir = 0;
    let totalHarga = 0;

    groupedItems.forEach((group) => {
      const sellerId = group.sellerId;
      const selected = selectedKurir[sellerId];
      console.log("selectedKurir[sellerId]:", selected);
      if (selected) {
        totalOngkir += Number(selected.shipping_cost) || 0;
      }

      const subtotal = group.items.reduce((sum, item) => {
        const harga = Number(item.hargaSatuan) || 0;
        const kuantitas = Number(item.kuantitas) || 0;
        return sum + harga * kuantitas;
      }, 0);

      totalHarga += subtotal;
    });

    return {
      totalOngkir,
      totalHargaAkhir: totalHarga + totalOngkir,
    };
  };

  const { totalOngkir, totalHargaAkhir } = calculateTotal();

  useEffect(() => {
    if (
      !Array.isArray(groupedItems) ||
      !groupedItems.length ||
      !preCheckoutInfo ||
      !Array.isArray(preCheckoutInfoKomship) ||
      !preCheckoutInfoKomship.length
    )
      return;

    const finalGroupedData = groupedItems.map((group) => {
      const sellerIdStr = String(group.sellerId);

      const tokoInfo = preCheckoutInfo.perToko.find(
        (p) => p.sellerId === sellerIdStr
      );
      const komshipInfo = preCheckoutInfoKomship.find(
        (p) => p.sellerId === sellerIdStr
      );

      return {
        sellerId: group.sellerId, // ✅ Tambahkan ini
        originId: komshipInfo?.originId,
        destinationId: komshipInfo?.destinationId,
        selectedKurir: selectedKurir[group.sellerId] || null, // <-- ini yang kamu tambahkan
      };
    });

    console.log("FINAL GROUPED DATA", finalGroupedData);

    setFinalCheckoutData(finalGroupedData);
  }, [groupedItems, preCheckoutInfo, preCheckoutInfoKomship, selectedKurir]);

  const [alamat, setAlamat] = useState("");
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

  const handleCloseModal = () => {
    setForm({
      nama: "",
      telepon: "",
      provinsi: "",
      kabupaten: "",
      kecamatan: "",
      desa: "",
      jalan: "",
      detail: "",
      latitude: null,
      longitude: null,
    });
    setShowModal(false);
  };

  const handlePositionChange = (lat, lon) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
    }));
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
    const fetchAlamat = async () => {
      try {
        const res = await fetch(`${apiUrl}/user/profile`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.alamat) {
            setAlamat(data.alamat);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil alamat:", err);
      }
    };

    fetchAlamat();
  }, []);

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
      alert("Mohon lengkapi semua data!");
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

    // Format alamat yang lebih baik
    const alamatBaru = `${form.nama}, ${form.telepon}, ${form.jalan}, ${form.detail}, Desa ${namaDesa}, Kecamatan ${namaKecamatan}, Kabupaten ${namaKabupaten}, Provinsi ${namaProvinsi}`;

    try {
      const res = await fetch(`${apiUrl}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          alamat: alamatBaru,
          latitude: Number(form.latitude.toFixed(7)),
          longitude: Number(form.longitude.toFixed(7)),
        }),
      });

      if (res.ok) {
        setAlamat(alamatBaru);
        setShowModal(false);
        alert("Alamat berhasil diperbarui!");
      } else {
        throw new Error("Gagal mengupdate alamat");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan alamat");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen pt-48">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-lg p-4 shadow-lg bg-white">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Alamat Pengiriman
                </h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="hover:brightness-110 cursor-pointer"
                >
                  <SquarePen size={18} />
                </button>
              </div>
              <hr className="my-3 text-[#A4A4A4]" />
              <p className="text-sm font-medium mt-2 whitespace-pre-line">
                {alamat || "Belum ada alamat yang disimpan"}
              </p>
            </div>

            {groupedItems.map((group, tokoIdx) => (
              <div key={tokoIdx} className="space-y-4">
                <div className="p-4 bg-white shadow rounded-lg border border-gray-200 mb-4">
                  <h3 className="font-semibold text-md text-blue-700">
                    {group.namaToko}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Penjual: {group.namaPenjual} — {group.alamatPenjual}
                  </p>
                  {group.items.map((item) => (
                    <div
                      key={item.idDetailKeranjang}
                      className="rounded-xl p-5 my-4 bg-white flex gap-5 items-start transition-all duration-300"
                    >
                      <img
                        src={item.gambar}
                        alt={item.namaProduk}
                        className="w-28 h-28 object-contain rounded-md border border-gray-200 bg-gray-50"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-lg text-gray-800">
                            {item.namaProduk}
                          </h4>
                          <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-medium">
                            x{item.kuantitas}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">
                            {item.namaVarianProduk}
                          </span>
                        </p>
                        <p className="text-lg font-semibold mt-9">
                          Rp {item.totalHarga.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <label className="text-sm font-semibold">
                      Pilih Kurir:
                    </label>
                    <select
                      className="block mt-1 w-full border rounded p-2 text-sm"
                      onChange={(e) => {
                        const selectedOption = JSON.parse(e.target.value);
                        setSelectedKurir((prev) => ({
                          ...prev,
                          [group.sellerId]: selectedOption,
                        }));
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Pilih kurir
                      </option>
                      {getOpsiKurirBySeller(group.sellerId).map(
                        (kurir, idx) => (
                          <option key={idx} value={JSON.stringify(kurir)}>
                            {kurir.shipping_name} - {kurir.service_name} (
                            {kurir.shipping_cost.toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            })}
                            )
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-4 shadow-xl h-fit bg-white">
            <h2 className="font-semibold text-lg mb-4">Ringkasan Pesanan</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Total Harga</span>
              <span>
                Rp{" "}
                {preCheckoutInfo?.totalHargaProdukKeseluruhan?.toLocaleString() ||
                  "0"}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Total Ongkos Kirim</span>
              <span>Rp {totalOngkir?.toLocaleString() || "0"}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-semibold text-base mb-4">
              <span>Total Tagihan</span>
              <span className="text-black">
                Rp {totalHargaAkhir?.toLocaleString() || "0"}
              </span>
            </div>
            <Button onClick={() => setModalOpen(true)}>Bayar Sekarang</Button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-999 overflow-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Atur Alamat Baru</h3>
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
            <div className="flex justify-end gap-2 text-white mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-black hover:bg-gray-100 text-black  rounded font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitAlamat}
                className="px-4 py-2 bg-[#EDCF5D] hover:brightness-110 cursor-pointer text-white rounded font-medium"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <ModalKonfirmasi
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCheckout}
        title="Konfirmasi Pembayaran"
        message={`Apakah Anda yakin ingin membayar sekarang? Saldo Anda akan terpotong sebesar Rp ${totalHargaAkhir?.toLocaleString()}!`}
        confirmText="Bayar"
        confirmColor="yellow"
      />
    </>
  );
}
