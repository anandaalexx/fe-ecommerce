// KeranjangList.jsx
import React from "react";
import KeranjangGroup from "./KeranjangGroup";

import { Trash2 } from "lucide-react";

export default function KeranjangList({
  groupedProducts,
  onSelectToko,
  onSelectProduct,
  onQuantityChange,
  onDeleteConfirm,
}) {

  // console.log("groupedProducts", groupedProducts);

  return (
    <>
      {groupedProducts.map((group, tokoIdx) => (
        <div
          key={group.namaToko}
          className="mb-6 bg-white border border-gray-200 rounded-lg p-4"
        >
          {/* Header toko */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={group.isSelected}
              onChange={() => onSelectToko(tokoIdx)}
              className="w-5 h-5 mr-2 accent-[#EDCF5D]"
            />
            <h2 className="font-medium">{group.namaToko}</h2>
          </div>

          {/* Daftar produk */}
          {group.items.map((product, produkIdx) => {
            const totalHarga = product.harga * product.kuantitas || 0;

            return (
              <div
                key={product.idVarianProduk}
                className="flex items-center border-t border-t-gray-200 py-2"
              >
                <input
                  type="checkbox"
                  checked={product.isSelected}
                  onChange={() => onSelectProduct(tokoIdx, produkIdx)}
                  className="w-5 h-5 mr-3 accent-[#EDCF5D]"
                />
               <div className="flex-1 flex items-center gap-4">
                  <img
                    src={
                      product.gambarVarianUrls?.[0]?.url ||
                      product.gambarProdukUrls?.[0]?.url ||
                      "/no-pictures.png"
                    }
                    alt={product.namaProduk}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <span>
                    {product.namaProduk}{" "}
                    <span className="text-sm text-gray-500">
                      ({product.namaVarianLengkap})
                    </span>
                  </span>
                </div>
                <div className="w-40 text-center">
                  Rp {product.harga.toLocaleString()}
                </div>
                <div className="w-40 text-center">
                  <button
                    onClick={() =>
                      onQuantityChange(
                        tokoIdx,
                        produkIdx,
                        Math.max(1, product.kuantitas - 1)
                      )
                    }
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-full"
                  >
                    -
                  </button>
                  <span className="px-2">{product.kuantitas}</span>
                  <button
                    onClick={() =>
                      onQuantityChange(
                        tokoIdx,
                        produkIdx,
                        product.kuantitas + 1
                      )
                    }
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-full"
                  >
                    +
                  </button>
                </div>
                <div className="w-40 text-center font-medium">
                  Rp {totalHarga.toLocaleString()}
                </div>
                <div className="w-16 flex justify-center">
                  <button
                    onClick={() => onDeleteConfirm(tokoIdx, produkIdx)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
