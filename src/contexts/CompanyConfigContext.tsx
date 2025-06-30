// src/contexts/CompanyConfigContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decrypt } from "../utils/crypto";

type CompanyConfigContextType = {
  companyConfig: any;
  userConfig: any; // Consider replacing 'any' with a proper type
  setUserConfig: any;
  subsidiary?: any;
};

export const CompanyConfigContext = createContext<
  CompanyConfigContextType | undefined
>(undefined);

const CompanyConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [companyConfig, setCompanyConfig] = useState<any>(null);
  const [userConfig, setUserConfig] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const config = localStorage.getItem("companyConfig");
    const userConfig = localStorage.getItem("user");
    if (!config) {
      navigate("/not-found", { replace: true });
    } else {
      try {
        setCompanyConfig(JSON.parse(decrypt(config)));
        setUserConfig(userConfig ? JSON.parse(decrypt(userConfig)) : null);
      } catch (error) {
        console.error("Failed to parse company config:", error);
        navigate("/not-found", { replace: true });
      }
    }
  }, [navigate]);

  if (!companyConfig) return null;

  return (
    <CompanyConfigContext.Provider
      value={{ companyConfig, userConfig, setUserConfig }}
    >
      {children}
    </CompanyConfigContext.Provider>
  );
};

export default CompanyConfigProvider;
