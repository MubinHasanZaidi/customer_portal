import { useContext } from "react";
import { CompanyConfigContext } from "../contexts/CompanyConfigContext";

const useCompanyConfig = () => {
  const context = useContext(CompanyConfigContext);
  if (!context) {
    throw new Error(
      "useCompanyConfig must be used within CompanyConfigProvider"
    );
  }
  return context;
};

export default useCompanyConfig;