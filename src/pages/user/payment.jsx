import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";

const Payment = () => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [step, setStep] = useState("pay"); // 'pay', 'processing', 'success'
  const [loading, setLoading] = useState(false);
  
    const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if no state is present
  useEffect(() => {
    if (!location.state) {
      navigate("/cart");
    }
  }, [location.state, navigate]);

useEffect(() => {
  if (step !== "pay") return;
  if (timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft, step]);

useEffect(() => {
  if (timeLeft === 0) {
    alert("Payment session expired");
    navigate("/cart");
  }
}, [timeLeft, navigate]);

useEffect(() => {
  if (paymentMethod === "COD") {
    handleFinalizeOrder();
  }
}, []);


  if (!location.state) return null;

    const {
    user,
    products,
    cartTotal,
    paymentMethod,
    today,
    days,
    deliveryDate,
  } = location.state;

  const paymentMode = paymentMethod || "UPI";
  const storedCoupon = localStorage.getItem("appliedCoupon");
  const appliedCoupon = storedCoupon ? JSON.parse(storedCoupon) : null;

  // UPI Config
  const upiId = import.meta.env.VITE_UPI_ID || "merchant@upi";
  const name = import.meta.env.VITE_UPI_NAME || "SoleMate Store";
  const transactionRef = `TXN${Date.now()}`;
  const amount = Number(cartTotal).toFixed(2);

  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tr=${transactionRef}&tn=Order%20Payment`;

  const handleClose = () => {
    navigate("/cart");
  };

  const handleFinalizeOrder = async () => {
    setStep("processing");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        user: {
          username: user.username,
          email: user.email,
          address: user.address,
          phone: user.phone,
        },
        products,
        cartTotal,
        paymentMethod: paymentMode,
        appliedCouponCode: appliedCoupon?.code || null,
        transactionId: `UPI_${Date.now()}`,
        today,
        days: days.toString(),
        deliveryDate,
      };

      // 1. Create Order
      await axios.post(
        `${API_BASE_URL}/${API_ENDPOINTS.CHECKOUT_ORDER}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Clear Cart on server
      try {
        await axios.post(`${API_BASE_URL}/${API_ENDPOINTS.DELETE_ALLCART}`, { email: user.email });
      } catch (e) {
        console.error("Cart clear failed", e);
      }

      // 3. Clear local storage
      localStorage.removeItem("appliedCoupon");

      // 4. Success State
      setTimeout(() => {
        setStep("success");
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error("Order failed", error);
      alert(error.response?.data?.message || "Failed to create order");
      setStep("pay");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 font-sans">
      
      {/* --- PAYMENT MODAL (Step: pay) --- */}
      {step === "pay" && paymentMethod !== "COD" && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-sm animate-in fade-in zoom-in duration-300">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="opacity-0 w-6"></div> {/* Spacer */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-800">Scan to Pay</h2>
                <p className="text-slate-500 font-medium">Total: ₹{cartTotal}</p>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-slate-100 rounded-full transition">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="bg-white p-4 border-2 border-slate-100 rounded-2xl flex justify-center mb-6 shadow-sm">
              <QRCode
                value={upiLink}
                size={220}
                level="H"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-slate-500 leading-relaxed">
                Scan with any UPI app like <span className="font-semibold text-slate-700">GPay, PhonePe, or Paytm</span>
              </p>
              
              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs py-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Waiting for payment... ({formatTime(timeLeft)})</span>
              </div>

              <button
                onClick={handleFinalizeOrder}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
              >
                I've Completed the Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PROCESSING OVERLAY --- */}
      {step === "processing" && (
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-semibold">Verifying Payment...</h2>
        </div>
      )}

      {/* --- SUCCESS MODAL (Step: success) --- */}
      {step === "success" && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-sm p-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-50 p-4 rounded-full">
               <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2 uppercase">
            Payment Successful
          </h1>
          <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase">
            Order Placed
          </h2>
          
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Thank you for your purchase! <br /> Your order is being processed and will be delivered by <span className="font-bold text-slate-700">{deliveryDate}</span>.
          </p>

          <button
            onClick={() => navigate("/userHome")}
            className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-100"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;