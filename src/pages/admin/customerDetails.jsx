import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Star,
  Package,
  Ticket,
  Home,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  return (
    <div
      className={`bg-black text-white min-h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        {!collapsed && <h2 className="text-xl font-bold">Dashboard</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="mt-6 space-y-2">
        <a
  href="/dashboard"
  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-800 ${
    location.pathname === "/dashboard" ? "bg-gray-900 text-blue-400" : ""
  }`}
>
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </a>
        <a
  href="/productsManage"
  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-800 ${
    location.pathname === "/productsManage" ? "bg-gray-900 text-blue-400" : ""
  }`}
>
          <Package size={20} />
          {!collapsed && <span>Manage Products</span>}
        </a>
        <a
  href="/ordersManage"
  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-800 ${
    location.pathname === "/ordersManage" ? "bg-gray-900 text-blue-400" : ""
  }`}
>
          <ShoppingCart size={20} />
          {!collapsed && <span>Orders</span>}
        </a>
        <a
  href="/customer"
  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-800 ${
    location.pathname === "/customer" ? "bg-gray-900 text-blue-400" : ""
  }`}
>
          <Users size={20} />
          {!collapsed && <span>Customers</span>}
        </a>
        <a
  href="/couponsManage"
  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-800 ${
    location.pathname === "/couponsManage" ? "bg-gray-900 text-blue-400" : ""
  }`}
>
          <Ticket size={20} />
          {!collapsed && <span>Coupons</span>}
        </a>
        <a
  href="/reviewsManage"
  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-800 ${
    location.pathname === "/reviewsManage" ? "bg-gray-900 text-blue-400" : ""
  }`}
>
          <Star size={20} />
          {!collapsed && <span>Reviews</span>}
        </a>
      </nav>
    </div>
  );
};

const CustomerDetails = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate(); // ✅ ADD

  const handleHomeClick = () => {
    navigate("/home"); // or "/" if needed
   }; // or "/"

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}/admin/customers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCustomers(res.data.customers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="flex min-h-screen w-screen bg-[#fdf6e3]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 bg-[#fdf6e3] p-10">
<div className="flex justify-between items-center mb-8">
  <h2 className="text-4xl font-bold text-black">Customer Details</h2>

  {/* 🏠 Home Icon */}
  <Home
    onClick={handleHomeClick}
    title="Go to Home"
    className="w-7 h-7 cursor-pointer text-black hover:text-blue-500 hover:scale-110 transition"
  />
</div>

        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="w-full border-collapse text-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-left">Customer ID</th>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Phone</th>
                <th className="py-4 px-6 text-center">Orders</th>
                <th className="py-4 px-6 text-center">Total Spent (₹)</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">
                    CUST-{customer.id?.toString().slice(-3)}
                  </td>
                  <td className="py-4 px-6 font-semibold">{customer.name}</td>
                  <td className="py-4 px-6">{customer.email}</td>
                  <td className="py-4 px-6">{customer.phone}</td>
                  <td className="py-4 px-6 text-center">{customer.orders}</td>
                  <td className="py-4 px-6 text-center">
                    ₹{customer.total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
