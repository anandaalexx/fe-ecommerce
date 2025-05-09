import DashboardLayout from "../components/DashboardLayout";

const KurirLayout = ({ children }) => {
  return (
    <DashboardLayout role="kurir" username="Mansur">
      {children}
    </DashboardLayout>
  );
};

export default KurirLayout;
