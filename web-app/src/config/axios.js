import axios from 'axios';
import router from '@/router';
import { useToast } from 'vue-toastification';

const toast = useToast();

// Base API call for private pages, i.e., use the apiClient instance for 
// private routes, i.e., customer and admin/other pages.
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', 
  withCredentials: true, // Ensures cookies are sent
});

// Function to refresh the access token when expired
const refreshAccessToken = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/user/refresh', {}, { withCredentials: true });
    const { accessToken } = response.data;

    // Save the new access token
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Unable to refresh access token:', error); // The refresh token has expired
    throw error; 
  }
};

// Request interceptor: Attach the access token to every request
apiClient.interceptors.request.use(
  (config) => {
   
    const token = localStorage.getItem('accessToken'); // Retrieve access token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header
    }
    console.log('Intercepted request!');
    //console.log("hello?")
    return config; //Push forward the request with the access token
  },
  (error) => {
    console.log(error);
    return Promise.reject(error)  // Reject request if there's an error
  }
);

// Response interceptor: Handle token expiration and retry the request
apiClient.interceptors.response.use(
  (response) => {
    return response; // Return the response if successful
  },
  async (error) => {
    const originalRequest = error.config;
    if(error.status === 403 && !originalRequest._retry){
      toast.error('You are not authorized to access this page.');
      localStorage.removeItem('accessToken');
      router.push('/login');
    }
    // Check if the error is due to an expired access token and not a retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops

      try {
        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        // Attach the new token to the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login page if refresh token fails
        router.push('/login');
      }
    }

    return Promise.reject(error); // Reject if it's not a token error
  }
);

export default apiClient;

