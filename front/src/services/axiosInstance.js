import axios from "axios";
import { useAuthStore } from "@/stores/auth";


// Create a reusable axios instance
// So we don't have to repeat the url each time
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/"
})


// Interceptor to automatically add the token to each request
// Before each request, we get the token from authStore. If it exists we add it to the HTTP header
api.interceptors.request.use(config => {
    // access Pinia state token in a reactive way
    const authStore = useAuthStore();

    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return config;
});

api.interceptors.response.use(
    // if response gives a 201, we return it as it is
    response => response,

    // if there's an error...
    async error => {
        // we stock it to use it later
        const originalRequest = error.config;
        // get once again the store to access the token or trigger a refresh token
        const authStore = useAuthStore();

        // if the error is a 401 (non authorize -> meaning in our case that the token has expired)
        // and that the request hasn't been tried a second time
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // we notice that the request is tried a second time (to prevent infinite loop)
            originalRequest._retry = true;

            try {
                // get the new token (here the refresh token) from the refreshToken method present in our Pinia store
                await authStore.refreshToken();
                // if it's a success, we update the header Authorization from our initial request
                originalRequest.headers.Authorization = `Bearer ${authStore.token}`;

                // then we try again the request with the new token (in a transparent way to our user)
                return api(originalRequest);

            } catch (error) {
                console.log("axios instance", error);
                // if the refreshment has failed, we log out the user because we can't authenticate them
                authStore.logout();
            }
        }

        // if another error is triggered (so not a 401 or a failure from our refresh), it is rejected so that the calling component can handle it. 
        return Promise.reject(error);
    }
);

export default api;