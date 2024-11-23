import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://smart-delivery-management-backend.onrender.com/api", // Backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;