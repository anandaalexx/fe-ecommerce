// KeranjangList.jsx
import React from "react";
import KeranjangGroup from "./KeranjangGroup";

import { Trash2 } from "lucide-react";

export default function KeranjangList({
  groupedProducts,
  onSelectToko,
  onSelectProduct,
  onQuantityChange,
  onDeleteProduct,
}) {
  return (
    <>
      {groupedProducts.map((group, tokoIdx) => (
        <div
          key={group.namaToko}
          className="mb-6 bg-white border rounded-lg p-4"
        >
          {/* Header toko */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={group.isSelected}
              onChange={() => onSelectToko(tokoIdx)}
              className="w-5 h-5 mr-2 accent-green-500"
            />
            <h2 className="font-semibold">{group.namaToko}</h2>
          </div>

          {/* Daftar produk */}
          {group.items.map((product, produkIdx) => {
            const totalHarga = product.harga * product.kuantitas || 0;

            return (
              <div
                key={product.idVarianProduk}
                className="flex items-center border-t py-2"
              >
                <input
                  type="checkbox"
                  checked={product.isSelected}
                  onChange={() => onSelectProduct(tokoIdx, produkIdx)}
                  className="w-5 h-5 mr-3 accent-green-500"
                />
                <div className="flex-1 flex items-center gap-4">
                  <img
                    src={product.gambar}
                    alt={product.namaProduk}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <span>{product.namaProduk}</span>
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
                    className="px-2 py-1 hover:bg-gray-100"
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
                    className="px-2 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="w-40 text-center font-bold">
                  Rp {totalHarga.toLocaleString()}
                </div>
                <div className="w-16 flex justify-center">
                  <button
                    onClick={() => onDeleteProduct(tokoIdx, produkIdx)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                   <Trash2/>
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
