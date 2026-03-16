import axios from "axios";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/apis`;

const api = axios.create({
  baseURL: API_BASE_URL,
  // Do not set default Content-Type here; let Axios handle it per request
});
const apiAuth = axios.create({
  baseURL: API_BASE_URL,
  // Do not set default Content-Type here; let Axios handle it per request
});

// Add a request interceptor
apiAuth.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
const handleUnauthorized = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  window.location.href = "/auth"; // Redirect to auth page
};

apiAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string, customerId: string) => {
    const response = await api.post(
      "/customer_portal/login",
      { email, password, customerId },
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  },

  forgotPassword: async (email: string, customerId: string) => {
    const response = await api.post(
      "/customer_portal/forget-password",
      { email, customerId },
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  },

  updatePassowrd: async (body: any) => {
    const response = await api.post(
      "/customer_portal/update-forget-password",
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  },

  resetPassword: async ({
    previousPassword,
    newPassword,
  }: {
    previousPassword: string;
    newPassword: string;
  }) => {
    const response = await apiAuth.post(
      "/customer_portal/reset_password",
      { previousPassword, newPassword },
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  },

  customerConfig: async (customerId: string) => {
    const response = await api.get(`/customer_portal/${customerId}`);
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    const response = await apiAuth.post(
      "/customer_portal/refresh_token",
      { refresh },
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  },
};

// Jobs APIs
export const jobsAPI = {
  getJobs: async (body: any) => {
    const response = await api.post("/customer_portal/tickets", body, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  getJobById: async (id: string) => {
    const response = await api.get(`/customer_portal/tickets/${id}`);
    return response.data;
  },
  getLocationByCompanyId: async (customerId: string) => {
    const response = await api.get(`/customer_portal/locations/${customerId}`);
    return response.data;
  },
  getDepartmentByCompanyId: async (customerId: string) => {
    const response = await api.get(
      `/customer_portal/departments/${customerId}`,
    );
    return response.data;
  },
  getFormOption: async (parentId: string) => {
    const response = await apiAuth.post(
      "/customer_portal/form_option",
      { parentId },
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  },
  getCountryOption: async () => {
    const response = await apiAuth.get("/customer_portal/country_option");
    return response.data;
  },
  getCityOption: async (countryId?: number) => {
    const response = await apiAuth.get(
      `/customer_portal/city_option/${countryId}`,
    );
    return response.data;
  },
  applicantFormSubmit: async (body?: any) => {
    const response = await apiAuth.post(`/customer_portal/applicant`, body);
    return response.data;
  },
  getApplicantForm: async () => {
    const response = await apiAuth.get(`/customer_portal/applicant`);
    return response.data;
  },
  uploadFile: async (body: any) => {
    // Do not set Content-Type; let Axios handle FormData
    return api.post(`/file-upload`, body);
  },
  getJobMandaotrySkills: async (jboId: string) => {
    const response = await apiAuth.get(
      `/customer_portal/mandatory_skills/${jboId}`,
    );
    return response.data;
  },
  getActiveVacancy: async () => {
    const response = await apiAuth.get("/customer_portal/active-vacancy");
    return response.data;
  },
  downloadOfferLetter: async () => {
    const response = await apiAuth.get(
      "/customer_portal/download-offer-letter",
      {
        responseType: "blob",
      },
    );
    return response.data;
  },
  handleOfferLetter: async (body: any) => {
    const response = await apiAuth.post("/customer_portal/handle-offer", body);
    return response.data;
  },
};
