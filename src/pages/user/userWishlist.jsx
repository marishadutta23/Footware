import React, { useState, useEffect } from "react";
import { Heart, Trash2, ShoppingCart, Ticket, MessageSquare, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
// Sidebar Component
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  

  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const menuItems = [
    { label: "Home", icon: <Home />, path: "/userHome" },
    { label: "Orders", icon: <ShoppingCart />, path: "/userOrders" },
    { label: "Wishlist", icon: <Heart />, path: "/userWishlist" },
    { label: "Coupons", icon: <Ticket />, path: "/userCoupons" },
    { label: "Reviews", icon: <MessageSquare />, path: "/userReview" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://footware-22xr.onrender.com/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchProfile();
  }, [token]);
// 👇 ADD THIS FUNCTION RIGHT HERE
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-64 bg-black h-screen text-white flex flex-col items-center py-10">
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold overflow-hidden">
{user?.avatar || user?.profilePicture ? (
  <img
    src={user.avatar || user.profilePicture}
    alt={user.fullName}
    className="w-full h-full object-cover"
  />
) : (
    <span>{getInitials(user?.fullName)}</span>
  )}
</div>

        <h2 className="text-lg font-semibold mt-3">
  {user ? user.fullName : "Loading..."}
</h2>

        <p className="text-sm text-gray-400">Welcome back!</p>
      </div>

      <div className="w-full space-y-4 px-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg transition ${
                isActive ? "bg-blue-600" : "bg-gray-900 hover:bg-[#374151]"
              }`}
            >
              {item.icon} <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("https://footware-22xr.onrender.com/api/user/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchWishlist();
  }, [token]);

  const handleRemove = async (id) => {
    try {
      await fetch(`https://footware-22xr.onrender.com/api/user/wishlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

const addToWishlist = async (productId) => {
  await fetch("https://footware-22xr.onrender.com/api/user/wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
};


const handleAddToCart = async (item) => {
  try {
    const res = await fetch("https://footware-22xr.onrender.com/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: item._id,
        size: item.sizes?.[0] || "M", // ✅ VERY IMPORTANT
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    toast.success(data.message);

  } catch (err) {
    console.error(err);
    toast.error("Failed to add to cart ❌");
  }
};


  return (
    <div className="flex w-screen min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#FFE0B2] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 p-10 overflow-y-auto text-gray-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
            <Heart className="text-red-500 w-8 h-8" /> My Wishlist
          </h1>

          {loading ? (
            <p className="text-center text-gray-600 text-xl">Loading wishlist...</p>
          ) : wishlist.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
              <p className="text-gray-600 text-xl">Your wishlist is empty 💔</p>
              <button
                onClick={() => navigate("/productsPage")}
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-md"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-4 flex flex-col transform hover:-translate-y-1"
                >
                  <div className="relative w-full h-48 overflow-hidden rounded-xl mb-4">
<img
  src={item.images?.[0] || "/placeholder.png"}
  alt={item.name}
  className="w-full h-full object-cover"
  onError={(e) => {
    e.currentTarget.src = "/placeholder.png";
  }}
/>

                    <button
                      onClick={() => handleRemove(item._id)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>

                  <div className="flex flex-col flex-1 space-y-2">
                    <p className="text-sm text-gray-500">{item.brand}</p>
                    <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                    <p className="mt-auto text-blue-600 font-bold text-lg">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition shadow-md"
                    >
                      <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
