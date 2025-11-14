import axios from "axios";
import { error } from "console";
import { response } from "express";
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscriber: (() => void)[] = [];
//handle logout and prevent infinite loop
const handleLogout = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
//handle adding a new access token to queued request
const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscriber.push(callback);
};
//Execued queued request after refresh
const onRefreshSuccess = () => {
  refreshSubscriber.forEach((callback) => callback());
  refreshSubscriber = [];
};

//handle API request
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);
//handle expired token and refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    //prevent infinite retry look
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/v1/refresh-token-user`,
          {},
          { withCredentials: true }
        );
        isRefreshing = false
        onRefreshSuccess()
        return axiosInstance(originalRequest)
      } catch (error) {
        isRefreshing = false
        refreshSubscriber = []
        handleLogout()
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
);
