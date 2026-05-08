import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Menu,
  ChevronLeft,
  Users,
  Ticket,
  Home,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate(); // ✅ ADD THIS
  const location = useLocation();

  const handleHomeClick = () => {
    navigate("/home"); // or "/" if needed
  };

  const formatINR = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [salesData, setSalesData] = useState([
    { name: "Apr", sales: 0 },
    { name: "May", sales: 0 },
    { name: "Jun", sales: 0 },
    { name: "Jul", sales: 0 },
    { name: "Aug", sales: 0 },
    { name: "Sep", sales: 0 },
    { name: "Oct", sales: 0 },
    { name: "Nov", sales: 0 },
  ]);

  const [countryData, setCountryData] = useState([
    { country: "USA", sales: 0 },
    { country: "India", sales: 0 },
    { country: "UK", sales: 0 },
    { country: "Canada", sales: 0 },
  ]);
  //const [stats, setStats] = useState(null);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  fetchStats();
}, []);

// ✅ ADD THIS NEW USEEFFECT RIGHT HERE
useEffect(() => {
  const fetchCharts = async () => {
    try {
      const salesRes = await fetch(
        "http://localhost:5000/api/admin/sales",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const countryRes = await fetch(
        "http://localhost:5000/api/admin/countries",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const salesData = await salesRes.json();
      const countryData = await countryRes.json();

      setSalesData(salesData.sales);
      setCountryData(countryData.countries);
    } catch (error) {
      console.error("Chart fetch error", error);
    }
  };

  fetchCharts();
}, []);
  

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#fdf6e3]">
      {/* Sidebar */}
      <aside
        className={`$
          {sidebarOpen ? "w-64" : "w-20"}
        h-full bg-black text-white flex flex-col transition-all duration-500 ease-in-out transform`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 animate-fade-in">
          {sidebarOpen && <span className="text-xl font-bold">Dashboard</span>}
          <button
            className="text-gray-300 hover:text-white transition-transform transform hover:scale-110"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
<a
  href="/dashboard"
  className={`flex items-center space-x-2 p-2 rounded ${
    location.pathname === "/dashboard"
      ? "bg-gray-900 text-blue-400"
      : "text-gray-300 hover:bg-gray-800"
  }`}
>
  <LayoutDashboard className="w-5 h-5" />
  {sidebarOpen && <span>Dashboard</span>}
</a>
          <a
            href="/productsManage"
            className={`flex items-center space-x-2 p-2 rounded ${
              location.pathname === "/productsManage"
                ? "bg-gray-900 text-indigo-400"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Package className="w-5 h-5" />
            {sidebarOpen && <span>Manage Products</span>}
          </a>
          <a
            href="/ordersManage"
            className={`flex items-center space-x-2 p-2 rounded ${
              location.pathname === "/ordersManage"
                ? "bg-gray-900 text-indigo-400"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {sidebarOpen && <span>Orders</span>}
          </a>
          <a
            href="/customer"
            className={`flex items-center space-x-2 p-2 rounded ${
              location.pathname === "/customer"
                ? "bg-gray-900 text-indigo-400"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Users className="w-5 h-5" />
            {sidebarOpen && <span>Customers</span>}
          </a>
          <a
            href="/couponsManage"
            className={`flex items-center space-x-2 p-2 rounded ${
              location.pathname === "/couponsManage"
                ? "bg-gray-900 text-indigo-400"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Ticket className="w-5 h-5" />
            {sidebarOpen && <span>Coupons</span>}
          </a>
          <a
            href="/reviewsManage"
            className={`flex items-center space-x-2 p-2 rounded ${
              location.pathname === "/reviewsManage"
                ? "bg-gray-900 text-indigo-400"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Star className="w-5 h-5" />
            {sidebarOpen && <span>Reviews</span>}
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#fdf6e3] animate-fade-in">
        {/* Header */}
<header className="flex items-center justify-between px-8 py-6 bg-black text-white shadow-md animate-slide-down">
  <h2 className="text-xl font-bold">Admin Dashboard</h2>

  <Home
    onClick={handleHomeClick}
    className="w-7 h-7 cursor-pointer text-white hover:text-blue-400 transition"
  />
</header>

        {/* Dashboard Content */}
        <main className="flex-1 w-full p-6 overflow-y-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-4 transform transition duration-500 hover:scale-105 animate-fade-in">
              <h2 className="text-sm text-gray-500">Today's Money</h2>
              <p className="text-2xl text-black font-bold">
  {formatINR(stats?.todayMoney)}
</p>
              <span className="text-green-500 text-xs">+55% since yesterday</span>
            </div>
            <div className="bg-white rounded-xl shadow p-4 transform transition duration-500 hover:scale-105 animate-fade-in delay-100">
              <h2 className="text-sm text-gray-500">Today's Users</h2>
              <p className="text-2xl text-black font-bold">
  {stats?.todayUsers || 0}
</p>

              <span className="text-green-500 text-xs">+3% since last week</span>
            </div>
            <div className="bg-white rounded-xl shadow p-4 transform transition duration-500 hover:scale-105 animate-fade-in delay-200">
              <h2 className="text-sm text-gray-500">New Clients</h2>
              <p className="text-2xl text-black font-bold">
  {stats?.totalUsers || 0}
</p>
              <span className="text-red-500 text-xs">-2% since last quarter</span>
            </div>
            <div className="bg-white rounded-xl shadow p-4 transform transition duration-500 hover:scale-105 animate-fade-in delay-300">
              <h2 className="text-sm text-gray-500">Sales</h2>
              <p className="text-2xl text-black font-bold">
  {formatINR(stats?.totalSales)}
</p>
              <span className="text-green-500 text-xs">+5% than last month</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="bg-white rounded-xl shadow p-4 w-full animate-slide-up">
              <h2 className="font-semibold mb-4">Sales Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow p-4 w-full animate-slide-up delay-200">
              <h2 className="font-semibold mb-4">Sales by Country</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Bar dataKey="sales" fill="#34d399" isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.8s ease forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease forwards;
        }
        .animate-slide-down {
          animation: slideDown 0.8s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
