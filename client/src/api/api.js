import axios from "axios";
import { openUpgradeModal } from "../utils/upgradeBus";

const api = axios.create({
baseURL: "http://localhost:8081/", // Keep the root URL
withCredentials: true,
});

// ======================================================
// 🔥 NEW: GLOBAL REQUEST INTERCEPTOR (Injects JWT)
// ======================================================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        
        if (token) {
            // Attach the JWT to the Authorization header for all requests
            // This fixes the 400 'Authorization' header missing error.
            config.headers.Authorization = `Bearer ${token}`; 
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// ======================================================

// GLOBAL RESPONSE INTERCEPTOR (Your existing code)
api.interceptors.response.use(
   (res) => res,
(err) => {
const status = err?.response?.status;

 // If trial expired or no payment
if (status === 402) {
openUpgradeModal();
}

// If token invalid/expired (HTTP 401) → logout
if (status === 401) {
 localStorage.removeItem("token");
 window.location.href = "/login";
}

return Promise.reject(err);
 }
);

export default api;