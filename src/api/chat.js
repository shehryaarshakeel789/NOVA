import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/chat",
  withCredentials: true,
});

export const getConversation = async (userId) => {
  const { data } = await api.get(`/${userId}`);
  return data;
};

export const getMessages = async (conversationId) => {
  const { data } = await api.get(`/messages/${conversationId}`);
  return data;
};

export const getAdminConversations = async () => {
  const { data } = await api.get("/admin/conversations");
  return data;
};
