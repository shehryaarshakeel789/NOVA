import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { getConversation, getMessages } from "@/api/chat";

export default function CustomerChat() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [conversation, setConversation] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user && !conversation) {
      // Fetch conversation and messages when opened
      const fetchChatHistory = async () => {
        try {
          const conv = await getConversation(user._id);
          setConversation(conv);
          
          if (conv) {
            const msgs = await getMessages(conv._id);
            setMessages(msgs);
            
            if (socket && isConnected) {
              socket.emit("join_conversation", conv._id);
            }
          }
        } catch (error) {
          console.error("Failed to load chat history:", error);
        }
      };
      fetchChatHistory();
    }
  }, [isOpen, user, conversation, socket, isConnected]);

  useEffect(() => {
    if (socket && isConnected && conversation) {
      socket.emit("join_conversation", conversation._id);
    }
  }, [socket, isConnected, conversation]);

  useEffect(() => {
    if (!socket) return;
    
    const handleReceiveMessage = (newMessage) => {
      if (conversation && newMessage.conversation === conversation._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !conversation || !socket) return;

    const messageData = {
      conversationId: conversation._id,
      senderId: user._id,
      senderRole: "user",
      text: inputText,
    };

    socket.emit("send_message", messageData);
    setInputText("");
  };

  if (!user || user.role === "admin") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white border rounded-2xl shadow-xl w-80 sm:w-96 flex flex-col h-[400px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-zinc-900 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Customer Support</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-zinc-800 p-1 rounded-md transition-colors">
              <X size={18} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-zinc-500 mt-10">
                Hi there! 👋 How can we help you today?
              </div>
            ) : (
              messages.map((msg, index) => {
                const isUser = msg.senderRole === "user";
                return (
                  <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      isUser ? 'bg-zinc-900 text-white rounded-br-none' : 'bg-white border rounded-bl-none text-zinc-800 shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-sm border rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-zinc-900 text-white p-2 rounded-full disabled:opacity-50 hover:bg-zinc-800 transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-zinc-900 text-white p-4 rounded-full shadow-lg hover:bg-zinc-800 hover:scale-105 transition-all animate-in zoom-in-95 duration-300"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}
