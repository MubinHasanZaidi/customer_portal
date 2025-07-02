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
  }
);

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string, companyId: string) => {
    const response = await api.post(
      "/career/login",
      { email, password, companyId },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    companyId: string
  ) => {
    const response = await api.post(
      "/career/register",
      { name, email, password, companyId },
      { headers: { "Content-Type": "application/json" } }
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
      "/career/reset_password",
      { previousPassword, newPassword },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  },

  companyConfig: async (companyId: string) => {
    const response = await api.get(`/career/${companyId}`);
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    const response = await apiAuth.post(
      "/career/refresh_token",
      { refresh },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  },
};

// Jobs APIs
export const jobsAPI = {
  getJobs: async (body: any) => {
    const response = await api.post("/career/jobs", body, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  getJobById: async (id: string) => {
    const response = await api.get(`/career/jobs/${id}`);
    return response.data;
  },
  getLocationByCompanyId: async (companyId: string) => {
    const response = await api.get(`/career/locations/${companyId}`);
    return response.data;
  },
  getDepartmentByCompanyId: async (companyId: string) => {
    const response = await api.get(`/career/departments/${companyId}`);
    return response.data;
  },
  getFormOption: async (parentId: string) => {
    const response = await apiAuth.post(
      "/career/form_option",
      { parentId },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  },
  getCountryOption: async () => {
    const response = await apiAuth.get("/career/country_option");
    return response.data;
  },
  getCityOption: async (countryId?: number) => {
    const response = await apiAuth.get(`/career/city_option/${countryId}`);
    return response.data;
  },
  applicantFormSubmit: async (body?: any) => {
    const response = await apiAuth.post(`/career/applicant`, body);
    return response.data;
  },
  getApplicantForm: async () => {
    const response = await apiAuth.get(`/career/applicant`);
    return response.data;
  },
  uploadFile: async (body: any) => {
    // Do not set Content-Type; let Axios handle FormData
    return api.post(`/file-upload`, body);
  },
  getJobMandaotrySkills: async (jboId: string) => {
    const response = await apiAuth.get(`/career/mandatory_skills/${jboId}`);
    return response.data;
  },
  getActiveVacancy: async () => {
    const response = await apiAuth.get("/career/active-vacancy");
    return response.data;
  },
  downloadOfferLetter: async () => {
    const response = await apiAuth.get("/career/download-offer-letter", {
      responseType: "blob",
    });
    return response.data;
  },
  handleOfferLetter: async (body: any) => {
    const response = await apiAuth.post("/career/handle-offer", body);
    return response.data;
  },
};
