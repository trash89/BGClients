import axios from "axios";
import { APISERVER } from "./utils/constants";
let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: APISERVER,
});

export { axiosInstance };
