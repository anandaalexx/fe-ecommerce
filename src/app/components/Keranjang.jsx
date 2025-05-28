// "use client";
// import { useState } from "react";
// import { Trash2 } from "lucide-react";
// import KeranjangList from "./KeranjangList";
// import { useState, useEffect } from "react";
// import Navbar from '../components/Navbar';
// import KeranjangList from './KeranjangList';

// export default function Keranjang({ product, onSelect, onQuantityChange }) {
//   const { toko, nama, harga, gambar, kuantitas, isSelected } = product;

//   // Cek apakah harga dan kuantitas valid
//   const totalHarga = Number(harga) * Number(kuantitas) || 0;

//   return (
//     <div className="bg-white border rounded-lg mb-4">
//       {/* Nama Toko + Checkbox */}
//       <div className="flex items-center p-4 border-b font-semibold text-gray-700">
//         <input
//           type="checkbox"
//           checked={isSelected}
//           onChange={onSelect}
//           className="w-5 h-5 mr-3 accent-green-500"
//         />
//         <span className="text-sm">{toko}</span>
//       </div>

//       {/* Konten Produk */}
//       <div className="flex items-center p-4">
//         {/* Gambar Produk + Nama */}
//         <div className="flex items-center flex-1 gap-4">
//           <img
//             src={gambar}
//             alt={nama}
//             className="w-16 h-16 object-cover rounded-md"
//           />
//           <div>
//             <h2 className="font-semibold text-sm">{nama}</h2>
//           </div>
//         </div>

//         {/* Harga Satuan */}
//         <div className="w-40 text-center font-semibold text-gray-700">
//           Rp {harga.toLocaleString()}
//         </div>

//         {/* Kuantitas */}
//         <div className="w-40 text-center flex items-center justify-center">
//           <div className="flex items-center border rounded-md overflow-hidden">
//             <button
//               onClick={() => onQuantityChange(Math.max(1, kuantitas - 1))}
//               className="px-2 py-1 hover:bg-gray-100"
//             >
//               -
//             </button>
//             <span className="px-2 text-sm">{kuantitas}</span>
//             <button
//               onClick={() => onQuantityChange(kuantitas + 1)}
//               className="px-2 py-1 hover:bg-gray-100"
//             >
//               +
//             </button>
//           </div>
//         </div>

//         {/* Total Harga */}
//         <div className="w-40 text-center font-bold text-sm">
//           Rp {totalHarga.toLocaleString()}
//         </div>

//         {/* Tombol Hapus */}
//         <div className="w-16 flex justify-center">
//           <button className="text-red-500 hover:text-red-700">
//             <Trash2 />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
