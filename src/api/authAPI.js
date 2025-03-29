import axios from "./axiosInstance";

export const registerUser = async (userData) => {
  const response = await axios.post("/users/signup", userData);
  return response.data;
};
export const loginUser = async (userData) => {
  const response = await axios.post("/users/signin", userData);
  return response.data;
};
