import api from "./api"; 

export const fetchUserProfile = () => {
  return api.get("/users/profile");
};

export const getAllUsers = () => api.get("/users");

export const approveDoctor = (id) =>
  api.put(`/users/approve/${id}`);