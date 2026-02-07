import api from "./axios";

export const fetchProjects = async () => {
  const res = await api.get("/projects"); // ✅ FIXED
  return res.data;
};

export const createProject = async (data) => {
  const res = await api.post("/projects", data); // ✅ FIXED
  return res.data;
};

export const fetchAssignedProjects = async () => {
  const res = await api.get("/projects/assigned");
  return res.data;
};