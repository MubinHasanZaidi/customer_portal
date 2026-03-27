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
  uploadFile: async (body: any) => {
    // Do not set Content-Type; let Axios handle FormData
    return api.post(`/file-upload`, body);
  },
};

export const ticketAPI = {
  getProjectDetail: async () => {
    const response = await apiAuth.get("/customer_portal/project-detail", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  createOrUpdateTicket: async (body: any) => {
    const response = await apiAuth.post("/customer_portal/ticket-form", body, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  getTickets: async (body: any) => {
    const response = await apiAuth.post(
      "/customer_portal/read-all-tickets",
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  },
  getTicketById: async (body: any) => {
    const response = await apiAuth.post(
      "/customer_portal/read-ticket-by-Id",
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  },
  deleteTicketById: async (body: any) => {
    const response = await apiAuth.post(
      "/customer_portal/delete-ticket-by-Id",
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  },
  getAllTicketStatus: async () => {
    const response = await apiAuth.post(
      "/customer_portal/read-all-ticket-status",
      {},
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  },
};

export const ticketActivityAPI = {
  getAllTicketComments: async (payload: any) => {
    const response = await apiAuth.post(
      "/customer_portal/read-all-ticket-comments",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  },
  createOrUpdateComment: async (body: any) => {
    const response = await apiAuth.post(
      "/customer_portal/update-ticket-comment",
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  },
  deleteComment: async (body: any) => {
    const response = await apiAuth.post(
      "/customer_portal/delete-ticket-comment",
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  },
};
