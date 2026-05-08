// src/config/api.js

export const API_BASE_URL = "${import.meta.env.VITE_API_URL}/api";

export const API_ENDPOINTS = {
  CHECKOUT_ORDER: "orders/checkout", // ✅ FIXED
  DELETE_ALLCART: "cart/delete-all",
};

