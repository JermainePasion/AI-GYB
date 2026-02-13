import api from "./api";

export const loginUser = (email, password) =>
  api.post("/users/login", { email, password });

export const registerUser = (username, email, password) =>
  api.post("/users/register", { username, email, password });

export const adjustThresholdOnLogout = () =>
  api.post("/users/logout-adjust");