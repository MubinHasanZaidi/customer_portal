// src/contexts/CustomerConfigContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decrypt } from "../utils/crypto";

type CustomerConfigContextType = {
  customerConfig: any;
  userConfig: any; // Consider replacing 'any' with a proper type
  setUserConfig: any;
  subsidiary?: any;
};

export const CustomerConfigContext = createContext<
  CustomerConfigContextType | undefined
>(undefined);

const CustomerConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [customerConfig, setCustomerConfig] = useState<any>(null);
  const [userConfig, setUserConfig] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const config = localStorage.getItem("customerConfig");
    const userConfig = localStorage.getItem("user");
    if (!config) {
      navigate("/not-found", { replace: true });
    } else {
      try {
        setCustomerConfig(JSON.parse(decrypt(config)));
        setUserConfig(userConfig ? JSON.parse(decrypt(userConfig)) : null);
      } catch (error) {
        console.error("Failed to parse company config:", error);
        navigate("/not-found", { replace: true });
      }
    }
  }, [navigate]);

  if (!customerConfig) return null;

  return (
    <CustomerConfigContext.Provider
      value={{ customerConfig, userConfig, setUserConfig }}
    >
      {children}
    </CustomerConfigContext.Provider>
  );
};

export default CustomerConfigProvider;
