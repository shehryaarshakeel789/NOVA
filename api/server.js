import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import promoRoutes from "./routes/promoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { handleStripeWebhook } from "./controllers/orderController.js";
import { createServer } from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chatRoutes.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";

const app = express();
const port = process.env.PORT;
const client_url = process.env.CLIENT_URL;

app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cors({ origin: client_url, credentials: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("hello");
});
app.get("/about", (req, res) => {
  res.send("This is the about page :)");
});
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/promos", promoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: client_url,
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join_conversation", (conversationId) => {
    if (conversationId) {
      socket.join(conversationId);
      console.log(`User joined room: ${conversationId}`);
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { conversationId, senderId, senderRole, text } = data;
      const newMessage = new Message({
        conversation: conversationId,
        senderRole,
        sender: senderId,
        text,
      });
      await newMessage.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date(),
        isRead: senderRole === "admin", // Unread if sent by user
      });

      io.to(conversationId).emit("receive_message", newMessage);
      // Also emit a general notification for admin dashboard if needed
      io.emit("new_message_notification"); 
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});
httpServer.listen(port, () => {
  console.log("server is running on port " + port);
});
