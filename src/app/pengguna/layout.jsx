import DashboardLayout from "../components/DashboardLayout";

const PenggunaLayout = ({ children }) => {
  return (
    <DashboardLayout role="seller" username="Tokoloko">
      {children}
    </DashboardLayout>
  );
};

export default PenggunaLayout;
