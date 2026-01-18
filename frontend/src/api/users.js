import api from "./api"; 

export const fetchUserProfile = () => {
  return api.get("/users/profile");
};

export const getAllUsers = () => api.get("/users");

export const approveDoctor = (id) =>
  api.put(`/users/approve/${id}`);

export const getThresholds = () => api.get("/users/thresholds");

export const updateThresholds = (thresholds) =>
  api.put("/users/thresholds", thresholds);

export const registerDoctor = (payload) =>
  api.post("/users/register-doctor", payload);