import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  Plus,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  TicketPercent,
  Home,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <div
      className={`bg-black text-white h-screen transition-all duration-300 ${
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
        <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800">
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </a>
        <a href="/productsManage" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800">
          <Package size={20} />
          {!collapsed && <span>Manage Products</span>}
        </a>
        <a href="/ordersManage" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800">
          <ShoppingCart size={20} />
          {!collapsed && <span>Orders</span>}
        </a>
        <a href="/customer" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800">
          <User size={20} />
          {!collapsed && <span>Customers</span>}
        </a>
        <a href="/couponsManage" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 bg-gray-900">
          <TicketPercent size={20} />
          {!collapsed && <span>Coupons</span>}
        </a>
        <a href="/reviewsManage" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800">
          <Star size={20} />
          {!collapsed && <span>Reviews</span>}
        </a>
      </nav>
    </div>
  );
};

const CouponsManage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

const handleHomeClick = () => {
  navigate("/home"); // or "/" if needed
};

  const [collapsed, setCollapsed] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expiry: "",
  });

  // ✅ ADD THIS EXACTLY HERE
  /*useEffect(() => {
    const fetchCoupons = async () => {
      const res = await fetch("https://footware-22xr.onrender.com/api/coupons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCoupons(data);
    };

    fetchCoupons();
  }, []);*/
const fetchCoupons = async () => {
  try {
    const res = await fetch("https://footware-22xr.onrender.com/api/coupons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setCoupons(data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchCoupons();
}, []);


  const handleDelete = async (id) => {
  await fetch(`https://footware-22xr.onrender.com/api/coupons/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setCoupons(coupons.filter((c) => c._id !== id));
};

  const handleAdd = () => {
    setEditCoupon(null);
    setFormData({ code: "", discount: "", expiry: "" });
    setShowForm(true);
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setFormData(coupon);
    setShowForm(true);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    expiry: new Date(formData.expiry),
  };

  const url = editCoupon
    ? `https://footware-22xr.onrender.com/api/coupons/${editCoupon._id}`
    : "https://footware-22xr.onrender.com/api/coupons";

  const method = editCoupon ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    alert(err.message);
    return;
  }

  setShowForm(false);
  fetchCoupons();
};



  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gradient-to-br from-amber-100 via-white to-amber-200">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className="flex-1 h-screen p-6 overflow-y-auto">
        {/* Header */}
<div className="flex justify-between items-center mb-6">
  <h2 className="text-3xl font-bold text-gray-900">Coupon Management</h2>

  <div className="flex items-center gap-4">
    {/* 🏠 Home Button */}
<Home
  onClick={handleHomeClick}
  title="Go to Home"
  className="w-7 h-7 cursor-pointer text-black hover:text-blue-500 transition"
/>
    {/* ➕ Add Coupon */}
    <button
      onClick={handleAdd}
      className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 flex items-center gap-2"
    >
      <Plus size={18} /> Add New Coupon
    </button>
  </div>
</div>

        {/* Coupons Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="py-3 px-4 text-center">Coupon Code</th>
                <th className="py-3 px-4 text-center">Discount (%)</th>
                <th className="py-3 px-4 text-center">Expiry Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{coupon.code}</td>
                  <td className="py-3 px-4 text-center">{coupon.discount}%</td>
                  <td className="py-3 px-4 text-center">{coupon.expiry}</td>
                  <td className="py-3 px-4 flex gap-3 justify-center">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-amber-50 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-amber-50 hover:text-red-500 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Add/Edit */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-black">
                {editCoupon ? "Edit Coupon" : "Add New Coupon"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="w-full border p-2 rounded text-black"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  className="w-full border p-2 rounded text-black"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                  required
                />
                <input
                  type="date"
                  className="w-full border p-2 rounded text-black"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  {editCoupon ? "Update Coupon" : "Add Coupon"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsManage;
