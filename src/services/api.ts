import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/apis";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const apiAuth = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
    const response = await api.post("/career/login", {
      email,
      password,
      companyId,
    });
    return response.data;
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    companyId: string
  ) => {
    const response = await api.post("/career/register", {
      name,
      email,
      password,
      companyId,
    });
    return response.data;
  },

  resetPassword: async (
    { previousPassword, newPassword }: { previousPassword: string; newPassword: string }
  ) => {
    const response = await apiAuth.post("/career/reset_password", {
      previousPassword,
      newPassword,
    });
    return response.data;
  },

  companyConfig: async (companyId: string) => {
    const response = await api.get(`/career/${companyId}`);
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    const response = await apiAuth.post("/career/refresh_token", { refresh });
    return response.data;
  },
};

// Jobs APIs
export const jobsAPI = {
  getJobs: async (body: any) => {
    const response = await api.post("/career/jobs", body);
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
};
