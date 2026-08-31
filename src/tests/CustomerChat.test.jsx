import { render, screen, fireEvent } from "@testing-library/react";
import CustomerChat from "../Components/CustomerChat";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { describe, it, expect, vi } from "vitest";

// Mock the AuthContext so we can simulate a logged in user
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock SocketContext
vi.mock("../context/SocketContext", () => ({
  useSocket: vi.fn(() => ({ socket: null, isConnected: false })),
  SocketProvider: ({ children }) => <div>{children}</div>,
}));

import { useAuth } from "../context/AuthContext";

describe("CustomerChat Component", () => {
  it("does not render if user is not logged in", () => {
    useAuth.mockReturnValue({ user: null });
    
    render(<CustomerChat />);
    // The button shouldn't be in the document
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render if user is admin", () => {
    useAuth.mockReturnValue({ user: { role: "admin" } });
    
    render(<CustomerChat />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a chat button if user is a normal customer", () => {
    useAuth.mockReturnValue({ user: { role: "user", _id: "123" } });
    
    render(<CustomerChat />);
    const chatButton = screen.getByRole("button");
    expect(chatButton).toBeInTheDocument();
  });

  it("opens the chat widget when the button is clicked", () => {
    useAuth.mockReturnValue({ user: { role: "user", _id: "123" } });
    
    render(<CustomerChat />);
    
    // Find floating chat button
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    // After clicking, the chat window header should be visible
    expect(screen.getByText("Customer Support")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
  });
});
