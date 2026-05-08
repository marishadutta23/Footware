import React, { useState, useEffect } from "react";

import { ShoppingCart, Heart, Ticket, MessageSquare, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ user }) => {
  const [activeMenu, setActiveMenu] = useState("reviews");
  const navigate = useNavigate();
  

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-64 bg-black min-h-screen text-white flex flex-col items-center py-10">
      {/* Profile Section */}
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

      {/* Menu Items */}
      <div className="w-full space-y-4 px-6">
        <button
  onClick={() => {
    setActiveMenu("home");
    navigate("/userHome");
  }}
  className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg transition ${
    activeMenu === "home"
      ? "bg-blue-600"
      : "bg-[#111827] hover:bg-[#374151]"
  }`}
>
  <Home /> <span className="font-semibold">Home</span>
</button>
        <button
          onClick={() => navigate("/userOrders")}
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#111827] rounded-lg hover:bg-[#374151] transition"
        >
          <ShoppingCart /> <span className="font-semibold">Orders</span>
        </button>

        <button
          onClick={() => navigate("/userWishlist")}
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#111827] rounded-lg hover:bg-[#374151] transition"
        >
          <Heart /> <span className="font-semibold">Wishlist</span>
        </button>

        <button
          onClick={() => navigate("/userCoupons")}
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#111827] rounded-lg hover:bg-[#374151] transition"
        >
          <Ticket /> <span className="font-semibold">Coupons</span>
        </button>

        <button
          onClick={() => navigate("/userReview")}
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#111827] rounded-lg hover:bg-[#374151] transition"
        >
          <MessageSquare /> <span className="font-semibold">Reviews</span>
        </button>
      </div>
    </div>
  );
};

const MyReviewsPage = () => {
  const [user, setUser] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const token = localStorage.getItem("token");
useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (token) fetchUser();
}, [token]);

useEffect(() => {
  const fetchMyReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch my reviews");

      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (token) fetchMyReviews();
}, [token]);

  const CustomMessageModal = ({ message, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-sm text-center">
        <p className="text-gray-700 font-medium mb-6 text-lg">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );

const handleDelete = async (id) => {
  await fetch(`http://localhost:5000/api/reviews/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setReviews(reviews.filter((r) => r._id !== id));
  setShowDeleteMessage(true);
};

  return (
    <div className="flex w-full min-h-screen bg-[#fdf6e3]">
      {/* Sidebar */}
      <Sidebar user={user} />


      {/* Main Content */}
      <div className="flex-1 flex justify-center py-12 px-4 md:px-8">
        <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-6 md:p-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
            My Reviews
          </h1>

          {reviews.length > 0 ? (
            <div className="space-y-8">
{reviews.map((review) => (
  <div
    key={review._id}
    className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b pb-8 cursor-pointer"
    onClick={() => setSelectedReview(review)}
  >
<img
  src={review.product?.images?.[0] || review.product?.image || "/placeholder.png"}
  className="w-28 h-28 rounded-2xl object-cover"
/>


    <div className="flex-1">
      <h2 className="text-2xl font-semibold">
        {review.product?.name || "Product"}
      </h2>

      <p className="text-gray-600 mt-2">
        {review.feedback}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Reviewed on{" "}
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>

    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDelete(review._id);
      }}
      className="px-6 py-3 bg-red-600 text-white rounded-xl"
    >
      Delete Review
    </button>
  </div>
))}

            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg mt-12">
              You haven’t written any reviews yet.
            </p>
          )}
        </div>
      </div>

      {/* Review Details Popup */}
      {selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-60 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
              {selectedReview.product.name}
            </h2>
<img
  src={
    selectedReview.product?.images?.[0] ||
    selectedReview.product?.image ||
    "/placeholder.png"
  }
  alt={selectedReview.product?.name || "Product"}
  className="w-48 h-48 rounded-2xl object-cover shadow-lg mb-6 mx-auto"
/>

            <p className="text-gray-700 mb-6 text-lg">
  {selectedReview.feedback}
</p>

<p className="text-sm text-gray-500 text-center mb-8">
  Reviewed on{" "}
  {new Date(selectedReview.createdAt).toLocaleDateString()}
</p>

            <button
              onClick={() => setSelectedReview(null)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteMessage && (
        <CustomMessageModal
          message="Review deleted successfully!"
          onClose={() => setShowDeleteMessage(false)}
        />
      )}
    </div>
  );
};

export default MyReviewsPage;
