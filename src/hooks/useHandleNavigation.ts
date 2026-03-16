import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const useHandleNavigation = (url?: string): void => {
  const navigate = useNavigate();
  const location = useLocation();

  const targetUrl = url || "/tickets";

  const handleBackAction = (): void => {
    if (window.confirm("Are you sure you want to leave this page?")) {
      navigate(targetUrl);
    } else {
      // Restore current URL to prevent navigation
      window.history.pushState(null, "", location.pathname);
    }
  };

  useEffect(() => {
    const handlePopState = (): void => {
      handleBackAction();
    };

    // Push dummy state to activate `popstate` event
    window.history.pushState(null, "", location.pathname);

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [url, location.pathname]);
};

export default useHandleNavigation;
