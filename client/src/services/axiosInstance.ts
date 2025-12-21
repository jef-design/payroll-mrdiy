import axios from "axios";


const axiosInstance = axios.create({

    baseURL: import.meta.env.PROD ? import.meta.env.VITE_SERVER_URL_PROD : import.meta.env.VITE_SERVER_URL_DEV,
    withCredentials: true,
});

export default axiosInstance;