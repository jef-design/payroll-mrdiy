import axios from "axios";


const axiosInstance = axios.create({

    baseURL: import.meta.env.PROD ? import.meta.env.VITE_SERVER_URL_PROD : import.meta.env.VITE_SERVER_URL_DEV,
    withCredentials: true,
});

export default axiosInstance;
axiosInstance.interceptors.response.use(
    (response) => response, // Simply return the response for successful requests
    async (error) => {
        const originalRequest = error.config;
       
        // Prevent infinite loop by checking the request URL or adding a custom flag
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Exclude refresh and logout requests from being retried
            if (originalRequest.url.includes("/refresh") || originalRequest.url.includes("/logout")) {
                // If the request is to refresh or logout, reject the promise to stop the loop
                return Promise.reject(error);
            }

            originalRequest._retry = true; // Mark this request as retried

            try {
                // console.log("refresh trigger");
                // Attempt to refresh the token
                await axiosInstance.get(`/employee/refresh`, {
                    withCredentials: true,
                });

                // If the token was refreshed successfully, retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError: any) {
                console.error("Unable to refresh token:", refreshError);

                // Handle specific error for refresh token expiration
                if (refreshError.response && refreshError.response.status === 403) {
                    console.log("Refresh token expired. Logging out...");

                    // Here, you might want to trigger a logout or redirect to a login page
                    // Perform logout and wait for it to complete before rejecting the promise

                    return axiosInstance.get("/employee/logout").then(() => {
                        // toast.error("Your session has expired. Please sign in again.", {
                        //     action: {
                        //         label: "Sign in",
                        //         onClick: () => {
                        //           window.location.href = "/signin";
                        //         },
                        //     },
                        // });
                       localStorage.removeItem("employee-user");
                        return Promise.reject(refreshError);
                    });
                } else {
                    // If the error is not due to refresh token expiration, reject normally
                    return Promise.reject(refreshError);
                }
            }
        }

        // If the error is not due to a 401 Unauthorized, simply forward it
        return Promise.reject(error);
    }
);
