import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * userService
 *
 * Encapsulates all HTTP calls related to users.
 * Consumers should never call axios directly.
 */
export const userService = {
  /**
   * Fetch all users from the backend.
   * @param {object} options - axios config (e.g. { signal } for abort)
   */
  getAll: async (options = {}) => {
    const { data } = await apiClient.get("/users", options);
    return data;
  },

  /**
   * Fetch a single user by ID.
   * @param {string|number} id
   */
  getById: async (id) => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },

  /**
   * Fetch available cargo (role) options for filter dropdown.
   */
  getCargos: async () => {
    const { data } = await apiClient.get("/users/cargos");
    return data;
  },
};
