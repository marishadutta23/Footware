import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();




  
const [pageConfig, setPageConfig] = useState(null);

useEffect(() => {
  const fetchLandingData = async () => {
    try {
      const res = await fetch("https://footware-22xr.onrender.com/api/landing");
      const data = await res.json();
      setPageConfig(data);
    } catch (error) {
      console.error("Failed to load landing page data", error);
    }
  };

  fetchLandingData();
}, []);


  const ShoeverseLogo = () => (
    <div className="flex items-center space-x-2">
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path fillRule="evenodd" clipRule="evenodd" d="M 50 2 C 23.51 2 2 23.51 2 50 C 2 76.49 23.51 98 50 98 C 76.49 98 98 76.49 98 50 C 98 23.51 76.49 2 50 2 Z M 50 14 C 30.14 14 14 30.14 14 50 C 14 69.86 30.14 86 50 86 C 69.86 86 86 69.86 86 50 C 86 30.14 69.86 14 50 14 Z" fill="none" stroke="currentColor" strokeWidth="6"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M 50 50 L 50 50 L 50 50 Z M 20 50 C 20 34.02 34.02 20 50 20 L 50 80 C 34.02 80 20 65.98 20 50 Z M 50 80 C 65.98 80 80 65.98 80 50 L 20 50 C 20 65.98 34.02 80 50 80 Z" fill="none" stroke="currentColor" strokeWidth="6"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M 50 30 C 39.04 30 30 39.04 30 50 C 30 60.96 39.04 70 50 70 C 60.96 70 70 60.96 70 50 C 70 39.04 60.96 30 50 30 Z M 50 42 C 45.58 42 42 45.58 42 50 C 42 54.42 45.58 58 50 58 C 54.42 58 58 54.42 58 50 C 58 45.58 54.42 42 50 42 Z" fill="currentColor"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-extrabold tracking-widest uppercase sm:text-base">SOLEMATE</span>
        <span className="text-[10px] font-light tracking-wider mt-1 text-gray-400">STEP INTO STYLE</span>
      </div>
    </div>
  );

if (!pageConfig) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
      Loading landing page...
    </div>
  );
}




  return (
    <div className="relative w-screen h-screen font-sans overflow-hidden">
      {/* Background Video */}
{pageConfig.videoUrl && (
  <video
    key={pageConfig.videoUrl}
    className="absolute top-0 left-0 w-full h-full object-cover z-0"
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
  >
    <source src={pageConfig.videoUrl} type="video/mp4" />
  </video>
)}



      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-6 sm:px-10 lg:px-20 py-3 text-white z-30 bg-[#4A433B] border-b border-gray-800 shadow-lg">
        <ShoeverseLogo />
        
        <div className="space-x-3 sm:space-x-6">
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 text-sm rounded-lg bg-gray-700/50 text-white transition hover:bg-gray-700 hover:scale-105"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm rounded-lg bg-gray-700/50 text-white transition hover:bg-gray-700 hover:scale-105"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      
<div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center text-white px-6 lg:px-20">
  
  <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
    {pageConfig.title}
  </h2>

  <div className="w-16 h-[2px] bg-white/60 mb-5" />

  <p className="text-lg sm:text-2xl font-light tracking-wide mb-8 max-w-2xl">
    {pageConfig.subtitle}
  </p>

  <button
    onClick={() => navigate("/register")}
    className="px-8 py-3 rounded-lg border border-white/60
               bg-black/40 backdrop-blur-sm text-white font-medium
               transition duration-300
               hover:bg-white hover:text-black hover:scale-105"
  >
    {pageConfig.buttonText}
  </button>

</div>
    </div>
  );
}