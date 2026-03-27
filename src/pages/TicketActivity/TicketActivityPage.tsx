import useCustomerConfig from "../../hooks/useCustomerConfig";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import TicketDetail from "./TicketDetail";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CommentSection } from "./CommentSection";
import { ArrowLeft, Backpack } from "lucide-react";

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
    <div
      style={{ background: customer?.secondary_color }}
      className={`min-h-screen flex flex-col`}
    >
      <Header />
      <main className="flex-1 mt-4">
        <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 min-h-[90dvh]">
          <hr />
          <div data-title={"Go Back"} className="ms-2 mt-2 w-fit">
            <ArrowLeft
              onClick={() => navigate("/tickets")}
              className="w-4 h-4 text-black cursor-pointer"
            />
          </div>
          <TicketDetail ticketId={Id} />
          <hr className="my-2" />
          <CommentSection
            Id={Id}
            primaryColor={customer?.primary_color}
            customerUserId={userConfig?.Id}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TicketActivityPage;
