// api/photos.js
import api from "./api";

export const uploadPhotos = (formData) => {
  return api.post("/upload-photos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
