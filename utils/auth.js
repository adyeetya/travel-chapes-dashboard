// auth.js

import jwt from "jsonwebtoken";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET; // Key for storing token in localStorage
const TOKEN_KEY = "auth_token"
/**
 * Set the authentication token in localStorage
 * @param {string} token - JWT token to be stored
 */
export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get the authentication token from localStorage
 * @returns {string | null} - JWT token or null if not found
 */
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Remove the authentication token from localStorage
 */
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Decode a JWT token to extract its payload
 * @param {string} token - JWT token to decode
 * @returns {object | null} - Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Verify the validity of a JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secretKey - Secret key to validate the token
 * @returns {object | null} - Decoded payload if valid, null otherwise
 */
export const verifyToken = (token) => {
  try {
    
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

/**
 * Check if a user is authenticated by verifying the presence of a valid token
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  // Optionally, check token expiration
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp && decoded.exp > currentTime;
};

/**
 * Get the user information stored in the token payload
 * @returns {object | null} - User data from token payload or null if invalid
 */
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded ? decoded.user : null;
};

/**
 * Redirect to login page if user is not authenticated
 * @param {string} loginPageUrl - URL of the login page
 */
export const redirectToLogin = (loginPageUrl = "/auth/login") => {
  if (typeof window !== "undefined" && !isAuthenticated()) {
    window.location.href = loginPageUrl;
  }
};

export default {
  setToken,
  getToken,
  removeToken,
  decodeToken,
  verifyToken,
  isAuthenticated,
  getUserFromToken,
  redirectToLogin,
};
