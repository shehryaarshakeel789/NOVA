import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getRevenueStats,
  getTopProducts,
  getOrdersByStatus,
} from "@/api/stats";
import AdminSidebar from "@/Components/AdminSidebar";
import { useToast } from "@/context/ToastContext";
import Skeleton from "@/Components/Skeleton";

const STATUS_COLORS = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

function AdminDashboard() {
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [revenueData, topProductsData, statusData] = await Promise.all([
          getRevenueStats(),
          getTopProducts(),
          getOrdersByStatus(),
        ]);
        setRevenue(revenueData);
        setTopProducts(topProductsData);
        setStatusStats(statusData);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [toast]);

  const totalRevenue = revenue.reduce((sum, d) => sum + d.totalRevenue, 0);
  const totalOrders = revenue.reduce((sum, d) => sum + d.orderCount, 0);

  return (
    <AdminSidebar activeItem="Dashboard">
      <div className="px-6 py-8 mx-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-2xl p-5">
                <p className="text-sm text-muted-foreground">
                  Revenue (last 30 days)
                </p>
                <p className="text-3xl font-bold mt-1">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="border rounded-2xl p-5">
                <p className="text-sm text-muted-foreground">
                  Orders (last 30 days)
                </p>
                <p className="text-3xl font-bold mt-1">{totalOrders}</p>
              </div>
            </div>

            <div className="border rounded-2xl p-5">
              <h2 className="font-semibold mb-4">Revenue Over Time</h2>
              {revenue.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No orders in the last 30 days yet.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="totalRevenue"
                      stroke="#00bb28"
                      strokeWidth={5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-2xl p-5">
                <h2 className="font-semibold mb-4">Top Selling Products</h2>
                {topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No sales data yet.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={topProducts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={110}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="totalSold"
                        fill="#5700e4"
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="border rounded-2xl p-5">
                <h2 className="font-semibold mb-4">Orders by Status</h2>
                {statusStats.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No orders yet.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={statusStats}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={(entry) => `${entry.status} (${entry.count})`}
                      >
                        {statusStats.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={STATUS_COLORS[entry.status] || "#999999"}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}

export default AdminDashboard;
