import axios from "axios";

// Normalize base URL to ensure it always targets the /api path
const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, ""); // Trim trailing slashes
const baseURL = cleanBaseUrl.endsWith("/api") ? cleanBaseUrl : `${cleanBaseUrl}/api`;

const api = axios.create({
  baseURL,
});

export const getLeaderboard = (period, category) =>
  api.get("/leaderboard", { params: { period, category } }).then((r) => r.data);

export const getCategories = () => api.get("/categories").then((r) => r.data.categories);

export const getMovements = () => api.get("/movement").then((r) => r.data.movements);

export const registerView = (channelId) => api.post(`/leaderboard/${channelId}/view`);

export const getQuote = (targetRank) =>
  api.get("/claim/quote", { params: { targetRank } }).then((r) => r.data);

export const createClaimOrder = (payload) => api.post("/claim", payload).then((r) => r.data);

export const verifyPayment = (payload) => api.post("/payment/verify", payload).then((r) => r.data);

export const lookupYoutubeChannel = (handle) =>
  api.get("/youtube/lookup", { params: { handle } }).then((r) => r.data);

export default api;