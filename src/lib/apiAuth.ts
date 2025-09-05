import api from "./axios";

export const registerUser = (payload: {
  username: string;
  password: string;
  role: "User" | "Admin";
}) => api.post("/auth/register", payload).then((r) => r.data);

export const loginUser = (payload: { username: string; password: string }) =>
  api.post("/auth/login", payload).then((r) => r.data);

export const getProfile = () => api.get("/auth/profile").then((r) => r.data);
