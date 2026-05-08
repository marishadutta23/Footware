import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  Ticket,
  Home,
} from "lucide-react";

export default function OrderManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);

  const location = useLocation();

  const navigate = useNavigate();


const handleHomeClick = () => {
  navigate("/home"); // or "/" if needed
};

  // Simulate fetching orders from an API
  useEffect(() => {
  console.log("TOKEN:", localStorage.getItem("token"));

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://footware-22xr.onrender.com/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log("ORDERS RESPONSE:", data);

      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  fetchOrders();
}, []);




  const updateStatus = async (id, newStatus) => {
  await fetch(`https://footware-22xr.onrender.com/api/admin/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  setOrders((prev) =>
    prev.map((o) =>
      o._id === id ? { ...o, status: newStatus } : o
    )
  );
};


  return (
    <div className="flex w-screen h-screen bg-[#fdf6e3] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-black text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && <h2 className="text-lg font-bold">Dashboard</h2>}
          <button
            className="text-gray-300 bg-gray-900 p-1 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-6">
          <a
  href="/dashboard"
  className={`flex items-center space-x-3 px-3 py-2 rounded ${
    location.pathname === "/dashboard"
      ? "bg-gray-900 text-blue-400"
      : "text-gray-300 hover:text-blue-300"
  }`}
>
  <LayoutDashboard />
  {sidebarOpen && <span>Dashboard</span>}
</a>
          <a
  href="/productsManage"
  className={`flex items-center space-x-3 px-3 py-2 rounded ${
    location.pathname === "/productsManage"
      ? "bg-gray-900 text-blue-400"
      : "text-gray-300 hover:text-blue-300"
  }`}
>
            <Package />
            {sidebarOpen && <span>Manage Products</span>}
          </a>
          <a
  href="/ordersManage"
  className={`flex items-center space-x-3 px-3 py-2 rounded ${
    location.pathname === "/ordersManage"
      ? "bg-gray-900 text-blue-400"
      : "text-gray-300 hover:text-blue-300"
  }`}
>
            <ShoppingCart />
            {sidebarOpen && <span>Orders</span>}
          </a>
          <a
  href="/customer"
  className={`flex items-center space-x-3 px-3 py-2 rounded ${
    location.pathname === "/customer"
      ? "bg-gray-900 text-blue-400"
      : "text-gray-300 hover:text-blue-300"
  }`}
>
            <User />
            {sidebarOpen && <span>Customers</span>}
          </a>
          <a
  href="/couponsManage"
  className={`flex items-center space-x-3 px-3 py-2 rounded ${
    location.pathname === "/couponsManage"
      ? "bg-gray-900 text-blue-400"
      : "text-gray-300 hover:text-blue-300"
  }`}
>
            <Ticket />
            {sidebarOpen && <span>Coupons</span>}
          </a>
          <a
  href="/reviewsManage"
  className={`flex items-center space-x-3 px-3 py-2 rounded ${
    location.pathname === "/reviewsManage"
      ? "bg-gray-900 text-blue-400"
      : "text-gray-300 hover:text-blue-300"
  }`}
>
            <Star />
            {sidebarOpen && <span>Reviews</span>}
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full bg-[#fdf6e3] p-10 flex flex-col">
<div className="flex justify-between items-center mb-8">
  <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>

  <Home
    onClick={handleHomeClick}
    title="Go to Home"
    className="w-7 h-7 cursor-pointer text-black hover:text-blue-500 transition"
  />
</div>

        {/* Table Container */}
        <div className="bg-white shadow rounded-xl flex-1 overflow-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="text-gray-600 uppercase text-sm">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Products</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800 font-medium">{order._id}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-600">{order.user?.fullName}</td>
                  <td className="px-6 py-4 text-gray-700">
      {order.items.map((item, i) => (
         <div key={i} className="text-sm">
          {item.product?.name} × {item.quantity}
       </div>
       ))}
    </td>
                  <td className="px-6 py-4 text-gray-800">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border rounded-lg px-3 py-1 focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}