import request from "supertest";
import { app } from "../server.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

describe("Chat API", () => {
  let user;
  let admin;
  let userToken;
  let adminToken;

  beforeEach(async () => {
    user = await User.create({
      name: "Test User",
      email: "user@test.com",
      password: "password123",
      role: "user",
    });
    
    admin = await User.create({
      name: "Test Admin",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });

    userToken = generateToken(user._id);
    adminToken = generateToken(admin._id);
  });

  it("should get or create a conversation for a logged in user", async () => {
    const res = await request(app)
      .get(`/api/chat/${user._id}`)
      .set("Cookie", [`token=${userToken}`]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.user.toString()).toBe(user._id.toString());
  });

  it("should block unauthenticated users from fetching a conversation", async () => {
    const res = await request(app).get(`/api/chat/${user._id}`);
    expect(res.status).toBe(401); // Unauthorized
  });

  it("admin can fetch all conversations", async () => {
    // Create conversation first
    await Conversation.create({ user: user._id });

    const res = await request(app)
      .get("/api/chat/admin/conversations")
      .set("Cookie", [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].user.name).toBe("Test User");
  });

  it("user cannot fetch all admin conversations", async () => {
    const res = await request(app)
      .get("/api/chat/admin/conversations")
      .set("Cookie", [`token=${userToken}`]);

    expect(res.status).toBe(403); // Forbidden
  });
});
