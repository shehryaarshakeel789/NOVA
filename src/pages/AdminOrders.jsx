import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "@/api/orders";
import AdminSidebar from "@/Components/AdminSidebar";
import { useToast } from "@/context/ToastContext";
import Skeleton from "@/Components/Skeleton";
import SearchBar from "@/Components/SearchBar";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o._id.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Order status updated");
      await fetchOrders();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <AdminSidebar activeItem="Orders">
      <div className="px-6 py-8 mx-8">
        <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search..."
        />
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 font-mono text-xs">{order._id}</td>
                  <td className="py-2">{order.user?.name}</td>
                  <td className="py-2">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 capitalize"
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="capitalize"
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminSidebar>
  );
}

export default AdminOrders;
