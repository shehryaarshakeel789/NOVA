import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "@/api/user";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import AdminSidebar from "@/Components/AdminSidebar";
import Skeleton from "@/Components/Skeleton";
import SearchBar from "@/Components/SearchBar";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, role) {
    try {
      await updateUserRole(userId, role);
      toast.success("Role updated");
      await fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <AdminSidebar activeItem="Users">
      <div className="px-6 py-8 mx-8">
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search..."
        />

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Joined</th>
                <th className="py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isSelf = user._id === currentUser._id;
                return (
                  <tr key={user._id} className="border-b">
                    <td className="py-2">
                      {user.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      <select
                        value={user.role}
                        disabled={isSelf}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 capitalize disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminSidebar>
  );
}

export default AdminUsers;
