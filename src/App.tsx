import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import ApplicantFormPage from "./pages/ApplicantFormPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import CareerPage from "./pages/CareerPage";
import NotFoundPage from "./pages/NotFoundPage";
import CompanyConfigProvider from "./contexts/CompanyConfigContext";
import HowItWorkPage from "./pages/HowItWorkPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/career/:companyId" element={<CareerPage />} />
        <Route
          path="/*"
          element={
            <CompanyConfigProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/jobs" replace />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/reset-password"
                  element={
                    <ProtectedRoute>
                      <ResetPasswordPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/how-it-work" element={<HowItWorkPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/forget-password" element={<ForgetPasswordPage />} />
                <Route path="/job-detail/:id" element={<JobDetailPage />} />
                <Route
                  path="/applicant-form"
                  element={
                    <ProtectedRoute>
                      <ApplicantFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </CompanyConfigProvider>
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
