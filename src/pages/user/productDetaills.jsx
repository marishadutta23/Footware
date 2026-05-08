import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Send, Trash2, Pencil, Search, Menu, X, User } from "lucide-react";
import {useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";




// NOTE
// This file fixes the `useNavigate()` outside of a <Router> error by:
// 1) Moving the main component logic into `ProductPageInner` which uses `useNavigate()` normally.
// 2) Exporting a wrapper component (`ProductPage`) that checks whether the code
//    is already rendered inside a router using `useInRouterContext()`.
//    - If it is, we render ProductPageInner directly (no nested BrowserRouter).
//    - If it isn't, we wrap ProductPageInner in a BrowserRouter so `useNavigate` has a Router context.
// This keeps existing navigation behavior while preventing the runtime error when the component
// is rendered in environments that haven't wrapped the app with a Router.

function ProductPageInner() {
  console.log("🔥 ProductDetails component rendered");
    const { id } = useParams();
  console.log("PRODUCT ID FROM URL:", id);

  const [product, setProduct] = useState(null);
 const [relatedProducts, setRelatedProducts] = useState([]);

  const [wishlistIds, setWishlistIds] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [message, setMessage] = useState("");
  const [cartCount, setCartCount] = useState(0); // New state for cart count
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation (safe because this component will always be rendered inside a Router)



  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState(null);

const currentUserId = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"))?._id || null;
  } catch {
    return null;
  }
})();

 // Placeholder for the current logged-in user

 const token = localStorage.getItem("token");

useEffect(() => {
  if (!id) return;

  const fetchReviews = async () => {
    const res = await fetch(
      `http://localhost:5000/api/reviews/product/${id}`
    );
    const data = await res.json();
    setReviews(data);
  };

  fetchReviews();
}, [id]);


const [images, setImages] = useState([]);
const [mainImage, setMainImage] = useState("");

useEffect(() => {
  if (!id) return;

  const fetchProduct = async () => {
    const res = await fetch(`http://localhost:5000/api/products/${id}`);
    const data = await res.json();

    setProduct(data);

    // ✅ IMPORTANT FIX
    const imgs = Array.isArray(data.images) ? data.images : [];
    setImages(imgs);
    setMainImage(imgs[0] || "");
  };

  fetchProduct();
}, [id]);


useEffect(() => {
  const fetchWishlist = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/user/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setWishlistIds(data.map((item) => item._id));
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  fetchWishlist();
}, [token]);



 const handleAddReview = async () => {
  if (!newReviewText.trim()) return;

  try {
    const url = editingReviewId
      ? `http://localhost:5000/api/reviews/${editingReviewId}`
      : `http://localhost:5000/api/reviews/${id}`;

    const method = editingReviewId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating: newReviewRating,
        feedback: newReviewText,
      }),
    });

    if (!res.ok) throw new Error("Failed to save review");

    setNewReviewText("");
    setNewReviewRating(5);
    setEditingReviewId(null);

    // Refresh reviews
    const updated = await fetch(
      `http://localhost:5000/api/reviews/product/${id}`
    );
    setReviews(await updated.json());
  } catch (err) {
    console.error(err);
    alert("Failed to save review");
  }
};

const handleDeleteReview = async (reviewId) => {
  if (!window.confirm("Delete this review?")) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to delete review");

    // ✅ Remove from UI immediately
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  } catch (err) {
    console.error(err);
    alert("Failed to delete review");
  }
};




const handleEditReview = (review) => {
  setEditingReviewId(review._id);
  setNewReviewText(review.feedback);
  setNewReviewRating(review.rating);

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

useEffect(() => {
  if (!product?.category) return;

  const fetchRelated = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const all = await res.json();

    const related = all.filter(
      (p) => p._id !== product._id && p.category === product.category
    );

    setRelatedProducts(related.slice(0, 3));
  };

  fetchRelated();
}, [product]);

useEffect(() => {
  if (product && wishlistIds.includes(product._id)) {
    setIsWishlisted(true);
  } else {
    setIsWishlisted(false);
  }
}, [product, wishlistIds]);



  // This effect will close the dropdown if a click is detected outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleNextImage = () => {
  if (!images.length) return;
  const next = (currentImageIndex + 1) % images.length;
  setCurrentImageIndex(next);
  setMainImage(images[next]);
};

