import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "@/api/orders";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p className="px-6 py-6">Loading orders...</p>;
  if (error) return <p className="px-6 py-6">{error}</p>;
  if (orders.length === 0)
    return <p className="px-6 py-6">You haven't placed any orders yet.</p>;

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto my-8 rounded-4xl bg-primary-foreground">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/order-confirmation/${order._id}`}
            className="block border rounded-xl p-4 hover:bg-zinc-50"
          >
            <div className="flex justify-between text-sm mb-1">
              <span className="font-mono">{order._id}</span>
              <span className="capitalize font-medium">{order.status}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
