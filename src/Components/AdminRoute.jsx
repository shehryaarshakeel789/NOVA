import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function AdminRoute({ children }) {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) return <p className="px-6 py-6">Loading...</p>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

export default AdminRoute;
