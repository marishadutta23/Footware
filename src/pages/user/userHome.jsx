import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Facebook,
  Instagram,
  Twitter,
  X,
} from "lucide-react";

const ShoeverseLogo = () => (
  <div className="flex items-center space-x-2">
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 50 2 C 23.51 2 2 23.51 2 50 C 2 76.49 23.51 98 50 98 C 76.49 98 98 76.49 98 50 C 98 23.51 76.49 2 50 2 Z M 50 14 C 30.14 14 14 30.14 14 50 C 14 69.86 30.14 86 50 86 C 69.86 86 86 69.86 86 50 C 86 30.14 69.86 14 50 14 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 50 50 L 50 50 L 50 50 Z M 20 50 C 20 34.02 34.02 20 50 20 L 50 80 C 34.02 80 20 65.98 20 50 Z M 50 80 C 65.98 80 80 65.98 80 50 L 20 50 C 20 65.98 34.02 80 50 80 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 50 30 C 39.04 30 30 39.04 30 50 C 30 60.96 39.04 70 50 70 C 60.96 70 70 60.96 70 50 C 70 39.04 60.96 30 50 30 Z M 50 42 C 45.58 42 42 45.58 42 50 C 42 54.42 45.58 58 50 58 C 54.42 58 58 54.42 58 50 C 58 45.58 54.42 42 50 42 Z"
        fill="currentColor"
      />
    </svg>
    <div className="flex flex-col leading-none">
      <span className="text-xl sm:text-2xl font-bold tracking-widest uppercase">
        SOLEMATE
      </span>
      <span className="text-xs sm:text-sm font-light tracking-wider mt-1">
        STEP INTO STYLE
      </span>
    </div>
  </div>
);

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

const [slides, setSlides] = useState([]);
const [products, setProducts] = useState([]);
useEffect(() => {
  const fetchHomeData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/home");
      const data = await res.json();
      setSlides(data.banners);
      setProducts(data.products);
    } catch (err) {
      console.error("Home data error", err);
    }
  };

  fetchHomeData();
}, []);


useEffect(() => {
  if (slides.length <= 1) return;

  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 4000);

  return () => clearInterval(timer);
}, [slides]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#f5f5dc] flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-12 py-4 z-20 backdrop-blur-md bg-black/60 text-white shadow-lg border-b border-white/10 transition-all duration-300">
        <ShoeverseLogo />

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className="hidden md:flex items-center space-x-6">
          <input
            type="text"
            placeholder="Search..."
            className="hidden sm:block px-4 py-2 rounded-full border border-gray-600 bg-gray-900/70 text-white placeholder-gray-400 outline-none backdrop-blur-sm"
          />
          <a href="productsPage" className="hover:text-gray-300">Products</a>
          <Heart className="cursor-pointer hover:text-red-400" onClick={() => navigate("/userWishlist")} />
          <ShoppingCart className="cursor-pointer hover:text-gray-300" onClick={() => navigate("/cart")} />

          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User />
              <span className="hidden md:inline">Profile</span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-black/80 backdrop-blur-lg text-white rounded-lg shadow-lg overflow-hidden border border-white/10">
                <a href="userOrders" className="block px-4 py-2 hover:bg-white/10">Dashboard</a>
                <a href="Profiles" className="block px-4 py-2 hover:bg-white/10">Profile</a>
                <a href="logout" className="block px-4 py-2 hover:bg-white/10">Logout</a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="w-full h-[80vh] relative overflow-hidden mt-16">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
  index === currentSlide
    ? "opacity-100 scale-100 z-10"
    : "opacity-0 scale-110 z-0"
}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white px-4">
              <h2 className="text-3xl font-bold mb-4 animate-slideInUp">{slide.title}</h2>
              <p className="text-lg mb-6 animate-slideInUp">{slide.subtitle}</p>
              <button
                onClick={() => navigate("/productsPage")}
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105"
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Showcase */}
      <section className="py-12 px-6 md:px-12 bg-[#f5f5dc] text-black">
        <h3 className="text-center text-3xl font-bold mb-8 animate-slideInUp">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden shadow-lg 
hover:shadow-2xl transform transition-all duration-500 
animate-slideInUp">
              <img
  src={product.image}
  alt={product.name}
  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
/>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                <p className="text-gray-700 mb-4">{product.price}</p>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 w-full transition transform hover:scale-105"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-8 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Shoeverse</h4>
            <p>Your go-to destination for stylish and comfortable footwear.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Products</a></li>
              <li><button onClick={() => setShowAbout(true)} className="hover:text-white">About Us</button></li>
              <li><button onClick={() => setShowContact(true)} className="hover:text-white">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white"><Facebook /></a>
              <a href="#" className="hover:text-white"><Instagram /></a>
              <a href="#" className="hover:text-white"><Twitter /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-8">
          © 2025 Shoeverse. All rights reserved.
        </div>
      </footer>

      {/* About Us Popup */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-md p-6 text-center relative animate-fadeInUp">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setShowAbout(false)}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">About Us</h2>
            <p className="text-gray-700">
              Solemate is your trusted destination for premium footwear that blends comfort, quality, and style. Our mission is to empower every step you take with confidence and elegance.
            </p>
          </div>
        </div>
      )}

      {/* Contact Popup */}
      {showContact && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-md p-6 text-center relative animate-fadeInUp">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setShowContact(false)}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-2">📞 +91 98765 43210</p>
            <p className="text-gray-700 mb-2">📧 support@solemate.com</p>
            <p className="text-gray-700">🏠 123 Fashion Street, Mumbai, India</p>
          </div>
        </div>
      )}

<style jsx>{`
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes zoomFade {
  from {
    opacity: 0;
    transform: scale(1.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 1s ease-in-out;
}

.animate-slideInUp {
  animation: slideInUp 0.8s ease forwards;
}

.animate-zoomFade {
  animation: zoomFade 1s ease forwards;
}
`}</style>
    </div>
  );
}
