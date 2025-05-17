// src/auth.js
export const isAuthenticated = () => {
  // For example, check if 'access_token' exists in localStorage
  return !!localStorage.getItem("access_token");
};

export const login = (token) => {
  localStorage.setItem("access_token", token);
};

export const logout = () => {
  localStorage.removeItem("access_token");
};
