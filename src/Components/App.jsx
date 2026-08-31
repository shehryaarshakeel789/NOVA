import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import Navbar from "./Navbar.jsx";
import CustomerChat from "./CustomerChat.jsx";
import Main from "../pages/Main.jsx";
import Men from "../pages/Men";
import Women from "../pages/Women";
import Sale from "../pages/Sale";
import NewArrivals from "../pages/NewArrivals.jsx";
import Login from "../pages/Login.jsx";
import Cart from "../pages/Cart.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Profile from "../pages/Profile.jsx";
import Admin from "../pages/Admin.jsx";
import AdminRoute from "./AdminRoute.jsx";
import Checkout from "../pages/Checkout.jsx";
import OrderConfirmation from "../pages/OrderConfirmation.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import AdminOrders from "../pages/AdminOrders.jsx";
import AdminPromos from "../pages/AdminPromos.jsx";
import AdminUsers from "../pages/AdminUsers.jsx";
import Register from "../pages/Register.jsx";
import AdminAlerts from "../pages/AdminAlerts.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import OrderConfirmationPending from "../pages/OrderConfirmationPending.jsx";
import AdminChats from "../pages/AdminChats.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      try {
        await getCurrentUser();
        if (isMounted) {
          setIsLoggedIn(true);
        }
      } catch {
        if (isMounted) {
          setIsLoggedIn(false);
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element="Page not Found :(" />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/pending"
          element={
            <ProtectedRoute>
              <OrderConfirmationPending />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:id"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/promos"
          element={
            <AdminRoute>
              <AdminPromos />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/alerts"
          element={
            <AdminRoute>
              <AdminAlerts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/chats"
          element={
            <AdminRoute>
              <AdminChats />
            </AdminRoute>
          }
        />
      </Routes>
      <CustomerChat />
    </>
  );
}
