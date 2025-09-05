export const setToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
export const setRole = (role: string) => localStorage.setItem("role", role);
export const getRole = () => localStorage.getItem("role");
export const isAdmin = () => getRole() === "Admin";

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
