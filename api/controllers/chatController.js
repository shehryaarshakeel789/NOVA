import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Get or create conversation for the logged-in user
export const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    let conversation = await Conversation.findOne({ user: userId });

    if (!conversation) {
      conversation = new Conversation({ user: userId });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all messages for a specific conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Check if the user is authorized to view this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    
    if (req.user.role !== "admin" && conversation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all conversations for admin dashboard
export const getAdminConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate("user", "name email")
      .sort({ lastMessageAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
