import { useState, useEffect } from "react";
import {
  Users,
  Truck,
  Package,
  ArrowRightCircle,
  ChartBarStacked,
} from "lucide-react";

const Dashboard = ({ onNavigate }) => {
  const [jumlahPengguna, setJumlahPengguna] = useState(0);
  const [jumlahKurir, setJumlahKurir] = useState(0);
  const [jumlahKategori, setJumlahKategori] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await fetch(`${apiUrl}/admin/users`);
        const resKurirs = await fetch(`${apiUrl}/admin/couriers`);
        const resCategories = await fetch(`${apiUrl}/category/view`);

        const users = await resUsers.json();
        const kurirs = await resKurirs.json();
        const categories = await resCategories.json();

        setJumlahPengguna(users.length);
        setJumlahKurir(kurirs.length);
        setJumlahKategori(categories.length);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Jumlah Pengguna",
      value: jumlahPengguna,
      icon: <Users className="w-6 h-6 text-white" />,
      bg: "from-yellow-400 to-yellow-600",
      targetPage: "Kelola Pengguna",
    },
    {
      title: "Jumlah Kurir",
      value: jumlahKurir,
      icon: <Truck className="w-6 h-6 text-white" />,
      bg: "from-green-400 to-green-600",
      targetPage: "Kelola Kurir",
    },
    {
      title: "Jumlah Barang",
      value: 340,
      icon: <Package className="w-6 h-6 text-white" />,
      bg: "from-blue-400 to-blue-600",
      targetPage: "Kelola Barang",
    },
    {
      title: "Jumlah Kategori",
      value: jumlahKategori,
      icon: <ChartBarStacked className="w-6 h-6 text-white" />,
      bg: "from-red-400 to-red-600",
      targetPage: "Kategori",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            onClick={() => onNavigate(item.targetPage)}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`bg-gradient-to-br ${item.bg} p-3 rounded-full shadow-inner`}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <p className="text-3xl font-semibold text-gray-800">
                    {item.value}
                  </p>
                </div>
              </div>
              <ArrowRightCircle className="w-6 h-6 text-gray-500/40 group-hover:text-[#EDCF5D] transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
