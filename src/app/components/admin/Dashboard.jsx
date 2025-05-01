import { Users, Truck, Package } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Jumlah Pengguna",
      value: 120,
      icon: <Users className="w-6 h-6 text-white" />,
      bg: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Jumlah Kurir",
      value: 10,
      icon: <Truck className="w-6 h-6 text-white" />,
      bg: "from-green-400 to-green-600",
    },
    {
      title: "Jumlah Barang",
      value: 340,
      icon: <Package className="w-6 h-6 text-white" />,
      bg: "from-blue-400 to-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
          >
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
