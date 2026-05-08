import React, { useState } from "react";
import { ShoppingCart, Heart, Ticket, MessageSquare, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("orders");

  const renderContent = () => {
    switch (activeMenu) {
      case "orders":
        return <div className="p-6">Your recent orders will appear here.</div>;
      case "wishlist":
        return <div className="p-6">Your wishlist items will appear here.</div>;
      case "coupons":
        return <div className="p-6">Your available coupons will appear here.</div>;
      case "reviews":
        return <div className="p-6">Your submitted reviews will appear here.</div>;
      default:
        return <div className="p-6">Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg hidden md:flex flex-col">
        {/* User Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col items-center">
          <img
            src="https://placehold.co/80x80/667EEA/ffffff?text=JD"
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500 shadow-md mb-3"
          />
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Jane Doe</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back!</p>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          <button
  onClick={() => {
    setActiveMenu("home");
    navigate("/userHome");
  }}
  className={`flex items-center w-full px-4 py-2 rounded-lg font-medium transition duration-200 ${
    activeMenu === "home"
      ? "bg-indigo-500 text-white"
      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
  }`}
>
  <Home className="mr-3" size={20} /> Home
</button>
          <button
            onClick={() => setActiveMenu("orders")}
            className={`flex items-center w-full px-4 py-2 rounded-lg font-medium transition duration-200 ${
              activeMenu === "orders"
                ? "bg-indigo-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <ShoppingCart className="mr-3" size={20} /> Orders
          </button>

          <button
            onClick={() => setActiveMenu("wishlist")}
            className={`flex items-center w-full px-4 py-2 rounded-lg font-medium transition duration-200 ${
              activeMenu === "wishlist"
                ? "bg-indigo-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Heart className="mr-3" size={20} /> Wishlist
          </button>

          <button
            onClick={() => setActiveMenu("coupons")}
            className={`flex items-center w-full px-4 py-2 rounded-lg font-medium transition duration-200 ${
              activeMenu === "coupons"
                ? "bg-indigo-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Ticket className="mr-3" size={20} /> Coupons
          </button>

          <button
            onClick={() => setActiveMenu("reviews")}
            className={`flex items-center w-full px-4 py-2 rounded-lg font-medium transition duration-200 ${
              activeMenu === "reviews"
                ? "bg-indigo-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <MessageSquare className="mr-3" size={20} /> Reviews
          </button>
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-white dark:bg-gray-800 p-2 border-t border-gray-200 dark:border-gray-700 flex justify-around">
        <button onClick={() => setActiveMenu("orders")} className={activeMenu === "orders" ? "text-indigo-500" : "text-gray-500"}>
          <ShoppingCart size={22} />
        </button>
        <button onClick={() => setActiveMenu("wishlist")} className={activeMenu === "wishlist" ? "text-indigo-500" : "text-gray-500"}>
          <Heart size={22} />
        </button>
        <button onClick={() => setActiveMenu("coupons")} className={activeMenu === "coupons" ? "text-indigo-500" : "text-gray-500"}>
          <Ticket size={22} />
        </button>
        <button onClick={() => setActiveMenu("reviews")} className={activeMenu === "reviews" ? "text-indigo-500" : "text-gray-500"}>
          <MessageSquare size={22} />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-white dark:bg-white text-black rounded-tl-xl md:rounded-none shadow-inner overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
