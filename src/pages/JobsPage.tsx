import Header from "../components/Header";
import Footer from "../components/Footer";
import useCustomerConfig from "../hooks/useCustomerConfig";

const JobsPage = () => {
  /// comapny Config
  const { customerConfig } = useCustomerConfig();
  const { customer } = customerConfig;
  return (
    <div
      style={{ background: customer?.secondary_color }}
      className={`min-h-screen flex flex-col`}
    >
      <Header />
      <main className="flex-1">
        <></>
      </main>
      <Footer />
    </div>
  );
};

export default JobsPage;
