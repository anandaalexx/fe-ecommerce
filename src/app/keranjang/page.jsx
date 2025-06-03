"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Footer from "../components/Footer";
import KeranjangList from "../components/KeranjangList";
import ToastNotification from "../components/ToastNotification";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const KeranjangPage = () => {
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState({
    tokoIdx: null,
    produkIdx: null,
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const fetchKeranjang = async () => {
    try {
      const res = await fetch(`${apiUrl}/cart/view`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Gagal fetch keranjang:", res.status, res.statusText);
        return;
      }

      const json = await res.json();
      // console.log("RESPON KERANJANG:", json);

      // Misalnya API return { data: [...] }, ambil datanya
      const items = Array.isArray(json) ? json : json.data;

      if (!Array.isArray(items)) {
        console.error("Data keranjang bukan array:", items);
        return;
      }

      const grouped = items.reduce((acc, item) => {
        const toko = item.namaToko;
        const existing = acc.find((group) => group.namaToko === toko);

        const product = {
          ...item,
          isSelected: false,
          kuantitas: item.jumlah || 1,
        };

        if (existing) {
          existing.items.push(product);
        } else {
          acc.push({
            namaToko: toko,
            isSelected: false,
            items: [product],
          });
        }

        return acc;
      }, []);

      setGroupedProducts(grouped);
    } catch (err) {
      console.error("Terjadi error saat fetch keranjang:", err);
    }
  };

  useEffect(() => {
    fetchKeranjang();
  }, []);

  // Fungsi untuk menangani perubahan checkbox produk
  const handleSelectProduct = (tokoIdx, produkIdx) => {
    const updated = [...groupedProducts];
    const product = updated[tokoIdx].items[produkIdx];
    product.isSelected = !product.isSelected;

    // Update status checkbox toko (semua produknya kepilih → toko kepilih)
    updated[tokoIdx].isSelected = updated[tokoIdx].items.every(
      (p) => p.isSelected
    );

    setGroupedProducts(updated);
  };

  const handleSelectToko = (tokoIdx) => {
    const updated = [...groupedProducts];
    const group = updated[tokoIdx];
    const newState = !group.isSelected;
    group.isSelected = newState;
    group.items = group.items.map((p) => ({ ...p, isSelected: newState }));
    setGroupedProducts(updated);
  };

  // Ubah kuantitas di backend & frontend
  const handleQuantityChange = async (tokoIdx, produkIdx, newQty) => {
    const product = groupedProducts[tokoIdx].items[produkIdx];
    const idVarianProduk = product.idVarianProduk; // Pastikan field ini sesuai API-mu

    try {
      // Panggil API update kuantitas
      const res = await fetch(`${apiUrl}/cart/update`, {
        method: "PUT", // Asumsi endpoint update pakai PUT
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idVarianProduk,
          jumlah: newQty,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const message = errorData.message || "Gagal update kuantitas";
        throw new Error(message);
      }

      // Update frontend state
      const updated = [...groupedProducts];
      updated[tokoIdx].items[produkIdx].kuantitas = newQty;
      setGroupedProducts(updated);
    } catch (error) {
      console.error(error);
      showToast(error.message, "error"); // Gunakan pesan dari error
    }
  };

  // Hapus produk dari backend & frontend
  const handleDeleteProduct = async () => {
    const { tokoIdx, produkIdx } = pendingDelete;
    const product = groupedProducts[tokoIdx].items[produkIdx];
    const idVarianProduk = product.idVarianProduk;

    try {
      const res = await fetch(`${apiUrl}/cart/remove/${idVarianProduk}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal hapus produk");

      const updated = [...groupedProducts];
      updated[tokoIdx].items.splice(produkIdx, 1);
      if (updated[tokoIdx].items.length === 0) {
        updated.splice(tokoIdx, 1);
      }

      setGroupedProducts(updated);
      setShowConfirmModal(false);
      setPendingDelete({ tokoIdx: null, produkIdx: null });
    } catch (error) {
      console.error(error);
      showToast("Gagal hapus produk", "error");
    }
  };

  const confirmDelete = (tokoIdx, produkIdx) => {
    setPendingDelete({ tokoIdx, produkIdx });
    setShowConfirmModal(true);
  };

  // Menghitung total produk berdasarkan checkbox yang dipilih dan kuantitas
  const totalProduk = groupedProducts
    .flatMap((g) => g.items)
    .filter((p) => p.isSelected)
    .reduce((sum, p) => sum + (parseInt(p.kuantitas) || 0), 0);

  const selectedItems = groupedProducts.flatMap((g) =>
    g.items.filter((p) => p.isSelected)
  );

  const handleCheckout = () => {
    const selectedDetailIds = groupedProducts
      .flatMap((group) => group.items.filter((item) => item.isSelected))
      .map((item) => item.idDetailKeranjang);

    if (selectedDetailIds.length === 0) {
      showToast("Pilih minimal 1 produk untuk checkout.", "warning");
      return;
    }

    // console.log("Yang diceklis:", selectedDetailIds);

    const query = encodeURIComponent(JSON.stringify(selectedDetailIds));
    window.location.href = `/checkout?items=${query}`;
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-48">
        {/* Header Tabel */}
        <div className="bg-gray-100 text-gray-800 border border-gray-200 rounded-sm p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-1 text-left font-medium">Produk</div>
            <div className="w-40 text-center font-medium">Harga Satuan</div>
            <div className="w-40 text-center font-medium">Kuantitas</div>
            <div className="w-40 text-center font-medium">Total Harga</div>
            <div className="w-16 text-center font-medium">Aksi</div>
          </div>
        </div>

        {/* Daftar produk per toko */}
        {groupedProducts.length === 0 ? (
          <div className="text-center border border-gray-200 py-4 text-sm rounded-xs -mt-4 ">
            Tidak ada produk di keranjang
          </div>
        ) : (
          <KeranjangList
            groupedProducts={groupedProducts}
            onSelectToko={handleSelectToko}
            onSelectProduct={handleSelectProduct}
            onQuantityChange={handleQuantityChange}
            onDeleteConfirm={confirmDelete}
          />
        )}

        {/* Footer Checkout */}
        <div className="max-w-md ml-auto bg-white border border-gray-200 rounded-sm p-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="font-medium">
              Total Produk Terpilih: {totalProduk}
            </div>
            <button
              onClick={handleCheckout}
              className="bg-[#EDCF5D] text-white font-medium py-2 px-12 rounded-md transition-all duration-150 cursor-pointer 
      hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h2 className="text-md font-semibold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-6 text-sm">
              Apakah Anda yakin ingin menghapus produk ini dari keranjang?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-1 text-sm rounded text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default KeranjangPage;
