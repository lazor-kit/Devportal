import { apiRequest } from "./queryClient";

// Get the JWT token from local storage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Add authorization header to fetch options
export const authHeader = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return false;
  
  try {
    const user = JSON.parse(userStr);
    return user.isAdmin === true;
  } catch (err) {
    return false;
  }
};
