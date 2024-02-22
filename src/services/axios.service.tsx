import axios from "axios";

export const axiosService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
