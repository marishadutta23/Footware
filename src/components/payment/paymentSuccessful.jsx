import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function PaymentSuccess() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 1200);
    
    // Trigger confetti animation
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#F5F5DC] flex items-center justify-center p-6 overflow-hidden">
      <div className="bg-[#FFF8E7] shadow-lg rounded-2xl w-full max-w-lg p-10 text-center text-[#3C2F2F] animate-fade-in relative border border-[#E3D5CA]">
        {/* Success Icon with Scale Animation */}
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500 animate-scale-in" />
        </div>

        {/* Animated Text */}
        {showText && (
          <div className="mt-6 animate-slide-up">
            <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
            <p className="text-[#5C4033] mb-8">
              Thank you for your purchase! Your payment has been processed successfully.
            </p>

            {/* Button */}
            <button
              onClick={() => (window.location.href = "/productsPage")}
              className="w-full bg-[#5C4033] hover:bg-[#3C2F2F] text-white py-4 rounded-xl font-semibold text-lg transition"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 1s ease-in-out; }
        .animate-scale-in { animation: scaleIn 1s ease-out; }
        .animate-slide-up { animation: slideUp 1s ease-out; }
      `}</style>
    </div>
  );
}
