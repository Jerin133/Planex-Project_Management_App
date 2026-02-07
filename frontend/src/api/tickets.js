import api from "./axios";

export const fetchTickets = async (projectId, filters = {}) => {
  const params = new URLSearchParams({
    projectId,
    ...filters
  }).toString();

  const res = await api.get(`/tickets?${params}`);
  return res.data;
};

export const createTicket = async (data) => {
  const res = await api.post("/tickets", data);
  return res.data;
};