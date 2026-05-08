import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  title = "Something went wrong",
  message = "An unexpected error has occurred. Please try again later.",
  onRetry,
}) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#fdf6e3] to-[#f5f1e6] text-[#2d2d2d] px-4">
      {/* Icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6 border border-red-200">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2 text-[#3b2f2f]">{title}</h1>

      {/* Message */}
      <p className="text-[#6b5e5e] text-center max-w-md mb-6">{message}</p>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-black hover:bg-gray-800 rounded-lg font-medium transition-colors text-white"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
