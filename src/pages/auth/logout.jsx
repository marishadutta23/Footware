import React from "react";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear auth data
      localStorage.removeItem("token");

      // Redirect
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-b from-[#fdf6e3] to-[#f5f1e6] text-[#2d2d2d] p-6">
      <div className="bg-[#fffaf0] shadow-2xl rounded-2xl p-10 w-full max-w-md text-center animate-fadeInUp border border-[#e6dccf]">
        
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-8 rounded-full bg-red-200/40">
          <LogOut className="w-10 h-10 text-red-500" />
        </div>

        <h2 className="text-3xl font-bold mb-3 text-[#3b2f2f]">
          Confirm Logout
        </h2>

        <p className="text-[#6b5e5e] mb-8 text-lg">
          Are you sure you want to log out of your account?
        </p>

        <div className="flex space-x-6 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 rounded-lg bg-[#d6c7b3] hover:bg-[#c9b89f] transition text-lg text-[#f0ebeb]"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="px-8 py-3 rounded-lg bg-black hover:bg-gray-900 transition text-white font-semibold text-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
