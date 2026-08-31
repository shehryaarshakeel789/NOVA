import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  if (!user) return null;

  return (
    <div className="px-6 py-10 max-w-md mx-auto bg-primary-foreground my-8 rounded-4xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="border border-3 rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Role</p>
          <p className="font-medium capitalize">{user.role}</p>
        </div>
      </div>

      <Link
        to="/my-orders"
        className="block mt-4 text-center border border-3 rounded-full py-2 bg-primary-foreground"
      >
        View My Orders
      </Link>

      <button
        onClick={handleLogout}
        className="mt-3 w-full bg-black text-white rounded-full py-2"
      >
        Log Out
      </button>
    </div>
  );
}

export default Profile;
