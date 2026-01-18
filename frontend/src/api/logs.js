import api from "./api"; 

export const uploadCsvLog = async ({ csv, filename }) => {
  return api.post("/logs/upload", {
    csv,
    filename,
    append: false,
  });
};

export const fetchMyPostureLogs = () => {
  return api.get("/logs/my");
};