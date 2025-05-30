import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Set base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "";

// Optionally, add axios interceptors for request/response handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // For example, redirect to login page or show message
      console.log("Unauthorized, please login again.");
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
