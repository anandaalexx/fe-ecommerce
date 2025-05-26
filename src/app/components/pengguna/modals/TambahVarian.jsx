"use client";
import { useState, useEffect } from "react";

const TambahVarian = ({ show, onClose, onSave, initialVariants = [] }) => {
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    nama: "",
    options: [],
  });
  const [variantInput, setVariantInput] = useState("");
  const [isAddingOptions, setIsAddingOptions] = useState(false);
  const [combinations, setCombinations] = useState([]);
  const [showCombinations, setShowCombinations] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pendingUploads, setPendingUploads] = useState([]);


  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


  // Sync initialVariants on modal open
  useEffect(() => {
    setVariants(initialVariants);
    setCurrentVariant({ nama: "", options: [] });
    setVariantInput("");
    setIsAddingOptions(false);
    setCombinations([]);
    setShowCombinations(false);
  }, [show, initialVariants]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [show]);

  const generateCombinations = () => {
    if (variants.length === 0) return;

    const combine = (arrays) => {
      if (arrays.length === 0) return [[]];
      const [first, ...rest] = arrays;
      const combinations = combine(rest);
      return first.flatMap((option) =>
        combinations.map((combination) => [option, ...combination])
      );
    };

    const variantOptions = variants.map((v) => v.options);
    const allCombinations = combine(variantOptions);

    const namedCombinations = allCombinations.map((options) => {
      const nama = options.join(" / ");
      return { nama, harga: "", stok: "" };
    });

    setCombinations(namedCombinations);
    setShowCombinations(true);
  };

  // Mulai input opsi varian setelah isi nama varian
  const handleStartAddVariant = () => {
    if (currentVariant.nama.trim() !== "") {
      setIsAddingOptions(true);
    }
  };

  const handleFileChange = (e, variantNama, optionNama) => {
    const file = e.target.files[0];
    if (!file) return;

    setPendingUploads((prev) => [
      ...prev,
      { variantNama, optionNama, file },
    ]);
  };

  // Tambah opsi baru ke currentVariant
  const handleAddOption = () => {
    if (variantInput.trim() !== "") {
      setCurrentVariant({
        ...currentVariant,
        options: [
          ...currentVariant.options,
          { nama: variantInput.trim(), gambar: null },
        ],
      });
      setVariantInput("");
    }
  };

  // Hapus opsi di currentVariant
  const handleRemoveOption = (index) => {
    setCurrentVariant({
      ...currentVariant,
      options: currentVariant.options.filter((_, i) => i !== index),
    });
  };

  // Selesai tambah varian, simpan currentVariant ke variants
  const handleFinishVariant = () => {
    if (currentVariant.nama.trim() !== "") {
      setVariants([...variants, currentVariant]);
      setCurrentVariant({ nama: "", options: [] });
      setIsAddingOptions(false);
      setVariantInput("");
    }
  };

  // Hapus varian dari daftar varian
  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Update input nama varian yang sedang dibuat
  const handleChangeCurrentVariantName = (value) => {
    setCurrentVariant({ ...currentVariant, nama: value });
  };

  // Update harga dan stok kombinasi
  const handleCombinationChange = (index, field, value) => {
    const newCombos = [...combinations];
    newCombos[index][field] = value;
    setCombinations(newCombos);
  };

  // Simpan semua data varian + kombinasi ke parent lalu tutup modal
  const handleSave = () => {
    onSave({ 
      variants, 
      combinations, 
      pendingUploads
    });
    onClose();
  };

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      } backdrop-blur-xs  `}
    >
      <div
        className={`bg-white rounded p-6 w-[600px] max-h-[80vh] overflow-auto shadow-lg transform transition-all duration-300 ${
          show ? "scale-100 translate-y-0" : "scale-95 -translate-y-4"
        }`}
      >
        <h2 className="text-xl font-semibold mb-6">Tambah Varian Produk</h2>

        {!isAddingOptions ? (
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">
                Nama Varian (contoh: Warna, Ukuran)
              </label>
              <input
                type="text"
                value={currentVariant.nama}
                onChange={(e) => handleChangeCurrentVariantName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Masukkan nama varian"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleStartAddVariant}
                className="relative w-1/3 bg-[#EDCF5D] text-white font-medium py-2 rounded-md transition-all duration-150 cursor-pointer hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
              >
                Tambah Varian
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">
                Tambahkan Opsi untuk Varian:{" "}
                <strong>{currentVariant.nama}</strong>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={variantInput}
                  onChange={(e) => setVariantInput(e.target.value)}
                  className="flex-grow p-3 border border-gray-300 rounded"
                  placeholder="Misal: Merah, Biru, L, XL"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <button
                  onClick={handleAddOption}
                  className="bg-[#EDCF5D] text-white px-4 py-1 rounded font-medium hover:brightness-110 active:translate-y-[2px] shadow-[0_4px_0_#d4b84a]"
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {currentVariant.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {/* Kotak background abu */}
                    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                      <span className="text-sm font-medium">{option.nama}</span>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, currentVariant.nama, option.nama)}
                      />
                    </div>

                    {/* Tombol hapus (×) di luar background abu-abu */}
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="text-gray-700 hover:text-red-600 text-xl"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleFinishVariant}
                className="relative w-1/3 bg-[#EDCF5D] text-white font-medium py-2 rounded-md mt-6 transition-all duration-150 cursor-pointer hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
              >
                Selesai Tambah Varian
              </button>
            </div>
          </div>
        )}

        {/* Daftar varian */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Varian yang Ditambahkan</h3>
          {variants.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada varian</p>
          )}
          <ul className="list-disc pl-5 space-y-1">
            {variants.map((variant, index) => (
              <li key={index} className="flex justify-between items-center">
                <div>
                  <strong>{variant.nama}</strong> - Opsi:{" "}
                  {variant.options.map((o) => o.nama).join(", ")}
                </div>
                <button
                  onClick={() => handleRemoveVariant(index)}
                  className="text-red-600 font-bold text-xl"
                  type="button"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tombol generate kombinasi */}
        {variants.length > 0 && !showCombinations && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={generateCombinations}
              className="relative w-1/3 bg-[#EDCF5D] text-white font-medium py-2 rounded-md transition-all duration-150 cursor-pointer hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
            >
              Atur Harga & Stok
            </button>
          </div>
        )}

        {/* Kombinasi harga dan stok */}
        {showCombinations && (
          <div className="mt-6 max-h-64 overflow-auto border rounded p-4">
            <h3 className="text-lg font-semibold mb-4">
              Atur Harga dan Stok Kombinasi
            </h3>
            {combinations.length === 0 && <p>Tidak ada kombinasi</p>}
            {combinations.map((combo, index) => (
              <div
                key={index}
                className="mb-4 border-b border-gray-300 pb-2 flex justify-between items-center"
              >
                <span>{combo.name}</span>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Harga"
                    value={combo.harga}
                    onChange={(e) =>
                      handleCombinationChange(index, "harga", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded w-24"
                  />
                  <input
                    type="number"
                    placeholder="Stok"
                    value={combo.stok}
                    onChange={(e) =>
                      handleCombinationChange(index, "stok", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded w-24"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            type="button"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#EDCF5D] text-white rounded hover:brightness-110"
            type="button"
            disabled={isAddingOptions} // disable kalau masih input opsi
          >
            Simpan Varian
          </button>
        </div>
      </div>
    </div>
  );
};

export default TambahVarian;
