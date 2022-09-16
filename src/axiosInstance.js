import axios from "axios";
import { APISERVER } from "./utils/constants";
import { getUserFromLocalStorage } from "./utils/localStorage";

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: APISERVER,
});

axiosInstance.interceptors.request.use((config) => {
  const user = getUserFromLocalStorage();
  if (user) {
    config.headers.common["Authorization"] = `Bearer ${user.access_token}`;
  }
  return config;
});

export { axiosInstance };
