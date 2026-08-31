const BASE_URL = import.meta.env.VITE_API_URL + "/api/chat";

export const getConversation = async (userId) => {
  const response = await fetch(`${BASE_URL}/${userId}`, { credentials: "include" });
  return response.json();
};

export const getMessages = async (conversationId) => {
  const response = await fetch(`${BASE_URL}/messages/${conversationId}`, { credentials: "include" });
  return response.json();
};

export const getAdminConversations = async () => {
  const response = await fetch(`${BASE_URL}/admin/conversations`, { credentials: "include" });
  return response.json();
};
