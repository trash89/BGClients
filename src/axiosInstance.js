import axios from "axios";
import { APISERVER } from "./utils/constants";

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: APISERVER,
});
