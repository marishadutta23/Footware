import React, { useState } from "react";
import { Mail, Send, Check } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (value) => {
    return /^\S+@\S+\.\S+$/.test(value);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  console.log("🚀 BUTTON CLICKED");

  if (!email) {
    setError("Please enter your email address.");
    return;
  }

  if (!isValidEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  try {
    setLoading(true);

    console.log("📡 Sending request to backend...");

    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    console.log("✅ Response:", data);

    if (!res.ok) throw new Error(data.message);

    setSuccess("Reset link sent! Check your inbox (and spam folder).");
    setEmail("");

  } catch (err) {
    //console.log("❌ ERROR:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fdf6e3] to-[#f5f1e6] p-6 w-screen text-[#2d2d2d]">
      <div className="w-full max-w-xl bg-[#fffaf0] backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-[#e6dccf]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#d6c7b3]">
            <Mail className="w-7 h-7 text-[#3b2f2f]" />
          </div>
          <div>
            <label className="block text-left">
              <h2 className="text-2xl font-semibold text-[#3b2f2f]">Forgot Password</h2>
              <p className="text-sm text-[#6b5e5e]">
                Enter your email and we'll send you a reset link.
              </p>
            </label>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600 border border-red-300">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-4 rounded-md bg-green-100 p-4 text-sm text-green-700 border border-green-300 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <div className="font-medium">Email sent</div>
              <div className="text-xs mt-1">{success}</div>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-left">
            <span className="text-sm text-[#6b5e5e]">Email address</span>
            <div className="mt-2 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pr-12 rounded-lg px-4 py-3 bg-[#f5f1e6] border border-[#674314] placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#d6c7b3]"
                aria-label="Email address"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </label>

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              className="flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-lg font-semibold transition"
              disabled={loading}
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <a href="/login" className="text-sm text-[#6b5e5e] hover:underline">
              Back to Login
            </a>
          </div>
        </form>

        <div className="mt-8 text-xs text-[#6b5e5e]">
          Tip: Check your spam folder if you don't see the email within a few minutes.
        </div>
      </div>
    </div>
  );
}
