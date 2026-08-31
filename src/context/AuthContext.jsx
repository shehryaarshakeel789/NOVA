import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logoutUser } from "@/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refetchUser() {
    const data = await getMe();
    setUser(data);
  }

  useEffect(() => {
    async function checkAuth() {
      await refetchUser();
      setLoading(false);
    }
    checkAuth();
  }, []);

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, refetchUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
