import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";


import { ShoppingCart, X, ArrowLeft, FileText, HelpCircle, Plus, Minus, Tag, Download, User, CheckCircle, AlertTriangle } from "lucide-react";

// --- Custom Modal Components for Compliance and UX ---

// 1. Reusable Modal for simple messages (replaces alert())
const MessageBox = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const icon = type === 'success' ? <CheckCircle className="w-8 h-8 text-green-500" /> : <AlertTriangle className="w-8 h-8 text-yellow-500" />;
  const title = type === 'success' ? 'Success!' : 'Oops!';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-100 border-t-4 border-b-4 border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">{icon} {title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-white py-2 rounded-lg font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// 2. Modal for simulated PDF Order Summary
const PdfModal = ({ items, finalTotal, onClose }) => {
  const date = new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-3xl font-extrabold text-[#8B4513] flex items-center gap-3">
            <FileText className="w-7 h-7" /> Order Summary PDF
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg font-medium">Date Generated: {date}</p>
          <p className="text-lg font-medium border-b pb-2">Order ID: #{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          
          <h4 className="text-xl font-bold mt-6 mb-3 text-gray-800">Items Ordered:</h4>
          <ul className="space-y-3">
            {items.map(item => (
              <li key={item.id} className="flex justify-between border-b border-dashed pb-2">
                <span>{item.title} (x{item.quantity})</span>
                <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-xl font-bold pt-4 text-gray-800">Final Billing:</h4>
          <div className="flex justify-between text-2xl font-extrabold text-[#8B4513] pt-2">
            <span>Total Payable:</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-white py-3 rounded-lg font-semibold text-lg transition"
        >
            Acknowledge & Close
          </button>
        </div>
      </div>
      </div>
  );
};

// 3. Modal for Address/Profile Check
const CheckoutAddressModal = ({ onClose, onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all scale-100 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Address Required!</h3>
        <p className="text-gray-600 mb-6">
          Please complete your shipping address and profile details before proceeding to checkout for all items.
        </p>

        <div className="space-y-4">
          <button
            onClick={onContinue}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" /> Go to Profile / Add Address
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold text-lg transition hover:bg-gray-100"
          >
            Maybe Later (Close)
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---



export default function App() {
  // Original states
const navigate = useNavigate();
    const token = localStorage.getItem("token");

const [cartItems, setCartItems] = useState([]);

  const [showHelp, setShowHelp] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);


  
useEffect(() => {
  if (!token) return;

  fetch("https://footware-22xr.onrender.com/api/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      const mappedItems = data.items.map(item => ({
        cartItemId: item._id,  
        id: item.product._id,
        title: item.product.name,
        category: item.product.category,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0],
      }));

      setCartItems(mappedItems);
    })
    .catch(err => {
      console.error("Failed to load cart", err);
    });
}, [token]);

useEffect(() => {
  const storedCoupon = localStorage.getItem("appliedCoupon");

  if (storedCoupon) {
    const parsed = JSON.parse(storedCoupon);

    // Convert % into decimal (5 → 0.05)
    setDiscountApplied(parsed.discount / 100);
    setCouponCode(parsed.code);
  }
}, []);

  // New states for the requested features
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [messageBox, setMessageBox] = useState({ show: false, message: '', type: 'info' });
  const [isProfileComplete, setIsProfileComplete] = useState(false); // New state to simulate profile/address completion

const handleQuantityChange = async (itemId, type) => {
  const item = cartItems.find(i => i.id === itemId);
  if (!item) return;

  const newQty =
    type === "increase" ? item.quantity + 1 : item.quantity - 1;

  if (newQty <= 0) return;

  await fetch(`https://footware-22xr.onrender.com/api/cart/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity: newQty }),
  });

  setCartItems(prev =>
    prev.map(i =>
      i.id === itemId ? { ...i, quantity: newQty } : i
    )
  );
};

  
const handleRemoveItem = async (cartItemId) => {
  await fetch(`https://footware-22xr.onrender.com/api/cart/${cartItemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setCartItems(prev =>
    prev.filter(item => item.cartItemId !== cartItemId)
  );
};



  // Recalculate totals using useMemo for efficiency
  const { total, baseDiscount, couponDiscount, tax, shipping, finalTotal } = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const baseDisc = subtotal * 0.1;
    const couponDisc = discountApplied
  ? subtotal * discountApplied
  : 0;

    const preTaxTotal = subtotal - baseDisc - couponDisc;
    const calculatedTax = preTaxTotal > 0 ? preTaxTotal * 0.05 : 0;
    const ship = 199;
    const final = preTaxTotal + calculatedTax + ship;

    return {
      total: subtotal,
      baseDiscount: baseDisc,
      couponDiscount: couponDisc,
      tax: calculatedTax,
      shipping: ship,
      finalTotal: final,
    };
  }, [cartItems, discountApplied]);

  // Handle Checkout (This is the logic that checks the profile status)
