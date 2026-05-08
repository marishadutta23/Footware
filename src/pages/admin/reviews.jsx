import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Star,
  Package,
  Ticket,
  X,
  Home,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <div
      className={`bg-black text-white min-h-screen transition-all duration-300 fixed md:relative z-40 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        {!collapsed && <h2 className="text-2xl font-bold">Dashboard</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <nav className="mt-6 space-y-2 text-lg">
        <a href="/dashboard" className="flex items-center gap-4 px-6 py-3 hover:bg-gray-800">
          <LayoutDashboard size={22} />
          {!collapsed && <span>Dashboard</span>}
        </a>
        <a href="/productsManage" className="flex items-center gap-4 px-6 py-3 hover:bg-gray-800">
          <Package size={22} />
          {!collapsed && <span>Manage Products</span>}
        </a>
        <a href="/ordersManage" className="flex items-center gap-4 px-6 py-3 hover:bg-gray-800">
          <ShoppingCart size={22} />
          {!collapsed && <span>Orders</span>}
        </a>
        <a href="/customer" className="flex items-center gap-4 px-6 py-3 hover:bg-gray-800">
          <Users size={22} />
          {!collapsed && <span>Customers</span>}
        </a>
        <a href="/couponsManage" className="flex items-center gap-4 px-6 py-3 hover:bg-gray-800">
          <Ticket size={22} />
          {!collapsed && <span>Coupons</span>}
        </a>
        <a href="/reviewsManage" className="flex items-center gap-4 px-6 py-3 bg-gray-900">
          <Star size={22} />
          {!collapsed && <span>Reviews</span>}
        </a>
      </nav>
    </div>
  );
};

const ReviewPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate(); // ✅ ADD

  const handleHomeClick = () => {
    navigate("/productsPage"); // or "/"
  };

  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch("http://localhost:5000/api/reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
  console.error("Admin reviews fetch failed", await res.text());
  return;
}


      const data = await res.json();
      setReviews(data);
    };

    fetchReviews();
  }, [token]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-amber-100 via-white to-amber-200">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 text-black p-6 md:p-12 overflow-auto md:ml-0 ml-20">
<div className="flex justify-between items-center mb-12">
  <h2 className="text-3xl md:text-5xl font-bold">
    Customer Reviews
  </h2>

  {/* 🏠 Home Icon */}
  <Home
    onClick={handleHomeClick}
    title="Go to Home"
    className="w-7 h-7 cursor-pointer text-black hover:text-blue-500 hover:scale-110 transition"
  />
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              onClick={() => setSelectedReview(review)}
              className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-2xl"
            >
<h3>{review.user?.fullName || "Unknown User"}</h3>
<p>Product: {review.product?.name || "Deleted Product"}</p>


              <p className="text-yellow-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </p>

              <p className="text-gray-700 line-clamp-2">{review.feedback}</p>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

{selectedReview && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-black/70 text-white p-8 rounded-2xl max-w-3xl relative">
      <button
        onClick={() => setSelectedReview(null)}
        className="absolute top-4 right-4"
      >
        <X />
      </button>

      <h3 className="text-3xl font-bold mb-2">
        {selectedReview.user?.fullName || "Unknown User"}
      </h3>

      {/* ✅ ADD EMAIL HERE */}
      <p className="text-gray-300 mb-2">
        Email: {selectedReview.user?.email || "N/A"}
      </p>

      <p className="mb-2">
        Product: {selectedReview.product?.name || "Deleted Product"}
      </p>

      {/* ✅ FIX IMAGE FIELD */}
      <img
        src={selectedReview.product?.images?.[0] || "/placeholder.png"}
        className="w-32 h-32 object-cover rounded-lg my-4"
        alt="Product"
      />

      <p className="text-yellow-400 text-xl">
        {"★".repeat(selectedReview.rating)}
        {"☆".repeat(5 - selectedReview.rating)}
      </p>

      <p className="mt-4">{selectedReview.feedback}</p>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ReviewPage;
