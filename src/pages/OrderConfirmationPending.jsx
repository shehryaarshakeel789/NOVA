import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function OrderConfirmationPending() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("waiting");

  useEffect(() => {
    if (!sessionId) return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await fetch(
          `${API_URL}/api/orders/by-session/${sessionId}`,
          { credentials: "include" },
        );
        if (response.ok) {
          const order = await response.json();
          clearInterval(interval);
          window.location.href = `/order-confirmation/${order._id}`;
        }
      } catch {
        // keep polling
      }

      if (attempts >= 10) {
        clearInterval(interval);
        setStatus("timeout");
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <div className="px-6 py-16 text-center">
      {status === "waiting" ? (
        <>
          <p className="text-lg font-medium">Confirming your payment...</p>
          <p className="text-muted-foreground text-sm mt-2">
            This should only take a moment.
          </p>
        </>
      ) : (
        <>
          <p className="text-lg font-medium">
            This is taking longer than expected.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Check{" "}
            <Link to="/my-orders" className="underline">
              My Orders
            </Link>{" "}
            shortly, or contact support if the issue persists.
          </p>
        </>
      )}
    </div>
  );
}

export default OrderConfirmationPending;
