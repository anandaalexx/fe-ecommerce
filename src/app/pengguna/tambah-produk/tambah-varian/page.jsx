"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TambahVarian = () => {
  const router = useRouter();

  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    name: "",
    options: [],
  });
  const [variantInput, setVariantInput] = useState("");
  const [isAddingOptions, setIsAddingOptions] = useState(false);
  const [combinations, setCombinations] = useState([]);
  const [showCombinations, setShowCombinations] = useState(false);

  const generateCombinations = () => {
    if (variants.length === 0) return [];

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
      const name = options.join(" / ");
      return { name, price: "", stock: "" };
    });

    setCombinations(namedCombinations);
    setShowCombinations(true);
  };

  const handleStartAddVariant = () => {
    if (currentVariant.name.trim() !== "") {
      setIsAddingOptions(true);
    }
  };

  const handleAddOption = () => {
    if (variantInput.trim() !== "") {
      setCurrentVariant({
        ...currentVariant,
        options: [...currentVariant.options, variantInput.trim()],
      });
      setVariantInput("");
    }
  };

  const handleRemoveOption = (index) => {
    setCurrentVariant({
      ...currentVariant,
      options: currentVariant.options.filter((_, i) => i !== index),
    });
  };

  const handleFinishVariant = () => {
    if (currentVariant.name.trim() !== "") {
      setVariants([...variants, currentVariant]);
      setCurrentVariant({ name: "", options: [] });
      setIsAddingOptions(false);
      setVariantInput("");
    }
  };

  const handleSubmit = () => {
    localStorage.setItem("variantData", JSON.stringify(variants));
    router.push("/produk/tambah");
  };

  return (
    <div className="max-w-xl mx-0 p-6">
      <h1 className="text-2xl font-bold mb-6">Tambah Varian Produk</h1>

      {!isAddingOptions ? (
        <div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 font-medium">
              Nama Varian (contoh: Warna, Ukuran)
            </label>
            <input
              type="text"
              value={currentVariant.name}
              onChange={(e) =>
                setCurrentVariant({ ...currentVariant, name: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Masukkan nama varian"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleStartAddVariant}
              className="relative w-1/3 bg-[#EDCF5D] text-white font-medium py-2 rounded-md transition-all duration-150 cursor-pointer 
              hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
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
              <strong>{currentVariant.name}</strong>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={variantInput}
                onChange={(e) => setVariantInput(e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded"
                placeholder="Misal: Merah, Biru, L, XL"
              />
              <button
                onClick={handleAddOption}
                className="bg-[#EDCF5D] text-white px-4 py-1 rounded font-medium hover:brightness-110 active:translate-y-[2px] shadow-[0_4px_0_#d4b84a]"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentVariant.options.map((option, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {option}
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="text-gray-700 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleFinishVariant}
              className="relative w-1/3 bg-[#EDCF5D] text-white font-medium py-2 rounded-md mt-6 transition-all duration-150 cursor-pointer 
      hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
            >
              Selesai Tambah Varian
            </button>
          </div>
        </div>
      )}

      {/* Daftar Varian */}
      <div className="mt-6">
        <h2 className="text-xl font-medium mb-2">Varian yang Ditambahkan</h2>
        <ul className="list-disc pl-5 space-y-1">
          {variants.map((variant, index) => (
            <li key={index}>
              <strong>{variant.name}</strong> - Opsi:{" "}
              {variant.options.join(", ")}
            </li>
          ))}
        </ul>
      </div>

      {variants.length > 0 && !showCombinations && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={generateCombinations}
            className="relative w-1/3 bg-[#EDCF5D] text-white font-medium py-2 rounded-md transition-all duration-150 cursor-pointer 
        hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
          >
            Atur Harga & Stok
          </button>
        </div>
      )}

      {showCombinations && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Atur Harga dan Stok Kombinasi
          </h2>
          {combinations.map((combo, index) => (
            <div
              key={index}
              className="mb-4 border-gray-300 p-4 rounded-md shadow-sm"
            >
              <h3 className="font-medium mb-2">{combo.name}</h3>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Harga"
                  value={combo.price}
                  onChange={(e) => {
                    const newCombos = [...combinations];
                    newCombos[index].price = e.target.value;
                    setCombinations(newCombos);
                  }}
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
                <input
                  type="number"
                  placeholder="Stok"
                  value={combo.stock}
                  onChange={(e) => {
                    const newCombos = [...combinations];
                    newCombos[index].stock = e.target.value;
                    setCombinations(newCombos);
                  }}
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                localStorage.setItem("variantData", JSON.stringify(variants));
                localStorage.setItem(
                  "variantCombinations",
                  JSON.stringify(combinations)
                );
                router.push("/produk/tambah");
              }}
              className="relative w-1/3 bg-[#EDCF5D] text-white font-medium py-2 rounded-md transition-all duration-150 cursor-pointer 
          hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
            >
              Simpan Kombinasi
            </button>
          </div>
        </div>
      )}

      {/* Tombol Simpan */}
      {variants.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="relative w-1/3 bg-[#EDCF5D] text-white font-medium py-2 rounded-md transition-all duration-150 cursor-pointer 
              hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
          >
            Simpan Semua Varian
          </button>
        </div>
      )}
    </div>
  );
};

export default TambahVarian;
