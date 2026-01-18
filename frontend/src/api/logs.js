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

export const fetchPatientLogs = (patientId) => {
  return api.get(`/logs/${patientId}`);
};

export const getMyLogs = () => api.get("/logs/my");

export const deleteLog = (logId) =>
  api.delete(`/logs/${logId}`);