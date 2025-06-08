import axios from "axios";

const baseURL = (process.env.REACT_APP_API_URL || "") + "/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

import { showToast } from "./ToastService";

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 200 && response.data?.message) {
      showToast(response.data.message, "success");
    }
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url;

    if (error.response?.status === 401 && requestUrl !== '/auth/login') {
      // Clear user data from sessionStorage
      sessionStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    } else {
      console.error('Got error ', error);
      // Show error notification for other errors
      let message = '';

      if(error.response.data instanceof Blob) {
        console.log('errorTexterrorTexterrorText ', error.response.data);
        return error.response.data.text().then(text => {
          const data = JSON.parse(text);
          const message = data.message || "An error occurred";
          showToast(message, "error");
          return Promise.reject(error);

        });
    
      } else {
        message = error.response?.data?.message || error.message || "An error occurred";
      }
      message = message || "An error occurred";
      showToast(message, "error");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
