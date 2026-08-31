import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLowStockProducts } from "@/api/products";
import AdminSidebar from "@/Components/AdminSidebar";
import { useToast } from "@/context/ToastContext";
import Skeleton from "@/Components/Skeleton";

function AdminAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      try {
        const data = await getLowStockProducts(5);
        setAlerts(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  return (
    <AdminSidebar activeItem="Alerts">
      <div className="px-6 py-8 mx-8">
        <h1 className="text-2xl font-bold mb-2">Low Stock Alerts</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Products with fewer than 5 units remaining in a given size.
        </p>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <p className="text-muted-foreground">
            Nothing to worry about — all sizes are well stocked.
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <Link
                key={`${alert.productId}-${alert.size}-${i}`}
                to={`/product/${alert.productId}`}
                className="flex items-center gap-4 border rounded-xl p-3 hover:bg-zinc-50"
              >
                <img
                  src={alert.image}
                  alt={alert.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium">{alert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Size: {alert.size}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    alert.stock === 0
                      ? "bg-zinc-200 text-zinc-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {alert.stock === 0 ? "Out of stock" : `${alert.stock} left`}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}

export default AdminAlerts;
