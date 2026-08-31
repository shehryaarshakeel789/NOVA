import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <p className="px-6 py-6">Loading...</p>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
