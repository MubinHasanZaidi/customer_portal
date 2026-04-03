import useCustomerConfig from "../../hooks/useCustomerConfig";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import TicketDetail from "./TicketDetail";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CommentSection } from "./CommentSection";

const TicketActivityPage = () => {
  const { customerConfig, userConfig } = useCustomerConfig();
  const { customer } = customerConfig;
  const { Id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Id) {
      navigate("/tickets");
    }
  }, [Id]);
  return (
    <div className={`min-h-screen flex flex-col `}>
      <Header isBack={true} />
      <main className="flex-1 bg-white">
        <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 min-h-[90dvh]">
          <TicketDetail ticketId={Id} />
          <CommentSection
            Id={Id}
            primaryColor={customer?.primary_color}
            customerUserId={userConfig?.Id}
            secondary_color={customer?.secondary_color}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TicketActivityPage;
