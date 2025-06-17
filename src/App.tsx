import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import ApplicantFormPage from "./pages/ApplicantFormPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";

function App() {
  return (
    <Routes>
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
      <Route path="*" element={<JobsPage />} />
    </Routes>
  );
}

export default App;
