import { PlusCircle } from "lucide-react";
import TablePengguna from "./TablePengguna";

const Pengguna = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDCF5D] active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a] text-white font-semibold rounded hover:brightness-110 transition duration-200 cursor-pointer"
        >
          <PlusCircle size={18} />
          Tambah Pengguna
        </button>
      </div>

      <TablePengguna />
    </div>
  );
};

export default Pengguna;
