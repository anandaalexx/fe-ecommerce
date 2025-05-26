"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CircleCheckBig,
  Hourglass,
  OctagonX,
  ArrowRightCircle,
} from "lucide-react";

const Dashboard = ({ onNavigate }) => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [jumlahPengiriman, setJumlahPengiriman] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resListOrder = await fetch(`${apiUrl}/pengiriman/list_order`, {
          credentials: "include",
        });

        const listOrder = await resListOrder.json();
        setJumlahPengiriman(listOrder.length);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Pengiriman yang Terselesaikan",
      value: 15,
      icon: <CircleCheckBig className="w-6 h-6 text-white" />,
      bg: "from-green-400 to-green-600",
      targetPage: "Pengiriman",
    },
    {
      title: "Total Pengiriman yang Belum Terselesaikan",
      value: 5,
      icon: <OctagonX className="w-6 h-6 text-white" />,
      bg: "from-red-400 to-red-600",
      targetPage: "Pengiriman",
    },
    {
      title: "Pesanan Menunggu",
      value: jumlahPengiriman,
      icon: <Hourglass className="w-6 h-6 text-white" />,
      bg: "from-yellow-400 to-yellow-600",
      targetPage: "Pengiriman",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
