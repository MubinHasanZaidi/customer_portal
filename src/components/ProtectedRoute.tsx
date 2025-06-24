import type React from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateUserToken = async () => {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setLoading(false);
        navigate("/auth", { replace: true });
        return;
      }
      try {
        const result = await authAPI.refreshToken(refresh);
        localStorage.setItem("refresh", result?.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
        navigate("/auth", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    validateUserToken();
  }, [navigate]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