const handlePrevImage = () => {
  if (!images.length) return;
  const prev = (currentImageIndex - 1 + images.length) % images.length;
  setCurrentImageIndex(prev);
  setMainImage(images[prev]);
};



  
const getPriceInRupees = (price) => {
  const num = Number(price);
  if (isNaN(num)) return "Rs. --";
  return `₹${num.toLocaleString("en-IN")}`;
};



  // Updated function to also increment the cart count.
 const handleAddToCart = async () => {
  if (!selectedSize) {
    setMessage("Please select a size first.");
    return;
  }

  try {
    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        quantity: 1,
        size: selectedSize, // ✅ IMPORTANT (future-proof)
      }),
    });

    navigate("/cart");
  } catch (err) {
    console.error("Failed to add to cart", err);
    setMessage("Failed to add item to cart");
  }
};

  // This function handles the "Buy Now" action.
const handleBuyNow = async () => {
  if (!selectedSize) {
    setMessage("Please select a size first.");
    return;
  }

  try {
    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        quantity: 1,
        size: selectedSize,
      }),
    });

    navigate("/cart");
  } catch (err) {
    console.error("Buy now failed", err);
    setMessage("Failed to proceed");
  }
};



const handleToggleWishlist = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/user/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
      }),
    });

    if (!res.ok) throw new Error("Wishlist update failed");

    setIsWishlisted((prev) => !prev);
  } catch (err) {
    console.error(err);
  }
};

  // Handles viewing the cart
  const handleViewCart = () => {
    // Navigate to cart page
    navigate("/cart");
  };
  
  // Simulates navigation to a related product page
  const handleViewRelatedProduct = (productId) => {
    navigate(`/product/${productId}`); // Dynamic navigation
    // Scroll to the top to simulate loading a new product page
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // Custom Logo Component using Inline SVG
  const ShoeverseLogo = () => (
    <div className="flex items-center space-x-2">
      {/* Recreated Logo Icon as SVG */}
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path fillRule="evenodd" clipRule="evenodd" d="M 50 2 C 23.51 2 2 23.51 2 50 C 2 76.49 23.51 98 50 98 C 76.49 98 98 76.49 98 50 C 98 23.51 76.49 2 50 2 Z M 50 14 C 30.14 14 14 30.14 14 50 C 14 69.86 30.14 86 50 86 C 69.86 86 86 69.86 86 50 C 86 30.14 69.86 14 50 14 Z" fill="none" stroke="currentColor" strokeWidth="6"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M 50 50 L 50 50 L 50 50 Z M 20 50 C 20 34.02 34.02 20 50 20 L 50 80 C 34.02 80 20 65.98 20 50 Z M 50 80 C 65.98 80 80 65.98 80 50 L 20 50 C 20 65.98 34.02 80 50 80 Z" fill="none" stroke="currentColor" strokeWidth="6"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M 50 30 C 39.04 30 30 39.04 30 50 C 30 60.96 39.04 70 50 70 C 60.96 70 70 60.96 70 50 C 70 39.04 60.96 30 50 30 Z M 50 42 C 45.58 42 42 45.58 42 50 C 42 54.42 45.58 58 50 58 C 54.42 58 58 54.42 58 50 C 58 45.58 54.42 42 50 42 Z" fill="currentColor"/>
      </svg>
      {/* Brand Name and Tagline */}
      <div className="flex flex-col leading-none">
        <span className="text-xl sm:text-2xl font-bold tracking-widest uppercase">SOLEMATE</span>
        <span className="text-xs sm:text-sm font-light tracking-wider mt-1">STEP INTO STYLE</span>
      </div>
    </div>
  );

if (!product || !product._id) {
  return (
    <div className="min-h-screen flex items-center justify-center text-xl">
      Loading product details...
    </div>
  );
}




  return (
    // Updated: Increased padding (p-6 sm:p-12 lg:p-16) for a more desktop-focused layout on large screens.
    <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFE0B2] text-gray-900 min-h-screen p-6 sm:p-12 lg:p-16">
      
      {/* Navbar */}
      {/* Updated: Navbar background to a darker brown (#4A433B) with a backdrop-blur-sm for the glass effect. */}
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-12 py-4 z-20 bg-[#4A433B]/90 backdrop-blur-sm text-white shadow-lg">
        <div className="flex items-center space-x-6">
          {/* Replaced 'Shoeverse' text with the new Logo component */}
          <ShoeverseLogo />
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate("/")} className="hover:text-gray-300 text-sm">Home</button>
            <button onClick={() => navigate("/productsPage")} className="hover:text-gray-300 text-sm">Men</button>
            <button onClick={() => navigate("/productsPage")} className="hover:text-gray-300 text-sm">Women</button>
            <button onClick={() => navigate("/productsPage")} className="hover:text-gray-300 text-sm">Collections</button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            {/* Updated: Search input to dark background/text for contrast in the dark navbar */}
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-full border border-gray-400 bg-gray-700 text-white placeholder-gray-300 outline-none text-sm"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          </div>
          {/* Cart Icon with Badge - ADDED onClick HANDLER */}
          <div className="relative cursor-pointer" onClick={handleViewCart}>
            <a href="/cart">
            <ShoppingCart className="hover:text-gray-300 w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold animate-popIn">
                {cartCount}
                
              </span>
            )}
           </a> 
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="focus:outline-none"
            >
              <User className="cursor-pointer hover:text-gray-300 w-6 h-6" />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-700 text-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                <button onClick={() => navigate("/userOrders")} className="block px-4 py-2 hover:bg-gray-600 transition text-center">
                  Dashboard
                </button>
                <button onClick={() => navigate("/profile")} className="block px-4 py-2 hover:bg-gray-600 transition text-center">
                  Profile
                </button>
                <button onClick={() => navigate("/logout")} className="block px-4 py-2 hover:bg-gray-600 transition text-center">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        // Updated: Mobile menu background to dark taupe
        <div className="md:hidden fixed top-16 left-0 w-full bg-[#5D564D]/95 backdrop-blur-sm text-white px-4 py-3 space-y-2 z-10">
          <button onClick={() => navigate("/")} className="block hover:text-gray-300">Home</button>
          <button onClick={() => navigate("/men")} className="block hover:text-gray-300">Men</button>
          <button onClick={() => navigate("/women")} className="block hover:text-gray-300">Women</button>
          <button onClick={() => navigate("/collections")} className="block hover:text-gray-300">Collections</button>
          <div className="relative">
            {/* Updated: Search input in mobile menu */}
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-full border border-gray-500 bg-gray-800 text-white placeholder-gray-400 outline-none text-sm"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}
      
      {/* Message Box */}
      {message && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-lg bg-blue-600 text-white shadow-xl animate-slideIn">
          {message}
        </div>
      )}

      {/* Adjusted max-width to max-w-screen-2xl for a wider desktop view */}
      <div className="mt-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Product Image Gallery */}
        <div className="flex flex-col items-center">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl mb-6 min-h-[300px] bg-gray-100">
  {product.images?.length > 0 ? (
    <img
      src={mainImage || product.images[0]}
      alt={product.name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.src = "/placeholder.png";
      }}
    />
  ) : (
    <div className="flex items-center justify-center h-full text-gray-500">
      No image available
    </div>
  )}




            {/* Updated: Nav buttons kept dark for contrast */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-900/70 p-2 rounded-full transition"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-900/70 p-2 rounded-full transition"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-900/60 backdrop-blur-sm transition hover:bg-gray-800/60"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isWishlisted ? "text-pink-500 fill-pink-500" : "text-gray-300"
                }`}
              />
            </button>
          </div>
<div className="flex space-x-4 overflow-x-auto p-2">
  {images.length > 0 &&
    images.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={`thumb-${index}`}
        className={`w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl cursor-pointer border-2 ${
          img === mainImage ? "border-blue-500" : "border-transparent"
        }`}
        onClick={() => {
          setMainImage(img);
          setCurrentImageIndex(index);
        }}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.png";
        }}
      />
    ))}
</div>

        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6 text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {product.name}
          </h1>
          {/* Updated: Text color for brand */}
          <p className="text-gray-600 text-lg sm:text-xl font-medium">{product.brand || "Solemate"}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  // Updated: Star color for light mode
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                  }`}
                />
              ))}
              {/* Updated: Text color for reviews count */}
              <span className="ml-2 text-sm text-gray-600">({product.reviewsCount || 0} reviews)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{getPriceInRupees(product.price)}</p>
          </div>
          
          {/* Updated: Text color for description */}
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            {product.description}
          </p>
          
          {/* Size Selection */}
          <div>
            <h3 className="text-lg text-gray-500 font-semibold mb-2">Select Size:</h3>
