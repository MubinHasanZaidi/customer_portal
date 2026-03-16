import { useContext } from "react";
import { CustomerConfigContext } from "../contexts/CustomerConfigContext";

const useCustomerConfig = () => {
  const context = useContext(CustomerConfigContext);
  if (!context) {
    throw new Error(
      "useCustomerConfig must be used within CustomerConfigProvider"
    );
  }
  return context;
};

export default useCustomerConfig;