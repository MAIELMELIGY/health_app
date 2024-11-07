// utils/auth.js

export const isAuthenticated = () => !!localStorage.getItem('token');
export const getUserType = () => localStorage.getItem('userType');
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
};
