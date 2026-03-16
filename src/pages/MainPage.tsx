import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {  customerConfigFetch } from "../store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { decrypt, encrypt } from "../utils/crypto";

const MainPage = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { error_customer, customerConfig } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (customerConfig) {
      let encrpytValue = encrypt(JSON.stringify(customerConfig));
      localStorage.clear();
      localStorage.setItem("customerConfig", encrpytValue);
      navigate("/auth");
    }
  }, [customerConfig, navigate]);

  useEffect(() => {
    if (error_customer) {
      navigate("/not-found");
    }
  }, [error_customer, navigate]);

  useEffect(() => {
    if (customerId) {
      handleCustomerConfig(customerId);
    } else {
      navigate("/not-found");
    }
  }, [customerId, navigate]);

  const handleCustomerConfig = async (customerId: string) => {
    await dispatch(customerConfigFetch(customerId)).unwrap();
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
    </div>
  );
};

export default MainPage;
