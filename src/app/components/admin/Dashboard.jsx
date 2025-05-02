import { Users, Truck, Package, ArrowRightCircle } from "lucide-react";

const Dashboard = ({ onNavigate }) => {
  const stats = [
    {
      title: "Jumlah Pengguna",
      value: 120,
      icon: <Users className="w-6 h-6 text-white" />,
      bg: "from-yellow-400 to-yellow-600",
      targetPage: "Kelola Pengguna",
    },
    {
      title: "Jumlah Kurir",
      value: 10,
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
