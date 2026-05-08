import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { ShoppingCart, User, Search, Filter, X, Home, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

// Renaming the core logic component to ProductPageInner
function ProductPageInner() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const navigate = useNavigate();

let user = null;

try {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    user = JSON.parse(storedUser);
  }
} catch (err) {
  console.error("Invalid user in localStorage");
  user = null;
}

  const token = localStorage.getItem("token");
  const [wishlistIds, setWishlistIds] = useState([]);
const role = user?.role;
const goToDashboard = () => {
  if (role === "admin") {
    navigate("/dashboard");
  } else {
    navigate("/userOrders");
  }
};

const goToProfile = () => {
  if (role === "admin") {
    navigate("/profile");
  } else {
    navigate("/Profiles");
  }
};
const handleHomeNavigation = () => {


  if (!user) {
    navigate("/login");
    return;
  }

  if (role === "admin") {
    console.log("ADMIN NAV");
    navigate("/home");
  } else {
    console.log("USER NAV");
    navigate("/userHome");
  }
};

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        console.log("FETCHED PRODUCTS 👉", data);
        setProducts(data);
      } catch (err) {
        console.error("Product fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setWishlistIds(data.map((item) => item._id));
    } catch (err) {
      console.error(err);
    }
  };

  if (token) fetchWishlist();
}, [token]);

  // ✅ LOADING CHECK GOES HERE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading products...
      </div>
    );
  }

  // 👇 NOW write filteredProducts, functions, JSX return

