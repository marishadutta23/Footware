import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Ticket, MessageSquare, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ================= SIDEBAR (same as review) ================= */
const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const ADMIN_EMAIL = "forpublic5678@gmail.com";

  const handleHomeClick = () => {
    if (user?.email === ADMIN_EMAIL) {
      navigate("/home"); // Redirect Admin to Home/Dashboard
    } else {
      navigate("/userHome"); // Redirect regular user to User Home
    }
  };

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-64 bg-black min-h-screen text-white flex flex-col items-center py-10">
      <div className="flex flex-col items-center mb-10">
        {user?.avatar || user?.profilePicture ? (
          <img
            src={user.avatar || user.profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
            {initials || "U"}
          </div>
        )}

        <h2 className="text-lg font-semibold mt-3">
          {user?.fullName || "Loading..."}
        </h2>
        <p className="text-sm text-gray-400">Welcome back!</p>
      </div>

      <div className="w-full space-y-4 px-6">
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#111827] rounded-lg hover:bg-[#374151]"
        >
          <Home /> Home
        </button>
        <button
          onClick={() => navigate("/userOrders")}
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#111827] rounded-lg hover:bg-[#374151]"
        >
          <ShoppingCart /> Orders
        </button>

        <button
          onClick={() => navigate("/userWishlist")}
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#111827] rounded-lg hover:bg-[#374151]"
        >
          <Heart /> Wishlist
        </button>

        <button
          onClick={() => navigate("/userCoupons")}
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#111827] rounded-lg hover:bg-[#374151]"
        >
          <Ticket /> Coupons
        </button>

        <button
          onClick={() => navigate("/userReview")}
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#111827] rounded-lg hover:bg-[#374151]"
        >
          <MessageSquare /> Reviews
        </button>
      </div>
    </div>
  );
};

/* ================= ORDERS PAGE ================= */
const UserOrdersPage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  const token = localStorage.getItem("token");

  /* ===== Fetch user ===== */
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("https://footware-22xr.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    };
    if (token) fetchUser();
  }, [token]);

  /* ===== Fetch orders ===== */
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("https://footware-22xr.onrender.com/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    };
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="flex w-full min-h-screen bg-[#fdf6e3]">
      
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 flex justify-center py-12 px-4 md:px-8">
        <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-6 md:p-12">
          
          <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
            My Orders
          </h1>

          {orders.length > 0 ? (
            <div className="space-y-8">

              {orders.map((order) =>
  order.items.map((item) => {

    console.log(item.product); // ✅ correct

    return (
      <div
        key={item._id}
        className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b pb-8 cursor-pointer"
        onClick={() =>
          setSelectedOrderItem({ ...item, status: order.status })
        }
      >
        
        {/* IMAGE */}
<img
  src={item.image || "/placeholder.png"}
  className="w-28 h-28 rounded-2xl object-cover"
/>

        {/* DETAILS */}
        <div className="flex-1">
<h2 className="text-2xl font-semibold">
  {item.name}
</h2>
          <p className="text-gray-600 mt-2">
            Price: ₹{item.price}
          </p>

          <p className="text-gray-500 mt-1">
            Quantity: {item.quantity}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Ordered on{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* STATUS */}
        <span className="px-6 py-3 bg-green-600 text-white rounded-xl">
          {order.status}
        </span>
      </div>
    );
  })
)}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg mt-12">
              You have no orders yet.
            </p>
          )}
        </div>
      </div>

      {/* ================= POPUP (same as review) ================= */}
      {selectedOrderItem && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-xl text-center">
            
            <h2 className="text-3xl font-extrabold mb-4">
              {selectedOrderItem.name}
            </h2>

<img
  src={selectedOrderItem.image || "/placeholder.png"}
  className="w-48 h-48 rounded-2xl object-cover mx-auto mb-6"
/>

            <p className="text-lg mb-2">
              Price: ₹{selectedOrderItem.price}
            </p>

            <p className="text-lg mb-2">
              Quantity: {selectedOrderItem.quantity}
            </p>

            <p className="text-lg mb-4">
              Status: {selectedOrderItem.status}
            </p>

            <button
              onClick={() => setSelectedOrderItem(null)}
              className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;