const handleCheckout = async () => {
  try {
    const res = await fetch("https://footware-22xr.onrender.com/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const hasAddress =
      typeof data.address === "string" &&
      data.address.trim().length > 0;

    

    if (hasAddress) {
      // ✅ Address exists → Payment page
      navigate("/payment", {
  state: {
    user: data,                 // profile data you just fetched
    products: cartItems,        // cart items
    cartTotal: finalTotal,      // total amount
    today: new Date().toISOString(),
    days: 5,
    deliveryDate: "2026-02-01",
  },
});

    } else {
      // ❌ No address → User Profile page
      navigate("/Profiles");
    }
  } catch (err) {
    console.error("Checkout failed:", err);
  }

};



  const handleBuyNow = (id) => handleCheckout({ singleItemId: id });
  
  // UPDATED: Navigate to home page ("/")
const handleBack = () => {
  navigate("/productsPage");
};

  
  const handlePdfGeneration = () => setShowPdfModal(true);

  // Apply Coupon (Updated to use MessageBox)
const applyCoupon = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("https://footware-22xr.onrender.com/api/coupons/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,   // 🔥 ADD THIS
      },
      body: JSON.stringify({ code: couponCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessageBox({
        show: true,
        message: data.message,
        type: "error",
      });
      return;
    }

    setDiscountApplied(data.discount / 100);

    setMessageBox({
      show: true,
      message: `Coupon applied: ${data.discount}% off`,
      type: "success",
    });

  } catch (err) {
    console.error(err);
  }
};


