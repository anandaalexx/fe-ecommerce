"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import KeranjangList from "../components/KeranjangList";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const KeranjangPage = () => {
  const [groupedProducts, setGroupedProducts] = useState([]);

  const fetchKeranjang = async () => {
    const res = await fetch(`${apiUrl}/cart/view`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    console.log("Data dari backend:", data); // 👈 Cek ini

    const grouped = data.reduce((acc, item) => {
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

      if (!res.ok) throw new Error("Gagal update kuantitas");

      // Update frontend state
      const updated = [...groupedProducts];
      updated[tokoIdx].items[produkIdx].kuantitas = newQty;
      setGroupedProducts(updated);
    } catch (error) {
      console.error(error);
      alert("Gagal update kuantitas");
    }
  };

  // Hapus produk dari backend & frontend
  const handleDeleteProduct = async (tokoIdx, produkIdx) => {
    const product = groupedProducts[tokoIdx].items[produkIdx];
    const idVarianProduk = product.idVarianProduk;

    try {
      // Panggil API hapus produk
      const res = await fetch(`${apiUrl}/cart/remove/${idVarianProduk}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal hapus produk");

      // Update frontend state: hapus produk
      const updated = [...groupedProducts];
      updated[tokoIdx].items.splice(produkIdx, 1);

      // Jika toko sudah kosong, hapus juga grup toko
      if (updated[tokoIdx].items.length === 0) {
        updated.splice(tokoIdx, 1);
      }

      setGroupedProducts(updated);
    } catch (error) {
      console.error(error);
      alert("Gagal hapus produk");
    }
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
      alert("Pilih minimal 1 produk untuk checkout.");
      return;
    }

    console.log("Yang diceklis:", selectedDetailIds); // 👈 di sini

    const query = encodeURIComponent(JSON.stringify(selectedDetailIds));
    window.location.href = `/checkout?items=${query}`;
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Tabel */}
        <div className="bg-white border rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-1 text-left font-semibold">Produk</div>
            <div className="w-40 text-center font-semibold">Harga Satuan</div>
            <div className="w-40 text-center font-semibold">Kuantitas</div>
            <div className="w-40 text-center font-semibold">Total Harga</div>
            <div className="w-16 text-center font-semibold">Aksi</div>
          </div>
        </div>

        {/* Daftar produk per toko */}
        <KeranjangList
          groupedProducts={groupedProducts}
          onSelectToko={handleSelectToko}
          onSelectProduct={handleSelectProduct}
          onQuantityChange={handleQuantityChange}
          onDeleteProduct={handleDeleteProduct} // pastikan diteruskan ke KeranjangList
        />

        {/* Footer Checkout */}
        <div className="max-w-md ml-auto bg-white border rounded-lg p-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="font-semibold text-gray-700">
              Total Produk Terpilih: {totalProduk}
            </div>
            <button
              onClick={handleCheckout}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeranjangPage;
