import api from "./api"; 

export const fetchUserProfile = () => {
  return api.get("/users/profile");
};
