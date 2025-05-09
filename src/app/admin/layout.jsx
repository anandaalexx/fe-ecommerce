import DashboardLayout from "../components/DashboardLayout";

const AdminLayout = ({ children }) => {
  return (
    <DashboardLayout role="admin" username="Admin">
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout;
