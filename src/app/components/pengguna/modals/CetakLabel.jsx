import React, { useState } from "react";

const ModalCetakLabel = ({ open, onClose, onSubmit, orderNo }) => {
  const [selectedPage, setSelectedPage] = useState("page_1");

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[300px]">
        <h2 className="text-lg font-semibold mb-4">Pilih Format Label</h2>
        <select
          className="w-full border px-3 py-2 mb-4"
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
        >
          <option value="page_1">A4 - 1 label</option>
          <option value="page_2">A4 - 2 label</option>
          <option value="page_4">A4 - 4 label</option>
          <option value="page_5">Thermal 10x10cm</option>
          <option value="page_6">Thermal 10x15cm</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1 border border-gray-300 cursor-pointer hover:bg-gray-200 rounded"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-3 py-1 bg-[#EDCF5D] hover:brightness-110 text-white rounded cursor-pointer"
            onClick={() => onSubmit(orderNo, selectedPage)}
          >
            Cetak
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCetakLabel;
