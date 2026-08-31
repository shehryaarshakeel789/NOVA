import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "@/api/orders";

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) return <p className="px-6 py-6">Loading...</p>;
  if (error) return <p className="px-6 py-6">{error}</p>;
  if (!order) return null;

  return (
    <div className="px-6 py-10 max-w-xl mx-auto text-center bg-primary-foreground my-8 rounded-4xl">
      <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
      <p className="text-muted-foreground mb-6">
        Thanks, {order.shippingAddress.fullName} — your order has been received.
      </p>

      <div className="border rounded-2xl p-6 text-left space-y-3">
        <p className="text-sm text-muted-foreground">Order ID</p>
        <p className="font-mono text-sm">{order._id}</p>

        {order.items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        {order.discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({order.promoCode})</span>
            <span>-${order.discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/" className="inline-block mt-6 underline">
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderConfirmation;
