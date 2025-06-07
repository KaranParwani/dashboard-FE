import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);
 
export const loginAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
    return response.data; // Adjust based on your API response format
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong!";
  }
};
