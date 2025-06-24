import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { companyConfigFetch } from "../store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { decrypt, encrypt } from "../utils/crypto";

const CareerPage = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { error_company, companyConfig } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (companyConfig) {
      let encrpytValue = encrypt(JSON.stringify(companyConfig));
      localStorage.setItem("companyConfig", encrpytValue);
      navigate("/jobs")
    }
  }, [companyConfig, navigate]);

  useEffect(() => {
    if (error_company) {
      navigate("/not-found");
    }
  }, [error_company, navigate]);

  useEffect(() => {
    if (companyId) {
      handleCompanyConfig(companyId);
    } else {
      navigate("/not-found");
    }
  }, [companyId, navigate]);

  const handleCompanyConfig = async (companyId: string) => {
    await dispatch(companyConfigFetch(companyId)).unwrap();
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
    </div>
  );
};

export default CareerPage;
