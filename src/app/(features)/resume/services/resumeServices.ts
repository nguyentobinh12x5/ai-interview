import axios from "axios";

export const fetchResumes = async () => {
  const response = await axios.get("/api/resume");
  return response.data;
};

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post("/api/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteResume = async (id: number) => {
  const response = await axios.delete(`/api/resume?id=${id}`);
  return response.data;
};
