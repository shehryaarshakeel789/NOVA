import { useState, useEffect, useRef } from "react";
import AdminSidebar from "@/Components/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { getAdminConversations, getMessages } from "@/api/chat";
import { Send, User as UserIcon } from "lucide-react";
import Skeleton from "@/Components/Skeleton";

export default function AdminChats() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getAdminConversations();
        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      const fetchMsgs = async () => {
        try {
          const msgs = await getMessages(activeChat._id);
          setMessages(msgs);
        } catch (err) {
          console.error(err);
        }
      };
      fetchMsgs();
      
      if (socket && isConnected) {
        socket.emit("join_conversation", activeChat._id);
      }
    }
  }, [activeChat, socket, isConnected]);

  useEffect(() => {
    if (!socket) return;
    
    const handleReceiveMessage = (newMessage) => {
      // If the message belongs to the active chat
      if (activeChat && newMessage.conversation === activeChat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
      
      // Update conversations list to show newest on top
      setConversations((prevConvs) => {
        const updated = prevConvs.map(conv => {
          if (conv._id === newMessage.conversation) {
            return { ...conv, lastMessageAt: new Date().toISOString(), isRead: newMessage.senderRole === "admin" };
          }
          return conv;
        });
        return updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, activeChat]);

  useEffect(() => {
    if (activeChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeChat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat || !socket) return;

    const messageData = {
      conversationId: activeChat._id,
      senderId: user._id,
      senderRole: "admin",
      text: inputText,
    };

    socket.emit("send_message", messageData);
    setInputText("");
  };

  return (
    <AdminSidebar activeItem="Chats">
      <div className="h-[calc(100vh-4rem)] flex my-15 bg-white">
        
        {/* Left Sidebar: Conversations List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b font-semibold text-lg">Customer Chats</div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-sm text-zinc-500 text-center mt-10">
                No active conversations
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => setActiveChat(conv)}
                  className={`w-full text-left p-4 border-b flex items-center gap-3 transition-colors ${
                    activeChat?._id === conv._id ? "bg-zinc-100" : "hover:bg-zinc-50"
                  }`}
                >
                  <div className="bg-zinc-200 p-2 rounded-full flex-shrink-0">
                    <UserIcon size={20} className="text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm truncate">{conv.user?.name || "Unknown User"}</p>
                      {!conv.isRead && activeChat?._id !== conv._id && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{conv.user?.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Chat Area */}
        <div className="flex-1 flex flex-col bg-zinc-50">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b flex items-center gap-3 shadow-sm">
                 <div className="bg-zinc-900 text-white p-2 rounded-full">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold">{activeChat.user?.name || "Customer"}</h2>
                    <p className="text-xs text-zinc-500">{activeChat.user?.email}</p>
                  </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center text-zinc-500 text-sm mt-20">
                    No messages yet. Send a message to start the conversation!
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isAdmin = msg.senderRole === "admin";
                    return (
                      <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm ${
                          isAdmin ? 'bg-zinc-900 text-white rounded-br-none shadow-md' : 'bg-white border text-zinc-800 rounded-bl-none shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-zinc-900 text-white p-3 rounded-full hover:bg-zinc-800 disabled:opacity-50 transition-all"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>

      </div>
    </AdminSidebar>
  );
}
