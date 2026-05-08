import { useLocation } from "react-router-dom";

import React, { useState, useEffect } from "react";
import { CreditCard, Smartphone, Wallet, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function PaymentOptions() {
  const [selected, setSelected] = useState("cod");
  const [cardType, setCardType] = useState("");
  const [upiApp, setUpiApp] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

const handleHomeNavigation = () => {
  if (userData?.role === "admin") {
    navigate("/cart");
  } else {
    navigate("/cart");
  }
};

  // ✅ Added a custom hook-like effect to track selection change
  useEffect(() => {
    if (selected) {
      console.log(`Payment option changed to: ${selected}`);
    }
  }, [selected]);

  const location = useLocation();
const {
  user,
  products,
  cartTotal,
  today,
  days,
  deliveryDate,
} = location.state || {};

const handleContinue = () => {
  if (!cartTotal || !products) {
    toast.error("Missing order data. Please go back to cart.");
    return;
  }

  navigate("/paymentqr", {
    state: {
      paymentMethod: selected === "upi" ? "UPI" : "COD",
      upiApp,
      user,
      products,
      cartTotal,
      today,
      days,
      deliveryDate,
    },
  });
};


  const cardOptions = [
    { value: "visa", label: "Visa", icon: "https://img.icons8.com/color/48/visa.png" },
    { value: "mastercard", label: "MasterCard", icon: "https://img.icons8.com/color/48/mastercard.png" },
    { value: "rupay", label: "RuPay", icon: "https://img.icons8.com/color/48/rupee.png" },
    { value: "amex", label: "American Express", icon: "https://img.icons8.com/color/48/amex.png" },
  ];

  const upiOptions = [
    { value: "gpay", label: "Google Pay", icon: "https://img.icons8.com/color/48/google-pay.png" },
    { value: "phonepe", label: "PhonePe", icon: "https://img.icons8.com/color/48/phonepe.png" },
    { value: "paytm", label: "Paytm", icon: "https://img.icons8.com/color/48/paytm.png" },
    { value: "bhim", label: "BHIM", icon: "https://img.icons8.com/color/48/india.png" },
  ];

  const getSelectedOption = () => {
    if (selected === "card") return cardOptions.find((o) => o.value === cardType);
    if (selected === "upi") return upiOptions.find((o) => o.value === upiApp);
    return null;
  };

  const chosen = getSelectedOption();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#FFF8E1] to-[#FFE0B2] flex items-center justify-center p-6 relative">
      <button
  onClick={handleHomeNavigation}
  className="absolute top-6 left-6 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl shadow-md hover:bg-gray-800 transition"
>
  <Home className="w-5 h-5" />
  Home
</button>
      <Toaster />
      <div className="bg-black shadow-lg rounded-2xl w-full max-w-3xl p-10 text-white">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Payment Option</h1>

        <div className="flex flex-col gap-6">
          <div
            onClick={() => setSelected("cod")}
            className={`flex items-center gap-4 p-5 rounded-xl cursor-pointer border transition ${
              selected === "cod" ? "bg-gray-900 border-green-400" : "bg-gray-900/60 border-gray-600 hover:border-green-300"
            }`}
          >
            <Wallet className="w-7 h-7 text-green-400" />
            <span className="text-lg font-medium">Cash on Delivery (COD)</span>
          </div>

          <div
            onClick={() => setSelected("card")}
            className={`flex flex-col gap-3 p-5 rounded-xl cursor-pointer border transition ${
              selected === "card" ? "bg-gray-900 border-green-400" : "bg-gray-900/60 border-gray-600 hover:border-green-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <CreditCard className="w-7 h-7 text-green-400" />
              <span className="text-lg font-medium">Credit / Debit Card</span>
            </div>

            {selected === "card" && (
              <div className="mt-2 space-y-2">
                {cardOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setCardType(opt.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${
                      cardType === opt.value ? "bg-gray-900 border-green-400" : "bg-gray-900/60 border-gray-600 hover:border-green-300"
                    }`}
                  >
                    <img src={opt.icon} alt={opt.label} className="w-6 h-6" />
                    <span>{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            onClick={() => setSelected("upi")}
            className={`flex flex-col gap-3 p-5 rounded-xl cursor-pointer border transition ${
              selected === "upi" ? "bg-gray-900 border-green-400" : "bg-gray-900/60 border-gray-600 hover:border-green-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <Smartphone className="w-7 h-7 text-green-400" />
              <span className="text-lg font-medium">UPI Payment</span>
            </div>

            {selected === "upi" && (
              <div className="mt-2 space-y-2">
                {upiOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setUpiApp(opt.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${
                      upiApp === opt.value ? "bg-gray-900 border-green-400" : "bg-gray-900/60 border-gray-600 hover:border-green-300"
                    }`}
                  >
                    <img src={opt.icon} alt={opt.label} className="w-6 h-6" />
                    <span>{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="mt-10 w-full bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-semibold text-xl transition flex items-center justify-center gap-3"
        >
          {chosen && <img src={chosen.icon} alt={chosen.label} className="w-6 h-6" />}
          Continue with {chosen ? chosen.label : selected.toUpperCase()}
        </button>
      </div>
    </div>
  );
}