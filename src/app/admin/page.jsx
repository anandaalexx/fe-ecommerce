import DashboardLayout from "../components/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin" username="Admin">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Konten statistik admin atau laporan bisa ditaruh di sini nanti.</p>
    </DashboardLayout>
  );
};

export default AdminDashboard;