<div className="flex flex-wrap gap-2">
  {product.sizes?.length > 0 ? (
    product.sizes.map((size) => (
      <button
        key={size}
        className={`w-10 h-10 rounded-full border ${
          selectedSize === size
            ? "bg-blue-600 text-white"
            : "border-gray-300"
        }`}
        onClick={() => setSelectedSize(size)}
      >
        {size}
      </button>
    ))
  ) : (
    <p className="text-gray-500 text-sm">No sizes available</p>
  )}
</div>

            <button
              onClick={() => setShowSizeChart(true)}
              className="text-amber-50 hover:underline mt-4 text-sm"
            >
              View Size Chart
            </button>
          </div>
          
          <div className="space-y-4">
{product.details?.length > 0 ? (
  product.details.map((detail, index) => (
    <div key={index}>
      <h3 className="text-lg font-semibold">{detail.title}</h3>
      <p className="text-gray-600">{detail.content}</p>
    </div>
  ))
) : (
  <p className="text-gray-500 text-sm">
    No additional product details available.
  </p>
)}

          </div>

          {/* Updated buttons with "Buy Now" and "Add to Cart" */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Updated: Separator color */}
      <hr className="my-12 border-gray-300" />
      
      {/* Customer Reviews Section */}
      <section className="max-w-screen-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Updated: Text color */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-10">Customer Reviews</h2>
        
        {/* Review Submission Form */}
        {/* Updated: Card background to white */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-12">
          <h3 className="text-xl font-semibold mb-6">Write a Review</h3>
          <div className="flex items-center space-x-2 mb-4 justify-center">
            <span className="text-sm">Rate this product:</span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 cursor-pointer transition ${
                  (i + 1) <= newReviewRating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                }`}
                onClick={() => setNewReviewRating(i + 1)}
              />
            ))}
          </div>
          {/* Updated: Textarea background and border for light mode */}
          <textarea
            className="w-full p-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
            rows="4"
            placeholder="Share your thoughts about this product..."
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddReview}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition"
            >
              <Send className="w-5 h-5" /> {editingReviewId ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </div>

        {/* Display Reviews */}
        <div className="space-y-8">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              // Updated: Review card background to white
              <div key={review._id} className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-lg">
  {review.user?.fullName}
</span>
                    <div className="flex ml-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.user?._id === currentUserId && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-2 rounded-full text-blue-600 hover:bg-gray-100 transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-2 rounded-full text-red-600 hover:bg-gray-100 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
                {/* Updated: Text color for review comment */}
                <p className="text-gray-700 leading-relaxed text-left">
                  {review.feedback}
                </p>
              </div>
            ))
          ) : (
            // Updated: Text color
            <p className="text-center text-gray-600">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </section>
      
      {/* Updated: Separator color */}
      <hr className="my-12 border-gray-300" />
      
      {/* Related Products Section */}
      <section className="max-w-screen-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Updated: Text color */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-left mb-10">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
{relatedProducts.map((product) => (
  <div
    key={product._id}   // ✅ ADD HERE
    className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105"
  >
    <img
      src={product.images?.[0] || product.image || "/placeholder.png"}
      alt={product.name}
      className="w-full h-56 object-cover"
      onError={(e) => {
        e.currentTarget.src = "/placeholder.png";
      }}
    />

    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>

      <p className="text-gray-700 font-bold text-lg">
        {getPriceInRupees(product.price)}
      </p>

      <button
        onClick={() => handleViewRelatedProduct(product._id)} // ✅ ADD HERE
        className="mt-4 w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition"
      >
        <ShoppingCart className="w-5 h-5" /> View Product
      </button>
    </div>
  </div>
))}

        </div>
      </section>
      
      {/* Size Chart Modal */}
      {showSizeChart && (
        // Updated: Modal backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          {/* Updated: Modal content background and text color */}
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl text-gray-900">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Shoe Size Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  {/* Updated: Table header background */}
                  <tr className="bg-gray-100">
                    <th className="p-3">US Size</th>
                    <th className="p-3">UK Size</th>
                    <th className="p-3">EU Size</th>
                    <th className="p-3">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Updated: Table row border color */}
                  <tr className="border-b border-gray-200">
                    <td className="p-3">6</td>
                    <td className="p-3">5.5</td>
                    <td className="p-3">38.5</td>
                    <td className="p-3">24</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">7</td>
                    <td className="p-3">6.5</td>
                    <td className="p-3">40</td>
                    <td className="p-3">25</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">8</td>
                    <td className="p-3">7.5</td>
                    <td className="p-3">41.5</td>
                    <td className="p-3">26</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">9</td>
                    <td className="p-3">8.5</td>
                    <td className="p-3">42.5</td>
                    <td className="p-3">27</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">10</td>
                    <td className="p-3">9.5</td>
                    <td className="p-3">44</td>
                    <td className="p-3">28</td>
                  </tr>
                  <tr>
                    <td className="p-3">11</td>
                    <td className="p-3">10.5</td>
                    <td className="p-3">45</td>
                    <td className="p-3">29</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Wrapper component: if the consumer already mounted this inside a Router, we won't create a nested BrowserRouter.
// If there's no Router in the ancestry, we wrap ProductPageInner in BrowserRouter so useNavigate() works.
export default function ProductPage() {
  return <ProductPageInner />;
}


