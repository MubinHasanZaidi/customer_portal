import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TicketsPage from "./pages/TicketsPage/TicketsPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import CustomerConfigProvider from "./contexts/CustomerConfigContext";
import HowItWorkPage from "./pages/HowItWorkPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPasswordLinkPage from "./pages/ResetPasswordLink";
import MainPage from "./pages/MainPage";
import TicketActivityPage from "./pages/TicketActivity/TicketActivityPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/customer/:customerId" element={<MainPage />} />
        <Route
          path="/*"
          element={
            <CustomerConfigProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/tickets" replace />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/forget-password"
                  element={<ForgetPasswordPage />}
                />
                <Route
                  path="/reset-link-password/:Id"
                  element={<ResetPasswordLinkPage />}
                />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/ticket/activity/:Id" element={<TicketActivityPage />} />
                <Route path="/how-it-work" element={<HowItWorkPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              </Routes>
            </CustomerConfigProvider>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