const removeCoupon = () => {
  localStorage.removeItem("appliedCoupon");
  setDiscountApplied(0);
  setCouponCode("");

  setMessageBox({
    show: true,
    message: "Coupon removed successfully",
    type: "info",
  });
};

  return (
    <div className="min-h-screen font-sans bg-[#F5F5DC] text-[#333] flex flex-col pt-6 overflow-x-hidden">
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
      
      {/* Modals/Pop-ups */}
      <MessageBox {...messageBox} onClose={() => setMessageBox({ show: false, message: '', type: 'info' })} />
      {showPdfModal && <PdfModal items={cartItems} finalTotal={finalTotal} onClose={() => setShowPdfModal(false)} />}
      {showCheckoutModal && (
        <CheckoutAddressModal
          onClose={() => setShowCheckoutModal(false)}
          onContinue={() => {
            // When the user clicks the button in the modal, it navigates to the profile page.
            navigate("/Profiles");
 
            
            setIsProfileComplete(true); // Simulates profile completion for the *next* checkout attempt
            setShowCheckoutModal(false);
            setMessageBox({ show: true, message: "Redirecting to Profile Page for address completion.", type: 'info' });
          }}
        />
      )}

      {/* Help Modal Simulation */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4 text-[#8B4513]">Help & Support</h3>
            <p className="mb-4 text-gray-700">For issues with your cart, please ensure product quantities are correct. Use the **SAVE5** coupon for an extra 5% discount!</p>
            <button
              onClick={() => setShowHelp(false)}
              className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-4 py-2 rounded-lg font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-6xl mb-10 flex flex-col sm:flex-row items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-lg font-medium bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#A0522D] transition w-full sm:w-auto mb-4 sm:mb-0"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Store
        </button>

        <div className="flex items-center gap-2 text-3xl sm:text-4xl font-bold text-center">
          <ShoppingCart className="text-[#8B4513] w-8 h-8 sm:w-10 sm:h-10" />
          Your Shopping Cart ({cartItems.length})
        </div>

        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-2 text-lg font-medium bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#A0522D] transition w-full sm:w-auto mt-4 sm:mt-0"
        >
          <HelpCircle className="w-5 h-5" /> Need Help
        </button>
      </div>

      {/* Layout Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Items and Coupon */}
        <div className="lg:col-span-2 space-y-6">

          {/* Coupon Section */}
          <div className="bg-[#fffaf0] rounded-2xl shadow-lg p-6 border-b-4 border-[#A0522D]">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="text-[#8B4513] w-6 h-6" />
              <h3 className="text-xl font-bold text-[#8B4513]">Have a Coupon?</h3>
              
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code (e.g. SAVE5)"
                className="border border-gray-300 rounded-lg px-4 py-3 flex-grow text-gray-700 focus:ring-2 focus:ring-[#8B4513] transition"
              />
              <button
                onClick={applyCoupon}
                className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0"
              >
                Apply
              </button>
            </div>
{discountApplied > 0 && (
  <div className="flex items-center justify-between mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
    <p className="text-green-700 font-semibold flex items-center gap-2">
      <CheckCircle className="w-4 h-4" />
      Coupon applied! Extra {discountApplied * 100}% discount added.
    </p>

    <button
      onClick={removeCoupon}
      className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
    >
      Remove
    </button>
  </div>
)}


          </div>

          {/* Cart Items List */}
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#fffaf0] rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-xl transition border-l-4 border-[#8B4513]"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img src={item.image} alt={item.title} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shadow-sm" />
                    <div className="flex-grow">
                      <h2 className="font-bold text-lg sm:text-xl">{item.title}</h2>
                      <p className="text-gray-500 text-sm">{item.category}</p>
                      <p className="text-[#8B4513] font-extrabold text-xl mt-1">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1 bg-[#fdf5e6] px-2 py-1 rounded-lg border border-gray-200">
                      <button
                        onClick={() => handleQuantityChange(item.id, "decrease")}
                        className="p-1 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4 text-[#8B4513]" />
                      </button>
                      <span className="font-medium text-lg w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, "increase")}
                        className="p-1 hover:bg-gray-200 rounded-lg"
                      >
                        <Plus className="w-4 h-4 text-[#8B4513]" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleBuyNow(item.id)}
                      className="bg-[#A0522D] hover:bg-[#8B4513] text-white px-4 py-2 rounded-lg font-medium text-base transition w-full sm:w-auto"
                    >
                      Buy Now
                    </button>

                    <button 
                        onClick={() => handleRemoveItem(item.cartItemId)}

                        className="p-2 hover:bg-red-100 rounded-lg transition border border-transparent hover:border-red-300"
                    >
                      <X className="text-red-500 w-5 h-5" />
                    </button>
                </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#fffaf0] p-10 text-center rounded-2xl shadow-lg">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 font-medium">Your cart is empty!</p>
            </div>
          )}
        </div>
        
        {/* Right Column: Summary and Actions */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Order Summary */}
          <div className="bg-[#fffaf0] rounded-2xl shadow-lg p-6 border-b-4 border-[#8B4513]">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="text-[#8B4513] w-6 h-6" />
              <h3 className="text-2xl font-bold text-[#8B4513]">Order Summary</h3>
            </div>
            <div className="text-lg space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount (10%):</span>
                <span className="text-green-600 font-medium">-₹{baseDiscount.toFixed(2)}</span>
              </div>
{discountApplied > 0 && (
  <div className="flex justify-between">
    <span>Coupon Discount ({discountApplied * 100}%):</span>
    <span className="text-green-600 font-medium">
      -₹{couponDiscount.toFixed(2)}
    </span>
  </div>
)}
              <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                <span>Tax (5%):</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">₹{shipping.toFixed(2)}</span>
              </div>
              <hr className="my-4 border-gray-300" />
              <div className="flex justify-between font-bold text-2xl">
                <span>Final Total:</span>
                <span className="text-[#8B4513]">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => handleCheckout()}
            disabled={cartItems.length === 0}
            className={`w-full px-10 py-4 rounded-xl font-semibold text-xl transition shadow-xl ${
              cartItems.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-700 hover:bg-green-800 text-white'
            }`}
          >
            Checkout All Items
          </button>
          
          {/* PDF Generator Button */}
          <button
            onClick={handlePdfGeneration}
            disabled={cartItems.length === 0}
            className={`w-full flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg transition shadow-md border-2 ${
              cartItems.length === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-[#8B4513] border-[#8B4513] hover:bg-[#FDF5E6]'
            }`}
          >
            <Download className="w-5 h-5" /> Generate Order PDF
          </button>
          
        </div>
        </div>
</div>
      </div>
  );
}
