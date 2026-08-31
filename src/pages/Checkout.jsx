import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, createCheckoutSession } from "@/api/orders";
import { validatePromo } from "@/api/promos";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const emptyAddress = {
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
};

function Checkout() {
  const [form, setForm] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const toast = useToast();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const validItems = cart?.items?.filter((item) => item.product) || [];
  const subtotal = validItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discountAmount = appliedPromo?.discountAmount || 0;
  const total = subtotal - discountAmount;

  async function handleApplyPromo() {
    if (!promoInput.trim()) return;
    setCheckingPromo(true);
    try {
      const result = await validatePromo(promoInput.trim(), subtotal);
      setAppliedPromo(result);
      toast.success(`Promo applied: ${result.code}`);
    } catch (err) {
      setAppliedPromo(null);
      toast.error(err.message);
    } finally {
      setCheckingPromo(false);
    }
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoInput("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPlacing(true);

    try {
      if (paymentMethod === "card") {
        const { url } = await createCheckoutSession(
          form,
          appliedPromo?.code || null,
        );
        window.location.href = url;
        return; // leaving the page entirely, no need to reset `placing`
      }

      const order = await createOrder(form, appliedPromo?.code || null);
      await refreshCart();
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      toast.error(err.message);
      setPlacing(false);
    }
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto grid md:grid-cols-2 gap-10 bg-primary-foreground my-10 rounded-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold mb-2">Shipping Address</h1>

        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
          <input
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 w-full"
        />

        <div>
          <p className="text-sm font-medium mb-2">Payment Method</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="text-sm">Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="text-sm">Pay by Card (Stripe)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={placing}
          className="bg-black text-white rounded-full py-3 w-full disabled:opacity-50"
        >
          {placing
            ? "Processing..."
            : paymentMethod === "card"
              ? "Continue to Payment"
              : "Place Order (Cash on Delivery)"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {validItems.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          {appliedPromo ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
              <span>
                Code <strong>{appliedPromo.code}</strong> applied
              </span>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="text-red-500 underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code"
                className="border rounded px-3 py-2 flex-1 text-sm"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={checkingPromo}
                className="border rounded px-4 py-2 text-sm disabled:opacity-50"
              >
                {checkingPromo ? "Checking..." : "Apply"}
              </button>
            </div>
          )}
        </div>

        <div className="border-t mt-4 pt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-1">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
