// src/services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Change this to your deployed Render URL after deployment ─────────────────
const BASE_URL = 'https://business-insight-2.onrender.com';
// For local dev: 'http://10.0.2.2:5000' (Android emulator) or 'http://localhost:5000'

const TOKEN_KEY = '@business_insights_token';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const saveToken = async (token) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

// ── Base fetch wrapper ────────────────────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ── API methods ───────────────────────────────────────────────────────────────
export const login = (email, password) =>
  request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getBusiness = () => request('/business');

export const getInsights = () => request('/insights');

export const getReviews = () => request('/reviews');

export default { login, getBusiness, getInsights, getReviews, saveToken, getToken, removeToken };
