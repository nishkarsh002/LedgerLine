import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:5000/api/v1',
    baseURL: 'https://taxproject-api.vercel.app/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        // Try to get token from localStorage
        const adminToken = localStorage.getItem('admin_token');
        const userToken = localStorage.getItem('token');

        // Prioritize admin_token for all requests if it exists, otherwise use userToken
        const token = adminToken || userToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