const filteredProducts = products
  .filter((product) => {
    // 🔍 SEARCH LOGIC
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (filterCategory !== "all" && product.category !== filterCategory)
      return false;

    if (filterType !== "all" && product.type !== filterType)
      return false;

    return true;
  })
  .sort((a, b) => {
    if (sortBy === "low") return a.price - b.price;
    if (sortBy === "high") return b.price - a.price;
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });




 const convertToRupees = (price) => {
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

  

  
  const handleViewCart = () => {
    navigate('/cart');
  };
  
  // Filter controls logic abstracted for reuse in sidebar and modal
  const FilterControls = ({ closeMenu }) => (
    <>
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-700 border-b border-gray-200 pb-1">Category</h3>
        <ul className="space-y-2 text-amber-50">
          <li><button className={`w-full text-left hover:text-blue-300 transition ${filterCategory === "all" && "font-bold text-gray-400"}`} onClick={() => {setFilterCategory("all"); closeMenu && closeMenu();}}>All</button></li>
          <li><button className={`w-full text-left hover:text-blue-300 transition ${filterCategory === "men" && "font-bold text-gray-40000"}`} onClick={() => {setFilterCategory("men"); closeMenu && closeMenu();}}>Men</button></li>
          <li><button className={`w-full text-left hover:text-blue-300 transition ${filterCategory === "women" && "font-bold text-gray-400"}`} onClick={() => {setFilterCategory("women"); closeMenu && closeMenu();}}>Women</button></li>
        </ul>
      </div>

      <div>
        <h3 className="font-medium mb-3 text-gray-700 border-b border-gray-200 pb-1">Type</h3>
        <ul className="space-y-2 text-amber-50">
          <li><button className={`w-full text-left hover:text-blue-300 transition ${filterType === "all" && "font-bold text-gray-400"}`} onClick={() => {setFilterType("all"); closeMenu && closeMenu();}}>All</button></li>
          <li><button className={`w-full text-left hover:text-blue-300 transition ${filterType === "sneakers" && "font-bold text-gray-400"}`} onClick={() => {setFilterType("sneakers"); closeMenu && closeMenu();}}>Sneakers</button></li>
          <li><button className={`w-full text-left hover:text-blue-300 transition ${filterType === "heels" && "font-bold text-gray-400"}`} onClick={() => {setFilterType("heels"); closeMenu && closeMenu();}}>Heels</button></li>
          <li><button className={`w-full text-left hover:text-blue-300 transition ${filterType === "crocs" && "font-bold text-gray-400"}`} onClick={() => {setFilterType("crocs"); closeMenu && closeMenu();}}>Crocs</button></li>
          <li><button className={`w-full text-left hover:text-blue-300 transition ${filterType === "shoes" && "font-bold text-gray-400"}`} onClick={() => {setFilterType("shoes"); closeMenu && closeMenu();}}>Shoes</button></li>
          <li><button className={`w-full text-left hover:text-blue-300 transition ${filterType === "chappals" && "font-bold text-gray-400"}`} onClick={() => {setFilterType("chappals"); closeMenu && closeMenu();}}>Chappals</button></li>
        </ul>
      </div>
    </>
  );



const toggleWishlist = async (productId) => {
  try {
    if (wishlistIds.includes(productId)) {
      // REMOVE
      await fetch(`http://localhost:5000/api/user/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlistIds((prev) => prev.filter((id) => id !== productId));
    } else {
      // ADD
      await fetch("http://localhost:5000/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      setWishlistIds((prev) => [...prev, productId]);
    }
  } catch (err) {
    console.error(err);
  }
};

const handleAddToCart = async (productId) => {
  try {
    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    toast.success("Added to cart 🛒");
  } catch (err) {
    console.error(err);
  }
};

  return (
  
    <div className="min-h-screen w-screen bg-[#F7F2E6] text-gray-900">
        
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-[#4A433B]/90 backdrop-blur-md shadow-lg sticky top-0 z-10 text-white">
        
        {/* Replaced old text with new Logo Component */}
        <ShoeverseLogo />
        
        

        <div className="flex items-center gap-4 sm:gap-6 relative">
<Home
  className="w-6 h-6 text-gray-300 cursor-pointer hover:text-white transition"
  onClick={handleHomeNavigation}
/>
          {/* Search Input for Navbar */}
          <div className="relative hidden sm:block">
<input
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="px-4 py-2 rounded-full border border-gray-400 bg-gray-700 text-white placeholder-gray-300 outline-none text-sm w-40 md:w-56"
/>
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          </div>
          
          {/* Cart Icon - ADDED onClick HANDLER */}
          <ShoppingCart 
            className="w-6 h-6 text-gray-300 cursor-pointer hover:text-gray-100 transition" 
            onClick={handleViewCart}
          />
          
          {/* Profile Dropdown */}
          <div className="relative">
            <User
              className="w-6 h-6 text-gray-300 cursor-pointer hover:text-gray-100 transition"
              onClick={() => setProfileOpen(!profileOpen)}
            />
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg text-sm z-20">
<button
  onClick={goToDashboard}
  className="block w-full text-center px-4 py-2 hover:bg-gray-700"
>
  Dashboard
</button>
                <button onClick={goToProfile} className="block w-full text-center px-4 py-2 hover:bg-gray-700">Profile</button>
                <button onClick={() => navigate('/logout')} className="block w-full text-center px-4 py-2 hover:bg-gray-700 text-red-400">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex w-full">
        {/* Desktop Sidebar (Hidden on mobile) */}
        <div className="w-64 bg-white p-6 border-r border-gray-200 shadow-lg min-h-screen sticky top-[72px] hidden sm:block">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Filter</h2>
          <FilterControls closeMenu={() => {}} />
        </div>

        {/* Products Grid */}
        <div className="flex-1 p-4 sm:p-8 text-gray-900">
          
          {/* Mobile Filter Button (Visible on mobile) */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Shop Our Latest Collection</h1>
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition"
            >
              <Filter size={18} />
              Filter
            </button>

            {/* Sort dropdown for mobile/tablet */}
            <div className="hidden sm:flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort By:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-400 rounded-full bg-white text-gray-700 text-sm shadow-sm focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="group bg-white rounded-xl shadow-lg p-3 sm:p-4 hover:shadow-xl transition transform hover:scale-[1.02] duration-300">
<div className="relative">
  <img
    src={product.images?.[0] || product.image || "/placeholder.png"}
    alt={product.name}
    className="w-full h-24 sm:h-40 object-cover rounded-md mb-2 sm:mb-4 border border-gray-100"
    onError={(e) => {
      e.currentTarget.src = "/placeholder.png";
    }}
  />

  {/* ❤️ Wishlist */}
<button
  onClick={() => toggleWishlist(product._id)}
  className="absolute top-2 left-2 bg-white p-2 rounded-full shadow 
             opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-red-100"
>
  <Heart
    className={`w-4 h-4 transition ${
      wishlistIds.includes(product._id)
        ? "fill-red-500 text-red-500"
        : "text-gray-500"
    }`}
  />
</button>
  {/* 🛒 Cart */}
<button
  onClick={() => handleAddToCart(product._id)}
  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow 
             opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-green-100"
>
  <ShoppingCart className="w-4 h-4 text-green-600" />
</button>
</div>

                  <h3 className="text-sm sm:text-lg font-bold mb-1">{product.name}</h3>
                  <p className="text-gray-700 font-semibold text-base sm:text-xl">{convertToRupees(product.price)}</p>
                 <button
      onClick={() => navigate(`/product/${product._id}`)}
      className="mt-3 w-full bg-black text-white py-2 rounded"
    >
      View Product
    </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 text-xl">No products found matching your filter criteria.</p>
          )}
        </div>
      </div>
      
      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-900">Filter Products</h2>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition"
              >
                <X size={24} />
              </button>
            </div>
            {/* Reusable Filter Controls, passing the close function */}
            <FilterControls closeMenu={() => setIsFilterModalOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );

}

// Wrapper component to provide Router context in the Canvas environment
export default ProductPageInner;

