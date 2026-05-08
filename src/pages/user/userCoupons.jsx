import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ShoppingCart, Heart, Ticket, MessageSquare, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-64 min-h-screen bg-black text-white flex flex-col items-center py-10">
      {/* Profile */}
      <div className="flex flex-col items-center mb-12">
{user?.avatar || user?.profilePicture ? (
  <img
    src={user.avatar || user.profilePicture}
    alt="Profile"
    className="w-20 h-20 rounded-full object-cover"
  />
) : (


          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
            {initials || "U"}
          </div>
        )}

        <h2 className="mt-4 text-lg font-semibold lowercase">
          {user?.fullName || "loading"}
        </h2>
        <p className="text-sm text-gray-400">Welcome back!</p>
      </div>

      {/* Navigation */}
      <div className="w-full px-6 space-y-4">
        <SidebarButton
  icon={<Home size={20} />}
  label="Home"
  onClick={() => navigate("/userHome")}
/>
        <SidebarButton
          icon={<ShoppingCart size={20} />}
          label="Orders"
          onClick={() => navigate("/userOrders")}
        />
        <SidebarButton
          icon={<Heart size={20} />}
          label="Wishlist"
          onClick={() => navigate("/userWishlist")}
        />
        <SidebarButton
          icon={<Ticket size={20} />}
          label="Coupons"
          onClick={() => navigate("/userCoupons")}
        />
        <SidebarButton
          icon={<MessageSquare size={20} />}
          label="Reviews"
          onClick={() => navigate("/userReview")}
        />
      </div>
    </div>
  );
};
const SidebarButton = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center gap-4
        px-5 py-3
        rounded-xl
        bg-gradient-to-r from-[#1c1c1c] to-[#111]
        hover:from-[#2a2a2a] hover:to-[#1a1a1a]
        transition
        shadow-md
      "
    >
      <span className="text-white">{icon}</span>
      <span className="font-semibold text-white">{label}</span>
    </button>
  );
};


const CouponPage = () => {
  const today = new Date();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedCoupons, setFetchedCoupons] = useState([]);
  
  const [popup, setPopup] = useState(null);

  useEffect(() => {
  if (!token) return;

  const fetchUser = async () => {
    try {
      const res = await fetch("https://footware-22xr.onrender.com/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);

    } catch (err) {
      console.error("User fetch failed:", err);
    }
  };

  fetchUser();
}, [token]);

useEffect(() => {
  if (!token) {
    console.log("No token yet");
    return;
  }

  const fetchCoupons = async () => {
    try {
      const res = await fetch("https://footware-22xr.onrender.com/api/coupons/public", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.log("STATUS:", res.status);
        const err = await res.json();
        console.log("ERROR:", err);
        return;
      }

      const data = await res.json();
      console.log("COUPONS RESPONSE 👉", data);
      setFetchedCoupons(data);

    } catch (err) {
      console.error(err);
    }
  };

  fetchCoupons();
}, [token]);





const filteredCoupons = Array.isArray(fetchedCoupons)
  ? fetchedCoupons.filter((coupon) =>
      coupon.code?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


const handleClaim = async (coupon) => {
  try {
    const res = await fetch("https://footware-22xr.onrender.com/api/coupons/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: coupon.code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setPopup(data.message);
      return;
    }

    const appliedCoupon = {
      code: coupon.code,
      discount: coupon.discount,
    };

    localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));

    setPopup(`Coupon ${coupon.code} applied successfully!`);

    // ✅ REFRESH COUPONS
    const refreshed = await fetch("https://footware-22xr.onrender.com/api/coupons/public", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const refreshedData = await refreshed.json();
    setFetchedCoupons(refreshedData);

    setTimeout(() => {
      setPopup(null);
      navigate("/cart");
    }, 1200);

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="flex w-full h-screen bg-[#fdf6e3] overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={user} />


      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-10 relative overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 w-full max-w-5xl">
          Coupons
        </h1>

        <div className="w-full max-w-5xl text-black mb-6">
          <input
            type="text"
            placeholder="Search coupons by title or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-xl shadow-sm"
          />
        </div>

        {popup && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce z-50">
            {popup}
          </div>
        )}

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon) => {
              const isExpired = new Date(coupon.expiry) < today;

const isUsed = coupon.usedBy?.some(
  (id) => id.toString() === user?._id
);
              

              return (
                <div
                  key={coupon._id}
                  className={`p-6 shadow-md rounded-2xl transition-all duration-300 border ${
                    isExpired ? "opacity-50 grayscale" : "bg-white"
                  }`}
                >
                  <h2 className="text-xl font-bold mb-2">
  {coupon.discount}% OFF
</h2>

                  <p className="text-gray-600 mb-2">
                    Code:{" "}
                    <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                      {coupon.code}
                    </span>
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-sm ${
                      isExpired ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {isExpired
                      ? "Expired"
                      : `Valid until ${format(
                          new Date(coupon.expiry),
                          "dd MMM yyyy"
                        )}`}
                  </span>
                  <div className="mt-4">
  <h3 className="font-semibold text-gray-700 mb-1">
    How to use
  </h3>
  <p className="text-sm text-gray-500">
    Use code <strong>{coupon.code}</strong> at checkout.
  </p>
</div>

{/* Show Claim Button if NOT used */}
{!isExpired && !isUsed && (
  <div className="mt-4">
    <button
      disabled={!user}
      onClick={() => handleClaim(coupon)}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl py-2 font-semibold"
    >
      Claim Now
    </button>
  </div>
)}

{/* Show Used Message */}
{isUsed && !isExpired && (
  <div className="mt-4 text-green-600 font-semibold">
    ✅ Redeemed
  </div>
)}

                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              {fetchedCoupons.length === 0 ? "Loading coupons..." : "No coupons found."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponPage;
