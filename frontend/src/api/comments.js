import api from "./axios";

export const fetchComments = async (ticketId) => {
  const res = await api.get(`/comments/${ticketId}`);
  return res.data;
};

export const addComment = async (data) => {
  const res = await api.post("/comments", data);
  return res.data;
};
