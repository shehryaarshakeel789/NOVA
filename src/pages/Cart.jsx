import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Skeleton from "@/Components/Skeleton";

function Cart() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const { isLoggedIn } = useAuth();
  const toast = useToast();

  async function handleQuantityChange(itemId, quantity) {
    if (quantity < 1) return;
    try {
      await updateItem(itemId, quantity);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemove(itemId) {
    try {
      await removeItem(itemId);
      toast.success("Item removed");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-6 max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const validItems = cart?.items?.filter((item) => item.product) || [];

  if (validItems.length === 0) {
    return <p className="px-6 py-6">Your cart is empty.</p>;
  }

  const total = validItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {validItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 border rounded-xl p-4 bg-primary-foreground"
          >
            <img
              src={item.product.images?.[0]}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{item.product.name}</h2>
              {item.size && <p className="text-sm">Size: {item.size}</p>}
              <p className="text-sm">${item.product.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity - 1)
                  }
                  className="border rounded px-2"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                  className="border rounded px-2"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item._id)}
              className="text-sm text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right font-bold text-lg">
        Total: ${total.toFixed(2)}
      </div>

      {isLoggedIn ? (
        <Link
          to="/checkout"
          className="block mt-4 bg-black text-white text-center rounded-full py-3"
        >
          Proceed to Checkout
        </Link>
      ) : (
        <Link
          to="/login"
          className="block mt-4 bg-black text-white text-center rounded-full py-3"
        >
          Log In to Checkout
        </Link>
      )}
    </div>
  );
}

export default Cart;
